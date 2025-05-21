import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ItemFreezer({ id, temp, isAlert, onOk }) {
  if (!isAlert) return null;

  return (
    <View style={[styles.container, styles.alert]}>
      <Text style={styles.id}>{id}</Text>
      <Text style={styles.temp}>{temp}ºC</Text>
      <TouchableOpacity style={styles.button} onPress={() => onOk(id)}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  alert: {
    backgroundColor: '#ff5252',
  },
  id: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  temp: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  buttonText: {
    color: '#ff5252',
    fontWeight: 'bold',
    fontSize: 16,
  },
});