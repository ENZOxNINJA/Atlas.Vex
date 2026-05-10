/**
 * ATLAS VEX AI Chat Worker
 * Cloudflare Worker using Workers AI for Atlas Vex chatbot
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      const url = new URL(request.url);

      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'online',
          service: 'ATLAS VEX AI',
          model: '@cf/meta/llama-3.1-8b-instruct'
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Chat endpoint
      if (url.pathname === '/chat') {
        return await handleChat(request, env);
      }

      // Not found
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

/**
 * Handle chat requests
 */
async function handleChat(request, env) {
  try {
    const { session_id, message } = await request.json();

    if (!session_id || !message) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: session_id, message'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Get conversation history (in a real implementation, you'd store this in KV or D1)
    const conversationHistory = await getConversationHistory(env, session_id);

    // Build the context
    const systemPrompt = env.ATLAS_VEX_SYSTEM_PROMPT;
    const contextBlock = buildContextBlock(conversationHistory);

    // Prepare the AI request
    const messages = [
      { role: 'system', content: systemPrompt + contextBlock },
      { role: 'user', content: message }
    ];

    // Call Cloudflare Workers AI
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
    });

    const reply = response.response || 'Transmission failed. Please try again.';

    // Store the conversation (in a real implementation)
    await storeConversation(env, session_id, message, reply);

    return new Response(JSON.stringify({
      session_id,
      reply,
      timestamp: new Date().toISOString(),
      model: '@cf/meta/llama-3.1-8b-instruct'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({
      error: 'AI transmission failed',
      message: error.message
    }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * Get conversation history from storage
 */
async function getConversationHistory(env, sessionId) {
  try {
    // In a real implementation, you'd use Cloudflare KV or D1
    // For now, return empty array (stateless)
    return [];
  } catch (error) {
    console.error('Failed to get conversation history:', error);
    return [];
  }
}

/**
 * Store conversation in storage
 */
async function storeConversation(env, sessionId, userMessage, aiReply) {
  try {
    // In a real implementation, you'd store in KV or D1
    // For now, just log
    console.log(`Stored conversation for session ${sessionId}`);
  } catch (error) {
    console.error('Failed to store conversation:', error);
  }
}

/**
 * Build conversation context block
 */
function buildContextBlock(history) {
  if (!history || history.length === 0) {
    return '';
  }

  const lines = history.slice(-8).map(msg => {
    const speaker = msg.role === 'user' ? 'USER' : 'ATLAS_VEX';
    return `${speaker}: ${msg.content}`;
  });

  return '\n\n=== RECENT CONVERSATION CONTEXT ===\n' +
         lines.join('\n') +
         '\n=== END CONTEXT ===';
}