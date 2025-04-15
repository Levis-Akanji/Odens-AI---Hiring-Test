const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateQuoteText({ customerName, contact, title, reference, validUntil, specifications, communication, predictedPrice }) {
  const prompt = `
Generate a professional quote message for the following:

- Company Name: ${customerName}
- Contact Person: ${contact}
- Quote Title: ${title}
- Reference: ${reference}
- Valid Until: ${validUntil}
- Specifications: ${specifications}
- Communication context: ${communication}
- Calculated Price: ${predictedPrice} SEK (excl. VAT)

Use a formal tone, and include standard terms for delivery and payment.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6
  });

  return completion.choices[0].message.content;
}

module.exports = generateQuoteText;
