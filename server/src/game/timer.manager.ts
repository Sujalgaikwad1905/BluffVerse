const bluffTimers = new Map<string, NodeJS.Timeout>();
const turnTimers = new Map<string, NodeJS.Timeout>();

class TimerManager {
  startBluffTimer(
    roomCode: string,
    callback: () => void
  ) {
    this.clearBluffTimer(roomCode);

    bluffTimers.set(
      roomCode,
      setTimeout(() => {
        bluffTimers.delete(roomCode);
        callback();
      }, 3000)
    );
  }

  clearBluffTimer(roomCode: string) {
    const timer = bluffTimers.get(roomCode);

    if (!timer) return;

    clearTimeout(timer);

    bluffTimers.delete(roomCode);
  }

  startTurnTimer(
    roomCode: string,
    callback: () => void
  ) {
    this.clearTurnTimer(roomCode);

    turnTimers.set(
      roomCode,
      setTimeout(() => {
        turnTimers.delete(roomCode);
        callback();
      }, 10000)
    );
  }

  clearTurnTimer(roomCode: string) {
    const timer = turnTimers.get(roomCode);

    if (!timer) return;

    clearTimeout(timer);

    turnTimers.delete(roomCode);
  }
}

export const timerManager = new TimerManager();