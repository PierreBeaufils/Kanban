const { Sequelize } = require('sequelize');

// underscored option to allow snake_case as naming convention
const sequelize = new Sequelize(process.env.PG_URL, {
    define: {
        underscored: true,
    }
});

module.exports = sequelize;