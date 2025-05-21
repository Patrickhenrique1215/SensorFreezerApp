import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Audio } from 'expo-av';
import { connectMQTT } from './seila';
import ItemFreezer from './ItemFreezer';

export default function App() {
  const [freezers, setFreezers] = useState({});
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('./assets/alert.mp3')
      );
      setSound(newSound);
    };

    loadSound();

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  const play = async () => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  // Função para remover alerta de um freezer específico e parar o som
  const handleOk = async (id) => {
    setFreezers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        alert: false,
      },
    }));
    if (sound) await sound.stopAsync();
  };

  useEffect(() => {
    const client = connectMQTT((data) => {
      const isTempHigh = typeof data.temp === 'number' && data.temp > 5;
      if (data.alert) play();
      setFreezers((prev) => ({
        ...prev,
        [data.id]: data,
      }));
    });

    return () => {
      client?.disconnect();
    };
  }, [sound]);

  const freezerList = Object.values(freezers);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoramento de Freezers</Text>
      <FlatList
        data={freezerList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemFreezer
            id={item.id}
            temp={item.temp}
            isAlert={item.alert}
            onOk={handleOk}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
});