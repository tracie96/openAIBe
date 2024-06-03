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

async function generateFashionAdvice(query, products, pipeline) {
  function stripHtml(html) {
    return html.replace(/<[^>]+>/g, '');
  }

  function generateProductDetailsString(products) {
    return products.map(p => `Name: ${p.name}\nDescription: ${stripHtml(p.description)}\nImage: ${p.images.map(img => img.src).join(', ')}`).join('\n\n');
  }

  const productDetails = generateProductDetailsString(products);
  let messages;
  if (pipeline === "approach_x") {
    messages = [
      { role: "system", content: `You are a fashion advisor. Use only the following product catalog to provide advice:\n\n${productDetails}` },
      { role: "user", content: query }
    ];
  } else if (pipeline === "approach_y") {
    messages = [
      { role: "system", content: `You are a fashion advisor. Here is a product catalog to help you provide fashion advice.\n\n${productDetails}` },
      { role: "user", content: `Please provide advice based on this query: ${query}` }
    ];
  } else {
    throw new Error(`Unknown pipeline: ${pipeline}`);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 200,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating fashion advice:", error);
    throw error;
  }
}

module.exports = {
  fetchProducts,
  getProductDetails,
  generateFashionAdvice,
};
