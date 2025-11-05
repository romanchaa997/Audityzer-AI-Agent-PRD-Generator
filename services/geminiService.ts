import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generatePrd(features: string): Promise<string> {
  const model = 'gemini-2.5-pro';

  const prompt = `
    You are a world-class AI product manager. Your task is to create an exceptionally detailed and comprehensive product requirements document (PRD) for a fictional product called "Audityzer AI Agent," an advanced Web3 community management and analytics platform. Your output must provide deep, actionable insights in every section, going far beyond surface-level descriptions.

    Based on the following feature categories, generate a professional PRD.

    Feature Categories:
    ---
    ${features}
    ---

    The PRD must include the following sections, precisely in this order and with the requested level of detail:

    1.  **Revision History**: This MUST be the absolute first section. It MUST be an HTML table with a \`<thead>\` containing the exact column headers: 'Version', 'Date', 'Author', and 'Changes'. The \`<tbody>\` MUST contain one pre-filled row with the following data: Version '1.0', today's date, Author 'AI Agent', and Changes 'Initial document generation'. Adherence to this format is mandatory.

    2.  **Executive Summary**: A concise (2-3 sentences) and powerful description of the product's core value proposition, target market, and key differentiator.

    3.  **Feature Specifications**: For each feature category provided, detail:
        -   **Functional Requirements**: Clearly describe what the feature does from a user's perspective.
        -   **Technical Implementation Approach**: Suggest a high-level technical strategy (e.g., "Use a fine-tuned LLM for intent recognition...").
        -   **Success Metrics and KPIs**: Provide specific, measurable metrics (e.g., "Reduce average community support ticket response time by 30%").
        -   **Priority Level**: P0/P1/P2.
        -   **Dependencies and Integration Requirements**: (e.g., "Requires read-access to Discord APIs and a wallet connection for token-gating").

    4.  **User Stories**: For the highest priority features, write 2-3 detailed user stories. Follow the format: "As a [user type], I want [functionality] so that [benefit]", ensuring each story clearly articulates user value.

    5.  **Technical Architecture Overview**: A deeply detailed, high-level system design. Do not be generic.
        -   **Core Components and Their Interactions**: Specify potential microservices (e.g., 'On-Chain Event Listener', 'Discord Bot Service', 'Analytics Engine') and their communication methods (e.g., REST for synchronous calls, gRPC for internal high-performance communication, message queues like RabbitMQ or NATS for asynchronous tasks).
        -   **Data Flow and Storage Requirements**: Suggest specific databases for specific needs (e.g., PostgreSQL or a similar SQL DB for structured user data, a vector database like Pinecone or Weaviate for semantic search on community chats, and a time-series DB like TimescaleDB for analytics). Detail the data pipeline (e.g., using Kafka for streaming on-chain events).
        -   **API and Integration Points**: Describe the API strategy (e.g., a public REST API for clients, internal GraphQL for flexibility), webhook strategies for real-time updates from platforms like Discord, and key third-party integrations (e.g., Alchemy/Infura for node access, The Graph for indexed data, Stripe for billing).

    6.  **Go-to-Market Strategy**: A concrete, actionable plan.
        -   **Target User Personas**: Create and describe specific user personas with names, roles, and pain points (e.g., "Alex, the overwhelmed DAO Community Manager," or "Chloe, the data-driven Web3 Project Founder").
        -   **Tiered Pricing Model**: Propose a detailed, tiered pricing model (e.g., Freemium, Pro, Enterprise). For each tier, break down the specific features, usage limits (e.g., number of connected accounts, API call limits), and price points.
        -   **Phased Rollout Plan**: Outline a clear, phased launch plan (Alpha, Beta, Public Launch) with specific objectives, target user counts, and key milestones for each phase.

    **Output Formatting Instructions:**
    - The entire response MUST be a single, well-structured HTML document fragment.
    - Do NOT include \`<html>\`, \`<head>\`, or \`<body>\` tags.
    - For the 'Revision History', use a proper HTML \`<table>\` with \`<thead>\`, \`<tbody>\`, \`<tr>\`, \`<th>\`, and \`<td>\` tags.
    - Use \`<h2>\` for main section titles.
    - Use \`<h3>\` for feature category titles.
    - Use \`<h4>\` for sub-sections within each feature.
    - Use \`<ul>\` and \`<li>\` for bullet points.
    - Use \`<strong>\` for emphasis and labels.
    - Use \`<p>\` for paragraphs.
    - Ensure the final output is clean, professional, and ready to be injected directly into a \`<div>\`.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating PRD with Gemini:", error);
    // Re-throw the original error to provide more specific details upstream.
    throw error;
  }
}