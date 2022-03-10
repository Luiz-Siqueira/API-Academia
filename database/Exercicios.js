const Sequelize = require("sequelize");

const connection = require('./database');

//criando tabela no banco de dados
const Exercicios = connection.define('tb_admin.exercicios',{
    nome_exercicios:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    repeticoes:{
        type:Sequelize.STRING,
        allowNull:false
    },  
    descricao:{
        type:Sequelize.STRING,
        allowNull:false
    },
    img:{
        type:Sequelize.STRING,
        allowNull:false
    }
});


Exercicios.sync({force:false}).then(()=>{});


module.exports = Exercicios;