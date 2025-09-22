async function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) return;

  try {
    const res = await fetch(`/api/eyeglasses/product/${productId}`);
    const data = await res.json();

    if (!data.success) {
      document.getElementById("productName").innerText = "Product not found";
      return;
    }

    const product = data.product;

    // ---- Main Image ----
    document.getElementById("mainImage").src = product.mainImage;

    // ---- Sub Images (thumbnails) ----
    const thumbContainer = document.getElementById("thumbContainer");
    thumbContainer.innerHTML = `
      <img src="${product.mainImage}" class="thumb-img active" onclick="changeImage(this)">
      ${product.subImages
        .map(img => `<img src="${img}" class="thumb-img" onclick="changeImage(this)">`)
        .join("")}
    `;

    // ---- Format category (camelCase → Title Case) ----
    function formatCategory(category) {
      return category
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    // ---- Product Details ----
    document.getElementById("productName").innerText = product.name;
    document.getElementById("productCategory").innerText = formatCategory(product.category);
    document.getElementById("productPrice").innerText = "Rs. " + product.price;
    let descText = product.description || "No description available.";

    // Add age group if kidsEyeglasses
    if (product.category === "kidsEyeglasses" && product.ageGroup) {
      descText += `\nAge Group: ${product.ageGroup}`;
    }
    document.getElementById("productDesc").innerText = descText;

    // ---- Load Related Products ----
    loadRelatedProducts(product.category, product._id, formatCategory);
  } catch (err) {
    console.error("Error fetching product:", err);
  }
}

// Change main image when clicking thumbnail
function changeImage(el) {
  document.getElementById("mainImage").src = el.src;
  document.querySelectorAll(".thumb-img").forEach(img => img.classList.remove("active"));
  el.classList.add("active");
}

// Quantity controls
function updateQty(change) {
  const qtyInput = document.getElementById("quantity");
  let value = parseInt(qtyInput.value) + change;
  if (value < 1) value = 1;
  qtyInput.value = value;
}

function addToCart() {
  alert("Added to cart!");
}

function buyNow() {
  alert("Proceeding to checkout!");
}

// ---- Load Related Products Section ----
async function loadRelatedProducts(category, excludeId, formatCategory) {
  try {
    const res = await fetch(`/api/eyeglasses/related/${category}/${excludeId}`);
    const data = await res.json();

    if (!data.success) return;

    const container = document.getElementById("relatedProducts");
    const title = document.getElementById("relatedTitle");
    container.innerHTML = "";

    // Set section heading
    title.textContent = `More ${formatCategory(category)}`;

    // Render cards in same layout
    data.products.forEach((p) => {
      // Include age group for kids
      let extraInfo = "";
      if (p.category === "kidsEyeglasses" && p.ageGroup) {
        extraInfo = `<p class="text-muted">Age: ${p.ageGroup}</p>`;
      }

      container.innerHTML += `
        <div class="col-md-3">
          <div class="card">
            <img src="${p.mainImage}" class="card-img-top" alt="${p.name}">
            <div class="card-body text-center">
              <h6>${p.name}</h6>
              ${extraInfo}
              <p class="text-primary">Rs. ${p.price}</p>
              <a href="products.html?id=${p._id}" class="btn btn-sm btn-outline-primary">View</a>
            </div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading related products:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProductDetails);
