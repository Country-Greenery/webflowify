import { Customer } from './customer.js'

class Product {

  constructor() {
    this.addEvents()
  }

  addEvents() {
    console.log('add events')
    const addToCartForm = document.querySelector('[data-node-type="commerce-add-to-cart-form"]')

    if (addToCartForm != null) {
      addToCartForm.addEventListener('submit', (e) => {
          e.preventDefault()
          const elements = e.target.elements
          this.#addProductToCart(elements)
      })
    }
  }

  #addProductToCart(elements) {
    const qty = elements['commerce-add-to-cart-quantity-input'].value
    const itemId = elements['item-id'].value

    console.log({
      qty: qty,
      itemId: itemId,
      customer: Customer.accessToken
    })
  }
}

export { Product }