The nodejs event loop was blocked by the naive recursive Fibonacci function (fib(n)) because at /api/process-data because this process is a synchronous CPU intensive process.
Used worker thread because it lets me have access to the shared memory in the form of sharedArrayBuffer, this allows us to share memory between worker thread and main thread without copying large objects.

runs heavy Cpu tasks in another thread within the node process

This was how i used the worker thread
Instead of spawning a worker for every request, you:

1. Start a fixed pool of workers when the server boots.
2. Maintain a job queue.
3. Assign incoming requests to an available worker immediately.
4. If all workers are busy, requests wait in a short queue instead of creating new worker threads.
   This way:

- Worker spin-up cost is paid once at startup.
- Each request only pays the actual Fibonacci calculation time.

Comparism between the old and the new

unoptimized code
latency = 5,000ms(5s)
output = 3.5 req/s
![Unoptimized Latency](/oldLatency.png)

optimized code
latency = 64.23ms(0.064s)
output = 1.544 req/s
![Optimized Latency](/newLatency.png)

test with: autocannon -c 100 -d 10 -m POST -H "Content-Type: application/json" -b '{"n":35}' http://localhost:3000/api/process-data

%improvement: (5000−64.23)/5000 ×100 ≈ 98.72%
