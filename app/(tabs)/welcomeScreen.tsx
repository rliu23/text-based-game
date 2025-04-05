import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';

// ====================
// Constants & Globals
// ====================
const fullMessage = "Welcome, young farmer... Your journey to sustainable agriculture begins now.";
const fadeAnim = new Animated.Value(0);
const animationLoopRef = { current: null };
const music = { current: null };

// ====================
// Animation Controls
// ====================
const startBreathingAnimation = () => {
  animationLoopRef.current = Animated.loop(
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true
      })
    ])
  );
  animationLoopRef.current.start();
};

const stopBreathingAnimation = () => {
  animationLoopRef.current?.stop();
};

// ====================
// Main Component
// ====================
export default function WelcomeScreen({ onStart }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullMessage.slice(0, i + 1));
      i++;
      if (i >= fullMessage.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Start breathing animation after typing finishes
  useEffect(() => {
    if (displayedText === fullMessage && !isHovered) {
      startBreathingAnimation();
    }
  }, [displayedText]);

  // Pause/resume animation on hover
  useEffect(() => {
    if (isHovered) {
      stopBreathingAnimation();
      fadeAnim.setValue(1); // Make fully visible when hovered
    } else if (displayedText === fullMessage) {
      startBreathingAnimation();
    }
  }, [isHovered]);

  // Load background music
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/music/ambient.mp3'),
          {
            shouldPlay: true,
            isLooping: true,
            volume: 0.5
          }
        );
        music.current = sound;
        await sound.playAsync();
      } catch (e) {
        console.error('Error loading music:', e);
      }
    };

    loadMusic();

    return () => {
      if (music.current) {
        music.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.typingText}>{displayedText}</Text>

      <Animated.View
        style={{
          opacity: displayedText === fullMessage
            ? (isHovered ? 1 : fadeAnim)
            : 0,
          marginTop: 30,
          height: 50,
          justifyContent: 'center'
        }}
        pointerEvents={displayedText === fullMessage ? 'auto' : 'none'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <TouchableOpacity onPress={onStart} style={styles.startButton}>
          <Text style={styles.startText}>▶ Start Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (music.current) {
              const status = await music.current.getStatusAsync();
              if (status.isPlaying) {
                await music.current.pauseAsync();
                console.log('Music paused');
              } else {
                await music.current.playAsync();
                console.log('Music resumed');
              }
            }
          }}
          style={[styles.startButton, { marginTop: 20, borderColor: '#1565c0' }]}
        >
          <Text style={[styles.startText, { color: '#1565c0' }]}>🎵 Toggle Music</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ====================
// Styles
// ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  typingText: {
    fontSize: 24,
    fontFamily: 'Courier',
    textAlign: 'center',
    color: '#2e7d32',
    lineHeight: 34
  },
  startButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderRadius: 4,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  startText: {
    fontSize: 22,
    fontFamily: 'Courier',
    color: '#2e7d32',
    fontWeight: 'bold',
    textShadowColor: '#A5D6A7',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  }
});
