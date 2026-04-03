import { AudioPlayer, createAudioPlayer } from 'expo-audio';

export const NOTIFICATION_SOUND = require('../assets/meldix-success-340660.mp3');

// Para adicionar sons ambientes, coloque arquivos MP3 em assets/sounds/ e adicione aqui:
// Exemplo: SOUND_MAP['rain'] = require('../assets/sounds/rain.mp3');
const SOUND_MAP: Record<string, any> = {};
SOUND_MAP['rain'] = require('../assets/sounds/rain.mp3');
SOUND_MAP['fireplace'] = require('../assets/sounds/fireplace.mp3');
SOUND_MAP['forest'] = require('../assets/sounds/forest.mp3');
SOUND_MAP['lofi'] = require('../assets/sounds/lofi.mp3');

export const getAmbientSound = (id: string): any | undefined => {
  return SOUND_MAP[id];
};

function waitForLoaded(player: AudioPlayer, timeoutMs = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (player.isLoaded) {
      resolve();
      return;
    }
    const timeout = setTimeout(() => {
      sub.remove();
      reject(new Error('Audio load timeout'));
    }, timeoutMs);
    const sub = player.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded) {
        clearTimeout(timeout);
        sub.remove();
        resolve();
      }
    });
  });
}

export const playNotificationSound = async (): Promise<AudioPlayer | null> => {
  try {
    const player = createAudioPlayer(NOTIFICATION_SOUND);
    await waitForLoaded(player);
    player.play();
    return player;
  } catch {
    return null;
  }
};

export const playAmbientSound = async (id: string): Promise<AudioPlayer | null> => {
  try {
    const file = getAmbientSound(id);
    if (!file) return null;
    const player = createAudioPlayer(file);
    player.loop = true;
    player.volume = 0.3;
    await waitForLoaded(player);
    player.play();
    return player;
  } catch {
    return null;
  }
};

export const stopSound = (sound: AudioPlayer | null) => {
  try {
    if (sound) {
      sound.pause();
      sound.remove();
    }
  } catch {}
};
