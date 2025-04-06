import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function GameScreen() {
  const [hoursLeft, setHoursLeft] = useState(8);
  const [gold, setGold] = useState(50);
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
  const [selectedEntry, setSelectedEntry] = useState(null); // State to track the selected log entry
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const handleBackToMenu = () => {
    setCurrentTask('menu');
    setTaskCompleted(false); // Reset task completion when going back to the menu
  };

  const handleTaskCompletion = (logEntry) => {
    setTaskCompleted(true);
    setSelectedEntry(logEntry); // Set the log entry for the modal
    setIsModalVisible(true); // Show the modal
  };

  const buyHerbicideAndSpray = () => {
    if (hoursLeft < 1 || gold < 10) return;
    setHasHerbicide(true);
    setHoursLeft(hoursLeft - 1);
    setGold(gold - 10);
    const logEntry = '🛒 You bought herbicide and sprayed your field.\nFun fact: Chemical herbicides work fast but can linger in the soil. (Kanissery et al., 2020)';
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setWeedComplete(true);
  };

  const weedByHand = () => {
    if (hoursLeft < 2) return;
    setHoursLeft(hoursLeft - 2);
    const logEntry = '💪 You weeded the field by hand.\nFun fact: Weeding by hand is environmentally-friendly, but intensive work. :(';
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setWeedComplete(true);
  };

  const harvestCrops = () => {
    if (hoursLeft < 2) return;
    setHoursLeft(hoursLeft - 2);
    setWheatStorage(wheatStorage+wheatCapacity);
    const logEntry = `🌾 You harvested ${wheatCapacity} wheat!\nFun fact: Wheat has been harvested since around 10,000 B.C. (de Sousa et al., 2021)`;
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setHarvestComplete(true);
  };

  const fertilizeCrops = () => {
    if (hoursLeft < 1 || gold < 10) return;
    setHoursLeft(hoursLeft - 1);
    setGold(gold - 10);
    setHasFertilizer(true);
    const logEntry = `🌾 Your crops have been fertilized with synthetic fertilizer. This action may have other effects…\nFun fact: Synthetic fertilizer is cheaper than organic fertilizer but can cause nearby waterways to turn green or cloud with algae blooms.`;
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setFertilizeComplete(true);
  };

  const manureCrops = () => {
    if (hoursLeft < 3) return;
    setHoursLeft(hoursLeft - 3);
    const logEntry = `🌾 After a grueling 3 hours of hard work, you’ve fertilized your crops with fresh manure from your cows! Field capacity +5\nFun fact: Natural fertilizer is more expensive but creates a more self-sufficient soil system. (Cherlinka, 2025)`;
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setFertilizeComplete(true);
    setWheatCapacity(wheatCapacity+5);
  };

  const wheatCows = () => {
    if (hoursLeft < 2) return;
    setHoursLeft(hoursLeft - 2);
    const logEntry = `🐄  You fed your cows with wheat from your own stores.`;
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setCowComplete(true);
  };

  const organicCows = () => {
    if (hoursLeft < 2 || gold < 15) return;
    setHoursLeft(hoursLeft - 2);
    setGold(gold - 15);
    setCows(cows + 1);
    const logEntry = `🐄  Your cows were pampered with an extravagant organic feast. Cows +1\nFun fact: Organic feed promotes digestive health by decreasing acidity in the cows’ first stomach. (Automatic Equipment Manufacturing, 2021)`;
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setCowComplete(true);
  };

  const pelletCows = () => {
    if (hoursLeft < 2 || gold < 5) return;
    setHoursLeft(hoursLeft - 2);
    setHasPellets(true);
    setGold(gold - 5);
    const logEntry = `🐄  Your cows are pretty sad from their dry pellet meal.\nFun fact: Pellets are easier for cows to eat but they reduce nutrient digestibility. (Retnani et al., 2022)`;
    setLog([...log, logEntry]);
    handleTaskCompletion(logEntry); // Call the new function
    setCowComplete(true);
  };

  const continueOn = () => {
    const newStats = {
      gold: gold,
      cows: cows,
      wheatCapacity: wheatCapacity,
      wheatStorage: wheatStorage,
      herbicide: hasHerbicide,
      fertilizer: hasFertilizer,
      pellets: hasPellets,
    };

    router.navigate({
      pathname: '/llm',
      params: { passedValue: JSON.stringify(newStats) }, // 📦 stringify to safely pass as a param
    });
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setIsModalVisible(false);
    setCurrentTask('menu');
    setTaskCompleted(false);
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
          
          {!(weedComplete && harvestComplete && fertilizeComplete) && (
          <>
            <Text style={styles.description}>
              You're a farmer in the rural countryside, and every day you wake up and tend to your crops and livestock for 12 hours. 
              Each action in your day will require a certain amount of time, depending on your choices. 
            </Text>
            <Text style={styles.description}>Choose your next task:</Text>
          </>)}

         

          
          <View style={{flexDirection:"row"}}>
          <View style={{flex:1, paddingHorizontal: 20}}>
          {!weedComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('weeding')}>
            Remove Weeds from Wheat Field
          </Button> }

          </View>
          <View style={{flex:1, paddingHorizontal: 20}}>
          {!harvestComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('harvest')}>
            Harvest Crops
          </Button>}
          </View>
          </View>

          <View style={{flexDirection:"row"}}>
          <View style={{flex:1, paddingHorizontal: 20}}>

          {!fertilizeComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('fertilize')}>
            Fertilize Crops
          </Button>}
          </View>
          <View style={{flex:1, paddingHorizontal: 20}}>
          {!cowComplete && <Button mode="contained" style={styles.button} onPress={() => setCurrentTask('cow')}>
            Feed Cows
          </Button>}
          </View>
          </View>

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
                const logEntry = '🌱 You buy herbicide and spray it generously. This action may have other effects...\nFun Fact: Chemical herbicides work quickly but can linger in the soil.';
                setLog([...log, logEntry]);
                handleTaskCompletion(logEntry); // Call the new function
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
        </>
      )}

      <Text style={styles.logTitle}>📜 Activity Log:</Text>
      {log.map((entry, idx) => (
        <TouchableOpacity key={idx} onPress={() => openModal(entry)}>
          <Text style={styles.logEntry}>• {entry}</Text>
        </TouchableOpacity>
      ))}

      {/* Modal for displaying the selected log entry */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Task Completed!</Text>
            <Text style={styles.modalText}>{selectedEntry}</Text>
            <Button mode="contained" style={styles.modalButton} onPress={closeModal}>
              Back to Choices
            </Button>
          </View>
        </View>
      </Modal>
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
    width: 200, // changed width of statscontainer
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    borderRadius: 10,
  },
});
