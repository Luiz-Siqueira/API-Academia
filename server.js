// Precisa intalar essas dependencias 
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

//Database
const connection = require("./database/database");
const Noticia = require("./database/Noticia");
const User = require("./database/User");
const Treino = require("./database/Treino");
const Exercicios = require("./database/Exercicios");

connection
    .authenticate()
    .then(()=>{
        console.log('connection feita');
    }).catch((e)=>{
        console.log(e);
        console.log('erro na con');
    })


//token JWT
const JWTSecret = "asdasdsadasdasd"

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


function auth(req,res,next){

    const authToken = req.headers['authorization'];

    if (authToken != undefined) {

        const bear = authToken.split(' ');
        var token = bear[1];

        //verificando autenticação
        jwt.verify(token,JWTSecret,(err,data)=>{
            if (err) {
                res.status(401);
            }else{
                req.token = token;
                req.loggedUser = {id:data.id,email:data.email};
                next();
            }
        })
        
    }else{
        res.status(401);
    }
}



app.get("/",(req,res)=>{
    res.status(404);
});

// gerando token com login e senha 
app.post("/auth",(req,res)=>{

    var {email,password} = req.body;

    if (email != undefined) {

        //select do bd
        User.findAll({
            attributes: [
                'id', 'nome', 'email',
            ],
            where:{
                email: email,
                password:password
            }
        }).then(data =>{
            if (data.length == 1) {
                jwt.sign({ id:User.id,  email:User.email },JWTSecret,{expiresIn:'48h'},(err,token) =>{
                    if(err){
                        res.status(400);
                        res.json({err:"Falha interna"});
                    }else{
                        res.status(200);
                        res.json({token:token,id:data[0].id})
                    }
                })
                
            } else {
                res.status(404);
            }
        }).catch(()=>{
            res.status(400);
            res.json({err:"Falha interna"});

        })
    }else{
        res.status = 404;
        res.json({err:"O email enviado não é valido"})
    }
});

//Recendo Noticias do Banco de Dados
app.get("/noticia",auth,(req,res)=>{
    Noticia.findAll({raw:true}).then(data =>{
        if (data.length > 0) {

            data.forEach((element,i) => {
                let data_convert = JSON.stringify(element.data);
                data_convert = data_convert.split("T");

                //convertendo dia 
                let dia = data_convert[0]
                dia = dia.substr(1)
                dia = dia.split("-")
                dia = dia[2] + "/" + dia[1] + "/" + dia[0]
                
                //convertendo hora
                let hora = data_convert[1]
                hora = hora.substring(0, hora.length - 9);

                data[i].data = hora + " - " +dia;

            });
            
            res.json(data);
        }else{
            res.status = 404;
            res.json({err:"Nenhuma informação foi encontrada"})
        }
    }).catch((e)=>{
        console.log(e)
    })
});


app.post("/userId",auth,(req,res)=>{

    var {email} = req.body;

    if (email != undefined) {

        //select do bd
        User.findAll({
            attributes: [
                'id',
            ],
            where:{
                email: email,
            }
        }).then(data =>{
            if (data.length == 1) {
                res.json({data:data});
            } else {
                res.status(404);
            }
        }).catch(()=>{
            res.status(400);
            res.json({err:"Falha interna"});

        })
    }else{
        res.status = 404;
        res.json({err:"O email enviado não é valido"})
    }
});


// Rebendo Treino de Cada Aluno
app.get("/treino/:id",auth,(req,res)=>{
    var id = req.params.id;

    if (isNaN(id)) {
        res.status = 404;
        res.json({err:"Nenhuma informação foi encontrada"})
    }else{
        User.findAll({
            attributes: [
                'treinoa', 'treinob', 'treinoc','treinod',
            ],
            where:{
                id:id
            }
        }).then(data =>{
            if (data.length > 0) {
                res.json(data);
            }else{
                res.status = 404;
                res.json({err:"Nenhuma informação foi encontrada"})
            }
        }).catch(()=>{
            res.status = 404;
            res.json({err:"Nenhuma informação foi encontrada"})
        })
    }
});


//Rebendo Treino especifico de Cada Aluno
app.get("/treino/:idUser/:treinoUser",auth,(req,res)=>{
    var id = req.params.idUser;
    var treino = req.params.treinoUser;

    if (isNaN(id)) {
        res.status = 404;
        res.json({err:"Nenhuma informação foi encontrada"})
    }else{
        User.findAll({
            attributes: [
                treino
            ],
            where:{id:id}
        }).then((data) =>{
            id_treino = data[0].dataValues[treino]
            Treino.findAll({
                where:{id:id_treino}
            }).then(async  data2 =>{
                var treino = data2[0].treino;

                var treino = treino.split('-');

                // Seleciona os exercicios com o id e armazena em um array
                var exercicios = async function (treino){
                    var arrExe = []
                    for (let index = 0; index < treino.length; index++) {
                        await Exercicios.findAll({
                            where:{id:treino[index]}
                        }).then(data2 =>{
                            arrExe.push(data2[0].dataValues)
                        })
                    }

                    return arrExe;
                }
                
                var exerciciosJSON = await exercicios(treino)
                data2[0].treino = exerciciosJSON;


                res.json(data2[0])
            }).catch((e)=>{
                console.log(e)
            })
        }).catch((e)=>{
            res.status = 404;
            res.json({erro:e.message})
        })
    }
});

//rebendo informaçoes do usuario
app.put("/user/:id",auth,(req,res)=>{

    var {password} = req.body;
    var id = req.params.id;
    if (isNaN(id)) {
        res.status = 404;
        res.json({err:"Nenhuma informação foi encontrada"})
    }else{
        User.update({ password: password }, {
            where: {
                id: id
            }
        })
        .then(data =>{
            if (data.length > 0) {
                res.status = 200;
                res.json(data);
            }else{
                res.status = 404;
                res.json({err:"Nenhuma informação foi encontrada"})
            }
        })
    }
});



//rebendo treinos Livres do banco de dados
app.get("/livre/",auth,(req,res)=>{
    Treino.findAll({
        where:{
            tipo_treino:"livre"
        }
    }).then(data =>{

        if (data.length > 0) {

            for (let index = 0; index < data.length; index++) {
                var arrTreinos = data[index].dataValues.treino;

                arrTreinos =  arrTreinos.split("-");
                arrTreinos.shift();
                
                data[index].dataValues.treino = arrTreinos
                
            }

            res.json(data);
        }else{
            res.status = 404;
            res.json({err:"Nenhuma informacao foi encontrada"})
        }
    })
});

app.listen(process.env.PORT || 5000,()=>{
    console.log("API Rodando");
})

