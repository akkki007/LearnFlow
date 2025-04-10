import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { code, workspaceId } = await req.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Code input required' }, 
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const suggestion = await getGroqCompletion(code, workspaceId);
    const latency = Date.now() - startTime;

    return NextResponse.json({ 
      suggestion,
      model: "llama3-8b-8192",
      latency: `${latency}ms`
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate completion',
        details: error.message,
        model: "llama3-8b-8192" 
      }, 
      { status: 500 }
    );
  }
}

async function getGroqCompletion(code, workspaceId) {
  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192", // Groq's fastest available model
    messages: [
      {
        role: "system",
        content: `You are an expert code completion assistant for workspace ${workspaceId}. 
                  Respond ONLY with code. No explanations, no markdown, no additional text.
                  Complete the code efficiently and accurately.`
      },
      {
        role: "user",
        content: code
      }
    ],
    temperature: 0.2, // Very low for maximum determinism in code
    max_tokens: 2048,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false
  });

  const suggestion = completion.choices[0]?.message?.content?.trim();
  if (!suggestion) throw new Error('Empty completion received');
  return suggestion;
}