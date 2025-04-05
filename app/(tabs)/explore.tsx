import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

export default function GameScreen() {
  const [hoursLeft, setHoursLeft] = useState(12);
  const [gold, setGold] = useState(100);
  const [cows, setCows] = useState(2);
  const [wheatCapacity, setWheatCapacity] = useState(20);
  const [wheatStorage, setWheatStorage] = useState(10);
  const [hasHerbicide, setHasHerbicide] = useState(false);
  const [log, setLog] = useState([]);
  const [currentTask, setCurrentTask] = useState('menu');
  const [taskCompleted, setTaskCompleted] = useState(false); 
  const [weedComplete, setWeedComplete] = useState(false);
  const [harvestComplete, setHarvestComplete] = useState(false);
  const [fertilizeComplete, setFertilizeComplete] = useState(false);

  const handleBackToMenu = () => {
    setCurrentTask('menu');
    setTaskCompleted(false); // Reset task completion when going back to the menu
  };

  const buyHerbicideAndSpray = () => {
    if (hoursLeft < 1 || gold < 10) return;
    setHasHerbicide(false);
    setHoursLeft(hoursLeft - 1);
    setGold(gold - 10);
    setLog([
      '🛒 You bought herbicide and sprayed your field.',
      'Fun Fact: Chemical herbicides work fast but can linger in the soil.',
    ]);
    setTaskCompleted(true); 
    setWeedComplete(true);
  };

  const weedByHand = () => {
    if (hoursLeft < 2) return;
    setHoursLeft(hoursLeft - 2);
    setLog([
      '💪 You weeded the field by hand.',
      'Fun Fact: Weeding by hand is safe and environmentally-friendly, but intensive work. :(',
    ]);
    setTaskCompleted(true); 
    setWeedComplete(true);
  };

  const harvestCrops = () => {
    if (hoursLeft < 2) return;
    setHoursLeft(hoursLeft - 2);
    setLog([
      `🌾 You harvested ${wheatCapacity} wheat!`,
      'Fun fact: Wheat has been harvested since around 9600 B.C.',
    ]);
    setTaskCompleted(true); 
    setHarvestComplete(true);
  };

  const fertilizeCrops = () => {
    if (hoursLeft < 1) return;
    setHoursLeft(hoursLeft - 2);
    setLog([
      `🌾 Your crops have been fertilized with synthetic fertilizer. This action may have other effects…`,
      'Fun fact: Synthetic fertilizer is cheaper than organic fertilizer but can cause nearby waterways to turn green or cloud with algae blooms.',

    ]);
    setTaskCompleted(true); 
    setFertilizeComplete(true);
  };

  const manureCrops = () => {
    if (hoursLeft < 2) return;
    setHoursLeft(hoursLeft - 2);
    setLog([
      `🌾 After a grueling 2 hours of hard work, you’ve fertilized your crops with fresh manure from your cows! Field capacity +5`,
      'Fun fact: Natural fertilizer is more expensive but creates a more self-sufficient soil system.',

    ]);
    setTaskCompleted(true); 
    setFertilizeComplete(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌾 Farmer's Day</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>🕐 {hoursLeft} hours</Text>
        <Text style={styles.stat}>💰 {gold} gold</Text>
        <Text style={styles.stat}>🐄 {cows} cows</Text>
        <Text style={styles.stat}>🌾 Field Capacity: {wheatCapacity}</Text>
        <Text style={styles.stat}>🧺 Stored Wheat: {wheatStorage}</Text>
      </View>

      {currentTask === 'menu' && (
        <>
          <Text style={styles.description}>Choose your next task:</Text>
          
          {!weedComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('weeding')}>
            Remove Weeds from Wheat Field
          </Button> }
          
          {!harvestComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('harvest')}>
            Harvest Crops
          </Button>}
          {/* Add more buttons for other tasks here */}
        </>
      )}

      {currentTask === 'weeding' && !taskCompleted && (
        <>
          <Text style={styles.description}>
            Your wheat field is overgrown with weeds.
            {hasHerbicide
              ? '\nWould you like to spray herbicide (1 hour)?'
              : '\nYou can buy herbicide for 10 gold and spray (1 hour), or weed by hand (2 hours).'}
          </Text>

          {hasHerbicide ? (
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                if (hoursLeft < 1) return;
                setHoursLeft(hoursLeft - 1);
                setLog([
                  ...log,
                  '🌱 You buy herbicide and spray it generously. This action may have other effects...',
                  'Fun Fact: Chemical herbicides work quickly but can linger in the soil.',
                ]);
                setTaskCompleted(true); 
                setWeedComplete(true);
              }}
            >
              Spray Herbicide (1 hour)
            </Button>
          ) : (
            <Button mode="contained" style={styles.button} onPress={buyHerbicideAndSpray}>
              Buy and Spray Herbicide (1 hour, 10 gold)
            </Button>
          )}

          <Button mode="outlined" style={styles.button} onPress={weedByHand}>
            Weed by Hand (2 hrs)
          </Button>
          <Button style={styles.button} onPress={handleBackToMenu}>
            🔙 Back to Menu
          </Button>
        </>
      )}

      {currentTask === 'harvest' && !taskCompleted && (
        <>
          <Text style={styles.description}>
            Your wheat field is ready to harvest!
          </Text>

          <Button mode="outlined" style={styles.button} onPress={harvestCrops}>
            Harvest Crops (2 hours)
          </Button>
          <Button style={styles.button} onPress={handleBackToMenu}>
            🔙 Back to Menu
          </Button>
        </>
      )}

      {taskCompleted && (
        <>
          <Text style={styles.description}>Task completed! 🎉</Text>
          <Button style={styles.button} onPress={handleBackToMenu}>
            Back to Menu
          </Button>
        </>
      )}

      <Text style={styles.logTitle}>📜 Activity Log:</Text>
      {log.map((entry, idx) => (
        <Text key={idx} style={styles.logEntry}>• {entry}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: '#fffaf0',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  stat: {
    fontSize: 16,
    marginVertical: 2,
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    marginVertical: 8,
    borderRadius: 10,
  },
  logTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logEntry: {
    fontSize: 16,
    marginTop: 5,
  },
});
