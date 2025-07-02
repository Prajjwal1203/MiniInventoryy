
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Brain, AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReorderSuggestion {
  recommendedQuantity: number;
  reasoning: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  nextReviewDate: string;
  costImpact?: string;
  stockoutRisk?: string;
  alternativeStrategy?: string;
}

interface ReorderSuggestionsProps {
  productId: number;
  productName: string;
  currentStock: number;
}

export const ReorderSuggestions = ({ productId, productName, currentStock }: ReorderSuggestionsProps) => {
  const [suggestion, setSuggestion] = useState<ReorderSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSuggestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Generating AI suggestion for product:', productId);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-reorder-suggestions', {
        body: { productId }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message);
      }

      console.log('Function response:', data);

      if (data.success) {
        setSuggestion(data.suggestion);
        toast({
          title: "AI Analysis Complete",
          description: "Smart reorder recommendation has been generated with detailed insights.",
        });
      } else {
        throw new Error(data.error || 'Failed to generate AI recommendation');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Error generating suggestion:', err);
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'default';
      case 'Medium': return 'secondary';
      case 'High': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      case 'Medium': return <Clock className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Inventory Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Get intelligent reorder recommendations for <strong>{productName}</strong> powered by advanced AI analysis of sales patterns, market trends, and inventory optimization principles.
        </div>

        {!suggestion && !loading && (
          <Button onClick={generateSuggestion} className="w-full">
            <Brain className="h-4 w-4 mr-2" />
            Generate Smart Recommendation
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Analyzing inventory data with AI...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestion && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Current Stock</div>
                <div className="text-2xl font-bold text-blue-600">{currentStock}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">AI Recommended</div>
                <div className="text-2xl font-bold text-green-600">{suggestion.recommendedQuantity}</div>
              </div>
            </div>

       
            {(suggestion.costImpact || suggestion.stockoutRisk) && (
              <div className="grid grid-cols-2 gap-4">
                {suggestion.costImpact && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Investment
                    </div>
                    <div className="text-lg font-bold text-yellow-600">{suggestion.costImpact}</div>
                  </div>
                )}
                {suggestion.stockoutRisk && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Stockout Risk
                    </div>
                    <div className="text-lg font-bold text-red-600">{suggestion.stockoutRisk}</div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Assessment:</span>
                <Badge variant={getRiskBadgeVariant(suggestion.riskLevel)} className="gap-1">
                  {getRiskIcon(suggestion.riskLevel)}
                  {suggestion.riskLevel} Risk
                </Badge>
              </div>

              <div>
                <span className="text-sm font-medium">AI Strategic Analysis:</span>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{suggestion.reasoning}</p>
              </div>

              {suggestion.alternativeStrategy && (
                <div>
                  <span className="text-sm font-medium">Alternative Strategy:</span>
                  <p className="text-sm text-muted-foreground mt-1 italic">{suggestion.alternativeStrategy}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Next Review:</span>
                <span className="text-muted-foreground">{new Date(suggestion.nextReviewDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={generateSuggestion} variant="outline" className="flex-1">
                <Brain className="h-4 w-4 mr-2" />
                Refresh Analysis
              </Button>
              <Button className="flex-1">
                Apply Recommendation
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
