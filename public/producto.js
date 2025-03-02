// Obtener el ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Verificar si hay un ID válido
if (productId) {
  fetch(`http://localhost:3001/products/${productId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      return response.json();
    })
    .then(product => {
      const productDetails = document.getElementById('product-details');

      productDetails.innerHTML = `
        <div class="product">
          <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
          <h2 class="product-name">${product.name}</h2>
          <p class="product-description">${product.description}</p>
          <p class="product-price">$${product.price}</p>
        </div>
      `;
    })
    .catch(error => {
      document.getElementById('product-details').innerHTML = `<p>${error.message}</p>`;
      console.error('Error al obtener el producto:', error);
    });
} else {
  document.getElementById('product-details').innerHTML = `<p>Producto no encontrado</p>`;
}
