import type { Response } from 'express';
import logger from './logger.js';

export class SSEManager {
  private clients = new Map<string, Response>();

  addClient(profileId: string, res: Response) {
    this.clients.set(profileId, res);
    logger.info(`[SSE] Client connected: ${profileId} | Total: ${this.clients.size}`);
  }

  removeClient(profileId: string) {
    this.clients.delete(profileId);
    logger.info(`[SSE] Client disconnected: ${profileId} | Total: ${this.clients.size}`);
  }

  sendToClient(profildId: string, data: object) {
    const client = this.clients.get(profildId);
    if (!client) return; // user offline - notification is in DB, they'll see it later
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  isConnected(profileId: string) {
    return this.clients.has(profileId);
  }
}

// Singleton - One instance for the entire server
export const sseManager = new SSEManager();
