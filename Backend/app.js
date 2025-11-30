const express = require("express"); // utilizando el framework
const app = express(); //instancia de express
const puerto = process.env.PORT || 3000; //3000; //puerto que voy a escuchar
const path = require("path");
const cors = require("cors");
const mariadb = require("mariadb"); //libreria para conectar con base de datos mariaDB
const jwt = require("jsonwebtoken");

app.use(express.json());

// AUTENTICACIÓN Y MIDDLEWARE
// Config (usa variables de entorno en producción)
const JWT_SECRET = process.env.JWT_SECRET || "clave_segura";
const JWT_EXPIRES_IN = "1h"; // ajustar según necesidad

const users = [
  { id: 1, username: "admin@mail.com", password: "admin123" },
  { id: 2, username: "melanie@mail.com", password: "pass123" },
];

// --- POST /login ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Correo electrónico y Contraseña son requeridos" });
  }

  // Aquí iría la verificación contra DB (hash comparation en prod)
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Payload mínimo: id y username (podés agregar rol u otros claims)
  const payload = { id: user.id, username: user.username };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  // Devolver token (y opcionalmente info de usuario)
  res.json({
    token,
    user: { id: user.id, username: user.username },
  });
});

// --- Middleware de autorización ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "No se proporcionó token" });

  // Esperamos: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(400).json({ error: "Formato de token inválido" });
  }

  const token = parts[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // err.name puede ser 'TokenExpiredError' o 'JsonWebTokenError'
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    // adjuntamos info del usuario decodificada al request para usar en rutas protegidas
    req.user = decoded;
    next();
  });
}

// --- Ejemplo de ruta protegida ---
app.get("/api/protected", authenticateToken, (req, res) => {
  // req.user viene del token
  res.json({ msg: "Acceso concedido", user: req.user });
});

///////////////////////////////////////////////////////////////////////////////////////
// INTENTO CONEXIÓN CON BD
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "proyectog5",
  connectionLimit: 5,
});

const dataFolderPath = path.join(__dirname);

app.use(cors());

// Servir frontend entero
app.use(express.static(path.join(__dirname, "../Frontend")));

app.use("/api", express.static(path.join(__dirname, "api")));

app.get("/cats_products/:id", (req, res) => {
  const cats_productsId = req.params.id;
  const filePath = path.join(
    __dirname,
    "api",
    "cats_products",
    `${cats_productsId}.json`
  );

  res.sendFile(filePath);
});

app.get("/cats/", (req, res) => {
  const filePath = path.join(dataFolderPath, "api", `cats`, `cats`);
  res.sendFile(filePath);
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const filePath = path.join(
    dataFolderPath,
    "api",
    `products`,
    `${productId}.json`
  );
  res.sendFile(filePath);
});

app.get("/products_comments/:id", (req, res) => {
  const products_commentsId = req.params.id;
  const filePath = path.join(
    dataFolderPath,
    `products_comments`,
    `${products_commentsId}.json`
  );
  res.sendFile(filePath);
});
app.get("/sell/:id", (req, res) => {
  const sellId = req.params.id;
  const filePath = path.join(dataFolderPath, `sell`, `${sellId}.json`);
  res.sendFile(filePath);
});

app.get("/user_cart/:id", (req, res) => {
  const userId = req.params.id;
  const filePath = path.join(dataFolderPath, `user_cart`, `${userID}.json`);
  res.sendFile(filePath);
});
app.get("/nav.html", (req, res) => {
  res.sendFile(path.join(__dirname, "nav.html"));
});

app.listen(puerto, () => {
  console.log(`Servidor funcionando en http://localhost:${puerto}`);
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});
