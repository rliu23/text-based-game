import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialStory = "Your crops are being eaten by pests. What will you do?";

const choices = [
  {
    text: "Use natural fertilizer",
    outcome: "You chose an eco-friendly path. Your crops grow strong!",
    effect: "positive"
  },
  {
    text: "Spray chemical pesticide",
    outcome: "The pests die, but the soil becomes less fertile.",
    effect: "negative"
  }
];

export default function StoryScreen() {
  const [story, setStory] = useState(initialStory);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const saved = await AsyncStorage.getItem('gameHistory');
      if (saved) setHistory(JSON.parse(saved));
    };
    loadHistory();
  }, []);

  const makeChoice = async (choice) => {
    const newEntry = {
      choice: choice.text,
      outcome: choice.outcome,
      effect: choice.effect,
      timestamp: Date.now()
    };

    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    await AsyncStorage.setItem('gameHistory', JSON.stringify(updatedHistory));

    setStory(choice.outcome);

    // For LLM integration, send updatedHistory to your backend here.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.story}>{story}</Text>
      {choices.map((choice, idx) => (
        <Button
          key={idx}
          mode="contained"
          style={styles.button}
          onPress={() => makeChoice(choice)}
        >
          {choice.text}
        </Button>
      ))}
      <Text style={styles.historyTitle}>Previous Choices:</Text>
      {history.map((entry, index) => (
        <Text key={index} style={styles.historyItem}>
          • {entry.choice} → {entry.outcome}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#f0f8ff',
    flexGrow: 1
  },
  story: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '500'
  },
  button: {
    marginVertical: 10,
    borderRadius: 8
  },
  historyTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold'
  },
  historyItem: {
    fontSize: 16,
    marginTop: 5
  }
});
