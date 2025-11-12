import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Привет! Я Никита. Задавайте любые вопросы!', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const getSmartAnswer = (message: string): string => {
    const smartAnswers: Record<string, string> = {
      'привет': 'Привет! Рад вас видеть! Как ваши дела?',
      'как дела': 'Всё отлично! Готов помочь с любыми вопросами.',
      'что ты умеешь': 'Отвечать на вопросы, помогать с задачами и поддерживать беседу!',
      'кто ты': 'Я Никита - ваш AI помощник.',
      'погода': 'К сожалению, у меня нет доступа к данным о погоде.',
      'время': `Сейчас ${new Date().toLocaleTimeString('ru-RU')}`,
      'шутка': 'Что программист сказал перед смертью? Hello world...',
      'совет': 'Всегда оставайтесь любознательными и продолжайте учиться!',
      'прощание': 'До свидания! Было приятно пообщаться!'
    };

    const lowerMsg = message.toLowerCase();
    for (const [key, answer] of Object.entries(smartAnswers)) {
      if (lowerMsg.includes(key)) {
        return answer;
      }
    }

    return "Интересный вопрос! К сожалению, API временно недоступен, но я обязательно помогу вам, когда он восстановится.";
  };

  const getAIResponse = async (message: string): Promise<string> => {
    try {
      const response = await fetch('https://functions.poehali.dev/50ef5898-c576-4263-af93-d81b0d605348', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message
        })
      });

      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('Ошибка:', error);
      return getSmartAnswer(message);
    }
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    const response = await getAIResponse(message);
    setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2a6c] to-[#b21f1f] text-white p-5">
      <div className="max-w-[600px] mx-auto bg-black/70 p-5 rounded-[15px]">
        <h1 className="text-3xl font-bold mb-5">🤖 ИИ Никита</h1>
        
        <div 
          ref={chatRef}
          className="h-[400px] overflow-y-auto my-5 p-2.5 bg-white/10 rounded-[10px]"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2.5 p-2.5 rounded-[10px] max-w-[80%] ${
                msg.sender === 'user' 
                  ? 'bg-[#3498db] ml-auto' 
                  : 'bg-[#2ecc71]'
              }`}
            >
              {msg.sender === 'user' ? `Вы: ${msg.text}` : `Никита: ${msg.text}`}
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Задайте вопрос..."
            disabled={isLoading}
            className="flex-1 border-none text-black"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-[#e74c3c] hover:bg-[#c0392b] disabled:bg-[#7f8c8d]"
          >
            {isLoading ? 'Думает...' : 'Спросить'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;