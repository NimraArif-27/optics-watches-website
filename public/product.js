let currentStock = 0;

(async function () {
  // --- Helpers ---
  function formatCategory(category) {
    if (!category) return "";
    return category
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  }

  function renderProduct(product) {
    // Main image
    const mainImageEl = document.getElementById("mainImage");
    if (mainImageEl) mainImageEl.src = product.mainImage || "";

    // Thumbnails
    const thumbContainer = document.getElementById("thumbContainer");
    if (thumbContainer) {
      const subImages = Array.isArray(product.subImages) ? product.subImages : [];
      const thumbs = [
        `<img src="${product.mainImage || ""}" class="thumb-img active" onclick="changeImage(this)">`,
        ...subImages.map(img => `<img src="${img}" class="thumb-img" onclick="changeImage(this)">`)
      ].join("");
      thumbContainer.innerHTML = thumbs;
    }

    // Basic details
    safeSetText("productId", product._id);
    safeSetText("productName", product.name || "Unnamed product");
    safeSetText("productCategory", formatCategory(product.category || ""));
    safeSetText("productPrice", product.price !== undefined ? "Rs. " + product.price : "");

    // --- STOCK STATUS ---
    currentStock = product.stock ?? 0;
    const stockInfo = document.createElement("p");
    stockInfo.id = "stockInfo";
    stockInfo.className = "fw-bold mt-2";

    if (currentStock <= 0) {
      stockInfo.textContent = "Out of Stock";
      stockInfo.style.color = "red";
      document.querySelector(".btn-primary").disabled = true; // Add to Cart
      document.querySelector(".btn-dark").disabled = true; // Buy Now
    } else if (currentStock < 5) {
      stockInfo.textContent = `Only ${currentStock} left in stock!`;
      stockInfo.style.color = "#d17b00";
    } else {
      stockInfo.textContent = "In Stock";
      stockInfo.style.color = "green";
    }

    const detailsCol = document.querySelector(".col-md-6:nth-child(2)");
    if (detailsCol) detailsCol.insertBefore(stockInfo, detailsCol.querySelector(".d-flex"));


    let descText = product.description || "";

    // Add brand and color info (from DB)
    if (product.brand) descText += `\nBrand: ${product.brand}`;
    if (product.color) descText += `\nColor: ${product.color}`;



    // Age group (for kids)
    if (product.ageGroup && /kids/i.test(product.category || "")) {
      descText += `\nAge Group: ${product.ageGroup}`;
    }

    safeSetText("productDesc", descText);

    // --- Lens Options Section ---
    const lensOptionsContainer = document.getElementById("lensOptionsContainer");
    if (lensOptionsContainer) {
      lensOptionsContainer.innerHTML = ""; // clear old

      if (product.category === "PowerLenses") {
        const powers = ["Plano (0.00)"];
        for (let p = -6; p <= 6; p += 0.25) {
          if (p === 0) continue;
          powers.push(p > 0 ? `+${p.toFixed(2)}` : p.toFixed(2));
        }

        lensOptionsContainer.innerHTML = `
          <div class="mb-4">
            <label class="text-primary form-label ">Select Power for Each Eye</label>
            <div class="row">
              <div class="col-md-6">
                <label class="form-label text-muted">Right Eye</label>
                <select id="rightEyePower" class="form-select text-muted">
                  ${powers.map(p => `<option value="${p}">${p}</option>`).join("")}
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">Left Eye</label>
                <select id="leftEyePower" class="form-select text-muted">
                  ${powers.map(p => `<option value="${p}">${p}</option>`).join("")}
                </select>
              </div>
            </div>
          </div>
        `;
      } else {
        
      }
    }

    // Write a Review Button
    const reviewBtn = document.getElementById("writeReviewBtn");
    if (reviewBtn) {
      reviewBtn.onclick = function() {
        // Redirect to review page with dynamic product id
        window.open(`review.html?id=${product._id}#showReview`, "_blank");
      }
    }

  }

  // Shared functions used by markup
  window.changeImage = function (el) {
    const main = document.getElementById("mainImage");
    if (main && el && el.src) main.src = el.src;
    document.querySelectorAll(".thumb-img").forEach(img => img.classList.remove("active"));
    if (el) el.classList.add("active");
  };

  window.updateQty = function (change) {
  const qtyInput = document.getElementById("quantity");
  const warning = document.getElementById("qtyWarning") || document.createElement("p");
  warning.id = "qtyWarning";
  warning.style.color = "red";
  warning.style.fontSize = "0.9rem";

  if (!qtyInput) return;
  let value = parseInt(qtyInput.value || "0", 10) + change;
  if (isNaN(value) || value < 1) value = 1;

  qtyInput.value = value;

  if (currentStock > 0 && value > currentStock) {
    warning.textContent = `Only ${currentStock} items available.`;
    qtyInput.parentNode.appendChild(warning);
    document.querySelector(".btn-primary").disabled = true; // disable Add to Cart
  } else {
    warning.textContent = "";
    document.querySelector(".btn-primary").disabled = false;
  }
};

// --- STOCK VALIDATION ---
function validateStock() {
  const qtyInput = document.getElementById("quantity");
  const addBtn = document.querySelector(".btn-primary");
  const buyBtn = document.querySelector(".btn-dark");
  let qty = parseInt(qtyInput.value);

  // Remove old warning if any
  let warning = document.getElementById("stockWarning");
  if (warning) warning.remove();

  // Check stock limit
  if (qty > currentStock) {
    const warn = document.createElement("p");
    warn.id = "stockWarning";
    warn.textContent = `Only ${currentStock} item(s) available in stock.`;
    warn.style.color = "red";
    warn.style.marginTop = "5px";
    qtyInput.insertAdjacentElement("afterend", warn);

    // Disable add/buy buttons
    addBtn.disabled = true;
    buyBtn.disabled = true;
    return false;
  } else {
    // Enable buttons again
    addBtn.disabled = false;
    buyBtn.disabled = false;
    return true;
  }
}

// Modify your existing updateQty function slightly:
function updateQty(change) {
  const qtyInput = document.getElementById("quantity");
  let current = parseInt(qtyInput.value);
  current = isNaN(current) ? 1 : current + change;
  if (current < 1) current = 1;
  qtyInput.value = current;

  // ✅ Validate stock after every change
  validateStock();
}


  window.addToCart = function () { alert("Added to cart!"); };
  window.buyNow = function () { alert("Proceeding to checkout!"); };

  // Related product loaders
  async function loadRelatedProducts(category, excludeId) {
    try {
      const res = await fetch(`/api/eyeglasses/related/${category}/${excludeId}`);
      const data = await res.json();
      if (!data || !data.success) return;
      const container = document.getElementById("relatedProducts");
      const title = document.getElementById("relatedTitle");
      if (title) title.textContent = `More ${formatCategory(category)}`;
      if (!container) return;
      container.innerHTML = "";
      data.products.forEach(p => {
        const extraInfo = (p.category === "kidsEyeglasses" && p.ageGroup)
          ? `<p class="text-muted">Age: ${p.ageGroup}</p>` : "";
        container.innerHTML += `
          <div class="col-md-3">
            <div class="card">
              <img src="${p.mainImage || ""}" class="card-img-top" alt="${p.name || ""}">
              <div class="card-body text-center">
                <h6>${p.name || ""}</h6>
                ${extraInfo}
                <p class="text-primary">Rs. ${p.price ?? ""}</p>
                <a href="products.html?id=${p._id}" class="btn btn-sm btn-outline-primary">View</a>
              </div>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error("Error loading related eyeglasses:", err);
    }
  }

  async function loadRelatedSunglasses(category, excludeId) {
    try {
      const res = await fetch(`/api/sunglasses/related/${category}/${excludeId}`);
      const data = await res.json();
      if (!data || !data.success) return;
      const container = document.getElementById("relatedProducts");
      const title = document.getElementById("relatedTitle");
      if (title) title.textContent = `More ${formatCategory(category)}`;
      if (!container) return;
      container.innerHTML = "";
      data.products.forEach(p => {
        const extraInfo = (p.category === "kidsSunglasses" && p.ageGroup)
          ? `<p class="text-muted">Age: ${p.ageGroup}</p>` : "";
        container.innerHTML += `
          <div class="col-md-3">
            <div class="card">
              <img src="${p.mainImage || ""}" class="card-img-top" alt="${p.name || ""}">
              <div class="card-body text-center">
                <h6>${p.name || ""}</h6>
                ${extraInfo}
                <p class="text-primary">Rs. ${p.price ?? ""}</p>
                <a href="products.html?id=${p._id}" class="btn btn-sm btn-outline-primary">View</a>
              </div>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error("Error loading related sunglasses:", err);
    }
  }

  async function loadRelatedWatches(category, excludeId) {
    try {
      const res = await fetch(`/api/watches/related/${category}/${excludeId}`);
      const data = await res.json();
      if (!data || !data.success) return;
      const container = document.getElementById("relatedProducts");
      const title = document.getElementById("relatedTitle");
      if (title) title.textContent = `More ${formatCategory(category)}`;
      if (!container) return;
      container.innerHTML = "";
      data.products.forEach(p => {
        const extraInfo = (p.category.toLowerCase().includes("kids") && p.ageGroup)
          ? `<p class="text-muted">Age: ${p.ageGroup}</p>` : "";
        container.innerHTML += `
          <div class="col-md-3">
            <div class="card">
              <img src="${p.mainImage || ""}" class="card-img-top" alt="${p.name || ""}">
              <div class="card-body text-center">
                <h6>${p.name || ""}</h6>
                ${extraInfo}
                <p class="text-primary">Rs. ${p.price ?? ""}</p>
                <a href="products.html?id=${p._id}" class="btn btn-sm btn-outline-primary">View</a>
              </div>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error("Error loading related watches:", err);
    }
  }

  // Related loader for Lenses
  async function loadRelatedLenses(category, excludeId) {
    try {
      const res = await fetch(`/api/lenses/${category}`);
      const data = await res.json();
      if (!data || !data.success) return;
      const filtered = data.products.filter(p => p._id !== excludeId);
      const container = document.getElementById("relatedProducts");
      const title = document.getElementById("relatedTitle");
      if (title) title.textContent = `More ${formatCategory(category)}`;
      if (!container) return;
      container.innerHTML = "";
      filtered.forEach(p => {
        container.innerHTML += `
          <div class="col-md-3">
            <div class="card">
              <img src="${p.mainImage || ""}" class="card-img-top" alt="${p.name || ""}">
              <div class="card-body text-center">
                <h6>${p.name || ""}</h6>
                <p class="text-primary">Rs. ${p.price ?? ""}</p>
                <a href="products.html?id=${p._id}" class="btn btn-sm btn-outline-primary">View</a>
              </div>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error("Error loading related lenses:", err);
    }
  }

  // --- Main loader ---
  async function loadAnyProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    if (!productId) return;

    const endpoints = [
      { kind: "eyeglasses", url: `/api/eyeglasses/product/${productId}`, related: loadRelatedProducts },
      { kind: "sunglasses", url: `/api/sunglasses/product/${productId}`, related: loadRelatedSunglasses },
      { kind: "watches", url: `/api/watches/product/${productId}`, related: loadRelatedWatches },
      { kind: "lenses", url: `/api/lenses/product/${productId}`, related: loadRelatedLenses }
    ];

    let found = false;
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url);
        let data;
        try { data = await res.json(); } catch (err) { continue; }

        if (data && data.success && data.product) {
          renderProduct(data.product);
          ep.related(data.product.category, data.product._id);
          found = true;
          break;
        }
      } catch (err) {
        console.warn(`Fetch error for ${ep.kind}:`, err);
      }
    }

    if (!found) {
      safeSetText("productName", "Product not found");
      safeSetText("productCategory", "");
      safeSetText("productPrice", "");
      safeSetText("productDesc", "");
      const thumb = document.getElementById("thumbContainer");
      if (thumb) thumb.innerHTML = "";
      const main = document.getElementById("mainImage");
      if (main) main.src = "";
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAnyProductDetails);
  } else {
    loadAnyProductDetails();
  }
})();
