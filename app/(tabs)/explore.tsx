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

// Stats following section
const [timeLeft, setTimeLeft] = useState(100);
const [numCows, setNumCows] = useState(5);
const [wheatField, setWheatField] = useState(200); 
const [wheatStorage, setWheatStorage] = useState(50);
const [gold, setGold] = useState(100);

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    background: '#f4f4f4',
    surface: '#ffffff',
  },
  roundness: 12,
};



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
    <PaperProvider theme={theme}>
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

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Inventory Stats:</Text>
        <Text style={styles.statItem}>⏳ Time Left: {timeLeft}</Text>
        <Text style={styles.statItem}>🐄 Number of Cows: {numCows}</Text>
        <Text style={styles.statItem}>🌾 Wheat in Field: {wheatField} kg</Text>
        <Text style={styles.statItem}>🏚 Wheat in Storage: {wheatStorage} kg</Text>
        <Text style={styles.statItem}>💰 Gold: {gold}</Text>
      </View>

      <Text style={styles.historyTitle}>Previous Choices:</Text>
      {history.map((entry, index) => (
        <Text key={index} style={styles.historyItem}>
          • {entry.choice} → {entry.outcome}
        </Text>
      ))}
    </ScrollView>
    </PaperProvider>
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
