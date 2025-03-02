fetch('http://localhost:3001/products')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const productsContainer = document.getElementById('products-container');

    data.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');

      productElement.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">$${product.price}</p>
        <button onclick="window.location.href='producto.html?id=${product._id}'">Ver</button>
      `;

      productsContainer.appendChild(productElement);
    });
  })
  .catch(error => console.log('Error fetching products:', error));
