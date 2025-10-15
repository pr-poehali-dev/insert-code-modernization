import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'upload' | 'profile' | 'favorites' | 'search'>('feed');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      setUploadStatus('Выберите видео для загрузки');
      return;
    }

    setUploading(true);
    setUploadStatus('Загружаю видео...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedVideo);
      
      reader.onloadend = async () => {
        const base64Video = reader.result as string;
        
        const response = await fetch('https://functions.poehali.dev/31742022-632b-4573-8705-502062534c76', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video: base64Video,
            description,
            hashtags,
            username: 'user1'
          })
        });

        const result = await response.json();

        if (result.success) {
          setUploadStatus('✅ Видео успешно загружено!');
          setSelectedVideo(null);
          setDescription('');
          setHashtags('');
          setTimeout(() => {
            setActiveTab('feed');
            setUploadStatus(null);
          }, 2000);
        } else {
          setUploadStatus('❌ Ошибка загрузки');
        }
      };
    } catch (error) {
      setUploadStatus('❌ Ошибка при загрузке видео');
    } finally {
      setUploading(false);
    }
  };

  const videoMocks = [
    { id: 1, username: 'user1', likes: 1200, comments: 45, views: 15000 },
    { id: 2, username: 'user2', likes: 890, comments: 32, views: 9500 },
    { id: 3, username: 'user3', likes: 2340, comments: 78, views: 28000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 dark:from-gray-900 dark:via-purple-900 dark:to-cyan-900">
      {activeTab === 'feed' && (
        <div className="max-w-md mx-auto relative h-screen">
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">NikShorts</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab('search')}
                className="text-white hover:bg-white/20"
              >
                <Icon name="Search" size={24} />
              </Button>
            </div>
          </div>

          <div className="h-full snap-y snap-mandatory overflow-y-scroll">
            {videoMocks.map((video) => (
              <div key={video.id} className="h-screen snap-start relative flex items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Icon name="Play" size={48} className="text-white" />
                  </div>
                </div>

                <div className="absolute bottom-20 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 border-2 border-white">
                      <AvatarFallback className="bg-primary text-white">
                        {video.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">@{video.username}</p>
                      <p className="text-sm text-white/90">{video.views.toLocaleString()} просмотров</p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">Описание видео с хештегами #shorts #trending #viral</p>
                </div>

                <div className="absolute bottom-20 right-4 flex flex-col gap-6">
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition">
                      <Icon name="Heart" size={28} className="text-white" />
                    </div>
                    <span className="text-xs text-white font-semibold">{video.likes}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition">
                      <Icon name="MessageCircle" size={28} className="text-white" />
                    </div>
                    <span className="text-xs text-white font-semibold">{video.comments}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition">
                      <Icon name="Share2" size={28} className="text-white" />
                    </div>
                    <span className="text-xs text-white font-semibold">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-border">
            <div className="max-w-md mx-auto flex justify-around items-center py-3">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'feed' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon name="Home" size={24} />
                <span className="text-xs font-medium">Главная</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon name="Search" size={24} />
                <span className="text-xs font-medium">Поиск</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className="relative -mt-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
                  <Icon name="Plus" size={32} className="text-white" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'favorites' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon name="Heart" size={24} />
                <span className="text-xs font-medium">Избранное</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon name="User" size={24} />
                <span className="text-xs font-medium">Профиль</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="max-w-md mx-auto min-h-screen flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('feed')}>
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold">Загрузка видео</h1>
            <div className="w-10" />
          </div>

          <Card className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-dashed border-primary">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                <Icon name="Upload" size={48} className="text-white" />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Выберите видео</h3>
                <p className="text-muted-foreground text-sm">Загрузите короткое вертикальное видео</p>
              </div>

              <input
                type="file"
                accept="video/*"
                className="hidden"
                id="video-upload"
                onChange={handleVideoSelect}
              />
              <label htmlFor="video-upload">
                <Button asChild className="bg-gradient-to-r from-primary via-accent to-secondary text-white">
                  <span>{selectedVideo ? selectedVideo.name : 'Выбрать файл'}</span>
                </Button>
              </label>

              <div className="w-full space-y-4">
                <Input 
                  placeholder="Добавьте описание..." 
                  className="bg-background" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input 
                  placeholder="Добавьте хештеги..." 
                  className="bg-background" 
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                />
              </div>

              {uploadStatus && (
                <div className="w-full text-center p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium">{uploadStatus}</p>
                </div>
              )}

              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent text-white" 
                size="lg"
                onClick={handleUpload}
                disabled={uploading || !selectedVideo}
              >
                {uploading ? 'Загрузка...' : 'Опубликовать'}
              </Button>
            </div>
          </Card>

          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-border">
            <div className="max-w-md mx-auto flex justify-around items-center py-3">
              <button
                onClick={() => setActiveTab('feed')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Home" size={24} />
                <span className="text-xs font-medium">Главная</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Search" size={24} />
                <span className="text-xs font-medium">Поиск</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className="relative -mt-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
                  <Icon name="Plus" size={32} className="text-white" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Heart" size={24} />
                <span className="text-xs font-medium">Избранное</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="User" size={24} />
                <span className="text-xs font-medium">Профиль</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          <div className="bg-gradient-to-br from-primary via-accent to-secondary p-8 text-white">
            <div className="flex justify-between items-start mb-6">
              <Button variant="ghost" size="icon" onClick={() => setActiveTab('feed')} className="text-white">
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <Icon name="Settings" size={24} />
              </Button>
            </div>

            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-4 border-white mb-4">
                <AvatarFallback className="bg-white text-primary text-2xl font-bold">U</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-1">@username</h2>
              <p className="text-white/90 mb-6">Описание профиля пользователя</p>

              <div className="flex gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">127</div>
                  <div className="text-sm text-white/80">Видео</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">12.5K</div>
                  <div className="text-sm text-white/80">Подписчики</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">342</div>
                  <div className="text-sm text-white/80">Подписки</div>
                </div>
              </div>

              <Button className="bg-white text-primary hover:bg-white/90">
                Редактировать профиль
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <Card key={item} className="aspect-[9/16] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
                  <Icon name="Play" size={32} className="text-primary" />
                </Card>
              ))}
            </div>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-border">
            <div className="max-w-md mx-auto flex justify-around items-center py-3">
              <button
                onClick={() => setActiveTab('feed')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Home" size={24} />
                <span className="text-xs font-medium">Главная</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Search" size={24} />
                <span className="text-xs font-medium">Поиск</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className="relative -mt-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
                  <Icon name="Plus" size={32} className="text-white" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Heart" size={24} />
                <span className="text-xs font-medium">Избранное</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="flex flex-col items-center gap-1 text-primary"
              >
                <Icon name="User" size={24} />
                <span className="text-xs font-medium">Профиль</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          <div className="p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-border">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveTab('feed')}>
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-2xl font-bold">Избранное</h1>
            </div>
          </div>

          <div className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="aspect-[9/16] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex flex-col justify-between p-3">
                  <div className="flex-1 flex items-center justify-center">
                    <Icon name="Play" size={48} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold line-clamp-2 mb-1">Название видео</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Heart" size={12} />
                        1.2K
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={12} />
                        15K
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-border">
            <div className="max-w-md mx-auto flex justify-around items-center py-3">
              <button
                onClick={() => setActiveTab('feed')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Home" size={24} />
                <span className="text-xs font-medium">Главная</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Search" size={24} />
                <span className="text-xs font-medium">Поиск</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className="relative -mt-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
                  <Icon name="Plus" size={32} className="text-white" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className="flex flex-col items-center gap-1 text-primary"
              >
                <Icon name="Heart" size={24} />
                <span className="text-xs font-medium">Избранное</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="User" size={24} />
                <span className="text-xs font-medium">Профиль</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          <div className="p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-border">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveTab('feed')}>
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <div className="flex-1 relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск видео, хештегов..." className="pl-10" />
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 bg-background">
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Популярные хештеги</h3>
              <div className="flex flex-wrap gap-2">
                {['#trending', '#viral', '#dance', '#music', '#comedy', '#art'].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Рекомендуемые</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <Card key={item} className="aspect-[9/16] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
                    <Icon name="Play" size={32} className="text-primary" />
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-border">
            <div className="max-w-md mx-auto flex justify-around items-center py-3">
              <button
                onClick={() => setActiveTab('feed')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Home" size={24} />
                <span className="text-xs font-medium">Главная</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className="flex flex-col items-center gap-1 text-primary"
              >
                <Icon name="Search" size={24} />
                <span className="text-xs font-medium">Поиск</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className="relative -mt-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
                  <Icon name="Plus" size={32} className="text-white" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="Heart" size={24} />
                <span className="text-xs font-medium">Избранное</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <Icon name="User" size={24} />
                <span className="text-xs font-medium">Профиль</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Index;