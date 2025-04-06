
import { useState } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatStatValue(value: any) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return String(value);
}

export default function HomeScreen() {
  const [stats, setStats] = useState({
    cows: 5,
    wheat: 100,
    gold: 50,
    herbicide: false
  });

  const [philosophy, setPhilosophy] = useState('Organic');
  const [response, setResponse] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  async function fetchFarmEvent() {
    try {
      const res = await fetch('http://localhost:3001/generate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, philosophy, history }),
      });

      const data = await res.json();
      console.log('Full response:', data.reply);

      const consequenceMatch = data.reply.match(/Consequence:\s*(.*)/);
      const eventMatch = data.reply.match(/Event:\s*(.*)/);
      const option1Match = data.reply.match(/Option 1:\s*(.*)/);
      const option2Match = data.reply.match(/Option 2:\s*(.*)/);

      const consequence = consequenceMatch ? consequenceMatch[1] : '';
      const eventText = eventMatch ? eventMatch[1] : '';
      const option1 = option1Match ? option1Match[1] : '';
      const option2 = option2Match ? option2Match[1] : '';

      setResponse(`${consequence}\n\n${eventText}`);
      setOptions([option1, option2]);
    } catch (error) {
      console.error('Error fetching from backend:', error);
      setResponse('Error connecting to backend.');
      setOptions([]);
    }
  }

  async function chooseOption(option: string) {
    setHistory(prev => [...prev, option]);

    try {
      const res = await fetch('http://localhost:3001/evaluate-choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: option, stats, philosophy }),
      });

      const data = await res.json();
      console.log('Consequence:', data.consequence);
      console.log('New Stats:', data.newStats);

      setResponse(`Consequence: ${data.consequence}`);
      setStats(data.newStats);
      setOptions([]);
    } catch (error) {
      console.error('Error evaluating choice:', error);
      setResponse('Error evaluating choice.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌾 Farming Simulator Test</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Farming Philosophy:</Text>
        <TextInput
          style={styles.input}
          value={philosophy}
          onChangeText={setPhilosophy}
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.subtitle}>📊 Current Farm Stats:</Text>
        {Object.entries(stats).map(([key, value]) => (
          <Text style={styles.stat} key={key}>
            {capitalizeFirstLetter(key)}: {formatStatValue(value)}
          </Text>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={fetchFarmEvent}>
        <Text style={styles.buttonText}>🌱 Generate Farm Event</Text>
      </TouchableOpacity>

      <View style={styles.responseContainer}>
        <Text style={styles.subtitle}>Generated Event:</Text>
        <Text style={styles.responseText}>{response}</Text>

        {options.length > 0 && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => chooseOption(options[0])}>
              <Text style={styles.buttonText}>{options[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => chooseOption(options[1])}>
              <Text style={styles.buttonText}>{options[1]}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    color: '#2e7d32',
    marginBottom: 4,
  },
  input: {
    borderColor: '#2e7d32',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#2e7d32',
  },
  statsContainer: {
    backgroundColor: '#fffaf0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  stat: {
    fontSize: 16,
    color: '#2e7d32',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: '#fffaf0',
    padding: 16,
    borderRadius: 12,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  optionsContainer: {
    marginTop: 20,
    gap: 10,
  },
});