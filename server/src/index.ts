import "dotenv/config";
import { createApp } from "./app.js";

const PORT = Number(process.env.PORT || 8787);
createApp().listen(PORT, () => {
  console.log(`English Buddy API chạy tại http://localhost:${PORT}`);
});
