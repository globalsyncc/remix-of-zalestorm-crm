import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Sparkles,
  Target,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Loader2,
  Zap,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { DealPrediction, PredictionSummary } from '@/hooks/useDealPrediction';

interface DealPredictionPanelProps {
  predictions: DealPrediction[];
  summary: PredictionSummary | null;
  isLoading: boolean;
  onPredict: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-success" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'text-success';
  if (confidence >= 60) return 'text-warning';
  return 'text-destructive';
};

const getProbabilityChange = (current: number, predicted: number) => {
  const diff = predicted - current;
  if (diff > 0) return { text: `+${diff}%`, color: 'text-success' };
  if (diff < 0) return { text: `${diff}%`, color: 'text-destructive' };
  return { text: '0%', color: 'text-muted-foreground' };
};

export function DealPredictionPanel({
  predictions,
  summary,
  isLoading,
  onPredict,
}: DealPredictionPanelProps) {
  const [expandedDeals, setExpandedDeals] = useState<Set<number>>(new Set());

  const toggleDeal = (dealId: number) => {
    setExpandedDeals((prev) => {
      const next = new Set(prev);
      if (next.has(dealId)) {
        next.delete(dealId);
      } else {
        next.add(dealId);
      }
      return next;
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Prédiction IA</h3>
              <p className="text-xs text-muted-foreground">Analyse prédictive des deals</p>
            </div>
          </div>
          <Button
            onClick={onPredict}
            disabled={isLoading}
            size="sm"
            className="gradient-primary shadow-glow"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-1.5" />
            )}
            {isLoading ? 'Analyse...' : 'Prédire'}
          </Button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-border/50 bg-muted/30"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Pipeline Total</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(summary.totalPipelineValue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Valeur Pondérée</p>
              <p className="text-lg font-bold text-success">
                {formatCurrency(summary.weightedPipelineValue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Haute Confiance</p>
              <p className="text-lg font-bold text-primary">{summary.highConfidenceDeals}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">À Risque</p>
              <p className="text-lg font-bold text-destructive">{summary.atRiskDeals}</p>
            </div>
          </div>
          {summary.topOpportunity && (
            <div className="mt-3 p-2 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-success" />
                <p className="text-sm text-success font-medium">
                  Top opportunité: {summary.topOpportunity}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Predictions List */}
      <ScrollArea className="max-h-[500px]">
        <div className="p-4 space-y-3">
          {isLoading && predictions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div className="relative">
                <Brain className="w-12 h-12 opacity-20" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <p className="mt-4 text-sm">Analyse en cours...</p>
              <p className="text-xs mt-1">L'IA prédit la probabilité de chaque deal</p>
            </div>
          )}

          {!isLoading && predictions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Brain className="w-12 h-12 opacity-20" />
              <p className="mt-4 text-sm">Cliquez sur "Prédire" pour analyser vos deals</p>
            </div>
          )}

          <AnimatePresence>
            {predictions.map((prediction, index) => {
              const isExpanded = expandedDeals.has(prediction.dealId);
              const change = getProbabilityChange(
                prediction.currentProbability,
                prediction.predictedProbability
              );

              return (
                <motion.div
                  key={prediction.dealId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-lg border border-border/50 overflow-hidden"
                >
                  {/* Deal Header */}
                  <div
                    className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleDeal(prediction.dealId)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground truncate">
                            {prediction.dealName}
                          </h4>
                          {getTrendIcon(prediction.trend)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {prediction.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-foreground">
                              {prediction.predictedProbability}%
                            </span>
                            <span className={cn('text-xs font-medium', change.color)}>
                              {change.text}
                            </span>
                          </div>
                          <p className={cn('text-xs', getConfidenceColor(prediction.confidence))}>
                            Confiance: {prediction.confidence}%
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span>Avant: {prediction.currentProbability}%</span>
                        <span>→</span>
                        <span className="text-foreground font-medium">
                          Prédit: {prediction.predictedProbability}%
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={prediction.predictedProbability} className="h-2" />
                        <div
                          className="absolute top-0 h-2 w-0.5 bg-muted-foreground/50"
                          style={{ left: `${prediction.currentProbability}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/50"
                      >
                        <div className="p-3 space-y-3 bg-muted/20">
                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-success" />
                              <div>
                                <p className="text-xs text-muted-foreground">Valeur prédite</p>
                                <p className="font-semibold">
                                  {formatCurrency(prediction.predictedValue)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-xs text-muted-foreground">Clôture estimée</p>
                                <p className="font-semibold">
                                  {formatDate(prediction.expectedCloseDate)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Risk Factors */}
                          {prediction.riskFactors.length > 0 && (
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-destructive mb-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span className="font-medium">Facteurs de risque</span>
                              </div>
                              <ul className="space-y-1">
                                {prediction.riskFactors.map((risk, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-muted-foreground pl-5 relative before:content-['•'] before:absolute before:left-2 before:text-destructive"
                                  >
                                    {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Opportunities */}
                          {prediction.opportunities.length > 0 && (
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-success mb-1.5">
                                <Lightbulb className="w-3.5 h-3.5" />
                                <span className="font-medium">Opportunités</span>
                              </div>
                              <ul className="space-y-1">
                                {prediction.opportunities.map((opp, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-muted-foreground pl-5 relative before:content-['•'] before:absolute before:left-2 before:text-success"
                                  >
                                    {opp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recommendation */}
                          <div className="p-2 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-start gap-2">
                              <Target className="w-4 h-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-primary mb-0.5">
                                  Recommandation
                                </p>
                                <p className="text-xs text-foreground">
                                  {prediction.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
