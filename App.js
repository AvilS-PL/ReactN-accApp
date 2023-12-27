import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  Accelerometer.setUpdateInterval(100)
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null)
  const [webs, setWebs] = useState(null)

  //acc
  const turnOn = () => {
    setSubscription(Accelerometer.addListener(setData))
  };

  const turnOff = () => {
    subscription && subscription.remove()
    setSubscription(null)
  };

  useEffect(() => {
    turnOn()
    return () => turnOff()
  }, []);

  //websocket
  const connect = () => {
    setWebs(new WebSocket('ws://192.168.43.40:3000'))
  }

  const disconnect = () => {
    webs && webs.close()
    setWebs(null)
  }

  useEffect(() => {
    if (webs) {
      webs.onopen = () => {
        webs.send('>---połączono---<');
      }

      webs.onmessage = (e) => {
        console.log(e.data);
        setTimeout(function () {
          webs.send("x: " + (Math.floor(x * 1000) / 1000) + " | y: " + (Math.floor(y * 1000) / 1000));
        }, 100);
      }

      webs.onerror = (e) => {
        console.log("/---error---\\")
        console.log(e.message);
        console.log("\\---error---/")
      };

      webs.onclose = (e) => {
        console.log("/---koniec---\\")
        console.log(e.code, e.reason);
        console.log("\\---koniec---/")
      };

    }
  }, [webs, x, y]);

  useEffect(() => {
    connect()
    return () => disconnect()
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar></StatusBar>
      <Text>----</Text>
      <Text>----</Text>
      <TouchableOpacity onPress={subscription ? turnOff : turnOn} style={{ backgroundColor: "red", width: 50, height: 50 }}>
        <Text>{subscription ? "on" : "off"}</Text>
      </TouchableOpacity>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      <TouchableOpacity onPress={webs ? disconnect : connect} style={{ backgroundColor: "blue", width: 50, height: 50 }}>
        <Text>{webs ? "connected" : "disconnected"}</Text>
      </TouchableOpacity>
    </View>
  );
}