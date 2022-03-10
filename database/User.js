const Sequelize = require("sequelize");

const connection = require('./database');

//criando tabela no banco de dados
const User = connection.define('tb_admin.aluno',{
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    datanascimento:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    cpf:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    whatsapp:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    treinoa:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    treinob:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    treinoc:{
        type:Sequelize.STRING,
        allowNull:false
    },

    treinod:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }

});


User.sync({force:false}).then(()=>{});


module.exports = User;