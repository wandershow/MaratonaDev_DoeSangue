
// configurando o servidor
const express = require("express") //atribui o express que instalamos na const express
const server = express() //atribui a const express ao nosso server

//configurar o servidor para apresentar arquivos estaticos (imagens,css, etc)
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true}))


// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres', // padrão do postgres
    password: '', // senha do postgres (nesse caso eu não configurei nenhuma ta vazia)
    host: 'localhost', //
    port: '5432',  // aqui coloca a porta sendo usada, no caso a padrão do postgres
    database: 'doe'   // aqui bota o nome do BD
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})



//configurar a apresentação da pagina
server.get("/", function(req, res) { //aqui pega o "/" (caminho) e retorna uma resposta

    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")


        const donors = result.rows
        return res.render("index.html", {donors}) //faz a renderização na pagina principal
    })
    
})

server.post("/", function(req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == ""  || email =="" || blood == ""){
        return res.send("Todos os campos são obrigatorios!")
    }

    //add valores dentro do BD
    const query = `INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]


    db.query(query, values, function(err) {
        if (err) return res.send("Erro no banco de dados.")

        // caminho feliz
        return res.redirect("/")
    } ) 
   

    
})


//Ligar o servidor e prmitir o acesso na porta 3000
server.listen(3000, function(){ 
    console.log("iniciei o servidor")
}); 