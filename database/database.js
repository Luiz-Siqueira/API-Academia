const Sequelize = require("sequelize");

const connection = new Sequelize('bd_name','user','password',{
    host:'us-cdbr-east-04.cleardb.com',
    dialect:'mysql',
    define: {
        timestamps: false
    }
})

module.exports = connection;
