const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const productRoutes = require('./routes/productRoutes');
const User = require('./models/User');  

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); 

app.use(session({
  secret: 'mi-clave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.username === 'admin') {
    return next();
  }
  res.redirect('/login');
}

// Ruta de login
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('Usuario no encontrado');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Contraseña incorrecta');
  }

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Ruta de registro
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('El nombre de usuario ya está en uso');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.status(201).send('Usuario registrado exitosamente');
});

// Ruta del dashboard
app.get('/dashboard', isAdmin, (req, res) => {
  res.send(`
    <h1>Bienvenido al Dashboard de Admin</h1>
    <p>Este es el panel donde puedes gestionar los productos.</p>
    <a href="/logout">Cerrar sesión</a>
  `);
});

// Ruta de logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('No se pudo cerrar sesión');
    }
    res.redirect('/login');
  });
});

// API de productos
// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    // Array de productos de ejemplo (puedes quitar esto cuando uses MongoDB)
    const productos = [
      {
        "_id": "67c44403bda921d129f1fe9a",
        "name": "Viaje a Japón",
        "price": 1500,
        "description": "Disfruta de un increíble viaje por todos los rincones de Japón durante 12 días, todo incluido en el precio.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/japon_cfguns.jpg",
        "__v": 0
      },
      {
        "_id": "67c4454dbda921d129f1fe9d",
        "name": "Bali",
        "price": 1200,
        "description": "Playas paradisíacas y templos exóticos en una experiencia única de 9 días.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/bali_phtqua.jpg",
        "__v": 0
      },
      {
        "_id": "67c44573bda921d129f1fea0",
        "name": "Grecia",
        "price": 860,
        "description": "Explora Grecia en un crucero de 7 días, recorriendo sus islas más emblemáticas.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/grecia_bc4rtl.jpg",
        "__v": 0
      },
      {
        "_id": "67c445b4bda921d129f1fea2",
        "name": "Copenhague",
        "price": 530,
        "description": "Viaje de 4 días en Semana Santa para descubrir la capital danesa y su encanto escandinavo.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/copenhague_xrb3d9.jpg",
        "__v": 0
      },
      {
        "_id": "67c445d6bda921d129f1fea5",
        "name": "Vietnam",
        "price": 730,
        "description": "Sumérgete en la cultura vietnamita con un tour de 8 días por sus paisajes y ciudades vibrantes.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/vietnam_o7qemv.jpg",
        "__v": 0
      },
      {
        "_id": "67c445fbbda921d129f1fea7",
        "name": "Patagonia Argentina",
        "price": 1010,
        "description": "Aventura en la Patagonia Argentina durante 10 días, explorando sus glaciares y paisajes únicos.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/patagonia_argentina_hv4enx.webp",
        "__v": 0
      },
      {
        "_id": "67c44627bda921d129f1feaa",
        "name": "París",
        "price": 420,
        "description": "Escapada de fin de semana a la ciudad del amor, con visitas a sus monumentos más icónicos.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/paris_uavwov.jpg",
        "__v": 0
      },
      {
        "_id": "67c4464abda921d129f1feac",
        "name": "Chicago",
        "price": 710,
        "description": "Oferta de última hora para explorar la vibrante ciudad de Chicago.",
        "imageUrl": "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912476/chicago_sambci.jpg",
        "__v": 0
      }
    ];

    res.json(productos); // Devuelvo los productos como JSON
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Ruta para obtener un producto por su ID
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    // Aquí obtendrías un producto desde la base de datos con el ID si estuvieras usando MongoDB
    const product = productos.find(p => p._id === productId); // Aquí simulo la búsqueda del producto por ID
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

// Rutas de productos (lo que ya tenías)
app.use('/products', productRoutes);

// Conexión con MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.log('Error de conexión:', error));

// Iniciar el servidor
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
