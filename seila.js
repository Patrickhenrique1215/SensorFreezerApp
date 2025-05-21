import { Client } from 'paho-mqtt';

const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const TOPIC = 'freezer/temperatura/#';

export function connectMQTT(onMessage) {
  const clientID = 'freezerApp_' + Math.random().toString(16).substr(2, 8);
  const client = new Client(BROKER, clientID);

  client.onConnectionLost = (responseObject) => {
    console.log('❌ Conexão perdida:', responseObject.errorMessage);
  };

  client.onMessageArrived = (message) => {
    try {
      const data = JSON.parse(message.payloadString);
      onMessage(data);
    } catch (err) {
      console.log('Erro ao processar mensagem:', err);
    }
  };

  client.connect({
    onSuccess: () => {
      console.log('✅ Conectado ao broker MQTT (HiveMQ)');
      client.subscribe(TOPIC);
    },
    onFailure: (err) => {
      console.log('❌ Falha na conexão:', err.errorMessage);
    },
    useSSL: true,
  });

  return client;
}