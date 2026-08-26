module.exports = {
  apps: [
    {
      name: 'kryzox-webapp',
      script: 'node',
      args: 'dist-server/server.js',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
