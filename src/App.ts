import express, { Request, Response } from "express";
import { Worker } from "worker_threads";
import os from "os";

interface Job {
  n: number;
  resolve: (value: string) => void;
  reject: (err: any) => void;
}

class WorkerPool {
  workers: Worker[] = [];
  queue: Job[] = [];
  idleWorkers: Worker[] = [];

  constructor(size: number) {
    for (let i = 0; i < size; i++) {
      this.addWorker();
    }
  }

  addWorker() {
    const worker = new Worker(new URL("./worker.js", import.meta.url));

    worker.on("message", (msg) => {
      const job = (worker as any).currentJob as Job;
      (worker as any).currentJob = null;

      this.idleWorkers.push(worker);

      if (msg.error) job.reject(new Error(msg.error));
      else job.resolve(msg.result);

      this.runNext();
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
    });

    this.idleWorkers.push(worker);
    this.workers.push(worker);
  }

  runJob(n: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ n, resolve, reject });
      this.runNext();
    });
  }

  runNext() {
    if (this.queue.length === 0 || this.idleWorkers.length === 0) return;

    const worker = this.idleWorkers.pop()!;
    const job = this.queue.shift()!;

    (worker as any).currentJob = job;
    worker.postMessage({ task: "fib", n: job.n });
  }
}

// Worker pool size = number of CPU cores
const pool = new WorkerPool(os.cpus().length);

const app = express();
app.use(express.json());

// Simple GET endpoint for fib
app.get("/fib/:n", async (req: Request, res: Response) => {
  const start = Date.now();
  const n = parseInt(req.params.n);

  if (isNaN(n) || n < 0) return res.status(400).json({ error: "Invalid n" });

  try {
    const result = await pool.runJob(n);
    const duration = (Date.now() - start);
    res.json({ n, result, duration: `${duration}ms` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint for autocannon test
app.post("/api/process-data", async (req: Request, res: Response) => {
  const start = Date.now();
  const n = req.body?.n ?? 35; // default fib(35)

  try {
    const result = await pool.runJob(n);
    const duration = (Date.now() - start);
    res.json({ task: "fib", n, result, duration: `${duration}ms` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💡 Test with: autocannon -c 100 -d 10 -m POST -H "Content-Type: application/json" -b '{"n":35}' http://localhost:3000/api/process-data`);
});
