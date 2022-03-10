const Sequelize = require("sequelize");

const connection = require('./database');

//criando tabela no banco de dados
const Treino = connection.define('tb_admin.treinos',{
    nome_treino:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    tipo_treino:{
        type:Sequelize.STRING,
        allowNull:false
    },  
    treino:{
        type:Sequelize.STRING,
        allowNull:false
    },

});


Treino.sync({force:false}).then(()=>{});


module.exports = Treino;