$(document).ready(function () {
  const apiUrl = "https://fakestoreapi.com/products";
  const productList = $("#product-list");
  const cartItems = $("#cart-items");
  const cartTotal = $("#cart-total");
  let cart = [];

  function fetchProducts() {
    $.get(apiUrl, function (data) {
      data.forEach((product) => {
        productList.append(`
                  <div class="col-md-4 col-sm-6">
                      <div class="product">
                          <h5>${product.title}</h5>
                          <img src="${product.image}" class="img-fluid" alt="${product.title}">
                          <p>$${product.price}</p>
                          <button class="btn btn-primary view-product" data-id="${product.id}">View Product</button>
                          <button class="btn btn-secondary add-to-cart" data-id="${product.id}">Add to Cart</button>
                      </div>
                  </div>
              `);
      });
    });
  }

  function addToCart(productId) {
    $.get(`${apiUrl}/${productId}`, function (product) {
      const existingProduct = cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        product.quantity = 1;
        cart.push(product);
      }
      updateCart();
    });
  }

  function removeFromCart(productId) {
    const productIndex = cart.findIndex((item) => item.id === productId);
    if (productIndex > -1) {
      cart[productIndex].quantity--;
      if (cart[productIndex].quantity === 0) {
        cart.splice(productIndex, 1);
      }
      updateCart();
    }
  }

  function clearCart() {
    cart = [];
    updateCart();
  }

  function updateCart() {
    cartItems.empty();
    let total = 0;
    cart.forEach((item) => {
      cartItems.append(`
              <div class="cart-item">
                  <h5>${item.title}</h5>
                  <p>$${item.price} x ${item.quantity}</p>
                  <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">Remove</button>
              </div>
          `);
      total += item.price * item.quantity;
    });
    cartTotal.text(total.toFixed(2));
  }

  function showProduct(productId) {
    $.get(`${apiUrl}/${productId}`, function (product) {
      $("#product-detail").html(`
              <div class="col-12">
                  <div class="product-detail">
                      <h3>${product.title}</h3>
                      <img src="${product.image}" class="img-fluid" alt="${product.title}">
                      <p>${product.description}</p>
                      <p>$${product.price}</p>
                      <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                  </div>
              </div>
          `);
    });
  }

  productList.on("click", ".add-to-cart", function () {
    const productId = $(this).data("id");
    addToCart(productId);
  });

  productList.on("click", ".view-product", function () {
    const productId = $(this).data("id");
    localStorage.setItem("productId", productId);
    window.location.href = "product.html";
  });

  cartItems.on("click", ".remove-from-cart", function () {
    const productId = $(this).data("id");
    removeFromCart(productId);
  });

  $("#clear-cart").click(function () {
    clearCart();
  });

  if (window.location.pathname.endsWith("product.html")) {
    const productId = localStorage.getItem("productId");
    showProduct(productId);
    $("#back-to-home").click(function () {
      window.location.href = "index.html";
    });
  } else {
    fetchProducts();
  }
});
