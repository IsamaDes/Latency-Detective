import { parentPort } from "worker_threads";
function fib(n) {
    if (n <= 1)
        return n.toString();
    let prev = 0n, curr = 1n;
    for (let i = 2; i <= n; i++) {
        const next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr.toString();
}
parentPort?.on("message", (data) => {
    try {
        if (data.task === "fib") {
            const result = fib(data.n);
            parentPort?.postMessage({ result });
        }
        else {
            parentPort?.postMessage({ error: "Unknown task" });
        }
    }
    catch (err) {
        parentPort?.postMessage({ error: err.message });
    }
});
