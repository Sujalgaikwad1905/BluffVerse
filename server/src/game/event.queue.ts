type EventHandler = () => Promise<void>;

class RoomEventQueue {
  private queues = new Map<string, EventHandler[]>();

  private processing = new Set<string>();

  async enqueue(
    roomCode: string,
    handler: EventHandler
  ): Promise<void> {
    if (!this.queues.has(roomCode)) {
      this.queues.set(roomCode, []);
    }

    this.queues.get(roomCode)!.push(handler);

    if (!this.processing.has(roomCode)) {
      await this.process(roomCode);
    }
  }

  private async process(roomCode: string): Promise<void> {
    this.processing.add(roomCode);

    const queue = this.queues.get(roomCode)!;

    while (queue.length > 0) {
      const handler = queue.shift();

      if (!handler) {
        continue;
      }

      await handler();
    }

    this.processing.delete(roomCode);
  }
}

export const eventQueue = new RoomEventQueue();
