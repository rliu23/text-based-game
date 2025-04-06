// hooks/useBackgroundMusic.ts
import { useEffect } from 'react';
import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

export function useBackgroundMusic() {
  useEffect(() => {
    let isMounted = true;

    const playMusic = async () => {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../../assets/music/ambient.mp3'), // replace with your file path
          { isLooping: true, volume: 0.4 }
        );
        sound = newSound;
        if (isMounted) await sound.playAsync();
      }
    };

    playMusic();

    return () => {
      isMounted = false;
    };
  }, []);
}
