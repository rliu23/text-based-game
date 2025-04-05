import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function GameScreen() {
  const [hoursLeft, setHoursLeft] = useState(8);
  const [gold, setGold] = useState(100);
  const [cows, setCows] = useState(10);
  const [wheatCapacity, setWheatCapacity] = useState(20);
  const [wheatStorage, setWheatStorage] = useState(10);
  const [hasHerbicide, setHasHerbicide] = useState(false);
  const [hasFertilizer, setHasFertilizer] = useState(false);
  const [hasPellets, setHasPellets] = useState(false);
  const [log, setLog] = useState([]);
  const [currentTask, setCurrentTask] = useState('menu');
  const [taskCompleted, setTaskCompleted] = useState(false); 
  const [weedComplete, setWeedComplete] = useState(false);
  const [harvestComplete, setHarvestComplete] = useState(false);
  const [fertilizeComplete, setFertilizeComplete] = useState(false);
  const [cowComplete, setCowComplete] = useState(false);
  const [stats, setStats] = useState({ gold: 10, cows: 5, wheatCapacity: 10, wheatStorage: 10, herbicide: false, fertilizer: false, pellets: false });


  const handleBackToMenu = () => {
    setCurrentTask('menu');
    setTaskCompleted(false); // Reset task completion when going back to the menu
  };

  const buyHerbicideAndSpray = () => {
    if (hoursLeft < 1 || gold < 10) return;
    setHasHerbicide(true);
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
    setWheatStorage(wheatStorage+wheatCapacity);
    setLog([
      `🌾 You harvested ${wheatCapacity} wheat!`,
      'Fun fact: Wheat has been harvested since around 9600 B.C.',
    ]);
    setTaskCompleted(true); 
    setHarvestComplete(true);
  };

  const fertilizeCrops = () => {
    if (hoursLeft < 1 || gold < 10) return;
    setHoursLeft(hoursLeft - 1);
    setGold(gold - 10);
    setHasFertilizer(true);
    setLog([
      `🌾 Your crops have been fertilized with synthetic fertilizer. This action may have other effects…`,
      'Fun fact: Synthetic fertilizer is cheaper than organic fertilizer but can cause nearby waterways to turn green or cloud with algae blooms.',

    ]);
    setTaskCompleted(true); 
    setFertilizeComplete(true);
  };

  const manureCrops = () => {
    if (hoursLeft < 3) return;
    setHoursLeft(hoursLeft - 3);
    setLog([
      `🌾 After a grueling 3 hours of hard work, you’ve fertilized your crops with fresh manure from your cows! Field capacity +5`,
      'Fun fact: Natural fertilizer is more expensive but creates a more self-sufficient soil system.',

    ]);
    setTaskCompleted(true); 
    setFertilizeComplete(true);
    setWheatCapacity(wheatCapacity+5);
  };

  const wheatCows = () => {
    if (hoursLeft < 2) return;
    setHoursLeft(hoursLeft - 2);
    setLog([
      `🐄  You fed your cows with wheat from your own stores.`,

    ]);
    setTaskCompleted(true); 
    setCowComplete(true);
  };

  const organicCows = () => {
    if (hoursLeft < 2 || gold < 15) return;
    setHoursLeft(hoursLeft - 2);
    setGold(gold - 15);
    setCows(cows + 1);
    setLog([
      `🐄  Your cows were pampered with an extravagant organic feast. Cows +1`,
      'Fun fact: Organic feed promotes digestive health by decreasing acidity in the cows’ first stomach.',

    ]);
    setTaskCompleted(true); 
    setCowComplete(true);
  };

  const pelletCows = () => {
    if (hoursLeft < 2 || gold < 5) return;
    setHoursLeft(hoursLeft - 2);
    setHasPellets(true);
    setGold(gold - 5);
    setLog([
      `🐄  Your cows are pretty sad from their dry pellet meal.`,
      'Fun fact: Pellets are easier for cows to eat but they reduce nutrient digestibility.',

    ]);
    setTaskCompleted(true); 
    setCowComplete(true);
  };

  const continueOn = () => {
    setStats({ gold: gold, cows: cows, wheatCapacity: wheatCapacity, wheatStorage: wheatStorage, herbicide: hasHerbicide, fertilizer: hasFertilizer, pellets: hasPellets, });
    router.navigate({
      pathname: '/index',
      params: { passedValue: stats },
    });
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
          {!weedComplete && !harvestComplete && !fertilizeComplete &&
          <>
            <Text style={styles.description}>
              You're a farmer in the rural countryside, and every day you wake up and tend to your crops and livestock for 12 hours. 
              Each action in your day will require a certain amount of time, depending on your choices. 
            </Text>
            <Text style={styles.description}>
              Which task would you like to complete first?
            </Text>
            <Text style={styles.description}>Choose your next task:</Text>
          </>}

          
          {false && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('shopping')}>
            Go to the Market 
          </Button> }
          
          {!weedComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('weeding')}>
            Remove Weeds from Wheat Field
          </Button> }
          
          {!harvestComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('harvest')}>
            Harvest Crops
          </Button>}

          {!fertilizeComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('fertilize')}>
            Fertilize Crops
          </Button>}

          {!cowComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('cow')}>
            Feed Cows
          </Button>}

          {weedComplete && harvestComplete && fertilizeComplete && cowComplete && <Text style={styles.description}>Congratulations on completing all tasks! Continue to see your results.</Text>}
          {weedComplete && harvestComplete && fertilizeComplete && cowComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('results')}>
          See Results
          </Button>}
          {/* Add more buttons for other tasks here */}
        </>
      )}

      {currentTask === 'weeding' && !taskCompleted && (
        <>
        <View style={{justifyContent: 'center',
    alignItems: 'center',}}
    >
          <Image
            source={require('@/assets/gemini-images/weedywheat.jpeg')} // Adjust path based on your file structure
            style={{ width: 1000, height: 250, marginTop: 10 , }}
            resizeMode="contain"
          /></View>
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
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Image
            source={require('@/assets/gemini-images/unharvestedwheatfield.jpeg')} // Adjust path based on your file structure
            style={{ width: 1000, height: 250, marginTop: 10 , }}
            resizeMode="contain"
          /></View>
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

      {currentTask === 'fertilize' && !taskCompleted && (
        <>
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Image
            source={require('@/assets/gemini-images/harvested wheat field.jpeg')} // Adjust path based on your file structure
            style={{ width: 1000, height: 250, marginTop: 10 , }}
            resizeMode="contain"
          /></View>
          <Text style={styles.description}>
            Your wheat field needs to be fertilized. Would you like to fertilize your wheat field with synthetic fertilizers (1 hour, 10 gold) or collect and use cow manure as fertilizer (3 hours)?
          </Text>

          <Button mode="outlined" style={styles.button} onPress={fertilizeCrops}>
            Use Synthetic Fertilizer (1 hour)
          </Button>
          <Button mode="outlined" style={styles.button} onPress={manureCrops}>
            Collect and Use Manure (3 hours)
          </Button>
          <Button style={styles.button} onPress={handleBackToMenu}>
            🔙 Back to Menu
          </Button>
        </>
      )}

      {currentTask === 'cow' && !taskCompleted && (
        <>
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Image
            source={require('@/assets/gemini-images/hungrycow.jpeg')} // Adjust path based on your file structure
            style={{ width: 1000, height: 250, marginTop: 10 , }}
            resizeMode="contain"
          /></View>
          <Text style={styles.description}>
            Your cows need to be fed. Will you feed them your stored wheat, special organic feed (15 gold), or cheap pellets (5 gold)? All choices require 2 hours.
          </Text>

          <Button mode="outlined" style={styles.button} onPress={wheatCows}>
            Feed Using Stored Wheat
          </Button>
          <Button mode="outlined" style={styles.button} onPress={organicCows}>
            Buy and Feed Organic Feed
          </Button>
          <Button mode="outlined" style={styles.button} onPress={pelletCows}>
            Buy and Feed Pellets
          </Button>
          <Button style={styles.button} onPress={handleBackToMenu}>
            🔙 Back to Menu
          </Button>
        </>
      )}

      {currentTask === 'shopping' && (
        <>
          <Text style={styles.description}>
            You're at a bustling market with many wares. What would you like to buy?
          </Text>

          <Button mode="outlined" style={styles.button} onPress={fertilizeCrops}>
            Buy Synthetic Fertilizer
          </Button>
          <Button mode="outlined" style={styles.button} onPress={manureCrops}>
            Buy Pesticide
          </Button>
          <Button mode="outlined" style={styles.button} onPress={manureCrops}>
            Buy Wheat
          </Button>
          <Button mode="outlined" style={styles.button} onPress={manureCrops}>
            Buy Cows
          </Button>
          <Button mode="outlined" style={styles.button} onPress={manureCrops}>
            Buy Pellets
          </Button>
          <Button style={styles.button} onPress={handleBackToMenu}>
            🔙 Back to Menu
          </Button>
        </>
      )}  

      {currentTask === 'results' && (
        <>
          <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Image
            source={require('@/assets/gemini-images/feedingcows.jpeg')} // Adjust path based on your file structure
            style={{ width: 1000, height: 250, marginTop: 10 , }}
            resizeMode="contain"
          /></View>
          
          <Text style={styles.description}>
            Congratulations on completing your first day as a farmer! 
          </Text>
          {hasFertilizer && <Text style={styles.description}>
            You chose to use synthetic fertilizer. The fertilizer has run into the surrounding waterways and 3 of your cows are ill.
          </Text>}
          {!hasFertilizer && <Text style={styles.description}>
            You chose to use manure as fertilizer. Your wheat is thriving!
          </Text>}
          {hasHerbicide && <Text style={styles.description}>
            You chose to use herbicide. The herbicide lingers in the soil and makes it difficult for your own wheat to grow. 
          </Text>}
          {!hasHerbicide && <Text style={styles.description}>
            You chose to manually weed. Your back hurts a little bit, but there are no unsavory environmental effects.
          </Text>}
          {hasPellets && <Text style={styles.description}>
            You chose to feed your cows pellets. 1 cow is malnourished due to insufficient nutrient absorption.
          </Text>}
          {!hasPellets && <Text style={styles.description}>
            You chose to feed your cows wheat. Your cows are well-fed.
          </Text>}
          <Text style={styles.description}>
            Although technology such as herbicide and pellets can save time, they may harm the surrounding ecosystem and your own produce in the long-term.
          </Text>
          <Button style={styles.button} onPress={continueOn}>
            Continue to Free Story Mode
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
