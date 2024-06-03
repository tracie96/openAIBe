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
    const userQuery = req.body.query;
    const products = await fetchProducts();
    const productDetails = getProductDetails(products);

    let response;
    if (process.env.PIPELINE === 'approach_x') {
      response = await generateFashionAdvice(userQuery, productDetails);
    } else if (process.env.PIPELINE === 'approach_y') {
      response = await generateFashionAdvice(userQuery, productDetails);
    } else {
      response = 'Invalid pipeline configuration.';
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate fashion advice' });
  }
};

module.exports = {
  getProducts,
  getFashionAdvice,
};
