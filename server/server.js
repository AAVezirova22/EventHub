const sequelize = require('./sequelizeConfig');
const User = require('./model/user'); // Import your model

// Sync models with the database
sequelize.sync({ force: true }) // 'force: true' will drop existing tables
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error syncing with the database:', err);
    });