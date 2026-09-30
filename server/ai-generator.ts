import { GoogleGenAI, Type } from '@google/genai';
import { PlanRequestData, PlanResultData, CategoryBreakdown, BudgetItem } from '../src/types';
import { generateShoppingLinks } from './db';

// Deterministic fallback generator as requested in prompt Section 23
export function generateFallbackPlan(request: PlanRequestData): PlanResultData {
  const { plan_type, total_budget, details } = request;
  const budget = Math.max(1000, Number(total_budget) || 10000);

  if (plan_type === 'home') {
    const room = details.room || 'Living Room';
    const style = details.stylePreference || 'Modern';

    // Home fallback ratios:
    // Furniture: 35%, Dining: 18%, Decor & Essentials: 20%, Lighting: 15%, Fans: 12% = 100%
    const furnitureBudget = Math.round(budget * 0.35);
    const diningBudget = Math.round(budget * 0.18);
    const decorBudget = Math.round(budget * 0.20);
    const lightingBudget = Math.round(budget * 0.15);
    const fansBudget = budget - (furnitureBudget + diningBudget + decorBudget + lightingBudget); // 12% remainder

    const breakdown: CategoryBreakdown[] = [
      {
        category: 'Furniture',
        allocated_budget: furnitureBudget,
        percentage_of_budget: 35,
        items: [
          {
            name: `${style} Multi-Utility Seating & Storage Set`,
            category: 'Furniture',
            estimated_price: Math.round(furnitureBudget * 0.72),
            quantity: 1,
            total_price: Math.round(furnitureBudget * 0.72),
            reason: `Core ergonomic seating suited for a ${room} matching ${style} decor.`,
            shopping_links: generateShoppingLinks(`${style} Seating Furniture for ${room}`),
          },
          {
            name: 'Modular Coffee & Accent End Table',
            category: 'Furniture',
            estimated_price: furnitureBudget - Math.round(furnitureBudget * 0.72),
            quantity: 1,
            total_price: furnitureBudget - Math.round(furnitureBudget * 0.72),
            reason: 'Compact functional table for books, beverages, and remotes.',
            shopping_links: generateShoppingLinks(`${style} Coffee Table wood metal`),
          },
        ],
      },
      {
        category: 'Lighting',
        allocated_budget: lightingBudget,
        percentage_of_budget: 15,
        items: [
          {
            name: 'Smart Energy-Saving LED Ambient Ceiling Fixture',
            category: 'Lighting',
            estimated_price: Math.round(lightingBudget * 0.65),
            quantity: 1,
            total_price: Math.round(lightingBudget * 0.65),
            reason: 'High-lumen primary illumination with adjustable warmth settings.',
            shopping_links: generateShoppingLinks('Smart LED Ceiling Light warm white'),
          },
          {
            name: 'Architectural Accent Wall Sconce / Table Lamp',
            category: 'Lighting',
            estimated_price: lightingBudget - Math.round(lightingBudget * 0.65),
            quantity: 1,
            total_price: lightingBudget - Math.round(lightingBudget * 0.65),
            reason: 'Provides soft evening background ambiance without harsh glare.',
            shopping_links: generateShoppingLinks(`${style} Accent Lamp warm light`),
          },
        ],
      },
      {
        category: 'Fans & Air Circulation',
        allocated_budget: fansBudget,
        percentage_of_budget: 12,
        items: [
          {
            name: 'BLDC Ultra Energy Efficient Ceiling Fan with Remote',
            category: 'Fans & Air Circulation',
            estimated_price: fansBudget,
            quantity: 1,
            total_price: fansBudget,
            reason: 'Saves up to 65% power consumption with whisper-quiet motor.',
            shopping_links: generateShoppingLinks('BLDC Ceiling Fan Remote control energy saver'),
          },
        ],
      },
      {
        category: 'Dining & Kitchen Essentials',
        allocated_budget: diningBudget,
        percentage_of_budget: 18,
        items: [
          {
            name: 'Compact Dining Table & Cushioned Chairs Ensemble',
            category: 'Dining & Kitchen Essentials',
            estimated_price: diningBudget,
            quantity: 1,
            total_price: diningBudget,
            reason: 'Durable finish designed for daily meals and easy maintenance.',
            shopping_links: generateShoppingLinks('Compact Dining Table Set solid wood'),
          },
        ],
      },
      {
        category: 'Decor & Essentials',
        allocated_budget: decorBudget,
        percentage_of_budget: 20,
        items: [
          {
            name: 'Soft Textured Low-Pile Area Rug',
            category: 'Decor & Essentials',
            estimated_price: Math.round(decorBudget * 0.55),
            quantity: 1,
            total_price: Math.round(decorBudget * 0.55),
            reason: 'Anchors the room layout and adds warm underfoot comfort.',
            shopping_links: generateShoppingLinks('Modern Geometric Area Rug living room'),
          },
          {
            name: 'Curated Wall Art Canvas & Ceramic Planter Set',
            category: 'Decor & Essentials',
            estimated_price: decorBudget - Math.round(decorBudget * 0.55),
            quantity: 1,
            total_price: decorBudget - Math.round(decorBudget * 0.55),
            reason: 'Elevates visual aesthetic without recurring maintenance costs.',
            shopping_links: generateShoppingLinks('Framed Canvas Wall Art set home decor'),
          },
        ],
      },
    ];

    return {
      title: `Smart Home Plan for ₹${budget.toLocaleString('en-IN')}`,
      summary: `A balanced, value-optimized home furnishing strategy for ${room} (${style} style). All items strictly stay within your ₹${budget.toLocaleString('en-IN')} budget.`,
      budget_used: budget,
      budget_remaining: 0,
      budget_breakdown: breakdown,
      tips: [
        'Compare product ratings and seller warranties before placing orders.',
        'Look out for bundled furniture deals on major online marketplaces for extra discounts.',
        'Measure room dimensions and doorway width before scheduling furniture delivery.',
        'Prioritize core utility items (sofa, fan, primary light) first.',
      ],
      disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
      isFallback: true,
    };
  }

  if (plan_type === 'party') {
    const partyType = details.partyType || 'Celebration';
    const guests = details.guests || 25;

    // Party fallback ratios:
    // Venue: 25%, Food & Drinks: 35%, Decorations: 15%, Entertainment: 15%, Contingency: 10% = 100%
    const venueBudget = Math.round(budget * 0.25);
    const foodBudget = Math.round(budget * 0.35);
    const decorBudget = Math.round(budget * 0.15);
    const entertainmentBudget = Math.round(budget * 0.15);
    const contingencyBudget = budget - (venueBudget + foodBudget + decorBudget + entertainmentBudget); // 10%

    const breakdown: CategoryBreakdown[] = [
      {
        category: 'Venue & Arrangement',
        allocated_budget: venueBudget,
        percentage_of_budget: 25,
        items: [
          {
            name: 'Seating, Canopy & Space Rental Arrangement',
            category: 'Venue & Arrangement',
            estimated_price: venueBudget,
            quantity: 1,
            total_price: venueBudget,
            reason: `Reserved comfortable seating setup scaled for ${guests} guests.`,
            shopping_links: generateShoppingLinks('Party event seating tables rental service'),
          },
        ],
      },
      {
        category: 'Food & Drinks',
        allocated_budget: foodBudget,
        percentage_of_budget: 35,
        items: [
          {
            name: 'Party Catering / Snack Platters Spread',
            category: 'Food & Drinks',
            estimated_price: Math.round(foodBudget * 0.75),
            quantity: 1,
            total_price: Math.round(foodBudget * 0.75),
            reason: `Appetizers and main bites calculated at approx. ₹${Math.round((foodBudget * 0.75) / guests)}/guest.`,
            shopping_links: generateShoppingLinks('Party bulk catering food platters snacks'),
          },
          {
            name: 'Refreshing Beverage & Mocktail Station',
            category: 'Food & Drinks',
            estimated_price: foodBudget - Math.round(foodBudget * 0.75),
            quantity: 1,
            total_price: foodBudget - Math.round(foodBudget * 0.75),
            reason: 'Chilled signature drinks with fruit infusions and ice dispensers.',
            shopping_links: generateShoppingLinks('Party drinks dispensers party supplies'),
          },
        ],
      },
      {
        category: 'Decorations',
        allocated_budget: decorBudget,
        percentage_of_budget: 15,
        items: [
          {
            name: 'Themed Photo Backdrop & Balloon Arch Kit',
            category: 'Decorations',
            estimated_price: Math.round(decorBudget * 0.65),
            quantity: 1,
            total_price: Math.round(decorBudget * 0.65),
            reason: `Creates focal photo zone personalized for a ${partyType}.`,
            shopping_links: generateShoppingLinks(`${partyType} backdrop and balloon garland kit`),
          },
          {
            name: 'LED Fairy String Lights & Table Accents',
            category: 'Decorations',
            estimated_price: decorBudget - Math.round(decorBudget * 0.65),
            quantity: 1,
            total_price: decorBudget - Math.round(decorBudget * 0.65),
            reason: 'Warm ambient lighting enhancing evening party vibes.',
            shopping_links: generateShoppingLinks('Warm LED fairy lights 50ft party decor'),
          },
        ],
      },
      {
        category: 'Entertainment',
        allocated_budget: entertainmentBudget,
        percentage_of_budget: 15,
        items: [
          {
            name: 'High-Output Bluetooth Party Speaker with Wireless Mic',
            category: 'Entertainment',
            estimated_price: entertainmentBudget,
            quantity: 1,
            total_price: entertainmentBudget,
            reason: 'Crystal-clear sound for curated playlists, batch toasts, and games.',
            shopping_links: generateShoppingLinks('Party Bluetooth Speaker with Wireless Microphone'),
          },
        ],
      },
      {
        category: 'Contingency & Supplies',
        allocated_budget: contingencyBudget,
        percentage_of_budget: 10,
        items: [
          {
            name: 'Eco-Friendly Dinnerware & Buffer Emergency Fund',
            category: 'Contingency & Supplies',
            estimated_price: contingencyBudget,
            quantity: 1,
            total_price: contingencyBudget,
            reason: 'Biodegradable plates, cups, tissue packs, and reserve funds for last-minute supplies.',
            shopping_links: generateShoppingLinks('Eco friendly party disposable plates cups bulk'),
          },
        ],
      },
    ];

    return {
      title: `Smart Party Plan for ₹${budget.toLocaleString('en-IN')}`,
      summary: `A complete, festive budget blueprint for your ${partyType} catering to ${guests} guests without exceeding ₹${budget.toLocaleString('en-IN')}.`,
      budget_used: budget,
      budget_remaining: 0,
      budget_breakdown: breakdown,
      tips: [
        'Confirm guest RSVP headcount 48 hours prior to finalize exact food trays.',
        'Curate your music playlists offline in advance to avoid streaming buffering during the party.',
        'Keep the 10% contingency budget untouched until the actual event day.',
      ],
      disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
      isFallback: true,
    };
  }

  // Jewelry fallback
  const jewelryType = details.jewelryType || 'Complete Set';
  const metal = details.preferredMetal || 'Gold';
  const occasion = details.occasion || 'Wedding';

  // Jewelry fallback ratios:
  // Main Piece: 55%, Matching Piece: 25%, Care & Packaging: 10%, Buffer: 10% = 100%
  const mainBudget = Math.round(budget * 0.55);
  const matchingBudget = Math.round(budget * 0.25);
  const careBudget = Math.round(budget * 0.10);
  const bufferBudget = budget - (mainBudget + matchingBudget + careBudget); // 10%

  const breakdown: CategoryBreakdown[] = [
    {
      category: 'Main Statement Piece',
      allocated_budget: mainBudget,
      percentage_of_budget: 55,
      items: [
        {
          name: `Handcrafted ${metal} ${details.mainPiece || jewelryType}`,
          category: 'Main Statement Piece',
          estimated_price: mainBudget,
          quantity: 1,
          total_price: mainBudget,
          reason: `Centerpiece crafted in ${metal} suitable for ${occasion} with hallmark certification.`,
          shopping_links: generateShoppingLinks(`${metal} ${jewelryType} ${occasion} hallmark`),
        },
      ],
    },
    {
      category: 'Matching Piece',
      allocated_budget: matchingBudget,
      percentage_of_budget: 25,
      items: [
        {
          name: `Matching ${metal} Companion Jewelry (Earrings / Ring / Pendant)`,
          category: 'Matching Piece',
          estimated_price: matchingBudget,
          quantity: 1,
          total_price: matchingBudget,
          reason: 'Harmonious design motifs pairing seamlessly with the primary piece.',
          shopping_links: generateShoppingLinks(`Matching ${metal} earrings pendant set`),
        },
      ],
    },
    {
      category: 'Care & Packaging',
      allocated_budget: careBudget,
      percentage_of_budget: 10,
      items: [
        {
          name: 'Velvet Anti-Tarnish Heirloom Jewelry Chest & Polishing Kit',
          category: 'Care & Packaging',
          estimated_price: careBudget,
          quantity: 1,
          total_price: careBudget,
          reason: 'Preserves shine, prevents scratches, and safeguards precious metal luster.',
          shopping_links: generateShoppingLinks('Anti tarnish velvet jewelry storage organizer box'),
        },
      ],
    },
    {
      category: 'Buffer & Hallmarking Charges',
      allocated_budget: bufferBudget,
      percentage_of_budget: 10,
      items: [
        {
          name: 'Making Charges, GST & Bullion Fluctuation Buffer',
          category: 'Buffer & Hallmarking Charges',
          estimated_price: bufferBudget,
          quantity: 1,
          total_price: bufferBudget,
          reason: 'Reserved to accommodate daily gold/silver price shifts and statutory tax.',
          shopping_links: generateShoppingLinks('Gold jewelry hallmark verification services'),
        },
      ],
    },
  ];

  return {
    title: `Smart Jewelry Plan for ₹${budget.toLocaleString('en-IN')}`,
    summary: `A curated ${metal} jewelry allocation for ${occasion} ensuring certified hallmark quality and timeless value within ₹${budget.toLocaleString('en-IN')}.`,
    budget_used: budget,
    budget_remaining: 0,
    budget_breakdown: breakdown,
    tips: [
      'Always insist on BIS Hallmarking (with 6-digit HUID) and a tax invoice for authenticity.',
      'Check current bullion rate per gram before finalizing the jeweler making charge.',
      'Store each item separately in anti-tarnish velvet pouches to prevent metal friction.',
    ],
    disclaimer: 'Precious metal prices fluctuate daily based on bullion indices and making charges. Verify live market rates and hallmarks before purchase.',
    isFallback: true,
  };
}

// Gemini AI Plan Generator
export async function generateAIPlan(request: PlanRequestData): Promise<PlanResultData> {
  const apiKey = process.env.GEMINI_API_KEY;
  const totalBudget = Math.max(1000, Number(request.total_budget) || 10000);

  if (!apiKey) {
    console.log('No GEMINI_API_KEY detected, using deterministic fallback plan.');
    return generateFallbackPlan(request);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const categoryDetails = JSON.stringify(request.details, null, 2);

    const prompt = `You are PocketSmart AI, an elite financial planner and lifestyle procurement assistant.
The user wants a smart budget plan in Indian Rupees (₹) for their request:
- Plan Category: ${request.plan_type.toUpperCase()}
- Total Budget: ₹${totalBudget.toLocaleString('en-IN')} (${totalBudget} INR)
- User Preferences and Details:
${categoryDetails}

CRITICAL RULES:
1. The sum of all items ("budget_used") MUST NEVER EXCEED the total budget of ₹${totalBudget}.
2. Always leave a prudent buffer amount (between 2% and 8% of the total budget) in "budget_remaining", such that budget_used + budget_remaining = ${totalBudget}.
3. Create 3 to 5 realistic, logical budget breakdown categories suited for this ${request.plan_type} plan.
4. For each category, provide 1 to 3 specific, realistic product or service items with accurate market prices in India.
5. Provide actionable, practical shopping and budgeting tips for this specific situation.
6. Return purely valid JSON adhering strictly to the schema provided.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'A catchy, descriptive title for the plan with budget (e.g., Smart Living Room Setup for ₹50,000)',
            },
            summary: {
              type: Type.STRING,
              description: 'A short 2-3 sentence explanation of the strategy and choices.',
            },
            budget_used: {
              type: Type.INTEGER,
              description: 'Total amount spent across all items in INR (must be <= total_budget).',
            },
            budget_remaining: {
              type: Type.INTEGER,
              description: 'Remaining unallocated buffer amount in INR.',
            },
            budget_breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: {
                    type: Type.STRING,
                    description: 'Name of the budget category (e.g. Furniture, Lighting, Food & Drinks).',
                  },
                  allocated_budget: {
                    type: Type.INTEGER,
                    description: 'Budget allocated for this category in INR.',
                  },
                  percentage_of_budget: {
                    type: Type.INTEGER,
                    description: 'Percentage of the total budget (e.g., 35).',
                  },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: {
                          type: Type.STRING,
                          description: 'Specific product/service name.',
                        },
                        category: {
                          type: Type.STRING,
                          description: 'Category of item.',
                        },
                        estimated_price: {
                          type: Type.INTEGER,
                          description: 'Price per unit in INR.',
                        },
                        quantity: {
                          type: Type.INTEGER,
                          description: 'Number of units.',
                        },
                        reason: {
                          type: Type.STRING,
                          description: 'Clear reason why this item is recommended and how it fits the budget.',
                        },
                      },
                      required: ['name', 'category', 'estimated_price', 'quantity', 'reason'],
                    },
                  },
                },
                required: ['category', 'allocated_budget', 'percentage_of_budget', 'items'],
              },
            },
            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'List of 4 practical, specific saving and smart shopping tips.',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Standard pricing disclaimer.',
            },
          },
          required: ['title', 'summary', 'budget_used', 'budget_remaining', 'budget_breakdown', 'tips'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      console.warn('Empty response from Gemini, falling back.');
      return generateFallbackPlan(request);
    }

    const parsed = JSON.parse(text) as PlanResultData;

    // Safety post-processing and link generation
    let totalItemsCost = 0;
    const processedBreakdown: CategoryBreakdown[] = (parsed.budget_breakdown || []).map(cat => {
      let catSum = 0;
      const processedItems: BudgetItem[] = (cat.items || []).map(item => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const unitPrice = Math.max(10, Math.round(Number(item.estimated_price) || 100));
        const itemTotal = unitPrice * qty;
        catSum += itemTotal;

        return {
          name: item.name,
          category: item.category || cat.category,
          estimated_price: unitPrice,
          quantity: qty,
          total_price: itemTotal,
          reason: item.reason || 'Fits within the allocated budget category.',
          shopping_links: generateShoppingLinks(item.name),
        };
      });

      totalItemsCost += catSum;
      return {
        category: cat.category,
        allocated_budget: catSum,
        percentage_of_budget: Math.round((catSum / totalBudget) * 100),
        items: processedItems,
      };
    });

    // Check if totalItemsCost exceeded budget or is wildly off
    if (totalItemsCost > totalBudget || totalItemsCost <= 0) {
      // Scale down proportionally
      const scaleFactor = (totalBudget * 0.94) / Math.max(1, totalItemsCost);
      totalItemsCost = 0;

      for (const cat of processedBreakdown) {
        let catSum = 0;
        for (const item of cat.items) {
          item.estimated_price = Math.max(50, Math.round(item.estimated_price * scaleFactor));
          item.total_price = item.estimated_price * item.quantity;
          catSum += item.total_price;
        }
        cat.allocated_budget = catSum;
        cat.percentage_of_budget = Math.round((catSum / totalBudget) * 100);
        totalItemsCost += catSum;
      }
    }

    const finalBudgetUsed = Math.min(totalBudget, totalItemsCost);
    const finalBudgetRemaining = Math.max(0, totalBudget - finalBudgetUsed);

    return {
      title: parsed.title || `Smart ${request.plan_type.toUpperCase()} Plan for ₹${totalBudget.toLocaleString('en-IN')}`,
      summary: parsed.summary || 'A custom plan optimized to deliver the highest value within your budget limits.',
      budget_used: finalBudgetUsed,
      budget_remaining: finalBudgetRemaining,
      budget_breakdown: processedBreakdown,
      tips: parsed.tips?.length ? parsed.tips : [
        'Compare prices across major e-commerce platforms before purchasing.',
        'Keep a small emergency buffer for unexpected shipping or handling charges.',
        'Prioritize core essential purchases before decorative add-ons.',
        'Check seller ratings and return policies before making commitments.',
      ],
      disclaimer: parsed.disclaimer || 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
      isFallback: false,
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return generateFallbackPlan(request);
  }
}
