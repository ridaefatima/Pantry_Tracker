import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  const { items } = await request.json();

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate a summarized recipe using the following items and make the ingredients appear as a list: ${items.join(', ')}`
        },
      ],
      model: 'llama3-8b-8192',
    });

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data from AI' }), { status: 500 });
  }
}
