
import { GoogleGenAI } from "@google/genai";
import { ProposalData } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Please set it to use the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateProposal = async (data: ProposalData): Promise<string> => {
  const { goal, audience, deliverables, budget, timeline, timelineUnit } = data;

  const deliverablesList = deliverables.map(d => `- ${d}`).join('\n');

  const prompt = `
    Generate a structured and professional project proposal based on the following details. The tone should be confident, clear, and persuasive.

    **Project Goal:**
    ${goal}

    **Target Audience/Client:**
    ${audience}

    **Key Deliverables:**
    ${deliverablesList}

    **Estimated Budget:**
    $${budget}

    **Estimated Timeline:**
    ${timeline} ${timelineUnit}

    ---

    Please structure the output into the following sections, providing detailed and relevant content for each:

    **1. Executive Summary:**
    A brief, high-level overview of the project. It should summarize the problem, the proposed solution, and the expected outcomes and benefits. This should be compelling enough to make the reader want to know more.

    **2. Project Scope:**
    Clearly define the boundaries of the project. Detail what is included (in-scope) and, if necessary, what is not included (out-of-scope) to manage expectations. This section should describe the project's objectives in more detail.

    **3. Key Deliverables:**
    List and describe the tangible outputs of the project. Be specific about what will be delivered to the client or stakeholder upon completion. This should be based on the list provided above but elaborated upon.

    **4. Timeline & Milestones:**
    Provide a high-level project timeline with key milestones. Break down the ${timeline} ${timelineUnit} duration into logical phases (e.g., Discovery, Design, Development, Deployment).

    **5. Budget Overview:**
    Briefly break down the estimated budget of $${budget}. You can create a high-level table with categories like 'Personnel', 'Software/Tools', 'Contingency', etc. This should be an estimate.

    **6. Next Steps:**
    Conclude with a clear call to action, outlining the next steps required to move the project forward (e.g., "We request a follow-up meeting to discuss this proposal in detail and proceed with a formal agreement.").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating proposal:", error);
    if (error instanceof Error) {
        return `An error occurred while generating the proposal. Please check your API key and network connection. Details: ${error.message}`;
    }
    return "An unknown error occurred while generating the proposal.";
  }
};
