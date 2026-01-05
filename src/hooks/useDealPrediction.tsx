import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  daysInStage?: number;
  closeDate?: string;
  owner?: { name: string; initials: string };
}

export interface DealPrediction {
  dealId: number;
  dealName: string;
  company: string;
  currentProbability: number;
  predictedProbability: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  riskFactors: string[];
  opportunities: string[];
  recommendation: string;
  expectedCloseDate: string;
  predictedValue: number;
}

export interface PredictionSummary {
  totalPipelineValue: number;
  weightedPipelineValue: number;
  highConfidenceDeals: number;
  atRiskDeals: number;
  topOpportunity: string;
}

export interface PredictionResult {
  predictions: DealPrediction[];
  summary: PredictionSummary;
}

const PREDICTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deal-prediction`;

export function useDealPrediction() {
  const [predictions, setPredictions] = useState<DealPrediction[]>([]);
  const [summary, setSummary] = useState<PredictionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const predictDeals = useCallback(async (deals: Deal[]) => {
    setIsLoading(true);
    setPredictions([]);
    setSummary(null);

    try {
      const response = await fetch(PREDICTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ deals }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de prédiction');
      }

      const data: PredictionResult = await response.json();
      setPredictions(data.predictions || []);
      setSummary(data.summary || null);

      toast({
        title: 'Prédictions générées',
        description: `${data.predictions?.length || 0} deals analysés avec succès`,
      });

      return data;
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur de prédiction',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
    setSummary(null);
  }, []);

  return {
    predictions,
    summary,
    isLoading,
    predictDeals,
    clearPredictions,
  };
}
