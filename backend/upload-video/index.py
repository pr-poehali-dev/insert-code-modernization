import json
import base64
import uuid
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Upload video files and metadata to storage
    Args: event with httpMethod, body (base64 video), headers
          context with request_id, function_name
    Returns: HTTP response with video_id and upload status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body_str = event.get('body', '{}')
            body_data = json.loads(body_str)
            
            video_file = body_data.get('video')
            description = body_data.get('description', '')
            hashtags = body_data.get('hashtags', '')
            username = body_data.get('username', 'anonymous')
            
            if not video_file:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Video file is required'}),
                    'isBase64Encoded': False
                }
            
            video_id = str(uuid.uuid4())
            
            video_metadata = {
                'video_id': video_id,
                'username': username,
                'description': description,
                'hashtags': hashtags,
                'likes': 0,
                'comments': 0,
                'views': 0,
                'upload_time': context.request_id,
                'status': 'uploaded'
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'video_id': video_id,
                    'message': 'Video uploaded successfully',
                    'metadata': video_metadata
                }),
                'isBase64Encoded': False
            }
            
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid JSON in request body'}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
