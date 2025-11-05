
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generatePrd(features: string): Promise<string> {
  const model = 'gemini-2.5-pro';

  const prompt = `
    You are a world-class AI product manager and senior software architect. Your task is to create an exceptionally detailed and comprehensive product requirements document (PRD) for a fictional product called "Audityzer AI Agent," an advanced Web3 community management and analytics platform. Your output must provide deep, actionable insights in every section, going far beyond surface-level descriptions.

    Based on the following feature categories, generate a professional PRD.

    Feature Categories:
    ---
    ${features}
    ---

    The PRD must include the following sections, precisely in this order and with the requested level of detail:

    1.  **Revision History**: This MUST be the absolute first section. It MUST be an HTML table with a \`<thead>\` containing the exact column headers: 'Version', 'Date', 'Author', and 'Changes'. The \`<tbody>\` MUST contain one pre-filled row with the following data: Version '1.0', today's date, Author 'AI Agent', and Changes 'Initial document generation'. Adherence to this format is mandatory.

    2.  **Executive Summary**: Provide a granular breakdown, not a single paragraph. It must include:
        -   **Problem Statement**: What is the core problem this product solves for Web3 communities?
        -   **Solution**: How does the Audityzer AI Agent address this problem?
        -   **Target Audience**: Who is the primary user of this product?
        -   **Unique Value Proposition (UVP)**: What makes this solution uniquely better than alternatives?

    3.  **Feature Specifications**: For each feature category, provide an in-depth breakdown. This section is critical for the development team, so be extremely clear and granular.
        -   **Functional Requirements**:
            -   **User-Facing Capabilities**: List exactly what the user can see and do.
            -   **Backend Processes**: Describe the key automated processes and logic that happen behind the scenes.
            -   **Acceptance Criteria**: Provide a set of specific, testable criteria that must be met for the feature to be considered complete (e.g., "Given a user is authenticated, when they navigate to the dashboard, then the on-chain activity for their connected wallet is displayed within 2 seconds.").
        -   **Technical Implementation Approach**:
            -   **High-Level Strategy**: Outline the general approach.
            -   **Key Technologies/Services**: Suggest specific libraries, frameworks, or cloud services that could be used.
            -   **Potential Risks**: Identify potential technical challenges or risks (e.g., "API rate limiting from third-party services").
        -   **Success Metrics and KPIs**:
            -   **Primary Metric**: The single most important metric to measure success.
            -   **Secondary/Guardrail Metrics**: Other important metrics to monitor, including those that ensure we're not negatively impacting other areas.
        -   **Priority Level**: P0/P1/P2.
        -   **Dependencies**: List any other features or systems this depends on.

    4.  **User Stories**: For the highest priority features, write 2-3 detailed user stories. Follow the format: "As a [user type], I want [functionality] so that [benefit]", ensuring each story clearly articulates user value.

    5.  **Technical Architecture Overview**: A deeply detailed, high-level system design. You MUST NOT be generic.
        -   **Core Components and Their Interactions**: You MUST specify example microservices such as 'On-Chain Event Listener' and 'Analytics Engine'. You MUST detail their communication protocols, explaining the use cases for REST (e.g., for public client communication) and gRPC (e.g., for high-performance internal microservice communication).
        -   **Data Flow and Storage Requirements**: You MUST suggest a multi-database strategy. For example, suggest PostgreSQL for relational user data, a vector DB (like Pinecone or Weaviate) for semantic search, and a time-series database like TimescaleDB for handling high-volume event data. You MUST also describe a data pipeline architecture, specifically mentioning the use of Kafka to stream data between services.
        -   **API and Integration Points**: You MUST detail the API strategy (e.g., versioned REST APIs, internal GraphQL APIs), describe the use of webhooks for real-time integrations, and list critical third-party integrations, specifically including services like Alchemy (for blockchain node access) and Stripe (for payment processing).

    6.  **Go-to-Market Strategy**: A concrete, actionable plan.
        -   **Target User Personas**: Create and describe specific user personas with names, roles, and pain points. Examples: "Alex, the overwhelmed DAO Community Manager who struggles with scaling support and filtering spam" and "Chloe, the data-driven Web3 Project Founder who needs actionable insights on community engagement and sentiment."
        -   **Tiered Pricing Model**: Propose a detailed, tiered pricing model (e.g., Freemium, Pro, Enterprise). For each tier, break down the specific features included, usage limits (e.g., 'Freemium: 1 connected Discord, 100 on-chain alerts/month', 'Pro: 5 connected accounts, 10,000 alerts/month, basic analytics'), and clear price points. Articulate the core value proposition of upgrading to each tier.
        -   **Phased Rollout Plan**: Outline a clear, phased launch plan with specific objectives, target user counts, key milestones, and success criteria for each phase. Example: 'Alpha: Onboard 10-15 design partners, focus on core feature stability, success is >80% weekly active users.' 'Beta: Scale to 100-200 teams, gather feedback on analytics and pricing, success is achieving first 10 paying customers.' 'Public Launch: Full market release, focus on growth marketing and user acquisition funnels, success is a 5% week-over-week user growth rate.'

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
