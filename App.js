import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, StatusBar } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {

  Accelerometer.setUpdateInterval(100)
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [realX, setRealX] = useState(0)
  const [realY, setRealY] = useState(0)
  const [realZ, setRealZ] = useState(0)
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

  const getReal = () => {
    console.log(x)
    if (Math.abs(realX - x) >= 0.01) {
      setRealX((Math.round(x * 100) / 100).toFixed(2))
    }
    if (Math.abs(realY - y) >= 0.01) {
      setRealY((Math.round(y * 100) / 100).toFixed(2))
    }
    if (Math.abs(realZ - z) >= 0.01) {
      setRealZ((Math.round(z * 100) / 100).toFixed(2))
    }
  }

  useEffect(() => {
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
    getReal()
    if (webs) {
      webs.onopen = () => {
        webs.send('>---połączono---<');
      }

      webs.onmessage = (e) => {
        console.log(e.data);
        setTimeout(function () {
          webs.send(realX + "|" + realY + "|" + realZ);
        }, 300);
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
    return () => disconnect()
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <TouchableOpacity onPress={subscription ? turnOff : turnOn} style={{ backgroundColor: "red", width: 50, height: 50 }}>
        <Text>{subscription ? "on" : "off"}</Text>
      </TouchableOpacity>
      <Text>x: {realX}</Text>
      <Text>y: {realY}</Text>
      <Text>z: {realZ}</Text>
      <TouchableOpacity onPress={webs ? disconnect : connect} style={{ backgroundColor: "blue", width: 50, height: 50 }}>
        <Text>{webs ? "connected" : "disconnected"}</Text>
      </TouchableOpacity>
    </View>
  );
}