// --- GLOBAL CART HANDLER ---
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  // --- RENDER CART ---
  function renderCart() {
    cartList.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartList.innerHTML = `<li class="list-group-item text-center text-muted">Your cart is empty</li>`;
      cartTotal.textContent = "Rs 0";
      cartCount.textContent = "0";
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          Rs <span>${item.price}</span>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateCartQty(${index}, -1)">−</button>
          <span class="mx-1">${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateCartQty(${index}, 1)">+</button>
          <button class="btn btn-sm btn-outline-danger ms-3" onclick="removeFromCart(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      cartList.appendChild(li);
    });

    cartTotal.textContent = "Rs " + total;
    cartCount.textContent = cart.length;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // --- UPDATE QUANTITY ---
  function updateCartQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    renderCart();
  }

  // --- REMOVE ITEM ---
  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }

  // --- ADD TO CART FUNCTION ---
  function addToCart() {
    const name = document.getElementById("productName").innerText.trim();
    const priceText = document.getElementById("productPrice").innerText.replace("Rs.", "").trim();
    const price = parseInt(priceText) || 0;
    const qty = parseInt(document.getElementById("quantity").value);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price, qty });
    }

    renderCart();

    // Open cart sidebar automatically
    const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
    cartSidebar.show();
  }

  // --- INITIAL RENDER ---
  document.addEventListener("DOMContentLoaded", renderCart);