const express = require("express"); // utilizando el framework
const app = express(); //instancia de express
const puerto = 3000; //puerto que voy a escuchar
const path = require("path") 
const cors = require("cors")
const mariadb = require('mariadb'); //libreria para conectar con base de datos mariaDB

const pool = mariadb.createPool({
  host: "localhost", 
  user: "root", 
  password: "1234", 
  database: "proyectog5", 
  connectionLimit: 5
});

const dataFolderPath = path.join(__dirname);

app.use(express.json());
app.use(cors());

// Servir frontend entero
app.use(express.static(path.join(__dirname, "../Frontend")));




app.use("/api", express.static(path.join(__dirname, "api")));

app.get('/cats_products/:id', (req, res) => {
    const cats_productsId = req.params.id;
   const filePath = path.join(__dirname, "api", "cats_products", `${cats_productsId}.json`);

    res.sendFile(filePath);
});

app.get('/cats/', (req, res) => {
    const filePath = path.join(dataFolderPath,"api", `cats`, `cats`);
    res.sendFile(filePath);
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const filePath = path.join(dataFolderPath, "api", `products`, `${productId}.json`);
    res.sendFile(filePath);
});

app.get("/products_comments/:id", (req, res)=> {
  const products_commentsId = req.params.id;
  const filePath = path.join(dataFolderPath, `products_comments`, `${products_commentsId}.json`);
res.sendFile(filePath);

});
app.get("/sell/:id", (req,res)=> {
  const sellId= req.params.id;
  const filePath = path.join(dataFolderPath, `sell`, `${sellId}.json`);
  res.sendFile(filePath);
});

app.get("/user_cart/:id", (req,res) => {
  const userId = req.params.id;
  const filePath = path.join(dataFolderPath, `user_cart`, `${userID}.json`)
  res.sendFile(filePath);
})
app.get("/nav.html", (req, res) => {
  res.sendFile(path.join(__dirname, "nav.html"));
});







app.listen(puerto, ()=> {
  console.log(`Servidor funcionando en http://localhost:${puerto}`)
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});
