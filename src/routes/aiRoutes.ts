import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();
let ai: GoogleGenAI | null = null;

try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
}


router.post('/chat', async (req, res) => {
    const { message, history } = req.body;
    
    if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in the backend.' });
    }

    try {
        // Construct the conversation history for context
        let prompt = "You are EcoBot, a helpful sustainability assistant for the Eco Insight platform. Keep your answers concise, eco-friendly, and informative.\n\n";
        
        if (history && history.length > 0) {
            prompt += "Previous conversation context:\n";
            history.forEach((msg: any) => {
                prompt += `${msg.role}: ${msg.content}\n`;
            });
            prompt += "\n";
        }
        
        prompt += `User: ${message}\nEcoBot:`;

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Set headers for Server-Sent Events (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of responseStream) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
        
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error: any) {
        console.error('AI Chat Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate chat response.' });
        } else {
            res.write(`data: ${JSON.stringify({ error: 'Generation failed.' })}\n\n`);
            res.end();
        }
    }
});

router.post('/generate-report', async (req, res) => {
    const { routes, length = 'medium' } = req.body;

    if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in the backend.' });
    }

    try {
        const routesData = JSON.stringify(routes, null, 2);
        
        const lengthInstruction = length === 'short' 
            ? "Provide a brief 1-paragraph summary with key bullet points." 
            : length === 'long' 
                ? "Provide a comprehensive, detailed report with multiple sections, analyzing trends." 
                : "Provide a standard 2-3 paragraph report highlighting the main achievements.";

        const prompt = `
            You are an expert Sustainability Analyst. Generate a professional sustainability report based on the following user route data.
            
            Format the output in clean Markdown.
            ${lengthInstruction}
            
            Route Data:
            ${routesData}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ report: response.text });

    } catch (error) {
        console.error('AI Report Error:', error);
        res.status(500).json({ error: 'Failed to generate report.' });
    }
});

export default router;
