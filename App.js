const express = require("express");
const app = express();
const PORT = 3000;

function logWithLocalTime(message) {
  const now = new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" });
  console.log(`[${now}] ${message}`);
}

app.get("/", (req, res) => {
  res.send("Latency Detective Server is Running ✅");
});

app.get("/api/sum", (req, res) => {
  console.time("SUM handler");
  let sum = 0;
  for (let i = 0; i < 1000; i++) sum += i;
  console.timeEnd("SUM handler");
  res.json({ success: true, sum });
});

app.post("/api/process-data", (req, res) => {
  console.time("FIB handler");

  function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }

  const num = Number.parseInt(req.query.num || "35", 10);
  const result = fib(num);

  console.timeEnd("FIB handler");
  res.json({ success: true, num, result });
});

app.get("/api/echo", (req, res) => {
  console.time("ECHO handler");
  const msg = req.query.msg || "Hello!";
  console.timeEnd("ECHO handler");
  res.json({ success: true, echo: msg });
});

app.listen(PORT, () => {
  logWithLocalTime(`🚀 Server started with fresh code`);
  console.log(`Server running on http://localhost:${PORT}`);
});
