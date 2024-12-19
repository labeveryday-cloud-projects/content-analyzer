# functions/transcribe.py
import json
import os
import boto3
from typing import Dict, Any
from datetime import datetime

s3 = boto3.client('s3')
transcribe = boto3.client('transcribe')
dynamodb = boto3.resource('dynamodb').Table(os.environ['TABLE_NAME'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        # Handle S3 event
        for record in event['Records']:
            if record['eventName'].startswith('ObjectCreated:'):
                bucket = record['s3']['bucket']['name']
                key = record['s3']['object']['key']
                
                # Extract user_id from the key (assuming format: videos/{user_id}/filename.mp4)
                user_id = key.split('/')[1]
                
                job_name = f"job-{datetime.now().strftime('%Y%m%d%H%M%S')}"
                
                # Start transcription job
                transcribe.start_transcription_job(
                    TranscriptionJobName=job_name,
                    LanguageCode='en-US',
                    Media={
                        'MediaFileUri': f"s3://{bucket}/{key}"
                    },
                    OutputBucketName=bucket,
                    OutputKey=f"transcripts/{user_id}/{job_name}.json"
                )
                
                # Store job info in DynamoDB
                dynamodb.put_item(
                    Item={
                        'userId': user_id,
                        'contentId': f"transcript-{job_name}",
                        'status': 'PROCESSING',
                        'videoKey': key,
                        'createdAt': datetime.now().isoformat()
                    }
                )
                
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Transcription jobs started'
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")  # This will go to CloudWatch Logs
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }