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
    safeSetText("productName", product.name || "Unnamed product");
    safeSetText("productCategory", formatCategory(product.category || ""));
    safeSetText("productPrice", product.price !== undefined ? "Rs. " + product.price : "");
    let descText = product.description  || "";
    // let descText = product.description || "No description available.";

    // Age group for kids (eyeglasses, sunglasses, watches)
    if (product.ageGroup && /kids/i.test(product.category || "")) {
      descText += `\nAge Group: ${product.ageGroup}`;
    }
    safeSetText("productDesc", descText);
  }

  // Shared functions used by markup (kept global)
  window.changeImage = function (el) {
    const main = document.getElementById("mainImage");
    if (main && el && el.src) main.src = el.src;
    document.querySelectorAll(".thumb-img").forEach(img => img.classList.remove("active"));
    if (el) el.classList.add("active");
  };

  window.updateQty = function (change) {
    const qtyInput = document.getElementById("quantity");
    if (!qtyInput) return;
    let value = parseInt(qtyInput.value || "0", 10) + change;
    if (isNaN(value) || value < 1) value = 1;
    qtyInput.value = value;
  };

  window.addToCart = function () { alert("Added to cart!"); };
  window.buyNow = function () { alert("Proceeding to checkout!"); };

  // Related loaders
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
        const extraInfo = (p.category === "kidsEyeglasses" && p.ageGroup) ? `<p class="text-muted">Age: ${p.ageGroup}</p>` : "";
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
        const extraInfo = (p.category === "kidsSunglasses" && p.ageGroup) ? `<p class="text-muted">Age: ${p.ageGroup}</p>` : "";
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

  // --- Related loader for watches ---
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
        const extraInfo = (p.category.toLowerCase().includes("kids") && p.ageGroup) ? `<p class="text-muted">Age: ${p.ageGroup}</p>` : "";
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

  // --- Main loader: tries eyeglasses, sunglasses, then watches ---
  async function loadAnyProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    if (!productId) return; // nothing to show if no id param

    const endpoints = [
      { kind: "eyeglasses", url: `/api/eyeglasses/product/${productId}`, related: loadRelatedProducts },
      { kind: "sunglasses", url: `/api/sunglasses/product/${productId}`, related: loadRelatedSunglasses },
      { kind: "watches", url: `/api/watches/product/${productId}`, related: loadRelatedWatches } // <--- Watches added
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
