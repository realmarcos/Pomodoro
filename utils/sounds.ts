import { AudioPlayer, createAudioPlayer } from 'expo-audio';

export const NOTIFICATION_SOUND = require('../assets/meldix-success-340660.mp3');

// Para adicionar sons ambientes, coloque arquivos MP3 em assets/sounds/ e adicione aqui:
// Exemplo: SOUND_MAP['rain'] = require('../assets/sounds/rain.mp3');
const SOUND_MAP: Record<string, any> = {};

export const getAmbientSound = (id: string): any | undefined => {
  return SOUND_MAP[id];
};

export const playNotificationSound = async (): Promise<AudioPlayer | null> => {
  try {
    const player = createAudioPlayer(NOTIFICATION_SOUND);
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
