import { Client } from 'paho-mqtt'; 
// Importa a biblioteca Paho MQTT. Essa biblioteca é usada para conectar e interagir com um broker MQTT.

const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
// Define a URL do broker MQTT a ser utilizado. Neste caso, é o broker público HiveMQ, utilizando o protocolo WebSocket seguro (WSS).

const TOPIC = 'freezer/temperatura/#';
// Define o tópico MQTT ao qual queremos nos inscrever. O uso do caractere curinga "#" indica que serão recebidas mensagens de todos os sub-tópicos sob "freezer/temperatura".

export function connectMQTT(onMessage) { 
  // Exporta uma função chamada `connectMQTT`, que aceita um callback `onMessage`. Esse callback será chamado sempre que uma mensagem for recebida.

  const clientID = 'freezerApp_' + Math.random().toString(16).substr(2, 8); 
  // Gera um clientID único para o cliente MQTT. Ele começa com "freezerApp_" seguido por uma string aleatória de 8 caracteres gerada a partir de um número aleatório.

  const client = new Client(BROKER, clientID); 
  // Cria uma instância do cliente MQTT utilizando o broker especificado e o clientID gerado.

  client.onConnectionLost = (responseObject) => { 
    // Define um callback a ser executado quando a conexão com o broker for perdida.
    console.log('❌ Conexão perdida:', responseObject.errorMessage); 
    // Exibe no console uma mensagem de erro junto com o motivo da perda de conexão.
  };

  client.onMessageArrived = (message) => { 
    // Define um callback que será chamado sempre que uma mensagem chegar ao cliente.
    try { 
      // Tenta processar a mensagem recebida.
      const data = JSON.parse(message.payloadString); 
      // Converte o payload da mensagem (esperado como uma string JSON) em um objeto JavaScript.
      onMessage(data); 
      // Chama o callback `onMessage` fornecido como parâmetro da função `connectMQTT`, passando os dados processados.
    } catch (err) { 
      // Captura erros que possam ocorrer durante o processamento da mensagem.
      console.log('Erro ao processar mensagem:', err); 
      // Exibe uma mensagem de erro no console com detalhes do erro capturado.
    }
  };

  client.connect({ 
    // Conecta o cliente ao broker MQTT.
    onSuccess: () => { 
      // Define um callback a ser executado quando a conexão for bem-sucedida.
      console.log('✅ Conectado ao broker MQTT (HiveMQ)'); 
      // Exibe no console uma mensagem de sucesso indicando que a conexão foi estabelecida.
      client.subscribe(TOPIC); 
      // Inscreve o cliente no tópico MQTT especificado, para começar a receber mensagens.
    },
    onFailure: (err) => { 
      // Define um callback a ser executado caso a conexão falhe.
      console.log('❌ Falha na conexão:', err.errorMessage); 
      // Exibe no console uma mensagem de erro com detalhes do motivo da falha na conexão.
    },
    useSSL: true, 
    // Habilita o uso de SSL/TLS para a conexão, garantindo que os dados sejam transmitidos de forma segura.
  });

  return client; 
  // Retorna a instância do cliente MQTT, permitindo que o chamador tenha acesso para interagir com ele (ex.: desconectar ou realizar outras ações).
}