import { useState } from 'react';
import { GameSettings } from './types/game';
import MainMenu from './components/MainMenu';
import Settings from './components/Settings';
import YouTubeLoader from './components/YouTubeLoader';
import Game from './components/Game';

type Screen = 'menu' | 'settings' | 'youtube' | 'game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [settings, setSettings] = useState<GameSettings>({
    speed: 2,
    difficulty: 'normal',
    gameMode: 'combo',
    volume: 0.5,
  });
  const [youtubeUrl, setYoutubeUrl] = useState<string>();

  const handlePlayGame = () => {
    setCurrentScreen('game');
  };

  const handleLoadSong = (url: string) => {
    setYoutubeUrl(url);
    setCurrentScreen('game');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onPlay={handlePlayGame}
            onSettings={() => setCurrentScreen('settings')}
            onLoadSong={() => setCurrentScreen('youtube')}
          />
        );
      case 'settings':
        return (
          <Settings
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setCurrentScreen('menu')}
          />
        );
      case 'youtube':
        return (
          <YouTubeLoader
            onLoadSong={handleLoadSong}
            onClose={() => setCurrentScreen('menu')}
          />
        );
      case 'game':
        return (
          <Game
            settings={settings}
            youtubeUrl={youtubeUrl}
            onExit={() => {
              setCurrentScreen('menu');
              setYoutubeUrl(undefined);
            }}
          />
        );
    }
  };

  return <>{renderScreen()}</>;
}

export default App;
