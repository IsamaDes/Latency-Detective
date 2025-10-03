import { parentPort } from "worker_threads";
if (!parentPort)
    throw new Error("Worker must be run via Worker Threads");
parentPort.on("message", (num) => {
    const fib = (n) => {
        if (n <= 1)
            return n;
        let prev = 0, curr = 1;
        for (let i = 2; i <= n; i++) {
            [prev, curr] = [curr, prev + curr];
        }
        return curr;
    };
    try {
        const result = fib(num);
        parentPort.postMessage(result);
    }
    catch (err) {
        parentPort.postMessage({ error: err.message });
    }
});
