const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('EventHub', 'postgres', 'gushkatmemishki', {
  host: 'localhost',
  dialect: 'postgres', // Use the 'postgres' dialect
  logging: console.log, // Enable detailed logging
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
