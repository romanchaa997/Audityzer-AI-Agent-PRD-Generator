
import { GoogleGenAI } from "@google/genai";
import type { Feature } from '../App';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstructionForTemplate = (template: string): string => {
  const commonInstructions = `
    You are a world-class AI product manager and senior software architect. Your task is to create an exceptionally detailed and comprehensive product requirements document (PRD) for a fictional product called "Audityzer AI Agent," an advanced Web3 community management and analytics platform. Your output must provide deep, actionable insights in every section, going far beyond surface-level descriptions.
    
    **Output Formatting Instructions:**
    - The entire response MUST be a single, well-structured HTML document fragment.
    - Do NOT include \`<html>\`, \`<head>\`, or \`<body>\` tags.
    - For any 'Revision History' table, use a proper HTML \`<table>\` with \`<thead>\`, \`<tbody>\`, \`<tr>\`, \`<th>\`, and \`<td>\` tags.
    - Use \`<h2>\` for main section titles.
    - Use \`<h3>\` for feature category titles or sub-sections.
    - Use \`<h4>\` for smaller sub-sections.
    - Use \`<ul>\` and \`<li>\` for bullet points.
    - Use \`<strong>\` for emphasis and labels.
    - Use \`<p>\` for paragraphs.
    - Ensure the final output is clean, professional, and ready to be injected directly into a \`<div>\`.
  `;

  const revisionHistorySection = `
    1.  **Revision History**: This MUST be the absolute first section. It MUST be an HTML table with a \`<thead>\` containing the exact column headers: 'Version', 'Date', 'Author', and 'Changes'. The \`<tbody>\` MUST contain one pre-filled row with the following data: Version '1.0', today's date, Author 'AI Agent', and Changes 'Initial document generation'. Adherence to this format is mandatory.
  `;

  const technicalArchitectureSection = `
    **Technical Architecture Overview**: A deeply detailed, high-level system design. You MUST NOT be generic.
    -   **Core Components and Their Interactions**: You MUST specify example microservices such as 'On-Chain Event Listener' and 'Analytics Engine'. You MUST detail their communication protocols, explaining the use cases for REST (e.g., for public client communication) and gRPC (e.g., for high-performance internal microservice communication).
    -   **Data Flow and Storage Requirements**: You MUST suggest a multi-database strategy. For example, suggest PostgreSQL for relational user data, a vector DB (like Pinecone or Weaviate) for semantic search, and a time-series database like TimescaleDB for handling high-volume event data. You MUST also describe a data pipeline architecture, specifically mentioning the use of Kafka to stream data between services.
    -   **API and Integration Points**: You MUST detail the API strategy (e.g., versioned REST APIs, internal GraphQL APIs), describe the use of webhooks for real-time integrations, and list critical third-party integrations, specifically including services like Alchemy (for blockchain node access) and Stripe (for payment processing).
  `;

  switch (template) {
    case 'agile':
      return `
        ${commonInstructions}
        Your PRD must be tailored for an **Agile development methodology**, focusing on user value, epics, and user stories.
        The PRD must include the following sections, precisely in this order:
        
        ${revisionHistorySection}
        2.  **Product Vision & Goals**:
            -   **Vision Statement**: A concise, inspiring statement about the product's future.
            -   **Business Goals**: What key business objectives will this product achieve (e.g., increase user engagement by 20%)?
            -   **User Personas**: Create and describe specific user personas with names, roles, and pain points (e.g., "Alex, the overwhelmed DAO Community Manager").
        3.  **Epics**: Group the provided features into larger bodies of work (Epics). For each Epic, provide a brief description based on the provided feature details.
        4.  **User Stories & Acceptance Criteria**: This is the most critical section. For each feature, use its name and description to create detailed user stories. 
            -   Follow the format: "As a [user type], I want [functionality] so that [benefit]".
            -   For each story, provide a list of specific, testable **Acceptance Criteria** (e.g., "Given a user is on the Pro plan, when they add a 6th Discord server, then they see an upgrade prompt.").
        5.  **Non-Functional Requirements**: Detail system-wide requirements like Performance, Security, Scalability, and Accessibility (WCAG 2.1 AA).
        6.  ${technicalArchitectureSection}
        7.  **Initial Release Plan**: Briefly outline a potential series of sprints or releases, indicating which Epics or major stories would be included in the first few iterations.
      `;
    case 'waterfall':
      return `
        ${commonInstructions}
        Your PRD must be tailored for a **Waterfall development methodology**, requiring comprehensive, upfront specification of all requirements before design and development begin. The document should be formal and exhaustive.
        The PRD must include the following sections, precisely in this order:

        ${revisionHistorySection}
        2.  **Introduction**:
            -   **Purpose**: State the purpose of this document.
            -   **Scope**: Clearly define what is in and out of scope for this product version.
            -   **Definitions, Acronyms, and Abbreviations**: Define all key terms.
        3.  **Overall Description**:
            -   **Product Perspective**: How does this product fit into the broader landscape? Is it a standalone product or part of a larger system?
            -   **Product Functions**: A high-level summary of the functions the product will perform, based on the feature list.
            -   **User Characteristics**: Describe the intended user base in detail.
            -   **Constraints, Assumptions, and Dependencies**: List any technical, business, or regulatory constraints.
        4.  **System Requirements Specification**: This is the core of the document. For EACH feature, use its name and description to provide a complete and unambiguous specification.
            -   **Functional Requirements**: A detailed list of requirements, each with a unique ID (e.g., FR-001). Describe inputs, processing, and outputs. Be extremely specific.
            -   **External Interface Requirements**: Detail all user interfaces, hardware interfaces, software interfaces, and communication interfaces.
            -   **Performance Requirements**: Specify requirements for response time, throughput, resource usage, etc.
            -   **Security Requirements**: Detail requirements for data protection, access control, etc.
        5.  ${technicalArchitectureSection}
        6.  **Verification and Validation**: Describe the high-level approach for testing and quality assurance, linking back to the requirement IDs.
      `;
    case 'lean':
      return `
        ${commonInstructions}
        Your PRD must be tailored for a **Lean Startup methodology**, focusing on defining a Minimum Viable Product (MVP), identifying key assumptions, and establishing metrics for learning and validation. The document should be concise and action-oriented.
        The PRD must include the following sections, precisely in this order:

        ${revisionHistorySection}
        2.  **Lean Canvas / Business Model Overview**:
            -   **Problem**: What are the top 1-3 problems you are solving?
            -   **Customer Segments**: Who are your target customers/early adopters?
            -   **Unique Value Proposition (UVP)**: What is your single, clear, compelling message that turns an unaware visitor into an interested prospect?
            -   **Solution**: Outline the key features of your MVP that address the problem.
            -   **Key Metrics**: What are the key activities you will measure to track progress (e.g., Activation, Retention, Referral)?
        3.  **MVP Feature Set**: Based on the provided feature list, define a prioritized list of features that constitute the core MVP. For each MVP feature:
            -   **Hypothesis**: State the core assumption you are testing with this feature (e.g., "We believe that providing AI-powered summaries will increase daily user engagement by 15%").
            -   **Core Functionality**: Use the feature name and description to describe the feature at its most basic, viable level.
            -   **Success Criteria**: How will you know if the hypothesis is validated? Be specific (e.g., "Success is when 50% of beta users use the summary feature more than 3 times in their first week.").
        4.  **Key Assumptions and Risks**:
            -   List the biggest business and technical assumptions that need to be true for this product to succeed.
            -   Describe how you will test these assumptions (e.g., user interviews, A/B tests).
        5.  ${technicalArchitectureSection} (Focus on an architecture that is scalable but quick to implement for an MVP).
        6.  **Go-to-Market / Learning Plan**: Outline the plan for launching the MVP, who the target for the first release is, and what key questions you aim to answer.
      `;
    default:
      // Fallback to a detailed, generic prompt if template is unknown
      return `
        ${commonInstructions}
        The PRD must include the following sections, precisely in this order and with the requested level of detail:
    
        ${revisionHistorySection}
        2.  **Executive Summary**: A granular breakdown including Problem, Solution, Target Audience, and UVP.
        3.  **Feature Specifications**: Detailed breakdown of Functional Requirements, Acceptance Criteria, Technical Approach, KPIs, Priority, and Dependencies for each feature.
        4.  **User Stories**: 2-3 detailed stories for high-priority features.
        5.  ${technicalArchitectureSection}
        6.  **Go-to-Market Strategy**: Include Target Personas, a Tiered Pricing Model, and a Phased Rollout Plan.
      `;
  }
};


export async function generatePrd(features: Feature[], template: string): Promise<string> {
  const model = 'gemini-2.5-pro';
  const systemInstruction = getSystemInstructionForTemplate(template);
  
  const featuresString = features
    .filter(f => f.name.trim() !== '')
    .map(f => `**Feature:** ${f.name}\n**Description:** ${f.description.trim() || 'No description provided.'}`)
    .join('\n\n');

  const prompt = `
    Based on the following features and their detailed descriptions, generate a professional PRD using the ${template} methodology.

    Feature Details:
    ---
    ${featuresString}
    ---
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating PRD with Gemini:", error);
    // Re-throw the original error to provide more specific details upstream.
    throw error;
  }
}
