import 'dotenv/config';
import Client from 'shopify-buy/index.unoptimized.umd';

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
    domain: process.env.SHOP_URL,
    storefrontAccessToken: process.env.STOREFRONT_ACCESS_TOKEN
});

// Fetch all collections, including their products
client.collection.fetchAllWithProducts().then((collections) => {
    // Do something with the collections
    console.log(collections);
    console.log(collections[0].products);
});