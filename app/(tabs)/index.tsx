import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatStatValue(value: any) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'; // ✅ Show "Yes" or "No" instead of true/false
  }
  if (value === null || value === undefined) {
    return 'N/A'; // Optional: Handle null/undefined
  }
  return String(value); // Force everything else to string
}


export default function HomeScreen() {
  // const [stats, setStats] = useState({ cows: 5, wheat: 100, gold: 50, human: 10, hebicide: false });
  const { passedValue } = useLocalSearchParams();

  const [stats, setStats] = useState({
    cows: 5,
    wheat: 100,
    gold: 50,
    human: 10,
    herbicide: false,
  });

  useEffect(() => {
    if (passedValue) {
      try {
        const parsedStats = JSON.parse(passedValue as string);
        setStats(parsedStats);
      } catch (error) {
        console.error('Error parsing passed stats:', error);
      }
    }
  }, [passedValue]);





  
  const [philosophy, setPhilosophy] = useState('Organic');
  const [response, setResponse] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  async function fetchFarmEvent() {
    try {
      const res = await fetch('http://localhost:3001/generate-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stats,
          philosophy,
          history,
        }),
      });

      const data = await res.json();
      console.log('Full response:', data.reply);

      // Parse Consequence, Event, Options
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
    // Save choice to history
    setHistory(prev => [...prev, option]);

    try {
      const res = await fetch('http://localhost:3001/evaluate-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          choice: option,
          stats,
          philosophy,
        }),
      });

      const data = await res.json();
      console.log('Consequence:', data.consequence);
      console.log('New Stats:', data.newStats);

      setResponse(`Consequence: ${data.consequence}`);
      setStats(data.newStats);  // 🔥 Update your stats with Gemini's new version!
      setOptions([]); // Hide options after picking

      // setTimeout(() => {
      //   fetchFarmEvent(); // Continue the story with new stats
      // }, 2000);

    } catch (error) {
      console.error('Error evaluating choice:', error);
      setResponse('Error evaluating choice.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">🌾 Farming Simulator Test</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText>Farming Philosophy:</ThemedText>
        <TextInput
          style={styles.input}
          value={philosophy}
          onChangeText={setPhilosophy}
        />
      </ThemedView>

      {/* 🌟 Stats Display Here */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle">📊 Current Farm Stats:</ThemedText>
        {Object.entries(stats).map(([key, value]) => (
          <ThemedText key={key}>
            {capitalizeFirstLetter(key)}: {formatStatValue(value)}
          </ThemedText>
        ))}
      </ThemedView>

      <Button title="Generate Farm Event 🌱" onPress={fetchFarmEvent} />

      <ThemedView style={styles.responseContainer}>
        <ThemedText type="subtitle">Generated Event:</ThemedText>
        <ThemedText>{response}</ThemedText>

        {/* Two choice buttons */}
        {options.length > 0 && (
          <View style={styles.optionsContainer}>
            <Button title={options[0]} onPress={() => chooseOption(options[0])} />
            <View style={{ margin: 10 }} />
            <Button title={options[1]} onPress={() => chooseOption(options[1])} />
          </View>
        )}
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
    minHeight: 40,
    textAlignVertical: 'top',
    color: 'white',
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  optionsContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 10,
  },
});


