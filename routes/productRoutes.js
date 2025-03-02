const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.get('/products', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});


router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); 
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
});

router.post('/products', async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  const product = new Product({
    name,
    price,
    description,
    imageUrl
  });

  try {
    await product.save(); 
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto' });
  }
});


router.post('/products/bulk', async (req, res) => {
  try {
    const productos = [
      {
        name: "Viaje a Japón",
        price: 1500,
        description: "Descubre Japón durante 12 días con todo incluido. Cultura, tecnología y tradición en un solo viaje.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/japon_cfguns.jpg"
      },
      {
        name: "Bali",
        price: 1200,
        description: "Playas paradisíacas y templos exóticos en una experiencia única de 9 días.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/bali_phtqua.jpg"
      },
      {
        name: "Grecia",
        price: 860,
        description: "Explora Grecia en un crucero de 7 días, recorriendo sus islas más emblemáticas.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/grecia_bc4rtl.jpg"
      },
      {
        name: "Copenhague",
        price: 530,
        description: "Viaje de 4 días en Semana Santa para descubrir la capital danesa y su encanto escandinavo.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/copenhague_xrb3d9.jpg"
      },
      {
        name: "Vietnam",
        price: 730,
        description: "Sumérgete en la cultura vietnamita con un tour de 8 días por sus paisajes y ciudades vibrantes.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/vietnam_o7qemv.jpg"
      },
      {
        name: "Patagonia Argentina",
        price: 1010,
        description: "Aventura en la Patagonia Argentina durante 10 días, explorando sus glaciares y paisajes únicos.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/patagonia_argentina_hv4enx.webp"
      },
      {
        name: "París",
        price: 420,
        description: "Escapada de fin de semana a la ciudad del amor, con visitas a sus monumentos más icónicos.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912477/paris_uavwov.jpg"
      },
      {
        name: "Chicago",
        price: 710,
        description: "Oferta de última hora para explorar la vibrante ciudad de Chicago.",
        imageUrl: "https://res.cloudinary.com/ddnrrotxo/image/upload/v1740912476/chicago_sambci.jpg"
      }
    ];

    const productosGuardados = await Product.insertMany(productos);
    res.status(201).json(productosGuardados);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar productos", error });
  }
});

module.exports = router;

