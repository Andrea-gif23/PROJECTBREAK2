const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const productRoutes = require('./routes/productRoutes');


dotenv.config();

const app = express();


app.use(express.json()); 
app.use(cors()); 
app.use(express.static('public'));  


app.use(session({
  secret: 'mi-clave-secreta', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));


const users = [
  { id: 1, username: 'admin', password: '$2a$10$VtXJ7r3XwC9u0dhZq0Lw9O/fIkIsG9T5K5pU7p1lHBG2Kjj0S8hK6' }, 
  { id: 2, username: 'user', password: '$2a$10$VtXJ7r3XwC9u0dhZq0Lw9O/fIkIsG9T5K5pU7p1lHBG2Kjj0S8hK6' }  
];

// Middleware para verificar
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Middleware para usuario de login
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.username === 'admin') {
    return next();
  }
  res.redirect('/login');
}

// pagina login
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// processamos login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Buscamos usuario
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = { id: user.id, username: user.username };
    return res.redirect('/dashboard');
  } else {
    return res.send('Credenciales incorrectas.');
  }
});

// Ruta para el panel de administración
app.get('/dashboard', isAdmin, (req, res) => {
  res.send(`
    <h1>Bienvenido al Dashboard de Admin</h1>
    <p>Este es el panel donde puedes gestionar los productos.</p>
    <a href="/logout">Cerrar sesión</a>
  `);
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('No se pudo cerrar sesión.');
    }
    res.redirect('/login');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');  
});

// Rutas de productos
app.use(productRoutes);

// Conecta con Mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.log('Error de conexión:', error));

// para irse al servidos
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
