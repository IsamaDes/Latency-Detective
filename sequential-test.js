// test.js
const autocannon = require("autocannon");

async function run() {
  console.log("Testing /api/sum");
  await autocannon({
    url: "http://localhost:3000/api/sum",
    connections: 1,
    amount: 100,
  });

  console.log("Testing /api/process-data");
  await autocannon({
    url: "http://localhost:3000/api/process-data?num=35",
    method: "POST",
    connections: 1,
    amount: 100,
  });

  console.log("Testing /api/echo");
  await autocannon({
    url: "http://localhost:3000/api/echo?msg=test",
    connections: 1,
    amount: 100,
  });
}

run();
