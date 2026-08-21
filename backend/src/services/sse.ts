import { Response } from "express";

type SSEClient = {
  id: string;
  res: Response;
};

class SSEManager {
  private clients: Map<string, Set<SSEClient>> = new Map();

  addClient(deviceId: string, res: Response): string {
    const clientId = `${deviceId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const clientSet = this.clients.get(deviceId) || new Set();
    
    const client: SSEClient = { id: clientId, res };
    clientSet.add(client);
    this.clients.set(deviceId, clientSet);

    // Header setup for SSE
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    });

    res.write(`event: connected\ndata: ${JSON.stringify({ clientId, deviceId })}\n\n`);

    return clientId;
  }

  removeClient(deviceId: string, clientId: string) {
    const clientSet = this.clients.get(deviceId);
    if (!clientSet) return;

    for (const client of clientSet) {
      if (client.id === clientId) {
        clientSet.delete(client);
        break;
      }
    }

    if (clientSet.size === 0) {
      this.clients.delete(deviceId);
    }
  }

  broadcastReading(deviceId: string, readingData: unknown) {
    const clientSet = this.clients.get(deviceId);
    if (!clientSet || clientSet.size === 0) return;

    const payload = `event: reading\ndata: ${JSON.stringify(readingData)}\n\n`;

    for (const client of clientSet) {
      try {
        client.res.write(payload);
      } catch {
        this.removeClient(deviceId, client.id);
      }
    }
  }
}

export const sseManager = new SSEManager();
