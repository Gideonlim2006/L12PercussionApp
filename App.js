import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

import {Gyroscope}  from "expo-sensors";
import { Audio } from "expo-av";

const styles = StyleSheet.create({
    shakeText: {
        fontSize: 100, // Increased font size
        fontWeight: "bold",
        textAlign: "center", // Centers text horizontally

    },
});
export default function App() {

  const [{x,y,z}, setData] = useState({x:0,y:0,z:0});
  const [mySound, setMySound] = useState();
  const [isShaking, setIsShaking] = useState(false);

  async function playSound() {
      const soundfile = require('./percussionSound.wav');
      const { sound } = await Audio.Sound.createAsync(soundfile)
      setMySound(sound)
      await sound.playAsync()
  }

    useEffect(() => {
        Gyroscope.setUpdateInterval(100);
        const subscription = Gyroscope.addListener((data) => {
            setData(data);

            // Calculate the magnitude of movement
            const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);

            // Shake threshold (adjust as needed)
            const SHAKE_THRESHOLD = 2.0;

            if (magnitude > SHAKE_THRESHOLD) {
                if (!isShaking) {
                    setIsShaking(true);
                    playSound();
                    setTimeout(() => setIsShaking(false), 1000); // Prevent multiple triggers
                }
            }
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        return mySound ? () => {
                console.log('Unloading Sound');
                mySound.unloadAsync
            }
            : undefined
    }, [mySound])

  return (
      <View>
        <StatusBar/>
          {isShaking && <Text style={styles.shakeText}>SHAKE</Text>}
      </View>
  );
}


