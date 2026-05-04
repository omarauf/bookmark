export class WorkerScheduler {
  private running = false;
  private timeouts = new Set<ReturnType<typeof setTimeout>>();

  constructor(
    private readonly options: {
      workerCount: number;
      interval: number;
      onTick: (workerId: number) => Promise<void>;
    },
  ) {}

  start() {
    if (this.running) return;
    this.running = true;

    for (let i = 0; i < this.options.workerCount; i++) {
      this.runWorker(i);
    }
  }

  stop() {
    this.running = false;

    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }

    this.timeouts.clear();
  }

  private runWorker(workerId: number) {
    const loop = async () => {
      if (!this.running) return;

      try {
        await this.options.onTick(workerId);
      } catch (err) {
        console.error(`Worker ${workerId} error:`, err);
      }

      if (!this.running) return;

      const timeout = setTimeout(() => {
        this.timeouts.delete(timeout);
        void loop();
      }, this.options.interval);

      this.timeouts.add(timeout);
    };

    void loop();
  }
}
