import Client from './shopify-client.js'
import Cookies from 'js-cookie'

const ShopifyClient = new Client()

const cookieName = 'cgShopAccessToken'

class Customer {

  constructor() {
    this.addEvents()
  }

  static get isLoggedIn() {
    return Cookies.get(cookieName) != null
  }

  static get accessToken() {
    return Cookies.get(cookieName)
  }

  addEvents() {
    const registerForm = document.querySelector('[data-node-type="commerce-customer-register-form"]')
    const loginForm = document.querySelector('[data-node-type="commerce-customer-login-form"]')

    if (registerForm != null) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const elements = e.target.elements
        this.#createCustomer(elements)
      })
    }

    if (loginForm != null) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const elements = e.target.elements
        this.#customerLogin(elements)
      })
    }
  }

  #customerLogin(elements) {
    const email = elements.email.value
    const password = elements.password.value
    const remember = elements.remember.checked

    const variables = {
      "input": {
        "email": email,
        "password": password
      }
    }

    ShopifyClient.query(`mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field,
          message,
          code
        }
      }
    }`, variables)
    .then(data => {
      const customerAccessToken = data.data.customerAccessTokenCreate.customerAccessToken
      const expires = remember ? new Date(customerAccessToken.expiresAt) : false
      Cookies.set('cgShopAccessToken', customerAccessToken.accessToken, { expires: expires, path: '' })

      window.location.replace('/')
    })
  }

  #createCustomer(elements) {
    const firstName = elements.firstName.value
    const lastName = elements.lastName.value
    const email = elements.email.value
    const password = elements.password.value

    const variables = {
      "input": {
        "email": email,
        "firstName": firstName,
        "lastName": lastName,
        "password": password
      }
    }

    ShopifyClient.query(`mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          firstName
          lastName,
          email
        }
        customerUserErrors { field, message, code }
      }
    }`, variables)
    .then(data => {
      console.log(data.data.customerCreate)
    })
  }
}

export { Customer }
