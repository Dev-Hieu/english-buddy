import "dotenv/config";
import { createApp } from "./app.js";
import { db } from "./db.js";
import { startImageWorker } from "./imageWorker.js";

const PORT = Number(process.env.PORT || 8787);
createApp().listen(PORT, () => {
  console.log(`English Buddy API chạy tại http://localhost:${PORT}`);
  startImageWorker(db);
});
