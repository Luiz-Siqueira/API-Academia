const Sequelize = require("sequelize");

const connection = require('./database');

//criando tabela no banco de dados
const Noticia = connection.define('tb_admin.noticia',{
    texto_noticia:{
        type:Sequelize.STRING(1234),
        allowNull:false
    },
    data:{
        type:Sequelize.DATE,
    }
});


Noticia.sync({force:false}).then(()=>{});


module.exports = Noticia;