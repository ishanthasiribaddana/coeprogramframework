module.exports = {
  apps: [{
    name: 'coe-api',
    script: 'index.js',
    cwd: '/var/www/coe-program-framework/server',
    env: {
      NODE_ENV: 'production',
      DB_HOST: 'localhost',
      DB_PORT: 3306,
      DB_USER: 'root',
      DB_PASSWORD: 'SH3iA7b9kUpd',
      DB_NAME: 'coe_program_framework',
      PORT: 3001
    }
  }]
};
