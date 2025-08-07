import { formatCurrency } from '../scripts/utils/money.js';

export let products = [];

export function getProduct(productId) {
  if (!products || products.length === 0) {
    console.warn('Products not loaded yet');
    return null;
  }

  return products.find(product => product.id === productId) || null;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}

export async function loadProductsFetch() {
  try {
    const response = await fetch('https://supersimplebackend.dev/products');
    const productsData = await response.json();

    products = productsData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });

    console.log('load products');
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }
}

export function loadProducts(callback) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });

    console.log('load products');
    if (typeof callback === 'function') {
      callback();
    }
  });

  xhr.addEventListener('error', () => {
    console.log('Unexpected error. Please try again later.');
  });

  xhr.open('GET', 'https://supersimplebackend.dev/products');
  xhr.send();
}
