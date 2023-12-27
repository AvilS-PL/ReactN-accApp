import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';

import Horizontal from './components/Horizontal';
import Vertical from './components/Vertical';

export default function App() {

  Accelerometer.setUpdateInterval(500)
  const [orientation, setOrientation] = useState(true)
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null)

  const turnOn = () => {
    setSubscription(Accelerometer.addListener(setData))
  };

  const turnOff = () => {
    subscription.remove()
    setSubscription(null)
  };

  const orientationCheck = () => {
    if (Dimensions.get('screen').height <= Dimensions.get('screen').width) {
      setOrientation(false)
    } else {
      setOrientation(true)
    }
  }

  useEffect(() => {
    turnOn()
    return () => turnOff()
  }, []);

  useEffect(() => {
    orientationChecker = Dimensions.addEventListener("change", orientationCheck)
    return () => orientationChecker.remove()
  }, []);

  return (
    <>
      {orientation
        ? <Vertical x={x} y={y} z={z} turnOn={turnOn} turnOff={turnOff} subscription={subscription} />
        : <Horizontal x={x} y={y} z={z} turnOn={turnOn} turnOff={turnOff} subscription={subscription} />
      }
    </>
  );
}