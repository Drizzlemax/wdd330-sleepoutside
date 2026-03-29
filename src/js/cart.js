import { getLocalStorage } from "./utils.mjs";

// Main render function
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  // Render all items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Show/hide total
  if (cartItems.length > 0) {
    const total = calculateCartTotal(cartItems);
    document.querySelector(".cart-total").style.display = "block";
    document.querySelector("#cart-total-amount").textContent = `$${total.toFixed(
      2
    )}`;
  } else {
    document.querySelector(".cart-total").style.display = "none";
  }

  // Attach remove-button events
  addRemoveListeners();
}

// Template for each cart item
function cartItemTemplate(item) {
  const newItem = `
  <li class="cart-card divider" data-id="${item.Id}">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>

    <button class="remove-item">Remove</button>
  </li>`;

  return newItem;
}

// Calculate cart total
function calculateCartTotal(cartItems) {
  return cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice),
    0
  );
}

// Remove item and update UI
function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.filter((item) => item.Id !== productId);

  localStorage.setItem("so-cart", JSON.stringify(cartItems));

  // Re-render cart after removal
  renderCartContents();
}

// Add listener to every remove button
function addRemoveListeners() {
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const parent = event.target.closest(".cart-card");
      const productId = parent && parent.getAttribute("data-id");
      if (productId) removeFromCart(productId);
    });
  });
}

// Initial render
renderCartContents();

