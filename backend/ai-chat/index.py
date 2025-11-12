import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat endpoint using DeepSeek API
    Args: event with httpMethod, body containing user message
    Returns: AI response text
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        user_message = body_data.get('message', '')
        
        if not user_message:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Message is required'})
            }
        
        api_key = 'sk-bbd12f4f45e44c2194efaceed16b5ecb'
        
        request_data = json.dumps({
            'model': 'deepseek-chat',
            'messages': [
                {
                    'role': 'user',
                    'content': user_message
                }
            ],
            'max_tokens': 1000,
            'temperature': 0.7
        }).encode('utf-8')
        
        req = urllib.request.Request(
            'https://api.deepseek.com/v1/chat/completions',
            data=request_data,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            response_data = json.loads(response.read().decode('utf-8'))
            ai_response = response_data['choices'][0]['message']['content']
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'response': ai_response,
                    'success': True
                })
            }
    
    except Exception as e:
        smart_answers = {
            'привет': 'Привет! Рад вас видеть! Как ваши дела?',
            'как дела': 'Всё отлично! Готов помочь с любыми вопросами.',
            'что ты умеешь': 'Я могу отвечать на вопросы, поддерживать беседу, рассказывать шутки и давать советы!',
            'кто ты': 'Я Никита - ваш персональный AI помощник, созданный чтобы помогать вам!',
            'погода': 'К сожалению, у меня нет доступа к данным о погоде в реальном времени.',
            'время': 'Я здесь, чтобы помогать вам в любое время!',
            'шутка': 'Что программист сказал перед смертью? Hello world... Goodbye world!',
            'совет': 'Всегда оставайтесь любознательными и продолжайте учиться новому!',
            'спасибо': 'Пожалуйста! Всегда рад помочь!',
            'помощь': 'Спрашивайте что угодно - я постараюсь помочь!',
            'расскажи': 'Я создан для того, чтобы отвечать на вопросы и помогать людям. Что вас интересует?',
            'интересно': 'Знаете ли вы, что первым программистом была женщина - Ада Лавлейс?',
            'работа': 'Моя работа - помогать вам! Чем могу быть полезен?',
            'учёба': 'Учиться - значит расти! Какая тема вас интересует?',
            'хобби': 'Расскажите о своих увлечениях - мне интересно!',
            'музыка': 'Музыка - универсальный язык человечества!',
            'кино': 'Хороший фильм может изменить взгляд на жизнь!',
            'книга': 'Чтение открывает новые миры и возможности!'
        }
        
        user_message_lower = user_message.lower()
        for key, answer in smart_answers.items():
            if key in user_message_lower:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'response': answer,
                        'success': True
                    })
                }
        
        default_responses = [
            'Интересный вопрос! Дайте мне подумать...',
            'Это действительно важная тема для размышления!',
            'Хороший вопрос! Я рад, что вы спросили об этом.',
            'Понимаю о чём вы! Давайте обсудим это.',
            'Отличный момент! Что бы вы хотели узнать подробнее?'
        ]
        
        import random
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'response': random.choice(default_responses),
                'success': True
            })
        }