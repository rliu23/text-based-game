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
    textAlignVertical: 'top',
    color: 'white', // 👈 Make input text white
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333', // darker background
    borderRadius: 8,
  },
});
