const axios = require('axios');

async function predictPrice(data) {
  try {

    console.log("👉 Sending data to Flask:", data);

    const response = await axios.post('http://localhost:5001/predict', data);
    console.log('Prediction API response:', response.data); // Log the full response
    return response.data.predicted_price;
  } catch (err) {
    console.error('Prediction API error:', err.message);
    return null;
  }
}

module.exports = predictPrice;
