// Xoá dữ liệu HỌC TẬP (tiến độ, kết quả test, lịch sử tra) để bắt đầu sạch.
// GIỮ NGUYÊN nội dung (topics, vocabulary) và hồ sơ học sinh. Chạy: npm run reset
import "dotenv/config";
import { db, initSchema } from "./db.js";

initSchema();
const tx = db.transaction(() => {
  db.prepare("DELETE FROM progress").run();
  db.prepare("DELETE FROM quiz_results").run();
  db.prepare("DELETE FROM lookup_history").run();
});
tx();
console.log("Đã xoá tiến độ/kết quả/lịch sử. Topics, vocabulary, students giữ nguyên.");
