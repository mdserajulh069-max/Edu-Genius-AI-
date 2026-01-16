
import { GoogleGenAI, Type } from "@google/genai";
import { AssistantRequest, AssistantResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAssistantResponse = async (params: AssistantRequest): Promise<AssistantResponse> => {
  const { subject, mode, query, language } = params;
  
  const systemInstructions = `
    You are EduGenius AI, a world-class educational authority specializing in K-12, Competitive Exams, and University-level curriculum from all universities worldwide.
    Subject/Exam: ${subject}
    Language: ${language}
    Operation Mode: ${mode}

    CONTEXTUAL GUIDELINES:
    1. UNIVERSAL ACADEMICS: Deep knowledge of global institutions (MIT, Oxford, IITs, etc.) and regional universities.
    2. COMPETITIVE EXAMS: Provide specific patterns and accuracy for:
       - SSC: CGL, CHSL, MTS, GD, JE.
       - UPSC: Civil Services (IAS/IFS), CDS, NDA.
       - JEE (Mains & Advanced) and NEET (UG).
       - UGC NET (JRF & Assistant Professor).
       - WBPSC: WBCS (West Bengal Civil Service), Miscellaneous Services, Clerkship, Food SI, and other WB State exams.
       - AUAT: Aliah University Admission Test (UG/PG entrance patterns, Islamic Studies, General Knowledge, and Specific Subjects).
       - CUET: Common University Entrance Test (Domain specific, General Test, and Language sections).
    3. Mode-SOLVER: Provide rigorous, step-by-step solutions with shortcuts for competitive exams (especially for Quant/Reasoning in SSC/WBPSC/AUAT).
    4. Mode-NOTES: Create high-density, structured academic notes. For WBPSC/UPSC/AUAT, focus on standard textbooks and specific university entry requirements.
    5. Mode-PYQ: Generate or simulate Previous Year Questions from actual exam patterns (e.g., WBPSC Preliminary/Mains patterns, AUAT past paper trends).
    6. Mode-MATERIAL: Provide reading lists, key terminology, and case studies relevant to the exam syllabus.
    
    Maintain an authoritative yet supportive tone. Use clear Markdown headers and formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: query }] }],
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.6,
      },
    });

    return {
      title: `${subject} - Global Academy`,
      content: response.text || "I was unable to process this request. Please try rephrasing with specific exam or university details.",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Critical connection error. Please ensure your query doesn't violate academic integrity policies and try again.");
  }
};
