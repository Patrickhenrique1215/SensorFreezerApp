// Importa dependências do React e React Native
import React from 'react'; 
import { View, Text, StyleSheet } from 'react-native'; // Importa componentes para a interface do usuário (View, Text) e a ferramenta de estilo (StyleSheet)

// Componente visual de cada freezer
export default function ItemFreezer({ id, temp, isAlert }) {
  return (
    // View principal do item, estilizada com base no estado de alerta
    <View style={[styles.container, isAlert && styles.alert]}> 
     
      <Text style={styles.id}>{id}</Text> 

     
      <Text style={styles.temp}>{temp}ºC</Text> 
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    padding: 12, // Adiciona espaçamento interno ao redor do conteúdo do container
    marginVertical: 6, // Espaçamento vertical entre os itens
    borderRadius: 8, // Arredonda os cantos do container
    backgroundColor: '#e0f7fa', // Define a cor de fundo como azul claro (sem alerta)
  },
  alert: {
    backgroundColor: '#ff5252', // Se em alerta, altera a cor de fundo para vermelho
  },
  id: {
    fontWeight: 'bold', // Deixa o texto do ID em negrito
    fontSize: 16, // Define o tamanho da fonte do ID
  },
  temp: {
    fontSize: 14, // Define o tamanho da fonte da temperatura
  },
});
