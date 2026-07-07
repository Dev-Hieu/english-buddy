module.exports = {
  apps: [{
    name: "english-buddy",
    script: "npx",
    args: "tsx src/index.ts",
    cwd: "/home/opc/english-buddy/server",
    instances: 3, // 3 workers (giữ 1 core cho Caddy/TTS/Speech)
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 8787,
    },
    max_memory_restart: "300M",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    merge_logs: true,
    autorestart: true,
    watch: false,
  }]
};
