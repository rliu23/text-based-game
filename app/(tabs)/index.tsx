// import { Image, StyleSheet, Platform } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12'
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           Tap the Explore tab to learn more about what's included in this starter app.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           When you're ready, run{' '}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });



import { useState } from 'react';
import { Button, StyleSheet, TextInput, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [stats, setStats] = useState('{"cows": 5, "wheat": 100, "gold": 50}');
  const [philosophy, setPhilosophy] = useState('Organic');
  const [response, setResponse] = useState('');

  async function fetchFarmEvent() {
    try {
      const res = await fetch('http://localhost:3001/generate-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stats: JSON.parse(stats),
          philosophy,
        }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error('Error fetching from backend:', error);
      setResponse('Error connecting to backend.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">🌾 Farming Simulator Test</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText>Player Stats (JSON):</ThemedText>
        <TextInput
          style={styles.input}
          value={stats}
          onChangeText={setStats}
          multiline
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <ThemedText>Farming Philosophy:</ThemedText>
        <TextInput
          style={styles.input}
          value={philosophy}
          onChangeText={setPhilosophy}
        />
      </ThemedView>

      <Button title="Generate Farm Event 🌱" onPress={fetchFarmEvent} />

      <ThemedView style={styles.responseContainer}>
        <ThemedText type="subtitle">Generated Event:</ThemedText>
        <ThemedText>{response}</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top', // makes text input start at the top
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});
