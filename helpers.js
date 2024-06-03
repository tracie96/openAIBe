const axios = require('axios');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchProducts() {
  try {
    const response = await axios.get(process.env.SHOPIFY_PRODUCTS_URL);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

function getProductDetails(products) {
  return products.map(product => ({
    name: product.title,
    description: product.body_html,
    images: product.images.map(image => image.src),  }));
}

async function generateFashionAdvice(prompt, products) {
  try {
    const productDetails = products.map(p => {
      const images = p.images.join(', ');
      return `Name: ${p.name}\nDescription: ${p.description}\nImages: ${images}`;
    }).join('\n\n');
    const response = await openai.chat.completions.create({
      prompt: `From the following product catalog, provide fashion advice.\n\nProduct Catalog:\n${productDetails}\n\nUser query: ${prompt}`,
      model:'gpt-3.5-turbo'
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating fashion advice:', error);
    throw new Error('Failed to generate fashion advice');
  }
}

module.exports = {
  fetchProducts,
  getProductDetails,
  generateFashionAdvice,
};
