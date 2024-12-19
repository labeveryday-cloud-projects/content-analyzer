# functions/analyze.py
import json
import os
import boto3
from typing import Dict, Any
from datetime import datetime
from botocore.exceptions import ClientError



s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb').Table(os.environ['TABLE_NAME'])
bedrock = boto3.client('bedrock-runtime')
MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# Prompts moved to separate constants for better maintainability
SEO_PROMPT = """
You are an expert YouTube SEO optimizer. Analyze the provided transcript and return the data in this EXACT format:

{
  "title": "Your optimized title here (55-80 characters)",
  "description": {
    "hook": "First 2-3 lines that appear before 'Show More'",
    "fullDescription": "Complete description with formatting",
    "chapters": [
      {"timestamp": "0:00", "title": "Introduction"},
      {"timestamp": "1:23", "title": "Section Name"}
    ]
  },
  "tags": [
    "tag1",
    "tag2",
    "tag3"
  ],
  "thumbnailKeywords": [
    "keyword1",
    "keyword2",
    "keyword3"
  ],
  "topicAnalysis": {
    "mainTopic": "Primary topic",
    "relatedTopics": [
      "related1",
      "related2"
    ],
    "keywordsToEmphasize": [
      "keyword1",
      "keyword2"
    ]
  }
}
"""

BLOG_PROMPT = """
You are an expert content writer. Convert the provided transcript into a blog post and return it in this EXACT format:

{
  "metadata": {
    "title": "Blog post title",
    "metaDescription": "SEO meta description (150-160 characters)",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "content": {
    "introduction": "Opening paragraphs here",
    "sections": [
      {
        "heading": "Section Heading",
        "content": "Section content",
        "keyTakeaways": [
          "takeaway1",
          "takeaway2"
        ]
      }
    ],
    "conclusion": "Concluding paragraph",
    "callToAction": "Specific call to action text"
  },
  "videoEmbed": {
    "title": "Video Title",
    "embedPlaceholder": "[VIDEO_EMBED_CODE]"
  },
  "relatedContent": [
    "Related topic 1",
    "Related topic 2"
  ]
}
"""

SYSTEM_PROMPT = """
You are an AI specifically configured for YouTube content optimization and blog creation. Your role is to analyze video transcripts and return precisely structured JSON responses for both SEO metadata and blog content.

RESPONSE RULES:
1. ALWAYS return responses in valid JSON format
2. NEVER include explanations outside the JSON structure
3. NEVER deviate from the specified JSON schema
4. NEVER omit any fields from the schema
5. ALWAYS ensure timestamps follow the format "MM:SS" or "HH:MM:SS"
6. ALWAYS include the minimum number of fields specified (e.g., if 3-5 keywords are required, never provide fewer than 3)

ERROR HANDLING:
- If the transcript is too short: Generate appropriate content while maintaining structure
- If the transcript is unclear: Use available context to generate relevant content
- If specific sections are missing: Create appropriate content based on available information

Your task is to process the input transcript and return either SEO metadata or blog content in the exact JSON format specified in the user prompt.
"""

def get_completion(transcript, analysis_type):

    prompt = SEO_PROMPT if analysis_type == "seo" else BLOG_PROMPT

    full_prompt = f"{prompt}\n\n[TRANSCRIPT]:\n{transcript}"

    inference_config = {
        "temperature": 1
    }

    # Create the converse method parameters
    converse_api_params = {
        "modelId": MODEL_ID, 
        "messages": [{"role": "user", "content": [{"text": full_prompt}]}], 
        "inferenceConfig": inference_config,  # Pass the inference configuration
        "system": [{"text": SYSTEM_PROMPT}]
    }

    # Send a request to the Bedrock client to generate a response
    try:
        response = bedrock.converse(**converse_api_params)

        # Extract the generated text content from the response
        text_content = response['output']['message']['content'][0]['text']

        # Return the generated text content
        return text_content

    except ClientError as err:
        message = err.response['Error']['Message']
        print(f"A client error occured: {message}")


def store_analysis(user_id: str, analysis_type: str, transcript_key: str, analysis: Dict) -> str:
    """
    Store analysis results in DynamoDB
    """
    content_id = f"{analysis_type}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    dynamodb.put_item(
        Item={
            'userId': user_id,
            'contentId': content_id,
            'analysisType': analysis_type,
            'analysis': analysis,
            'transcriptKey': transcript_key,
            'createdAt': datetime.now().isoformat()
        }
    )
    
    return content_id

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        # Parse request
        body = json.loads(event['body'])
        transcript_key = body['transcriptKey']
        analysis_type = body.get('analysisType', 'seo').lower()  # Default to SEO if not specified
        user_id = event['requestContext']['authorizer']['claims']['sub']
        
        # Validate analysis type
        if analysis_type not in ['seo', 'blog']:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Invalid analysis type. Must be either "seo" or "blog"'
                })
            }
        
        # Get transcript from S3
        transcript_obj = s3.get_object(
            Bucket=os.environ['BUCKET_NAME'],
            Key=transcript_key
        )
        transcript = transcript_obj['Body'].read().decode('utf-8')
        
        # Get analysis from Bedrock
        analysis = get_completion(transcript, analysis_type)
        
        # Store results
        content_id = store_analysis(user_id, analysis_type, transcript_key, analysis)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'contentId': content_id,
                'analysis': analysis
            })
        }
        
    except ClientError as e:
        print(f"AWS API error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': f"AWS API error: {str(e)}"
            })
        }
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }