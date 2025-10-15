
import { GoogleGenAI, GenerateContentResponse, Content, Part } from "@google/genai";
import { ASTRA_SYSTEM_INSTRUCTION } from '../constants';

const modelConfig = {
    systemInstruction: ASTRA_SYSTEM_INSTRUCTION,
};

export async function getAstraResponseStream(
    ai: GoogleGenAI,
    prompt: string,
    image?: { mimeType: string; data: string }
): Promise<AsyncGenerator<GenerateContentResponse>> {
    const modelName = image ? 'gemini-2.5-flash' : 'gemini-2.5-flash';

    const parts: Part[] = [{ text: prompt }];
    if (image) {
        parts.unshift({
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        });
    }
    
    const contents: Content = { role: 'user', parts };

    const response = await ai.models.generateContentStream({
        model: modelName,
        contents: contents,
        config: modelConfig,
    });
    
    return response;
}


export async function generateImage(ai: GoogleGenAI, prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
}
