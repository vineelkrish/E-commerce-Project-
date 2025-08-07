import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';
import { loadCart } from '../data/cart.js';

async function loadPage() {
  try {
    await loadProductsFetch();

    await new Promise((resolve, reject) => {
      loadCart((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    renderOrderSummary();
    renderPaymentSummary();

  } catch (error) {
    console.log('Unexpected error. Please try again later.');
    console.error('Error details:', error);
  }
}

loadPage();
