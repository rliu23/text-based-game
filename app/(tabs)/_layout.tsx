import { Stack } from 'expo-router';
import { useBackgroundMusic } from './music.tsx';

export default function RootLayout() {
  useBackgroundMusic(); // this makes music start once when app launches

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
