"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
function obtener() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // se conecta al broker
            const coneccion = yield amqplib_1.default.connect('amqp://adp:adp@localhost:5672');
            // creamos un canal
            const canal = yield coneccion.createChannel();
            const nombreExchange = 'header_exchange';
            const cola = ''; // genera una temporalmente
            // declaramos exchange
            yield canal.assertExchange(nombreExchange, 'headers', { durable: true });
            // declaramos una cola
            const q = yield canal.assertQueue(cola, { exclusive: false });
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
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
obtener();
