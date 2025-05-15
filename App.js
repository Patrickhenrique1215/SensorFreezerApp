// Importa dependências do React e React Native
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Audio } from 'expo-av'; // Importa a biblioteca de áudio para tocar sons
import { connectMQTT } from './seila'; // Importa a função de conexão MQTT (não fornecida no código)
import ItemFreezer from './ItemFreezer'; // Importa um componente para exibir informações de cada freezer

// Função principal do componente App
export default function App() {
  // Declara um estado para armazenar os freezers (inicializado como objeto vazio)
  const [freezers, setFreezers] = useState({});
  
  // Declara um estado para armazenar o som a ser tocado
  const [sound, setSound] = useState(null);

  // useEffect para carregar o som uma única vez ao montar o componente
  useEffect(() => {
    // Função assíncrona para carregar o arquivo de som
    const loadSound = async () => {
      // Cria o som a partir do arquivo local 'alert.mp3'
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('./assets/alert.mp3') // Caminho do arquivo de som
      );
      setSound(newSound); // Armazena o som no estado
    };

    loadSound(); // Chama a função para carregar o som

    // Função de limpeza para descarregar o som quando o componente for desmontado
    return () => {
      sound?.unloadAsync(); // Verifica se o som existe antes de descarregar
    };
  }, []); // O array vazio faz o efeito ser chamado apenas uma vez ao montar o componente

  // Função para tocar o som de alerta
  const play = async () => {
    // Verifica se o som está carregado e, se sim, toca novamente
    if (sound) {
      await sound.replayAsync(); // replayAsync é utilizado para tocar o som novamente
    }
  };

  // useEffect para gerenciar a conexão com o MQTT e atualizar os dados dos freezers
  useEffect(() => {
    // Conecta-se ao broker MQTT e recebe dados (supondo que `connectMQTT` retorne o cliente MQTT)
    const client = connectMQTT((data) => {
      // Verifica se a temperatura é maior que 5 (indicando que a temperatura está alta)
      const isTempHigh = typeof data.temp === 'number' && data.temp > 5;

      // Se o dado do MQTT incluir um alerta, toca o som
      if (data.alert) play();

      // Atualiza o estado dos freezers com o novo dado recebido
      setFreezers((prev) => ({
        ...prev, // Mantém os dados anteriores dos freezers
        [data.id]: data, // Atualiza ou adiciona o freezer com o ID específico
      }));
    });

    // Função de limpeza para desconectar o cliente MQTT ao desmontar o componente
    return () => {
      client?.disconnect(); // Desconecta o cliente MQTT se ele estiver presente
    };
  }, [sound]); // O efeito é executado sempre que o estado 'sound' mudar

  // Transforma os dados de freezers (objeto) em uma lista de objetos
  const freezerList = Object.values(freezers);

  // Renderiza a interface do usuário
  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Monitoramento de Freezers</Text> 
      
      
      <FlatList
        data={freezerList} // A lista de freezers a ser exibida
        keyExtractor={(item) => item.id} // Utiliza o ID do freezer como chave única para cada item
        renderItem={({ item }) => ( // Função para renderizar cada item da lista
          <ItemFreezer id={item.id} temp={item.temp} isAlert={item.alert} /> // Componente que exibe as informações de cada freezer
        )}
      />
    </View>
  );
}

// Estilos do aplicativo
const styles = StyleSheet.create({
  container: {
    flex: 1, // O contêiner ocupa todo o espaço disponível
    paddingTop: 50, // Adiciona padding no topo
    paddingHorizontal: 20, // Adiciona padding nas laterais
    backgroundColor: '#fff', // Cor de fundo branca
  },
  title: {
    fontSize: 22, // Tamanho da fonte do título
    fontWeight: 'bold', // Título em negrito
    marginBottom: 20, // Espaçamento inferior
    marginTop: 20, // Espaçamento superior
    textAlign: 'center', // Alinha o texto no centro
  },
});
