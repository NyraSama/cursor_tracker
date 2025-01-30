const express = require("express");
const cors = require("cors");
const { Kafka, Partitioners } = require("kafkajs");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:19092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const consumer = kafka.consumer({ groupId: "cursor-tracker-group" });

app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { pseudo, x, y } = req.body;

  await producer.connect();
  await producer.send({
    topic: "cursor_tracker",
    messages: [{ key: pseudo, value: JSON.stringify({ x, y }) }],
  });

  res.sendStatus(200);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
});

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "cursor_tracker", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const pseudo = message.key.toString();
      const positions = JSON.parse(message.value.toString());

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ pseudo, positions }));
        }
      });
    },
  });
};

runConsumer().catch(console.error);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
