import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(request) {
  try {
    const body = await request.json();
    const code = body.code;

    if (!code) {
      return NextResponse.json(
        { error: 'Code content is required' },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
      Analyze the following code and determine if it appears to be AI-generated.
      Evaluate based on these criteria:
      - Pattern consistency (too regular/perfect)
      - Comment style and quality
      - Variable naming patterns
      - Problem-solving approach
      - Code structure and organization

      Return a JSON object with the following properties:
      - isAiGenerated: boolean (true if likely AI-generated)
      - probability: number (between 0-1, how likely it's AI-generated)
      - indicators: array of strings (specific patterns that suggest AI generation)

      Here's the code to analyze:

      ${code}
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const analysisResult = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({
      isAiGenerated: analysisResult.isAiGenerated,
      probability: analysisResult.probability,
      indicators: analysisResult.indicators,
    });
  } catch (error) {
    console.error('AI detection error:', error.message);
    return NextResponse.json(
      { error: 'Failed to analyze code', details: error.message },
      { status: 500 }
    );
  }
}
