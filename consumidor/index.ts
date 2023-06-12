import amqp from 'amqplib';

async function obtener() {
  try {
    // se conecta al broker
    const coneccion = await amqp.connect('amqp://adp:adp@localhost:5672');
    // creamos un canal
    const canal = await coneccion.createChannel();

    const nombreExchange = 'header_exchange';
    const cola = ''; // genera una temporalmente

    // declaramos exchange
    await canal.assertExchange(nombreExchange, 'headers', { durable: true });
    // declaramos una cola
    const q = await canal.assertQueue(cola, { exclusive: false });
    const nombreCola = q.queue;

    const headers = {
      prioridad: 'Alto',
      tipo: 'importante',
    };
    
    // asociamos la cola
    canal.bindQueue(nombreCola, nombreExchange, '', headers);

    // consumimos los mensajes que llegan a la cola
    canal.consume(nombreCola, (mensaje) => {
      if (mensaje) {
        // pasamos mensaje a String
        const mensajeRecibido = mensaje.content.toString();
        // imprimimos mensaje recibido
        console.log(`[x] Recibido '${mensajeRecibido}' de la cola '${nombreCola}'`);
        // Confirmamos la recepción del mensaje
        // Al llamar a ack, se informa al broker AMQP que el mensaje ha sido 
        // correctamente procesado y puede ser eliminado de la cola
        canal.ack(mensaje); 
      }
    });

    console.log('[consumidor] Esperando mensajes. Presiona CTRL+C para salir.');

  } catch (error) {
    console.error('Error:', error);
  }
}

obtener();
