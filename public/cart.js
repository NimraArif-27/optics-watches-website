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

      // Clear localStorage when cart is empty
      localStorage.removeItem("cart");

      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          Rs. <span>${item.price}</span>
          ${item.power ? `<br><small>Power: R ${item.power.right}, L ${item.power.left}</small>` : ""}
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateCartQty(${index}, -1)">−</button>
          <span class="mx-1">${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateCartQty(${index}, 1)" ${item.stock && item.qty >= item.stock ? "disabled" : ""}>+</button>
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
  const item = cart[index];
  if (!item) return;

  // Prevent exceeding stock
  if (change > 0 && item.stock && item.qty >= item.stock) {
    const stockError = document.getElementById("stockError");
    if (stockError) {
      stockError.textContent = `Only ${item.stock} item(s) are available in stock.`;
      stockError.style.background = "red";
      stockError.style.color = "white";
      stockError.style.textAlign = "center";
      stockError.style.fontWeight = "bold";
      stockError.style.padding = "8px 12px";
    }
    return; // stop quantity increase
  }

  // Normal quantity change
  item.qty += change;

  // Remove if qty <= 0
  if (item.qty <= 0) cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
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
  const qty = parseInt(document.getElementById("quantity").value) || 1;

  // Reference the stock error div
  const stockError = document.getElementById("stockError");

  // Helper: show styled error message
  function showStockError(msg) {
    if (!stockError) return;
    stockError.textContent = msg;
    stockError.style.background = "red";
    stockError.style.color = "white";
    stockError.style.textAlign = "center";
    stockError.style.fontWeight = "bold";
    stockError.style.padding = "8px 12px";
    stockError.style.position = "fixed";   // stay in viewport
    stockError.style.top = "60px";            // stick to top
    stockError.style.left = "0";
    stockError.style.width = "100%";       // full width
    stockError.style.zIndex = "9999";

    // Auto-hide after duration
    setTimeout(() => {
      stockError.textContent = "";
      stockError.removeAttribute("style");
     }, 3000);
  }

  // Helper: clear error and its styles completely
  function clearStockError() {
    if (!stockError) return;
    stockError.textContent = "";
    stockError.removeAttribute("style");
  }

  clearStockError(); // always reset first

  // --- Capture stock info from products.js global ---
  if (typeof currentStock !== "undefined" && qty > currentStock) {
    showStockError(`Only ${currentStock} item(s) are available in stock.`);
    return;
  }

  // Capture lens power if available
  const rightPowerEl = document.getElementById("rightEyePower");
  const leftPowerEl = document.getElementById("leftEyePower");
  let power = null;
  if (rightPowerEl && leftPowerEl) {
    power = { right: rightPowerEl.value, left: leftPowerEl.value };
  }

  // --- Check if same product + power exists ---
  const existing = cart.find(item => {
    if (item.name !== name) return false;
    if (!power) return !item.power; // normal product
    return item.power && item.power.right === power.right && item.power.left === power.left;
  });

  // --- If already in cart, update qty but not beyond stock ---
  if (existing) {
    const newQty = existing.qty + qty;
    if (typeof currentStock !== "undefined" && newQty > currentStock) {
      showStockError(`You already have ${existing.qty} in cart. Only ${currentStock} available.`);
      return;
    }
    existing.qty = newQty;
  } else {
    // --- Add new item ---
    const cartItem = { name, price, qty, stock: currentStock };
    if (power) cartItem.power = power;
    cart.push(cartItem);
  }

  // --- Save + Render ---
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  clearStockError(); // ✅ hide error fully after successful add

  // --- Show Cart Sidebar (Bootstrap Offcanvas) ---
  const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
  cartSidebar.show();
}



  // --- INITIAL RENDER ---
  document.addEventListener("DOMContentLoaded", renderCart);

//   // --- ADD TO CART FROM HOVER ICON --- //
// document.addEventListener("click", function (e) {
//   const icon = e.target.closest(".cart-icon");
//   if (!icon) return;

//   const card = e.target.closest(".card");
//   if (!card) return;

//   e.preventDefault();
//   e.stopPropagation();

//   const name = card.querySelector(".card-title").innerText.trim();
//   const priceText = card.querySelector(".price").innerText.replace("Rs.", "").trim();
//   const price = parseInt(priceText) || 0;
//   const qty = 1;

//   let power = null;

//   // If the card is inside Power Lenses section, set default Plano power
//   if (card.closest("#powerlenses-section")) {
//     power = { right: "Plano (0.00)", left: "Plano (0.00)" };
//   }

//   // Check if same product (and same power if any) exists
//   const existing = cart.find(item => {
//     if (item.name !== name) return false;
//     if (!power) return !item.power; // normal product without power
//     return item.power && item.power.right === power.right && item.power.left === power.left;
//   });

//   if (existing) {
//     existing.qty += qty;
//   } else {
//     const cartItem = { name, price, qty, stock: currentStock};
//     if (power) cartItem.power = power;
//     cart.push(cartItem);
//   }

//   renderCart();

//   const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
//   cartSidebar.show();
// });

// --- ADD TO CART FROM HOVER ICON --- //
document.addEventListener("click", function (e) {
  const icon = e.target.closest(".cart-icon");
  if (!icon) return;

  const card = e.target.closest(".card");
  if (!card) return;

  e.preventDefault();
  e.stopPropagation();

  const name = card.querySelector(".card-title").innerText.trim();
  const priceText = card.querySelector(".price").innerText.replace("Rs.", "").trim();
  const price = parseInt(priceText) || 0;
  const qty = 1;

  // Stock from card dataset or fallback to currentStock
  let stock = parseInt(card.dataset.stock) || (typeof currentStock !== "undefined" ? currentStock : 0);

  // Lens power if applicable
  let power = null;
  if (card.closest("#powerlenses-section")) {
    power = { right: "Plano (0.00)", left: "Plano (0.00)" };
  }

  // Reference the stock error div
  const stockError = document.getElementById("stockError");

  function showStockError(msg) {
    if (!stockError) return;
    stockError.textContent = msg;
    stockError.style.cssText = `
      background: red;
      color: white;
      text-align: center;
      font-weight: bold;
      padding: 8px 12px;
      position: fixed;
      top: 60px;
      left: 0;
      width: 100%;
      z-index: 9999;
    `;
    setTimeout(() => {
      stockError.textContent = "";
      stockError.removeAttribute("style");
    }, 3000);
  }

  // --- Check if product already in cart ---
  const existing = cart.find(item => {
    if (item.name !== name) return false;
    if (!power) return !item.power; // normal product
    return item.power && item.power.right === power.right && item.power.left === power.left;
  });

  if (existing) {
    if (existing.qty + qty > stock) {
      showStockError(`You already have ${existing.qty} in cart. Only ${stock} available.`);
      return;
    }
    existing.qty += qty;
  } else {
    if (qty > stock) {
      showStockError(`Only ${stock} item(s) are available in stock.`);
      return;
    }
    const cartItem = { name, price, qty, stock };
    if (power) cartItem.power = power;
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();

  // Show cart sidebar
  const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
  cartSidebar.show();
});




// 🔁 Force refresh when user comes back to this page
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });


  // --- CHECKOUT BUTTON REDIRECT FROM CART-SIDEBAR ---
document.querySelectorAll('button.btn-primary.w-100.mt-3').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
});
