
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('Processing request for product ID:', productId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Enhanced mock data with more realistic inventory scenarios
    const mockProduct = {
      id: productId,
      name: productId === 1 ? 'Wireless Headphones' : productId === 2 ? 'Smartphone Case' : 'Laptop Stand',
      currentStock: productId === 1 ? 8 : productId === 2 ? 3 : 15,
      reorderLevel: productId === 1 ? 10 : productId === 2 ? 5 : 12,
      avgMonthlySales: productId === 1 ? 25 : productId === 2 ? 40 : 18,
      seasonalTrend: productId === 1 ? 'increasing' : productId === 2 ? 'stable' : 'decreasing',
      supplierLeadTime: productId === 1 ? 7 : productId === 2 ? 14 : 5,
      unitCost: productId === 1 ? 89.99 : productId === 2 ? 24.99 : 45.00,
      category: productId === 1 ? 'Electronics' : productId === 2 ? 'Accessories' : 'Office Equipment'
    };

    const mockTransactionHistory = productId === 1 ? [
      { date: '2024-12-15', quantity: 12, type: 'sale' },
      { date: '2024-12-10', quantity: 8, type: 'sale' },
      { date: '2024-12-05', quantity: 25, type: 'purchase' },
      { date: '2024-11-28', quantity: 15, type: 'sale' },
      { date: '2024-11-20', quantity: 6, type: 'sale' }
    ] : productId === 2 ? [
      { date: '2024-12-18', quantity: 18, type: 'sale' },
      { date: '2024-12-12', quantity: 22, type: 'sale' },
      { date: '2024-12-08', quantity: 50, type: 'purchase' },
      { date: '2024-12-01', quantity: 12, type: 'sale' }
    ] : [
      { date: '2024-12-14', quantity: 4, type: 'sale' },
      { date: '2024-12-07', quantity: 2, type: 'sale' },
      { date: '2024-11-30', quantity: 20, type: 'purchase' },
      { date: '2024-11-25', quantity: 3, type: 'sale' }
    ];

    // Create a more detailed and strategic prompt for better AI suggestions
    const prompt = `
    You are an expert inventory management AI consultant with deep knowledge of supply chain optimization, demand forecasting, and risk management. Analyze the following comprehensive product data and provide strategic reorder recommendations.

    PRODUCT ANALYSIS DATA:
    Product: ${mockProduct.name} (${mockProduct.category})
    Current Stock Level: ${mockProduct.currentStock} units
    Reorder Threshold: ${mockProduct.reorderLevel} units
    Average Monthly Sales: ${mockProduct.avgMonthlySales} units
    Market Trend: ${mockProduct.seasonalTrend}
    Supplier Lead Time: ${mockProduct.supplierLeadTime} days
    Unit Cost: $${mockProduct.unitCost}

    RECENT SALES & PURCHASE HISTORY:
    ${mockTransactionHistory.map(t => `• ${t.date}: ${t.type.toUpperCase()} - ${t.quantity} units`).join('\n')}

    ANALYSIS REQUIREMENTS:
    Consider these critical factors in your recommendation:
    1. Safety stock requirements based on demand variability
    2. Economic Order Quantity (EOQ) principles
    3. Seasonal demand patterns and market trends
    4. Cash flow impact and inventory carrying costs
    5. Risk of stockouts vs. overstock situations
    6. Supplier reliability and lead time variations

    RESPONSE FORMAT:
    Provide your analysis in this exact JSON format:
    {
      "recommendedQuantity": [number between 10-100],
      "reasoning": "[2-3 detailed sentences explaining your calculation methodology, key factors considered, and business rationale]",
      "riskLevel": "[Low/Medium/High]",
      "nextReviewDate": "[YYYY-MM-DD format, 2-4 weeks from today]",
      "costImpact": "[estimated cost impact in dollars]",
      "stockoutRisk": "[percentage likelihood of stockout if recommendation not followed]",
      "alternativeStrategy": "[brief alternative approach if budget is constrained]"
    }

    Be precise, data-driven, and consider both short-term needs and long-term inventory optimization.
    `;

    console.log('Calling Gemini API with enhanced prompt');

    // Call Gemini API with correct endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);
    
    // Enhanced JSON parsing with better error handling
    let suggestion;
    try {
      // Clean the response text and extract JSON
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        suggestion = JSON.parse(jsonMatch[0]);
        
        // Validate required fields and add defaults if missing
        if (!suggestion.recommendedQuantity || !suggestion.reasoning || !suggestion.riskLevel) {
          throw new Error('Missing required fields in AI response');
        }
        
        // Ensure reasonable bounds for recommended quantity
        if (suggestion.recommendedQuantity < 5) suggestion.recommendedQuantity = 5;
        if (suggestion.recommendedQuantity > 200) suggestion.recommendedQuantity = 200;
        
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Original response:', generatedText);
      
      // Enhanced fallback with more intelligent defaults based on product data
      const salesVelocity = mockProduct.avgMonthlySales / 30; // daily sales rate
      const leadTimeDemand = Math.ceil(salesVelocity * mockProduct.supplierLeadTime);
      const safetyStock = Math.ceil(leadTimeDemand * 0.5); // 50% safety stock
      const recommendedQty = leadTimeDemand + safetyStock;
      
      suggestion = {
        recommendedQuantity: Math.max(recommendedQty, mockProduct.reorderLevel * 2),
        reasoning: `Based on your current sales velocity of ${salesVelocity.toFixed(1)} units/day and ${mockProduct.supplierLeadTime}-day lead time, this quantity ensures adequate coverage plus safety stock. Current stock of ${mockProduct.currentStock} is ${mockProduct.currentStock <= mockProduct.reorderLevel ? 'below' : 'near'} your reorder threshold.`,
        riskLevel: mockProduct.currentStock <= mockProduct.reorderLevel ? "High" : "Medium",
        nextReviewDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        costImpact: `$${(recommendedQty * mockProduct.unitCost).toFixed(2)}`,
        stockoutRisk: mockProduct.currentStock <= mockProduct.reorderLevel ? "75%" : "25%",
        alternativeStrategy: "Consider smaller, more frequent orders to reduce carrying costs"
      };
    }

    console.log('Final suggestion:', suggestion);

    return new Response(JSON.stringify({ 
      success: true, 
      suggestion,
      productInfo: mockProduct,
      analysisTimestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-reorder-suggestions function:', error);
    
    // More detailed error response
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      troubleshooting: 'Check API key configuration and network connectivity'
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
