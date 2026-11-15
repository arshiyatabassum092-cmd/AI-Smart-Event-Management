import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isGeminiConfigured = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');

let genAI = null;
if (isGeminiConfigured) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('Gemini SDK initialization error:', err);
  }
}

export const geminiService = {
  isConfigured() {
    return isGeminiConfigured;
  },

  async askEventAssistant(userPrompt, activeEvents = []) {
    // If user provided a real Gemini API key, query Google Gemini
    if (isGeminiConfigured && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build compact event catalogue for context grounding
        const eventsContext = activeEvents.map(e => ({
          title: e.title,
          category: e.category,
          date: e.date,
          time: e.time,
          venue: e.venue,
          eligibility: e.eligibility,
          availableSeats: (e.capacity || 100) - (e.registeredCount || 0),
          summary: e.description
        }));

        const systemPrompt = `You are "SmartEvent AI", the intelligent campus event assistant for college students and organizers.
Below is the real-time catalog of all currently listed campus events:
${JSON.stringify(eventsContext, null, 2)}

Your responsibilities:
1. Recommend suitable events based on user preferences, major/branch, or career goals.
2. Answer questions regarding event dates, timings, venues, eligibility criteria, and remaining seats.
3. Be concise, engaging, and structured with bullet points.
4. If an event requested is not found, state that politely and suggest the closest relevant event.
5. Format your answers in clean Markdown.`;

        const fullPrompt = `${systemPrompt}\n\nStudent Query: "${userPrompt}"\n\nAssistant Response:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
      } catch (err) {
        console.error('Gemini API query error:', err);
        return `⚠️ **Gemini API Error:** ${err.message || 'Unable to connect to Gemini at this moment.'}\n\nPlease check your \`VITE_GEMINI_API_KEY\` in \`.env.local\`.`;
      }
    }

    // Demo / Smart Local Fallback when API key is not yet configured
    const lower = userPrompt.toLowerCase();

    // 1. Check for category queries
    if (lower.includes('tech') || lower.includes('hackathon') || lower.includes('code') || lower.includes('ai')) {
      const techEvents = activeEvents.filter(e => e.category === 'Technical' || e.tags?.includes('AI'));
      if (techEvents.length > 0) {
        return `🤖 **SmartEvent Assistant:**\n\nHere are the top technical events happening on campus:\n\n` +
          techEvents.map(e => `* **${e.title}** (${e.date})\n  📍 *Venue:* ${e.venue}\n  🎯 *Seats Left:* ${(e.capacity || 100) - (e.registeredCount || 0)}`).join('\n\n') +
          `\n\n👉 *Tip:* You can register directly from the **Explore Events** page! *(Running in offline demo mode. Add your Gemini API Key in .env.local for live multi-turn AI reasoning!)*`;
      }
    }

    if (lower.includes('workshop') || lower.includes('learn') || lower.includes('hands-on')) {
      const workshops = activeEvents.filter(e => e.category === 'Workshop');
      if (workshops.length > 0) {
        return `🛠️ **Recommended Workshops:**\n\n` +
          workshops.map(e => `* **${e.title}** (${e.date} at ${e.time})\n  📍 *Venue:* ${e.venue}\n  📋 *Eligibility:* ${e.eligibility}`).join('\n\n') +
          `\n\n*(Running in smart demo mode. Configure your \`VITE_GEMINI_API_KEY\` for live Gemini AI responses!)*`;
      }
    }

    if (lower.includes('cultural') || lower.includes('music') || lower.includes('dance') || lower.includes('fest')) {
      const cultEvents = activeEvents.filter(e => e.category === 'Cultural');
      if (cultEvents.length > 0) {
        return `🎉 **Cultural Highlights:**\n\n` +
          cultEvents.map(e => `* **${e.title}**\n  📅 ${e.date} | ⏰ ${e.time}\n  📍 ${e.venue}\n  ${e.description}`).join('\n\n');
      }
    }

    // Generic helpful overview
    return `👋 **Hello! I am SmartEvent AI.**\n\nCurrently, there are **${activeEvents.length} events** scheduled on campus across Technical, Workshops, Cultural, and Sports categories.\n\nHere are quick suggestions you can ask me:\n- *"What hackathons or coding contests can I join?"*\n- *"Are there any workshops for beginners?"*\n- *"What cultural events are happening this month?"*\n\n*(💡 Notice: Add your free Google Gemini API key to \`.env.local\` as \`VITE_GEMINI_API_KEY\` to activate full generative conversational powers!)*`;
  }
};
