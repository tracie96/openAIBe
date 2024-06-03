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

async function generateFashionAdvice(prompt, products, pipeline) {
    try {
    const productDetails = products.map(p => {
      const images = p.images.join(', ');
      return `Name: ${p.name}\nDescription: ${p.description}\nImages: ${images}`;
    }).join('\n\n');
    let modelPrompt;
    if (pipeline === 'approach_x') {
      modelPrompt = `Based on the following product catalog, provide fashion advice using Approach X.\n\nProduct Catalog:\n${productDetails}\n\nUser query: ${prompt}`;
    } else if (pipeline === 'approach_y') {
      modelPrompt = `Based on the following product catalog, provide fashion advice using Approach Y.\n\nProduct Catalog:\n${productDetails}\n\nUser query: ${prompt}`;
    } else {
      throw new Error('Invalid pipeline');
    }

    const response = await openai.chat.completions.create({
      prompt: modelPrompt,
      model: 'gpt-3.5-turbo',    });
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
