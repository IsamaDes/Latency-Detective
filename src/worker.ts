import { parentPort, workerData } from "worker_threads";

function fib(n: number): string {
  if (n <= 1) return n.toString();
  let prev = 0n, curr = 1n;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr.toString();
}

parentPort?.on("message", (data: { task: string; n: number }) => {
  try {
    if (data.task === "fib") {
      const result = fib(data.n);
      parentPort?.postMessage({ result });
    } else {
      parentPort?.postMessage({ error: "Unknown task" });
    }
  } catch (err: any) {
    parentPort?.postMessage({ error: err.message });
  }
});
