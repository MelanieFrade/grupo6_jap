const express = require("express"); // utilizando el framework
const app = express(); //instancia de express
const puerto = 3000; //puerto que voy a escuchar
const path = require("path") 
const cors = require("cors");

const dataFolderPath = path.join(__dirname);
app.use(express.json());
app.use(cors());
//api
app.use(express.static(path.join(__dirname,"api")));

app.get('/cats_products/:id', (req, res) => {
    const cats_productsId = req.params.id;
    const filePath = path.join(dataFolderPath, `cats_products`, `${cats_productsId}.json`);
    res.sendFile(filePath);
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const filePath = path.join(dataFolderPath, `products`, `${productId}.json`);
    res.sendFile(filePath);
});


app.use("/cats", express.static(path.join(__dirname, "api/cats")));
app.use("/cats_products", express.static(path.join(__dirname, "api/cats_products")));
app.use("/products", express.static(path.join(__dirname, "api/products")));
app.use("/products_comments", express.static(path.join(__dirname, "api/products_comments")));
app.use("/user_cart", express.static(path.join(__dirname, "api/user_cart")));
app.use("/sell", express.static(path.join(__dirname, "api/sell")));
app.use("/cart", express.static(path.join(__dirname, "api/cart")));

// front

const frontPath = path.join(__dirname, "../Frontend");
app.use(express.static(frontPath));
console.log("Frontend path:", frontPath);




app.listen(puerto, ()=> {
  console.log(`Servidor funcionando en http://localhost:${puerto}`)
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});
