import Client from './shopify-client.js';

const ShopifyClient = new Client()

const products = ShopifyClient.query(`{
    products(first: 3) {
      edges {
        node {
          id
          title
        }
      }
    }
  }`)
  .then(data => {
    console.log(data)
  })

  export default products