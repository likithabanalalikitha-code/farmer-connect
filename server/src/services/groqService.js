const config = require('../config/env');
const Product = require('../models/Product');
const logger = require('../utils/logger');

const SYSTEM_PROMPT = `You are Farmer Market Connect AI Assistant. You help users navigate the Farmer Market Connect agricultural marketplace. You can help with:
- Finding agricultural products
- Understanding marketplace features
- Product recommendations
- Farmer marketplace guidance
- Order-related questions
- Platform navigation
- General agricultural marketplace information

Be concise, friendly, helpful and easy to understand.
Do not claim to have access to information that is not provided.
Do not invent product availability, prices, farmer information or order information.
For personalized marketplace recommendations, use the available application data provided below.
All prices are in Indian Rupees (₹).
For medical, legal, financial or highly specialized agricultural advice, clearly explain that users should consult a qualified professional when appropriate.
Never expose API keys, database credentials, JWT secrets, or internal server configurations.`;

/**
 * Searches current marketplace products relevant to the user query for RAG context
 */
const getMarketplaceContext = async (queryText) => {
  try {
    let filter = { isActive: true, availableQuantity: { $gt: 0 } };
    
    // Check for keywords in query
    const keywords = queryText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (keywords.length > 0) {
      const regexPatterns = keywords.map(kw => new RegExp(kw, 'i'));
      filter.$or = [
        { name: { $in: regexPatterns } },
        { category: { $in: regexPatterns } },
        { description: { $in: regexPatterns } },
        { location: { $in: regexPatterns } }
      ];
    }

    const matchedProducts = await Product.find(filter)
      .populate('farmer', 'name farmName city state')
      .limit(6)
      .lean();

    if (!matchedProducts || matchedProducts.length === 0) {
      // Return top active featured products if direct keyword match is empty
      const featured = await Product.find({ isActive: true, availableQuantity: { $gt: 0 } })
        .populate('farmer', 'name farmName city state')
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();
      
      return featured.map(p => ({
        id: p._id,
        name: p.name,
        category: p.category,
        price: `₹${p.price} per ${p.unit}`,
        available: `${p.availableQuantity} ${p.unit}`,
        organic: p.organic ? 'Certified Organic' : 'Conventional',
        location: p.location,
        farmer: p.farmer ? `${p.farmer.name} (${p.farmer.farmName || 'Local Farm'})` : 'Local Farmer'
      }));
    }

    return matchedProducts.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category,
      price: `₹${p.price} per ${p.unit}`,
      available: `${p.availableQuantity} ${p.unit}`,
      organic: p.organic ? 'Certified Organic' : 'Conventional',
      location: p.location,
      farmer: p.farmer ? `${p.farmer.name} (${p.farmer.farmName || 'Local Farm'})` : 'Local Farmer'
    }));
  } catch (err) {
    logger.warn('Could not fetch marketplace context for AI:', err.message);
    return [];
  }
};

/**
 * Sends conversation to Groq API
 */
const chatWithGroq = async (messages, userContext = null) => {
  const lastMessage = messages[messages.length - 1];
  const queryText = lastMessage ? lastMessage.content : '';

  // Retrieve current real products for grounding
  const relevantProducts = await getMarketplaceContext(queryText);

  let contextSnippet = '';
  if (relevantProducts.length > 0) {
    contextSnippet = `\n\nCURRENT VERIFIED MARKETPLACE PRODUCTS (Real-time data):\n` +
      relevantProducts.map(p => `- ${p.name} (${p.category}): ${p.price}, Available: ${p.available}, Type: ${p.organic}, Location: ${p.location}, Farmer: ${p.farmer}`).join('\n') +
      `\n\nWhen recommending products, refer to these actual items and mention their prices in ₹. If the user asks for something not listed, state clearly that it is currently unavailable on the market.`;
  } else {
    contextSnippet = `\n\nCurrently there are no matching live products listed in the marketplace for this exact query. Inform the user respectfully and suggest browsing our available categories or checking back soon.`;
  }

  const promptWithContext = `${SYSTEM_PROMPT}${contextSnippet}`;

  // If GROQ_API_KEY is not configured or in test mode, provide an intelligent agricultural mock assistant
  if (!config.groqApiKey) {
    logger.warn('GROQ_API_KEY is not configured. Serving grounded fallback assistant response.');
    return generateFallbackResponse(queryText, relevantProducts);
  }

  try {
    const formattedMessages = [
      { role: 'system', content: promptWithContext },
      ...messages.slice(-8) // Send last 8 conversation turns for optimal latency and token window
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.groqApiKey}`
      },
      body: JSON.stringify({
        model: config.groqModel || 'llama-3.1-8b-instant',
        messages: formattedMessages,
        temperature: 0.5,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Groq API Error (${response.status}):`, errorText);
      return generateFallbackResponse(queryText, relevantProducts);
    }

    const data = await response.json();
    const assistantMessage = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : 'I am here to help you navigate Farmer Market Connect. What produce or information are you looking for today?';

    return {
      message: assistantMessage,
      products: relevantProducts
    };
  } catch (error) {
    logger.error('Error invoking Groq API:', error.message);
    return generateFallbackResponse(queryText, relevantProducts);
  }
};

/**
 * Graceful fallback when Groq key is absent or network is degraded
 */
const generateFallbackResponse = (query, products) => {
  const q = query.toLowerCase();
  let text = '';

  if (q.includes('organic')) {
    const organicItems = products.filter(p => p.organic.includes('Organic'));
    if (organicItems.length > 0) {
      text = `Here are certified organic products directly from our farmers:\n\n` +
        organicItems.map(p => `• **${p.name}** at ${p.price} from ${p.farmer} in ${p.location}`).join('\n') +
        `\n\nYou can click on any product in the Marketplace tab to view detailed harvest information and place an order!`;
    } else {
      text = `We prioritize verified natural and organic farming. Currently, our farmers are updating their organic harvest inventory. You can browse the Marketplace with the "Organic Only" filter active to see all certified items.`;
    }
  } else if (q.includes('tomato') || q.includes('potato') || q.includes('onion') || q.includes('vegetable')) {
    if (products.length > 0) {
      text = `We have fresh produce available right now:\n\n` +
        products.map(p => `• **${p.name}**: ${p.price} (${p.available} in stock) from ${p.farmer}`).join('\n') +
        `\n\nThese items can be ordered with convenient Cash on Delivery directly from the farm!`;
    } else {
      text = `You can find fresh local vegetables in our **Marketplace** page. Use the filter panel on the left to select the Vegetables category.`;
    }
  } else if (q.includes('sell') || q.includes('farmer') || q.includes('register')) {
    text = `Joining as a Farmer is quick and free! Register with a 'Farmer' account, visit your **Farmer Dashboard**, and start listing your harvest with photos, pricing in ₹, and quantity. You retain full control of your prices with direct access to buyers.`;
  } else if (q.includes('order') || q.includes('track') || q.includes('delivery')) {
    text = `You can track all your orders in real-time under **My Orders** in the navigation bar. Each order features an interactive status timeline (Pending → Confirmed → Processing → Shipped → Delivered).`;
  } else {
    text = `Welcome to Farmer Market Connect! I'm your AI Agricultural Assistant. I can help you find fresh farm produce, discover organic harvest near your location, track your orders, or guide farmers on managing listings. How can I assist you today?`;
  }

  return {
    message: text,
    products: products.slice(0, 3)
  };
};

module.exports = {
  chatWithGroq,
  getMarketplaceContext
};
