import amqp from 'amqplib';
import {Buffer} from 'buffer';

async function publicar() {
  try {
    // se conecta al broker
    const coneccion = await amqp.connect('amqp://adp:adp@localhost:5672');
    // creamos un canal
    const canal = await coneccion.createChannel();
    
    const nombreExchange = 'header_exchange';

    await canal.assertExchange(nombreExchange, 'headers', { durable: true });

    const mensaje = 'Hola, soy el mensaje del productor';
    const headers = {
      prioridad: 'Alto',
      tipo: 'importante',
    };

    canal.publish(nombreExchange, '', Buffer.from(mensaje), {headers});
    console.log(`[productor] Mensaje enviado: ${mensaje}`);
    
    // cerramos el canal
    await canal.close();
    // cerramos la conexión
    await coneccion.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

publicar();
