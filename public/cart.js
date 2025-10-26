// // --- GLOBAL CART HANDLER ---
//   let cart = JSON.parse(localStorage.getItem("cart")) || [];

//   const cartList = document.getElementById("cart-items");
//   const cartTotal = document.getElementById("cart-total");
//   const cartCount = document.getElementById("cart-count");

//   // --- RENDER CART ---
//   function renderCart() {
//     cartList.innerHTML = "";
//     let total = 0;

//     if (cart.length === 0) {
//       cartList.innerHTML = `<li class="list-group-item text-center text-muted">Your cart is empty</li>`;
//       cartTotal.textContent = "Rs 0";
//       cartCount.textContent = "0";

//       // Clear localStorage when cart is empty
//       localStorage.removeItem("cart");

//       return;
//     }

//     cart.forEach((item, index) => {
//       total += item.price * item.qty;

//       const li = document.createElement("li");
//       li.className = "list-group-item d-flex justify-content-between align-items-center";
//       li.innerHTML = `
//         <div>
//           <strong>${item.name}</strong><br>
//           Rs. <span>${item.price}</span>
//           ${item.power ? `<br><small>Power: R ${item.power.right}, L ${item.power.left}</small>` : ""}
//         </div>
//         <div class="d-flex align-items-center">
//           <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateCartQty(${index}, -1)">−</button>
//           <span class="mx-1">${item.qty}</span>
//           <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateCartQty(${index}, 1)" ${item.stock && item.qty >= item.stock ? "disabled" : ""}>+</button>
//           <button class="btn btn-sm btn-outline-danger ms-3" onclick="removeFromCart(${index})">
//           <i class="fas fa-trash"></i>
//         </button>
//       </div>
//       `;

//       cartList.appendChild(li);
//     });

//     cartTotal.textContent = "Rs " + total;
//     cartCount.textContent = cart.length;
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }

//   // --- UPDATE QUANTITY ---
//   function updateCartQty(index, change) {
//   const item = cart[index];
//   if (!item) return;

//   // Prevent exceeding stock
//   if (change > 0 && item.stock && item.qty >= item.stock) {
//     const stockError = document.getElementById("stockError");
//     if (stockError) {
//       stockError.textContent = `Only ${item.stock} item(s) are available in stock.`;
//       stockError.style.background = "black";
//       stockError.style.color = "white";
//       stockError.style.textAlign = "center";
//       stockError.style.fontWeight = "bold";
//       stockError.style.padding = "8px 12px";
//     }
//     return; // stop quantity increase
//   }

//   // Normal quantity change
//   item.qty += change;

//   // Remove if qty <= 0
//   if (item.qty <= 0) cart.splice(index, 1);

//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();
// }


//   // --- REMOVE ITEM ---
//   function removeFromCart(index) {
//     cart.splice(index, 1);
//     renderCart();
//   }

//   // --- ADD TO CART FUNCTION ---
// function addToCart() {
//   const name = document.getElementById("productName").innerText.trim();
//   const priceText = document.getElementById("productPrice").innerText.replace("Rs.", "").trim();
//   const price = parseInt(priceText) || 0;
//   const qty = parseInt(document.getElementById("quantity").value) || 1;

//   // Reference the stock error div
//   const stockError = document.getElementById("stockError");

//   // Helper: show styled error message
//   function showStockError(msg) {
//     if (!stockError) return;
//     stockError.textContent = msg;
//     stockError.style.background = "black";
//     stockError.style.color = "white";
//     stockError.style.textAlign = "center";
//     stockError.style.fontWeight = "bold";
//     stockError.style.padding = "8px 12px";
//     stockError.style.position = "fixed";   // stay in viewport
//     stockError.style.top = "60px";            // stick to top
//     stockError.style.left = "0";
//     stockError.style.width = "100%";       // full width
//     stockError.style.zIndex = "9999";

//     // Auto-hide after duration
//     setTimeout(() => {
//       stockError.textContent = "";
//       stockError.removeAttribute("style");
//      }, 3000);
//   }

//   // Helper: clear error and its styles completely
//   function clearStockError() {
//     if (!stockError) return;
//     stockError.textContent = "";
//     stockError.removeAttribute("style");
//   }

//   clearStockError(); // always reset first

//   // --- Capture stock info from products.js global ---
//   if (typeof currentStock !== "undefined" && qty > currentStock) {
//     showStockError(`Only ${currentStock} item(s) are available in stock.`);
//     return;
//   }

//   // Capture lens power if available
//   const rightPowerEl = document.getElementById("rightEyePower");
//   const leftPowerEl = document.getElementById("leftEyePower");
//   let power = null;
//   if (rightPowerEl && leftPowerEl) {
//     power = { right: rightPowerEl.value, left: leftPowerEl.value };
//   }

//   // --- Check if same product + power exists ---
//   const existing = cart.find(item => {
//     if (item.name !== name) return false;
//     if (!power) return !item.power; // normal product
//     return item.power && item.power.right === power.right && item.power.left === power.left;
//   });

//   // --- If already in cart, update qty but not beyond stock ---
//   if (existing) {
//     const newQty = existing.qty + qty;
//     if (typeof currentStock !== "undefined" && newQty > currentStock) {
//       showStockError(`You already have ${existing.qty} in cart. Only ${currentStock} available.`);
//       return;
//     }
//     existing.qty = newQty;
//   } else {
//     // --- Add new item ---
//     const cartItem = { name, price, qty, stock: currentStock };
//       if (power) cartItem.power = power;
//       cart.push(cartItem);
//   }

//   // --- Save + Render ---
//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();
//   clearStockError(); // ✅ hide error fully after successful add

//   // --- Show Cart Sidebar (Bootstrap Offcanvas) ---
//   const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
//   cartSidebar.show();
// }



//   // --- INITIAL RENDER ---
//   document.addEventListener("DOMContentLoaded", renderCart);


// // --- ADD TO CART FROM HOVER ICON --- //
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

//   // Stock from card dataset or fallback to currentStock
//   let stock = parseInt(card.dataset.stock) || (typeof currentStock !== "undefined" ? currentStock : 0);

//   // Lens power if applicable
//   let power = null;
//   if (card.closest("#powerlenses-section")) {
//     power = { right: "Plano (0.00)", left: "Plano (0.00)" };
//   }

//   // Reference the stock error div
//   const stockError = document.getElementById("stockError");

//   function showStockError(msg) {
//     if (!stockError) return;
//     stockError.textContent = msg;
//     stockError.style.cssText = `
//       background: black;
//       color: white;
//       text-align: center;
//       font-weight: bold;
//       padding: 8px 12px;
//       position: fixed;
//       top: 60px;
//       left: 0;
//       width: 100%;
//       z-index: 9999;
//     `;
//     setTimeout(() => {
//       stockError.textContent = "";
//       stockError.removeAttribute("style");
//     }, 3000);
//   }

//   // --- Check if product already in cart ---
//   const existing = cart.find(item => {
//     if (item.name !== name) return false;
//     if (!power) return !item.power; // normal product
//     return item.power && item.power.right === power.right && item.power.left === power.left;
//   });

//   if (existing) {
//     if (existing.qty + qty > stock) {
//       showStockError(`You already have ${existing.qty} in cart. Only ${stock} available.`);
//       return;
//     }
//     existing.qty += qty;
//   } else {
//     if (qty > stock) {
//       showStockError(`Only ${stock} item(s) are available in stock.`);
//       return;
//     }
//     const cartItem = { name, price, qty, stock };
//     if (power) cartItem.power = power;
//     cart.push(cartItem);
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();

//   // Show cart sidebar
//   const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
//   cartSidebar.show();
// });




// // 🔁 Force refresh when user comes back to this page
//   window.addEventListener("pageshow", function (event) {
//     if (event.persisted) {
//       window.location.reload();
//     }
//   });


// //Powerlenses shared stock is not handled here
// // --- GLOBAL CART HANDLER ---
// let cart = JSON.parse(localStorage.getItem("cart")) || [];
// const cartList = document.getElementById("cart-items");
// const cartTotal = document.getElementById("cart-total");
// const cartCount = document.getElementById("cart-count");

// // --- Backend stock map ---
// let backendStock = new Map();

// async function fetchBackendStock() {
//   try {
//     const res = await fetch("/api/products/stock");
//     const data = await res.json();
//     if (!data.success) return;

//     backendStock.clear();
//     data.products.forEach(p => {
//       backendStock.set(p._id, p.stock); // changed: use id as key
//     });

//     // Update stock in cart
//     cart.forEach(item => {
//       if (backendStock.has(item.id)) {
//         item.stock = backendStock.get(item.id);
//       }
//     });
//     localStorage.setItem("cart", JSON.stringify(cart));
//     renderCart();
//   } catch (err) {
//     console.error("Failed to fetch backend stock:", err);
//   }
// }

// // --- RENDER CART ---
// function renderCart() {
//   cartList.innerHTML = "";
//   let total = 0;

//   if (cart.length === 0) {
//     cartList.innerHTML = `<li class="list-group-item text-center text-muted">Your cart is empty</li>`;
//     cartTotal.textContent = "Rs 0";
//     cartCount.textContent = "0";
//     localStorage.removeItem("cart");
//     return;
//   }

//   cart.forEach((item, index) => {
//     total += item.price * item.qty;
//     const li = document.createElement("li");
//     li.className = "list-group-item d-flex justify-content-between align-items-center";
//     li.innerHTML = `
//       <div>
//         <strong>${item.name}</strong><br>
//         Rs. <span>${item.price}</span>
//         ${item.power ? `<br><small>Power: R ${item.power.right}, L ${item.power.left}</small>` : ""}
//       </div>
//       <div class="d-flex align-items-center">
//         <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateCartQty(${index}, -1)">−</button>
//         <span class="mx-1">${item.qty}</span>
//         <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateCartQty(${index}, 1)" ${item.stock && item.qty >= item.stock ? "disabled" : ""}>+</button>
//         <button class="btn btn-sm btn-outline-danger ms-3" onclick="removeFromCart(${index})">
//           <i class="fas fa-trash"></i>
//         </button>
//       </div>
//     `;
//     cartList.appendChild(li);
//   });

//   cartTotal.textContent = "Rs " + total;
//   cartCount.textContent = cart.length;
//   localStorage.setItem("cart", JSON.stringify(cart));
// }

// // --- UPDATE QUANTITY ---
// async function updateCartQty(index, change) {
//   await fetchBackendStock(); // always get latest stock
//   const item = cart[index];
//   if (!item) return;

//   if (change > 0 && item.stock && item.qty >= item.stock) {
//     const stockError = document.getElementById("stockError");
//     if (stockError) {
//       stockError.textContent = `Only ${item.stock} item(s) are available in stock.`;
//       stockError.style.background = "black";
//       stockError.style.color = "white";
//       stockError.style.textAlign = "center";
//       stockError.style.fontWeight = "bold";
//       stockError.style.padding = "8px 12px";
//     }
//     return;
//   }

//   item.qty += change;
//   if (item.qty <= 0) cart.splice(index, 1);
//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();
// }

// // --- REMOVE ITEM ---
// function removeFromCart(index) {
//   cart.splice(index, 1);
//   renderCart();
// }

// // --- SHOW STOCK ERROR ---
// function showStockError(msg) {
//   const stockError = document.getElementById("stockError");
//   if (!stockError) return;
//   stockError.textContent = msg;
//   stockError.style.cssText = `
//     background: black;
//     color: white;
//     text-align: center;
//     font-weight: bold;
//     padding: 8px 12px;
//     position: fixed;
//     top: 60px;
//     left: 0;
//     width: 100%;
//     z-index: 9999;
//   `;
//   setTimeout(() => {
//     stockError.textContent = "";
//     stockError.removeAttribute("style");
//   }, 3000);
// }

// // --- ADD TO CART FUNCTION ---
// async function addToCart() {
//   await fetchBackendStock(); // ensure latest stock

//   const id = document.getElementById("productId")?.innerText?.trim(); // added id capture
//   const name = document.getElementById("productName").innerText.trim();
//   const priceText = document.getElementById("productPrice").innerText.replace("Rs.", "").trim();
//   const price = parseInt(priceText) || 0;
//   const qty = parseInt(document.getElementById("quantity").value) || 1;

//   const rightPowerEl = document.getElementById("rightEyePower");
//   const leftPowerEl = document.getElementById("leftEyePower");
//   let power = null;
//   if (rightPowerEl && leftPowerEl) {
//     power = { right: rightPowerEl.value, left: leftPowerEl.value };
//   }

//   const stock = backendStock.get(id) || 0;

//   const existing = cart.find(item => {
//     if (item.id !== id) return false;
//     if (!power) return !item.power;
//     return item.power && item.power.right === power.right && item.power.left === power.left;
//   });

//   if (existing) {
//     const newQty = existing.qty + qty;
//     if (newQty > stock) {
//       showStockError(`You already have ${existing.qty} in cart. Only ${stock} available.`);
//       return;
//     }
//     existing.qty = newQty;
//   } else {
//     if (qty > stock) {
//       showStockError(`Only ${stock} item(s) are available in stock.`);
//       return;
//     }
//     const cartItem = { id, name, price, qty, stock };
//     if (power) cartItem.power = power;
//     cart.push(cartItem);
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();

//   const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
//   cartSidebar.show();
// }

// // --- ADD TO CART FROM HOVER ICON ---
// document.addEventListener("click", function (e) {
//   const icon = e.target.closest(".cart-icon");
//   if (!icon) return;

//   const card = e.target.closest(".card");
//   if (!card) return;

//   e.preventDefault();
//   e.stopPropagation();

//   const id = card.dataset.id; // added id read from card
//   const name = card.querySelector(".card-title").innerText.trim();
//   const priceText = card.querySelector(".price").innerText.replace("Rs.", "").trim();
//   const price = parseInt(priceText) || 0;
//   const qty = 1;

//   let stock = parseInt(card.dataset.stock) || (typeof currentStock !== "undefined" ? currentStock : 0);

//   let power = null;
//   if (card.closest("#powerlenses-section")) {
//     power = { right: "Plano (0.00)", left: "Plano (0.00)" };
//   }

//   const stockError = document.getElementById("stockError");

//   function showStockError(msg) {
//     if (!stockError) return;
//     stockError.textContent = msg;
//     stockError.style.cssText = `
//       background: black;
//       color: white;
//       text-align: center;
//       font-weight: bold;
//       padding: 8px 12px;
//       position: fixed;
//       top: 60px;
//       left: 0;
//       width: 100%;
//       z-index: 9999;
//     `;
//     setTimeout(() => {
//       stockError.textContent = "";
//       stockError.removeAttribute("style");
//     }, 3000);
//   }

//   const existing = cart.find(item => {
//     if (item.id !== id) return false;
//     if (!power) return !item.power;
//     return item.power && item.power.right === power.right && item.power.left === power.left;
//   });

//   if (existing) {
//     if (existing.qty + qty > stock) {
//       showStockError(`You already have ${existing.qty} in cart. Only ${stock} available.`);
//       return;
//     }
//     existing.qty += qty;
//   } else {
//     if (qty > stock) {
//       showStockError(`Only ${stock} item(s) are available in stock.`);
//       return;
//     }
//     const cartItem = { id, name, price, qty, stock };
//     if (power) cartItem.power = power;
//     cart.push(cartItem);
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();

//   const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
//   cartSidebar.show();
// });

// // --- helper for stock error ---
// function showStockError(msg) {
//   const stockError = document.getElementById("stockError");
//   if (!stockError) return;
//   stockError.textContent = msg;
//   stockError.style.cssText = `
//     background: black;
//     color: white;
//     text-align: center;
//     font-weight: bold;
//     padding: 8px 12px;
//     position: fixed;
//     top: 60px;
//     left: 0;
//     width: 100%;
//     z-index: 9999;
//   `;
//   setTimeout(() => {
//     stockError.textContent = "";
//     stockError.removeAttribute("style");
//   }, 3000);
// }

// // --- INITIAL RENDER ---
// document.addEventListener("DOMContentLoaded", renderCart);
// fetchBackendStock(); // fetch stock on page load

// // --- CHECKOUT BUTTON ---
// document.querySelectorAll('button.btn-primary.w-100.mt-3').forEach(btn => {
//   btn.addEventListener('click', () => {
//     window.location.href = 'checkout.html';
//   });
// });

// // --- Force refresh on page back ---
// window.addEventListener("pageshow", function (event) {
//   if (event.persisted) window.location.reload();
// });


// --- GLOBAL CART HANDLER ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

// --- Backend stock map ---
let backendStock = new Map();
let sharedStockMap = new Map(); // for shared-stock power lenses

async function fetchBackendStock() {
  try {
    const res = await fetch("/api/products/stock");
    const data = await res.json();
    if (!data.success) return;

    backendStock.clear();
    sharedStockMap.clear();

    data.products.forEach(p => {
      backendStock.set(p._id, p.stock);

      // shared-stock logic
      if (p.baseProductId) {
        if (!sharedStockMap.has(p.baseProductId)) sharedStockMap.set(p.baseProductId, 0);
        sharedStockMap.set(p.baseProductId, sharedStockMap.get(p.baseProductId) + p.stock);
      }
    });

    cart.forEach(item => {
      if (backendStock.has(item.id)) item.stock = backendStock.get(item.id);
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  } catch (err) {
    console.error("Failed to fetch backend stock:", err);
  }
}

// --- Sidebar error for shared-stock power lenses ---
function showSidebarError(msg) {
  let existingError = document.querySelector("#cartSidebar .cart-stock-error");
  if (!existingError) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "cart-stock-error mt-2 p-2 text-primary fw-bold text-center";
    document.querySelector("#cartSidebar .offcanvas-body").prepend(errorDiv);
    existingError = errorDiv;
  }
  existingError.textContent = msg;
  existingError.style.display = "block";
  setTimeout(() => existingError.remove(), 3000);
}

// --- SHOW STOCK ERROR (top bar) ---
function showStockError(msg) {
  const stockError = document.getElementById("stockError");
  if (!stockError) return;
  stockError.textContent = msg;
  stockError.style.cssText = `
    background: black;
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

// --- RENDER CART ---
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="list-group-item text-center text-muted">Your cart is empty</li>`;
    cartTotal.textContent = "Rs 0";
    cartCount.textContent = "0";
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
async function updateCartQty(index, change) {
  await fetchBackendStock();
  const item = cart[index];
  if (!item) return;

  const sameProductTotal = cart
    .filter(i => i.id === item.id)
    .reduce((sum, i) => sum + i.qty, 0);

  // shared stock check
  if (change > 0 && sameProductTotal >= item.stock) {
    if (item.power) {
      showSidebarError(`Stock complete for ${item.name}. Only ${item.stock} available in total.`);
    } else {
      showStockError(`Only ${item.stock} item(s) are available in stock.`);
    }
    return;
  }

  item.qty += change;
  if (item.qty <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// --- REMOVE ITEM ---
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// --- Helper: get correct available stock (shared or individual) ---
function getAvailableStock(productId, baseProductId) {
  if (baseProductId && sharedStockMap.has(baseProductId)) {
    return sharedStockMap.get(baseProductId);
  }
  return backendStock.get(productId) || 0;
}

// --- ADD TO CART FUNCTION ---
// async function addToCart() {
//   await fetchBackendStock();

//   const id = document.getElementById("productId")?.innerText?.trim();
//   const name = document.getElementById("productName").innerText.trim();
//   const price = parseInt(document.getElementById("productPrice").innerText.replace("Rs.", "").trim()) || 0;
//   const qty = parseInt(document.getElementById("quantity").value) || 1;
//   const baseProductId = document.getElementById("baseProductId")?.innerText?.trim() || null;

//   const rightPowerEl = document.getElementById("rightEyePower");
//   const leftPowerEl = document.getElementById("leftEyePower");
//   let power = null;
//   if (rightPowerEl && leftPowerEl) {
//     power = { right: rightPowerEl.value, left: leftPowerEl.value };
//   }

//   const stock = getAvailableStock(id, baseProductId);

//   const existing = cart.find(item => {
//     if (item.id !== id) return false;
//     if (!power) return !item.power;
//     return item.power && item.power.right === power.right && item.power.left === power.left;
//   });

//   const totalQtyOfSameProduct = cart.filter(i => i.id === id).reduce((sum, i) => sum + i.qty, 0);

//   if (existing && existing.qty >= stock) {
//     showStockError(`You already have ${existing.qty} in cart. Only ${stock} available in stock.`);
//     return;
//   }

//   if (totalQtyOfSameProduct + qty > stock) {
//     showStockError(`Only ${stock} item(s) are available in stock.`);
//     return;
//   }

//   if (existing) {
//     existing.qty += qty;
//   } else {
//     const cartItem = { id, name, price, qty, stock };
//     if (baseProductId) cartItem.baseProductId = baseProductId;
//     if (power) cartItem.power = power;
//     cart.push(cartItem);
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();

//   const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
//   cartSidebar.show();
// }
async function addToCart() {
  await fetchBackendStock();

  const id = document.getElementById("productId")?.innerText?.trim();
  const name = document.getElementById("productName").innerText.trim();
  const priceText = document.getElementById("productPrice").innerText.replace("Rs.", "").trim();
  const price = parseInt(priceText) || 0;
  const qty = parseInt(document.getElementById("quantity").value) || 1;

  const rightPowerEl = document.getElementById("rightEyePower");
  const leftPowerEl = document.getElementById("leftEyePower");
  let power = null;
  if (rightPowerEl && leftPowerEl) {
    power = { right: rightPowerEl.value, left: leftPowerEl.value };
  }

  const stock = backendStock.get(id) || 0;

  // --- Find all same-id items (shared stock)
  const sameProductItems = cart.filter(i => i.id === id);
  const totalQtyOfSameProduct = sameProductItems.reduce((sum, i) => sum + i.qty, 0);

  // --- Find if same power already exists
  const existing = sameProductItems.find(item => {
    if (!power) return !item.power;
    return item.power && item.power.right === power.right && item.power.left === power.left;
  });

  const combinedQtyAfterAdd = totalQtyOfSameProduct + qty;

  // // ✅ Case 1: Already full stock in cart
  // if (totalQtyOfSameProduct >= stock) {
  //   showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  //   return;
  // }

  // // ✅ Case 2: Adding exceeds stock
  // if (combinedQtyAfterAdd > stock) {
  //   // 👉 If nothing in cart yet (fresh add attempt)
  //   if (totalQtyOfSameProduct === 0) {
  //     showStockError(`Only ${stock} item(s) are available in stock.`);
  //   } else {
  //     showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  //   }
  //   return;
  // }
  // ✅ Check for 0 stock first
if (stock === 0) {
  showStockError("This product is out of stock.");
  return;
}

// ✅ Already full stock in cart
if (totalQtyOfSameProduct >= stock) {
  showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  return;
}

// ✅ Adding exceeds stock
if (combinedQtyAfterAdd > stock) {
  if (totalQtyOfSameProduct === 0) {
    showStockError(`Only ${stock} item(s) are available in stock.`);
  } else {
    showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  }
  return;
}


  // ✅ Add or update item
  if (existing) {
    existing.qty += qty;
  } else {
    const newItem = { id, name, price, qty, stock };
    if (power) newItem.power = power;
    cart.push(newItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();

  const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
  cartSidebar.show();
}


// --- ADD TO CART FROM HOVER ICON ---
// document.addEventListener("click", function (e) {
//   const icon = e.target.closest(".cart-icon");
//   if (!icon) return;

//   const card = e.target.closest(".card");
//   if (!card) return;

//   e.preventDefault();
//   e.stopPropagation();

//   const id = card.dataset.id;
//   const baseProductId = card.dataset.baseProductId || null;
//   const name = card.querySelector(".card-title").innerText.trim();
//   const price = parseInt(card.querySelector(".price").innerText.replace("Rs.", "").trim()) || 0;
//   const qty = 1;

//   let power = null;
//   if (card.closest("#powerlenses-section")) {
//     power = { right: "Plano (0.00)", left: "Plano (0.00)" };
//   }

//   const stock = getAvailableStock(id, baseProductId);
//   const totalQtyOfSameProduct = cart.filter(i => i.id === id).reduce((sum, i) => sum + i.qty, 0);
//   const existing = cart.find(item => item.id === id);

//   if (existing && existing.qty >= stock) {
//     showStockError(`You already have ${existing.qty} in cart. Only ${stock} available in stock.`);
//     return;
//   }

//   if (totalQtyOfSameProduct + qty > stock) {
//     showStockError(`Only ${stock} item(s) are available in stock.`);
//     return;
//   }

//   if (existing) {
//     existing.qty += qty;
//   } else {
//     const cartItem = { id, name, price, qty, stock };
//     if (baseProductId) cartItem.baseProductId = baseProductId;
//     if (power) cartItem.power = power;
//     cart.push(cartItem);
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();

//   const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
//   cartSidebar.show();
// });
document.addEventListener("click", function (e) {
  const icon = e.target.closest(".cart-icon");
  if (!icon) return;

  const card = e.target.closest(".card");
  if (!card) return;

  e.preventDefault();
  e.stopPropagation();

  const id = card.dataset.id;
  const baseProductId = card.dataset.baseProductId || null;
  const name = card.querySelector(".card-title").innerText.trim();
  const price = parseInt(card.querySelector(".price").innerText.replace("Rs.", "").trim()) || 0;
  const qty = 1;

  // --- Power lenses handle ---
  let power = null;
  if (card.closest("#powerlenses-section")) {
    power = { right: "Plano (0.00)", left: "Plano (0.00)" };
  }

  const stock = getAvailableStock(id, baseProductId);

  // --- Combine all same ID items (shared stock) ---
  const sameProductItems = cart.filter(i => i.id === id);
  const totalQtyOfSameProduct = sameProductItems.reduce((sum, i) => sum + i.qty, 0);

  // --- Find if same power variant already exists ---
  const existing = sameProductItems.find(item => {
    if (!power) return !item.power;
    return item.power && item.power.right === power.right && item.power.left === power.left;
  });

  const combinedQtyAfterAdd = totalQtyOfSameProduct + qty;

  // // ✅ Case 1: Already full stock in cart
  // if (totalQtyOfSameProduct >= stock) {
  //   showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  //   return;
  // }

  // // ✅ Case 2: Adding exceeds stock
  // if (combinedQtyAfterAdd > stock) {
  //   if (totalQtyOfSameProduct === 0) {
  //     showStockError(`Only ${stock} item(s) are available in stock.`);
  //   } else {
  //     showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  //   }
  //   return;
  // }
  // ✅ Check for 0 stock first
if (stock === 0) {
  showStockError("This product is out of stock.");
  return;
}

// ✅ Already full stock in cart
if (totalQtyOfSameProduct >= stock) {
  showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  return;
}

// ✅ Adding exceeds stock
if (combinedQtyAfterAdd > stock) {
  if (totalQtyOfSameProduct === 0) {
    showStockError(`Only ${stock} item(s) are available in stock.`);
  } else {
    showStockError(`You already have ${totalQtyOfSameProduct} in cart. Only ${stock} available in stock.`);
  }
  return;
}


  // ✅ Add or update item
  if (existing) {
    existing.qty += qty;
  } else {
    const cartItem = { id, name, price, qty, stock };
    if (baseProductId) cartItem.baseProductId = baseProductId;
    if (power) cartItem.power = power;
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();

  const cartSidebar = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
  cartSidebar.show();
});


// --- INITIAL RENDER ---
document.addEventListener("DOMContentLoaded", renderCart);
fetchBackendStock();

// --- CHECKOUT BUTTON ---
// document.querySelectorAll('button.btn-primary.w-100.mt-3').forEach(btn => {
//   btn.addEventListener('click', (e) => {
//     e.preventDefault();

//     if (!cart.length) {
//       showSidebarError("Your cart is empty.");
//       return;
//     }

//     // --- Validate stock for each product before checkout ---
//     for (const item of cart) {
//       // Group items by baseProductId (for power lenses) or by id (normal)
//       const sameItems = cart.filter(i =>
//         (i.baseProductId && item.baseProductId && i.baseProductId === item.baseProductId) ||
//         i.id === item.id
//       );

//       const totalQty = sameItems.reduce((sum, i) => sum + i.qty, 0);
//       const stock = item.stock ?? getAvailableStock(item.id, item.baseProductId);

//       if (totalQty > stock) {
//         showSidebarError(
//           `You have ${totalQty} of "${item.name}" in your cart, but only ${stock} item(s) are available in stock.`
//         );
//         return; // stop checkout
//       }
//     }

//     // ✅ If everything is valid, proceed
//     window.location.href = 'checkout.html';
//   });
// });
document.querySelectorAll('button.btn-primary.w-100.mt-3').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.length) {
      showSidebarError("Your cart is empty.");
      return;
    }

    // Validate stock for each product
    for (const item of cart) {
      const sameItems = cart.filter(i =>
        (i.baseProductId && item.baseProductId && i.baseProductId === item.baseProductId) ||
        i.id === item.id
      );

      const totalQty = sameItems.reduce((sum, i) => sum + i.qty, 0);
      const stock = item.stock ?? getAvailableStock(item.id, item.baseProductId);

      if (totalQty > stock) {
        showSidebarError(
          `You have ${totalQty} of "${item.name}" in your cart, but only ${stock} item(s) are available in stock.`
        );
        return; // stop checkout
      }
    }

    // ✅ Set flag for normal checkout
    localStorage.setItem("fromBuyNow", "false");
    window.location.href = 'checkout.html';
  });
});



// ✅ BUY NOW BUTTON HANDLER
// async function buyNow() {
//   await fetchBackendStock();

//   const id = document.getElementById("productId")?.innerText?.trim();
//   const name = document.getElementById("productName")?.innerText.trim();
//   const priceText = document.getElementById("productPrice")?.innerText.replace("Rs.", "").trim();
//   const price = parseInt(priceText) || 0;
//   const qty = parseInt(document.getElementById("quantity")?.value) || 1;

//   const brand = document.getElementById("productBrand")?.innerText?.trim() || null;
//   const color = document.getElementById("productColor")?.innerText?.trim() || null;
//   const ageGroup = document.getElementById("productAgeGroup")?.innerText?.trim() || null;

//   const rightPowerEl = document.getElementById("rightEyePower");
//   const leftPowerEl = document.getElementById("leftEyePower");
//   let power = null;
//   if (rightPowerEl && leftPowerEl) {
//     power = {
//       right: rightPowerEl.value || null,
//       left: leftPowerEl.value || null,
//     };
//   }

//   const stock = backendStock.get(id) || 0;
//   if (qty > stock) {
//     showStockError(`Only ${stock} item(s) are available in stock.`);
//     return;
//   }

//   const buyNowItem = { id, name, price, qty, stock };
//   if (brand) buyNowItem.brand = brand;
//   if (color) buyNowItem.color = color;
//   if (ageGroup) buyNowItem.ageGroup = ageGroup;
//   if (power) buyNowItem.power = power;

//   // ✅ changed line — store in separate key (not in "cart")
//   localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));

//   // redirect to checkout
//   window.location.href = "checkout.html";
// }
async function buyNow() {
  await fetchBackendStock();

  const id = document.getElementById("productId")?.innerText?.trim();
  const name = document.getElementById("productName")?.innerText.trim();
  const priceText = document.getElementById("productPrice")?.innerText.replace("Rs.", "").trim();
  const price = parseInt(priceText) || 0;
  const qty = parseInt(document.getElementById("quantity")?.value) || 1;

  const brand = document.getElementById("productBrand")?.innerText?.trim() || null;
  const color = document.getElementById("productColor")?.innerText?.trim() || null;
  const ageGroup = document.getElementById("productAgeGroup")?.innerText?.trim() || null;

  const rightPowerEl = document.getElementById("rightEyePower");
  const leftPowerEl = document.getElementById("leftEyePower");
  let power = null;
  if (rightPowerEl && leftPowerEl) {
    power = {
      right: rightPowerEl.value || null,
      left: leftPowerEl.value || null,
    };
  }

  const stock = backendStock.get(id) || 0;
  if (qty > stock) {
    showStockError(`Only ${stock} item(s) are available in stock.`);
    return;
  }

  const buyNowItem = { id, name, price, qty, stock };
  if (brand) buyNowItem.brand = brand;
  if (color) buyNowItem.color = color;
  if (ageGroup) buyNowItem.ageGroup = ageGroup;
  if (power) buyNowItem.power = power;

  // ✅ Store BuyItNow item and set flag
  localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
  localStorage.setItem("fromBuyNow", "true");

  window.location.href = "checkout.html";
}




// --- Force refresh on page back ---
window.addEventListener("pageshow", function (event) {
  if (event.persisted) window.location.reload();
});
