## Clone the Repository

- git clone https://github.com/tracie96/openAIBe
- cd openAIBe

## Install Dependencies

Run `Yarn install`

## Environmental Variables (Please include this for project to work)

- Create a .env file in the backend directory and add the following:
OPENAI_API_KEY=your_openai_api_key<br>
SHOPIFY_PRODUCTS_URL=https://shopwoven.ca/products.json
<br>
Please replace with your functional openai_api_key

## Start Server

Run `Yarn Start` or `Nodemon`

### Project Structure:
- `index.js`: Main application file.
- `controllers/productController.js`: Contains logic for fetch product and Fashion advie.
- `routes/chatRoutes.js`: Defines the routes to get fashion advice.
- `helpers.js`: This is where the openAI integration is done and also where the model fetches advice from openAI service


## Usage

- Start the backend server.
- Ensure the frontend is running and connected to the backend.
- The frontend will make requests to the backend to get fashion advice based on user input.

