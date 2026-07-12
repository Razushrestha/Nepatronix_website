/** PM2 config — secrets live in .env.local on the server (Next.js loads them automatically). */
module.exports = {
  apps: [
    {
      name: 'nepatronix',
      cwd: '/var/www/nepatronix',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
