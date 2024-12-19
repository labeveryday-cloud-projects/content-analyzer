# functions/auth.py
import json
import os
import boto3
from typing import Dict, Any
from botocore.exceptions import ClientError

cognito = boto3.client('cognito-idp')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        body = json.loads(event['body'])
        action = body.get('action')
        email = body.get('email')
        password = body.get('password')
        
        if action == 'signup':
            response = cognito.sign_up(
                ClientId=os.environ['CLIENT_ID'],
                Username=email,
                Password=password,
                UserAttributes=[
                    {'Name': 'email', 'Value': email}
                ]
            )
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'User registered successfully',
                    'userSub': response['UserSub']
                })
            }
            
        elif action == 'signin':
            response = cognito.initiate_auth(
                ClientId=os.environ['CLIENT_ID'],
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': email,
                    'PASSWORD': password
                }
            )
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'token': response['AuthenticationResult']['IdToken']
                })
            }
            
    except ClientError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({
                'error': str(e)
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }