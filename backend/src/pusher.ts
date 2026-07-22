/**
 * Pusher Configuration for Real-time Communication
 */

import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '2177349',
  key: process.env.PUSHER_KEY || 'ab96fbeb449d4f90ca68',
  secret: process.env.PUSHER_SECRET || '99ccf1f995f64d4765d7',
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true
});

/**
 * Broadcast message to all connected clients on a channel
 */
export async function broadcastToChannel(channel: string, event: string, data: any): Promise<void> {
  try {
    await pusher.trigger(channel, event, data);
    console.log(`📡 Broadcast: ${event} on ${channel}`);
  } catch (error) {
    console.error('Pusher broadcast error:', error);
  }
}

/**
 * Broadcast message to all connected clients
 */
export function broadcast(channel: string, event: string, data: any): void {
  pusher.trigger(channel, event, data).catch((error) => {
    console.error('Pusher broadcast error:', error);
  });
}

/**
 * Send message to specific client
 */
export function sendToClient(
  channel: string,
  event: string,
  data: any,
  socketId: string
): void {
  pusher.trigger(channel, event, data, { socket_id: socketId }).catch((error) => {
    console.error('Pusher send error:', error);
  });
}

console.log('Pusher initialized on cluster:', process.env.PUSHER_CLUSTER || 'eu');
