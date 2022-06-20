class Client {
  constructor() {
  }
  
  async query(query, variables = {}) {
    const response = await fetch(webflowify.SHOP_GQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': webflowify.STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
  
    return response.json()
  }
}

export default Client