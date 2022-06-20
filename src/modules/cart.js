class Cart {

  constructor() {
    this.id = this.getId()

    this.addEvents()
    
  }

  getId() {
    console.log('get cart id')
  }

  addEvents() {
    const addToCartForm = document.querySelector('[data-node-type="commerce-add-to-cart-form"]')

    addToCartForm.addEventListener('submit', (e) => {
        e.preventDefault()
        console.log(e.target.elements)
    })
  }
}

export { Cart }