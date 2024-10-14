const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'EventHub',
  password: 'gushkatmemishki',
  port: 5432, // default PostgreSQL port
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack))
  .finally(() => client.end());