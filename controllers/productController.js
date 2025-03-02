const Product = require('../models/Product');

// Mostrar todos los productos
const showProducts = async (req, res) => {
  const products = await Product.find();
  let html = '<h1>Catálogo de Productos</h1>';
  products.forEach(product => {
    html += `
      <div>
        <img src="${product.imagen}" alt="${product.nombre}" width="100">
        <h2>${product.nombre}</h2>
        <p>${product.descripcion}</p>
        <p>${product.precio}€</p>
        <a href="/products/${product._id}">Ver detalle</a>
      </div>
    `;
  });
  res.send(html);
};

// Mostrar un solo producto
const showProductById = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  res.send(`
    <h1>${product.nombre}</h1>
    <img src="${product.imagen}" alt="${product.nombre}" width="200">
    <p>${product.descripcion}</p>
    <p>${product.precio}€</p>
  `);
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const { nombre, descripcion, imagen, categoria, talla, precio } = req.body;
  await Product.create({ nombre, descripcion, imagen, categoria, talla, precio });
  res.redirect('/products');
};

module.exports = { showProducts, showProductById, createProduct };
