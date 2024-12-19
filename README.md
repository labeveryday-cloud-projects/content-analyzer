# YouTube Video Optimizer

A full-stack application that helps content creators optimize their YouTube videos by generating SEO metadata and blog posts from video transcripts. Built with React, AWS CDK, and Claude AI.

## Features

- **AI-Powered Video Optimization**: Generate optimized titles, descriptions, and tags for your YouTube videos
- **Automatic Blog Post Generation**: Convert video transcripts into SEO-optimized blog posts
- **Secure Authentication**: AWS Cognito-based user authentication
- **Serverless Architecture**: Fully serverless backend using AWS Lambda and DynamoDB

## Architecture Overview

### Frontend
- React.js with React Router for routing
- Tailwind CSS for styling
- AWS Amplify/Cognito for authentication

### Backend
- AWS CDK for infrastructure as code
- Lambda functions for serverless compute
- Amazon Bedrock with Claude 3 for AI analysis
- DynamoDB for data storage
- S3 for file storage
- API Gateway for RESTful API
- Amazon Transcribe for video transcription

## Prerequisites

- Node.js v16 or later
- AWS CLI configured with appropriate credentials
- Python 3.8 or later (for backend development)
- AWS CDK CLI (`npm install -g aws-cdk`)

## Getting Started

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:
```env
REACT_APP_REGION=us-east-1
REACT_APP_COGNITO_DOMAIN=your-cognito-domain
REACT_APP_API_ENDPOINT=your-api-endpoint
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-client-id
```

3. Start the development server:
```bash
npm start
```

### Backend Setup

1. Create and activate a Python virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Install CDK dependencies:
```bash
npm install
```

4. Deploy the backend infrastructure:
```bash
cdk deploy
```

## Backend Infrastructure

The CDK stack (`youtube-optimizer-backend-stack.ts`) sets up the following resources:

- Cognito User Pool for authentication
- S3 bucket for video and transcript storage
- DynamoDB table for storing analysis results
- Lambda functions for:
  - Video transcription
  - Content analysis
  - Authentication handling
- API Gateway for frontend communication

## Environment Configuration

### Backend Environment Variables
Required environment variables for Lambda functions:
- `TABLE_NAME`: DynamoDB table name
- `BUCKET_NAME`: S3 bucket name
- `CLIENT_ID`: Cognito Client ID

### Frontend Environment Variables
Required variables in `.env`:
- `REACT_APP_REGION`: AWS region
- `REACT_APP_COGNITO_DOMAIN`: Cognito domain
- `REACT_APP_API_ENDPOINT`: API Gateway endpoint
- `REACT_APP_USER_POOL_ID`: Cognito User Pool ID
- `REACT_APP_USER_POOL_CLIENT_ID`: Cognito Client ID

## Deployment

### Backend Deployment

1. Build and deploy the CDK stack:
```bash
cdk synth
cdk deploy
```

2. Note the outputs from the CDK deployment, including:
   - API Gateway endpoint
   - Cognito User Pool ID
   - Cognito Client ID

### Frontend Deployment

1. Update the `.env` file with values from the backend deployment

2. Build the frontend:
```bash
npm run build
```

3. Deploy to AWS Amplify or your preferred hosting service

## Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
pytest
```

## Security Considerations

- All API endpoints are protected with Cognito authentication
- CORS is configured for your domain only
- S3 bucket access is restricted to authenticated users
- API Gateway uses HTTPS only
- Sensitive configuration is managed through environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, please open an issue in the GitHub repository or contact the development team.
