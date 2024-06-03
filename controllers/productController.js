const { fetchProducts, getProductDetails, generateFashionAdvice } = require('../helpers');

const getProducts = async (req, res) => {
  try {
    const products = await fetchProducts();
    const productDetails = getProductDetails(products);
    res.json(productDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getFashionAdvice = async (req, res) => {
  try {
    const { query, pipeline } = req.body;
    const products = await fetchProducts();
    const productDetails = getProductDetails(products);
    let result;
    if (pipeline === 'approach_x' || pipeline === 'approach_y') {
      result = await generateFashionAdvice(query, productDetails,pipeline);
    } else {
      result = { advice: 'Invalid pipeline configuration.', products: [] };
    }

    res.json({ response: result.advice, products: result.products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate fashion advice' });
  }
};

module.exports = {
  getProducts,
  getFashionAdvice,
};
