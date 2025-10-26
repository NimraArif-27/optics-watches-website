// Validation & COD logic
document.getElementById('year').textContent = new Date().getFullYear();

const step1 = document.getElementById('step-1'),
      step2 = document.getElementById('step-2'),
      step3 = document.getElementById('step-3'),
      orderSuccess = document.getElementById('orderSuccess');

document.getElementById('continueToAddress').addEventListener('click', () => {
  step1.classList.add('d-none');
  step2.classList.remove('d-none');
  setStepperActive(2);
});

document.getElementById('backToCart').addEventListener('click', (e) => {
  e.preventDefault();
  step2.classList.add('d-none');
  step1.classList.remove('d-none');
  setStepperActive(1);
});

document.getElementById('continueToPayment').addEventListener('click', (e) => {
  e.preventDefault();
  if (validateAddress()) {
    step2.classList.add('d-none');
    step3.classList.remove('d-none');
    setStepperActive(3);
  }
});

document.getElementById('backToAddress').addEventListener('click', (e) => {
  e.preventDefault();
  step3.classList.add('d-none');
  step2.classList.remove('d-none');
  setStepperActive(2);
});

/* Updated stepper (keeps all previous steps filled blue) */
function setStepperActive(stepNo) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => {
    const stepNum = Number(step.getAttribute('data-step'));
    const numDiv = step.querySelector('.num');

    if (stepNum <= stepNo) {
      // Current and completed steps stay filled
      numDiv.style.backgroundColor = '#0d6efd';
      numDiv.style.color = '#fff';
      step.style.color = '#0d6efd';
      step.classList.add('active');
    } else {
      // Future steps normal
      numDiv.style.backgroundColor = '#e9eefc';
      numDiv.style.color = '#0d6efd';
      step.classList.remove('active');
    }
  });
}

const fullname = document.getElementById('fullname');
const phone = document.getElementById('phone');
const addressLine = document.getElementById('addressLine');
const city = document.getElementById('city');
const state = document.getElementById('state');
const postal = document.getElementById('postal');

function validateNameField() {
  const val = fullname.value.trim();
  return /^[A-Za-z\s]+$/.test(val) && val.length >= 2;
}

function validateCityField() {
  const val = city.value.trim();
  return /^[A-Za-z\s]+$/.test(val) && val.length >= 2;
}

function validateStateField() {
  const val = state.value.trim();
  return /^[A-Za-z\s]+$/.test(val) && val.length >= 2;
}

function validatePhoneField() {
  const val = phone.value.trim();
  return /^[0-9]{11}$/.test(val);
}

function validatePostalField() {
  const val = postal.value.trim();
  return /^[0-9]+$/.test(val);
}

function validateAddress() {
  let ok = true;
  if (!validateNameField()) { showError(fullname); ok = false; } else clearError(fullname);
  if (!validatePhoneField()) { showError(phone); ok = false; } else clearError(phone);
  if (!addressLine.value.trim()) { showError(addressLine); ok = false; } else clearError(addressLine);
  if (!validateCityField()) { showError(city); ok = false; } else clearError(city);
  if (!validateStateField()) { showError(state); ok = false; } else clearError(state);
  if (!validatePostalField()) { showError(postal); ok = false; } else clearError(postal);
  return ok;
}

function showError(input) {
  input.classList.add('is-invalid');
  input.style.borderColor = '#dc3545';
  input.style.boxShadow = '0 0 0 0.25rem rgba(220,53,69,.25)';
}

function clearError(input) {
  input.classList.remove('is-invalid');
  input.style.borderColor = '';
  input.style.boxShadow = 'none';
}

[fullname, city, state].forEach(field => {
  field.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
  });
});

phone.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
});

postal.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '');
});

/* STRONGEST NO-AUTOFILL SETTINGS */
window.addEventListener('load', () => {
  document.querySelectorAll('form').forEach(form => {
    form.setAttribute('autocomplete', 'off');
  });

  document.querySelectorAll('input').forEach(input => {
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('inputmode', 'text');

    // disable Chrome autofill popup visually
    input.setAttribute('data-form-type', 'other');
    input.setAttribute('aria-autocomplete', 'none');
    input.setAttribute('role', 'presentation');
    input.addEventListener('focus', () => clearError(input));
  });
});

const methodCard = document.getElementById('methodCard');
const methodCOD = document.getElementById('methodCOD');
const cardGroups = document.querySelectorAll('.card-group');

function toggleCardFields(){
  const cod = methodCOD.checked;
  cardGroups.forEach(g => {
    g.style.display = cod ? 'none' : '';
    g.querySelectorAll('input').forEach(inp => {
      if (cod) inp.removeAttribute('required'); 
      else inp.setAttribute('required','');
    });
  });
}

document.querySelectorAll('input[name="paymentMethod"]').forEach(r=> 
  r.addEventListener('change', toggleCardFields)
);
toggleCardFields();

const cardNumber = document.getElementById('cardNumber');
const cardExp = document.getElementById('cardExp');

if (cardNumber) {
  cardNumber.addEventListener('input', e=>{
    let v = e.target.value.replace(/\D/g,'').slice(0,16);
    v = v.match(/.{1,4}/g)?.join(' ') || v;
    e.target.value = v;
  });
}

if (cardExp) {
  cardExp.addEventListener('input', e=>{
    let v = e.target.value.replace(/\D/g,'').slice(0,4);
    if (v.length>2) v = v.slice(0,2) + '/' + v.slice(2);
    e.target.value = v;
  });
}

// document.getElementById('paymentForm').addEventListener('submit', function(e){
//   e.preventDefault();
//   const codSelected = methodCOD.checked;

//   if (!validateAddress()) {
//     step3.classList.add('d-none');
//     step2.classList.remove('d-none');
//     setStepperActive(2);
//     return;
//   }

//   if (!codSelected) {
//     const cardName = document.getElementById('cardName');
//     const cardNumberVal = document.getElementById('cardNumber').value.replace(/\s/g,'');
//     const cardExpVal = document.getElementById('cardExp').value;
//     const cardCvvVal = document.getElementById('cardCvv').value;

//     if (!cardName.value.trim() || cardNumberVal.length < 13 || cardCvvVal.length < 3 || cardExpVal.length < 4) {
//       if(!cardName.value.trim()) showError(cardName); else clearError(cardName);
//       if(cardNumberVal.length < 13) showError(document.getElementById('cardNumber')); else clearError(document.getElementById('cardNumber'));
//       if(cardCvvVal.length < 3) showError(document.getElementById('cardCvv')); else clearError(document.getElementById('cardCvv'));
//       if(cardExpVal.length < 4) showError(document.getElementById('cardExp')); else clearError(document.getElementById('cardExp'));
//       return;
//     }
//   }

//   const btn = document.getElementById('placeOrderBtn');
//   btn.disabled = true;
//   const orig = btn.innerHTML;
//   btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;

//   setTimeout(()=> {
//     step1.classList.add('d-none');
//     step2.classList.add('d-none');
//     step3.classList.add('d-none');
//     orderSuccess.classList.remove('d-none');
//     document.getElementById('orderId').textContent = 'KOPT-' + Math.floor(Math.random()*900000 + 100000);
//     window.scrollTo({top:0,behavior:'smooth'});
//   }, 1200);
// });

document.getElementById('paymentForm').addEventListener('submit', async function(e){
  e.preventDefault();
  
  const codSelected = methodCOD.checked;

  // --- Validate Address ---
  if (!validateAddress()) {
    step3.classList.add('d-none');
    step2.classList.remove('d-none');
    setStepperActive(2);
    return;
  }

  // --- Validate Card if not COD ---
  if (!codSelected) {
    const cardName = document.getElementById('cardName');
    const cardNumberVal = document.getElementById('cardNumber').value.replace(/\s/g,'');
    const cardExpVal = document.getElementById('cardExp').value;
    const cardCvvVal = document.getElementById('cardCvv').value;

    if (!cardName.value.trim() || cardNumberVal.length < 13 || cardCvvVal.length < 3 || cardExpVal.length < 4) {
      if(!cardName.value.trim()) showError(cardName); else clearError(cardName);
      if(cardNumberVal.length < 13) showError(document.getElementById('cardNumber')); else clearError(document.getElementById('cardNumber'));
      if(cardCvvVal.length < 3) showError(document.getElementById('cardCvv')); else clearError(document.getElementById('cardCvv'));
      if(cardExpVal.length < 4) showError(document.getElementById('cardExp')); else clearError(document.getElementById('cardExp'));
      return;
    }
  }

  const btn = document.getElementById('placeOrderBtn');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;

  try {
    // --- Gather cart / buy-now items ---
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
    const fromBuyNow = localStorage.getItem("fromBuyNow") === "true";
    let orderItems = [];

    if (fromBuyNow && buyNowItem) {
      orderItems = [buyNowItem];
    } else {
      orderItems = cart;
    }

    if (orderItems.length === 0) {
      alert("Your cart is empty.");
      btn.disabled = false;
      btn.innerHTML = orig;
      return;
    }

    const items = orderItems.map(item => ({
       productId: item._id || item.id,
      name: item.name,
      price: item.price,
      qty: item.qty || 1,
      power: item.power || { right: "", left: "" },
      brand: item.brand || "",
      color: item.color || "",
      ageGroup: item.ageGroup || "",
      category: item.category || "",
      subtotal: (item.price || 0) * (item.qty || 1)
    }));

    const totalAmount = parseFloat(document.getElementById("total").textContent.replace(/[^0-9.]/g,""));


    const orderData = {
      items,
      totalAmount,
      deliveryAddress: {
        fullname: fullname.value.trim(),
        phone: phone.value.trim(),
        addressLine: addressLine.value.trim(),
        city: city.value.trim(),
        state: state.value.trim(),
        postal: postal.value.trim()
      },
      paymentMethod: codSelected ? "COD" : "CARD"
    };

    // --- Send order to backend ---
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
 
    if (res.ok) {
      setTimeout(() => {
        step1.classList.add('d-none');
        step2.classList.add('d-none');
        step3.classList.add('d-none');
        orderSuccess.classList.remove('d-none');
        // document.getElementById('orderId').textContent =
        //   'KOPT-' + Math.floor(Math.random() * 900000 + 100000);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const fromBuyNow = localStorage.getItem("fromBuyNow") === "true";

        if (fromBuyNow) {
          // ✅ Buy Now order: clear only BuyNow item and UI, not cart
          localStorage.removeItem("buyNowItem");
          localStorage.setItem("fromBuyNow", "false");

          // remove only buyNow section if exists
          const buyNowSection = document.getElementById("buyNowSummary");
          if (buyNowSection) buyNowSection.innerHTML = "<p>Order placed successfully!</p>";
        } else {
          // ✅ Cart checkout: clear full cart
          localStorage.removeItem("cart");

          const cartList = document.getElementById("cart-items");
          const cartCount = document.getElementById("cart-count");
          const cartTotal = document.getElementById("cart-total");

          if (cartList) cartList.innerHTML = "<p>Your cart is empty.</p>";
          if (cartCount) cartCount.textContent = "0";
          if (cartTotal) cartTotal.textContent = "Rs. 0";
        }

        // reset button
        btn.disabled = false;
        btn.innerHTML = orig;
      }, 2000);
    } else {
      alert(data.error || "Failed to place order.");
      btn.disabled = false;
      btn.innerHTML = orig;
    }

  } catch (err) {
    console.error("Order failed:", err);
    alert("Something went wrong, try again.");
    btn.disabled = false;
    btn.innerHTML = orig;
  }
});


// Chrome autofill full suppression (final working trick)
window.addEventListener("DOMContentLoaded", () => {
  const sensitiveInputs = document.querySelectorAll(
    '#fullname, #phone, #addressLine, #city, #state, #postal'
  );

  // Insert hidden dummy fields before real inputs
  sensitiveInputs.forEach(input => {
    const dummy = document.createElement('input');
    dummy.type = 'text';
    dummy.style.display = 'none';
    dummy.autocomplete = 'off';
    dummy.name = Math.random().toString(36).substring(2,10); // random name
    input.parentNode.insertBefore(dummy, input);
  });

  // Randomize real input names too
  sensitiveInputs.forEach(input => {
    input.name = 'field_' + Math.random().toString(36).substring(2,10);
    input.setAttribute('autocomplete', 'new-' + input.name);
  });
});

//Order Summary Calculation
async function updateCheckoutSummary(cartTotal) {
  try {
    const res = await fetch("/api/site-settings"); // fetch from your route
    const data = await res.json();

    if (!data.success) return;

    const delivery = data.settings.deliveryCharges || 0;   // use deliveryCharges
    const taxPercentage = data.settings.tax || 0;          // use tax

    const taxAmount = (cartTotal * taxPercentage) / 100;
    const total = cartTotal + delivery + taxAmount;

    document.getElementById("subtotal").textContent = "Rs " + cartTotal.toLocaleString();
    document.getElementById("delivery").textContent = "Rs " + delivery.toLocaleString();
    document.getElementById("tax").textContent = "Rs " + taxAmount.toLocaleString();
    document.getElementById("total").textContent = "Rs " + total.toLocaleString();
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
  }
}


//Show Cart Items in Checkout Page
// document.addEventListener("DOMContentLoaded", async () => {
//   const checkoutList = document.getElementById("checkout-list");
//   const totalDisplay = document.getElementById("cart-total");

//   // let cart = JSON.parse(localStorage.getItem("cart")) || [];
//   let cart = [];

//   const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
//   if (buyNowItem) {
//     cart = [buyNowItem]; // use only this one product
//     localStorage.removeItem("buyNowItem"); // clear temporary key
//   } else {
//     cart = JSON.parse(localStorage.getItem("cart")) || [];
//   }


//   if (cart.length === 0) {
//     checkoutList.innerHTML = `
//       <div class="p-3 text-center text-muted">
//         Your cart is empty<br>
//         <a href="index.html" class="btn btn-primary mt-3">Continue Shopping</a>
//       </div>`;
//     totalDisplay.textContent = "Rs 0";
//     return;
//   }

//   let total = 0;
//   let renderedHTML = "";

//   // ✅ Fetch missing product details
//   for (let item of cart) {
//     try {
//       const res = await fetch(`/api/products/${item.id}`);
//       const data = await res.json();
//       const product = data.product || {};

//       const qty = item.qty || 1;
//       const price = product.price || item.price || 0;
//       const subtotal = qty * price;
//       total += subtotal;

//       renderedHTML += `
// <div class="list-group-item d-flex justify-content-between align-items-center p-3">
//   <div class="d-flex align-items-center">
//     ${product.mainImage ? `<img src="${product.mainImage}" alt="${product.name}" style="width:60px; height:60px; object-fit:cover; margin-right:15px;">` : ""}
//     <div>
//       <div style="font-weight:600">${product.name || item.name}</div>

//       <!-- Brand & Color for all lenses -->
//       ${(product.brand || item.brand) ? `<div class="muted-small">Brand: ${product.brand || item.brand}</div>` : ""}
//       ${(product.color || item.color) ? `<div class="muted-small">Color: ${product.color || item.color}</div>` : ""}

//       <!-- Power (if exists in cart) -->
//       ${item.power ? `
//         <div class="muted-small">Right Eye: ${item.power.right}</div>
//         <div class="muted-small">Left Eye: ${item.power.left}</div>
//       ` : ""}

//       ${product.ageGroup ? `<div class="muted-small">Age Group: ${product.ageGroup}</div>` : ""}
//       <div class="muted-small mt-2">Qty: <span>${qty}</span></div>
//     </div>
//   </div>
//   <div class="text-end">
//     <div class="fw-bold">Rs ${subtotal.toLocaleString()}</div>
//     <div class="muted-small">Rs ${price.toLocaleString()} each</div>
//   </div>
// </div>`;
//     } catch (err) {
//       console.error("Error fetching product details:", err);
//     }
//   }

//   checkoutList.innerHTML = renderedHTML;
//   totalDisplay.textContent = "Rs " + total.toLocaleString();

//   updateCheckoutSummary(total);
// });
document.addEventListener("DOMContentLoaded", async () => {
  const checkoutList = document.getElementById("checkout-list");
  const totalDisplay = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
  const fromBuyNow = localStorage.getItem("fromBuyNow") === "true";

  // ✅ If BuyItNow, show only that product
  if (fromBuyNow && buyNowItem) {
    cart = [buyNowItem];
    // ⚠️ Don't remove from localStorage here, so refresh will still show it
  }

  if (cart.length === 0) {
    checkoutList.innerHTML = `
      <div class="p-3 text-center text-muted">
        Your cart is empty<br>
        <a href="index.html" class="btn btn-primary mt-3">Continue Shopping</a>
      </div>`;
    totalDisplay.textContent = "Rs 0";
    return;
  }

  let total = 0;
  let renderedHTML = "";

  for (let item of cart) {
    try {
      const res = await fetch(`/api/products/${item.id}`);
      const data = await res.json();
      const product = data.product || {};
      const qty = item.qty || 1;
      const price = product.price || item.price || 0;
      const subtotal = qty * price;
      total += subtotal;

      renderedHTML += `
<div class="list-group-item d-flex justify-content-between align-items-center p-3">
  <div class="d-flex align-items-center">
    ${product.mainImage ? `<img src="${product.mainImage}" alt="${product.name}" style="width:60px; height:60px; object-fit:cover; margin-right:15px;">` : ""}
    <div>
      <div style="font-weight:600">${product.name || item.name}</div>
      ${(product.brand || item.brand) ? `<div class="muted-small">Brand: ${product.brand || item.brand}</div>` : ""}
      ${(product.color || item.color) ? `<div class="muted-small">Color: ${product.color || item.color}</div>` : ""}
      ${item.power ? `<div class="muted-small">Right Eye: ${item.power.right}</div><div class="muted-small">Left Eye: ${item.power.left}</div>` : ""}
      ${product.ageGroup ? `<div class="muted-small">Age Group: ${product.ageGroup}</div>` : ""}
      <div class="muted-small mt-2">Qty: <span>${qty}</span></div>
    </div>
  </div>
  <div class="text-end">
    <div class="fw-bold">Rs ${subtotal.toLocaleString()}</div>
    <div class="muted-small">Rs ${price.toLocaleString()} each</div>
  </div>
</div>`;
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  }

  checkoutList.innerHTML = renderedHTML;
  totalDisplay.textContent = "Rs " + total.toLocaleString();
  updateCheckoutSummary(total);
});

