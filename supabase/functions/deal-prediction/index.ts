import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  daysInStage?: number;
  closeDate?: string;
  owner?: { name: string };
}

interface PredictionResult {
  dealId: number;
  dealName: string;
  company: string;
  currentProbability: number;
  predictedProbability: number;
  confidence: number;
  trend: "up" | "down" | "stable";
  riskFactors: string[];
  opportunities: string[];
  recommendation: string;
  expectedCloseDate: string;
  predictedValue: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autorisé - authentification requise" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { deals } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!deals || !Array.isArray(deals) || deals.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucun deal à analyser" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing ${deals.length} deals for prediction...`);

    const systemPrompt = `Tu es un expert en analyse prédictive de ventes CRM. Tu analyses les deals et prédit leur probabilité de conclusion.

Pour chaque deal, tu dois fournir:
1. Une probabilité prédite (0-100%) basée sur les signaux
2. Un niveau de confiance dans ta prédiction (0-100%)
3. La tendance (up/down/stable)
4. Les facteurs de risque identifiés
5. Les opportunités détectées
6. Une recommandation d'action concrète
7. Une date de clôture estimée
8. Une valeur prédite (peut différer de la valeur actuelle)

Analyse les patterns suivants:
- Stage avancé = probabilité plus élevée
- Temps trop long dans un stage = risque
- Valeur élevée = cycle plus long
- Historique de l'entreprise
- Saisonnalité

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.`;

    const userPrompt = `Analyse ces deals et prédit leur probabilité de conclusion:

${JSON.stringify(deals, null, 2)}

Réponds avec un tableau JSON de prédictions pour chaque deal avec cette structure:
{
  "predictions": [
    {
      "dealId": number,
      "dealName": string,
      "company": string,
      "currentProbability": number,
      "predictedProbability": number,
      "confidence": number,
      "trend": "up" | "down" | "stable",
      "riskFactors": string[],
      "opportunities": string[],
      "recommendation": string,
      "expectedCloseDate": string (format ISO),
      "predictedValue": number
    }
  ],
  "summary": {
    "totalPipelineValue": number,
    "weightedPipelineValue": number,
    "highConfidenceDeals": number,
    "atRiskDeals": number,
    "topOpportunity": string
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes dépassée, réessayez plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits IA épuisés, veuillez recharger." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erreur du service IA");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Réponse IA vide");
    }

    console.log("AI response received, parsing...");

    // Parse JSON response
    let predictions;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      predictions = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Erreur de parsing de la réponse IA");
    }

    console.log("Predictions generated successfully");

    return new Response(JSON.stringify(predictions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Deal prediction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
