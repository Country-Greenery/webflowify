async function ShopifyQuery(url = '', data = {}) {

  const response = await fetch('https://country-greenery-moorhead.myshopify.com/api/2021-07/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': 'ad3a9789e579c20149b3cf60692c912c'
    },
    body: JSON.stringify({
      query: `
      {
          products(first: 3) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
        `
    })
  })
  
  return response.json()
}

export default ShopifyQuery