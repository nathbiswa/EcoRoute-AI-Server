import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getLogisticsOptimization = async (data: any) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `You are an expert Sustainability Agent. Analyze this shipment:
    Origin: ${data.origin}, Destination: ${data.destination}, Weight: ${data.weight}kg.
    1. Calculate estimated CO2 impact.
    2. Suggest 3 greener transport alternatives.
    3. Provide a summary for the logistics manager.
    Return response in JSON format.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};