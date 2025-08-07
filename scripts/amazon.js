import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  try {
    let productsHTML = '';

    products.forEach((product) => {
      productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars" src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-select">
              ${[...Array(10)].map((_, i) =>
                `<option value="${i + 1}" ${i === 0 ? 'selected' : ''}>${i + 1}</option>`
              ).join('')}
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-message">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
            data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
    });

    document.querySelector('.js-products-grid').innerHTML = productsHTML;

    // Set up event listeners after rendering
    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const container = button.closest('.product-container');
        const quantity = Number(container.querySelector('.js-quantity-select').value);

        addToCart(productId, quantity);
        updateCartQuantity();

        // Show "Added" message briefly
        const addedMessage = container.querySelector('.js-added-to-cart-message');
        addedMessage.classList.add('visible');
        setTimeout(() => {
          addedMessage.classList.remove('visible');
        }, 1500);
      });
    });

    updateCartQuantity();

  } catch (error) {
    console.error('Error rendering product grid:', error);
  }
}

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}
