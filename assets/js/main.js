// open e close cart
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// visual feedback on elements
function addVisualFeedback(element, message) {
  const feedback = document.createElement("span");
  feedback.innerText = message;
  feedback.style.cssText =
    "position: absolute; top: -10px; right: -10px; background: #28a745; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; opacity: 1; transition: opacity 1s ease-in-out;";
  element.style.position = "relative";
  element.appendChild(feedback);

  // Remove feedback after 3 seconds
  setTimeout(() => {
    feedback.style.opacity = "0";
    setTimeout(() => feedback.remove(), 1000);
  }, 2000);
}

// start when the document is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

// start
function start() {
  addEvents();
  updateTotal();
}

// update & rerender
function update() {
  updateTotal();
}

// add events
function addEvents() {
  const cartContent = document.querySelector(".cart-content");

  // Event delegation on cart-content
  cartContent.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("cart-remove")) {
      handle_removeCartItem(target);
    }
  });

  cartContent.addEventListener("input", (event) => {
    const target = event.target;

    if (target.classList.contains("cart-quantity")) {
      handle_changeItemQuantity(target);
    }
  });

  // Event delegation for add to cart and buy buttons
  document.body.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("addcart")) {
      handle_addCartItem(target);
    }

    if (target.classList.contains("btn-buy")) {
      handle_buyOrder();
    }
  });
}

// handle event functions
let itemsAdded = [];

function handle_addCartItem(button) {
  const product = button.parentElement;
  const title = product.querySelector(".product-title").innerHTML;
  const price = product.querySelector(".product-price").innerHTML;
  const imgSrc = product.querySelector(".product-img").src;

  const newToAdd = { title, price, imgSrc };

  if (itemsAdded.find((el) => el.title === newToAdd.title)) {
    addVisualFeedback(button, "Already in cart");
    return;
  }

  itemsAdded.push(newToAdd);

  const cartBoxElement = CartBoxComponent(title, price, imgSrc);
  const cartContent = document.querySelector(".cart-content");
  const newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  cartContent.appendChild(newNode);

  // add visual feedback
  addVisualFeedback(button, "Added to cart");

  update();
}

function handle_removeCartItem(button) {
  const cartBox = button.parentElement;
  const title = cartBox.querySelector(".cart-product-title").innerHTML;

  itemsAdded = itemsAdded.filter((item) => item.title !== title);
  cartBox.remove();

  update();
}

function handle_changeItemQuantity(input) {
  if (isNaN(input.value) || input.value < 1) {
    input.value = 1;
  }
  input.value = Math.floor(input.value);

  update();
}

function handle_buyOrder() {
  if (itemsAdded.length <= 0) {
    showFeedback("There is no order to place yet! Please make an order first.");
    return;
  }

  const cartContent = document.querySelector(".cart-content");
  cartContent.innerHTML = "";
  showFeedback("Your order has been placed successfully!");
  itemsAdded = [];

  update();
}

// update and rerender functions
function updateTotal() {
  const cartBoxes = document.querySelectorAll(".cart-box");
  const totalElement = cart.querySelector(".total-price");
  let total = 0;

  cartBoxes.forEach((cartBox) => {
    const priceElement = cartBox.querySelector(".cart-price");
    const price = parseFloat(priceElement.innerHTML.replace("€", ""));
    const quantity = cartBox.querySelector(".cart-quantity").value;
    total += price * quantity;
  });

  total = total.toFixed(2);
  totalElement.innerHTML = "€" + total;
}

// html components
function CartBoxComponent(title, price, imgSrc) {
  return `
    <div class="cart-box">
        <img src="${imgSrc}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}





