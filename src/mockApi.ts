import { 
  Company, 
  SearchResponse, 
  SearchAssumptions, 
  UploadMatchResult, 
  EnrichmentResult, 
  EnrichmentEstimate,
  ContactEnrichmentSettings,
  Segment,
  Bookmark,
  Contact,
  OutreachMessage,
  OutreachSequence,
  Campaign,
  EnrichedProfile,
  Product,
  Pricing,
  CampaignDetail,
  CampaignRecipient,
  CampaignRecipientEvent,
  Lead,
  LeadEvent,
  Quote,
  EnrichmentRulesSettings,
  CreditBalance,
  CreditConsumptionEvent
} from './types';

// Mock Companies Data
export const mockCompanies: Company[] = [
  {
    companyId: 'c_001',
    name: 'EuroSpice GmbH',
    commodities: ['Pepper', 'Spices'],
    hqCountry: 'DE',
    originCountries: ['VN', 'ID'],
    destinationCountries: ['NL', 'DE', 'FR'],
    profileType: 'Importer',
    industry: 'Food Import/Distribution',
    matchScore: 92
  },
  {
    companyId: 'c_002',
    name: 'Mediterranean Imports Ltd',
    commodities: ['Pepper', 'Herbs'],
    hqCountry: 'ES',
    originCountries: ['TR', 'GR'],
    destinationCountries: ['ES', 'IT', 'FR'],
    profileType: 'Importer',
    industry: 'Food Import/Distribution',
    matchScore: 88
  },
  {
    companyId: 'c_003',
    name: 'Nordic Food Solutions',
    commodities: ['Pepper', 'Spices'],
    hqCountry: 'SE',
    originCountries: ['VN', 'IN'],
    destinationCountries: ['SE', 'NO', 'DK'],
    profileType: 'Distributor',
    industry: 'Food Distribution',
    matchScore: 84
  },
  {
    companyId: 'c_004',
    name: 'Atlantic Spice Co',
    commodities: ['Pepper', 'Turmeric'],
    hqCountry: 'US',
    originCountries: ['IN', 'VN'],
    destinationCountries: ['US', 'CA'],
    profileType: 'Importer',
    industry: 'Spice Trading',
    matchScore: 81
  },
  {
    companyId: 'c_005',
    name: 'Asia Pacific Trading',
    commodities: ['Pepper', 'Cardamom'],
    hqCountry: 'SG',
    originCountries: ['IN', 'VN', 'ID'],
    destinationCountries: ['SG', 'MY', 'TH'],
    profileType: 'Trader',
    industry: 'Commodity Trading',
    matchScore: 79
  }
];

// Mock Leads Data
export const mockLeads: Lead[] = [
  {
    id: 'lead_001',
    companyId: 'c_001',
    companyName: 'EuroSpice GmbH',
    contactId: 'contact_001',
    contactName: 'Anna Keller',
    email: 'anna.keller@eurospice.de',
    source: 'Campaign',
    status: 'Qualified',
    statusReason: 'Replied to campaign with interest in ASTA 500 pepper',
    interestCommodity: 'Black Pepper',
    interestSpec: 'ASTA 500, 500g pouches',
    estimatedValue: 25000,
    nextBestAction: 'Send product samples',
    dueDate: '2024-02-15',
    notes: 'Very interested in premium quality. Mentioned they need consistent supply for Q2.',
    attachments: [],
    timeline: [
      {
        id: 'event_001',
        type: 'lead_created',
        timestamp: '2024-01-15T09:00:00Z',
        description: 'Lead created from campaign reply',
        details: { campaignId: 'campaign_1' }
      },
      {
        id: 'event_002',
        type: 'status_change',
        timestamp: '2024-01-16T14:30:00Z',
        description: 'Status changed from New to Qualified',
        details: { oldStatus: 'New', newStatus: 'Qualified' }
      }
    ],
    ownerId: 'user_001',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 'lead_002',
    companyId: 'c_002',
    companyName: 'Mediterranean Imports Ltd',
    contactId: 'contact_002',
    contactName: 'Carlos Rodriguez',
    email: 'carlos@medimports.es',
    source: 'Manual',
    status: 'Sample or Quote',
    statusReason: 'Quote sent for turmeric powder',
    interestCommodity: 'Turmeric Powder',
    interestSpec: 'Organic, 1kg bags',
    estimatedValue: 15000,
    nextBestAction: 'Follow up on quote',
    dueDate: '2024-02-10',
    notes: 'Looking for organic certification. Price sensitive.',
    attachments: [],
    timeline: [
      {
        id: 'event_003',
        type: 'lead_created',
        timestamp: '2024-01-10T11:00:00Z',
        description: 'Lead created manually',
        details: {}
      },
      {
        id: 'event_004',
        type: 'quote_sent',
        timestamp: '2024-01-20T16:00:00Z',
        description: 'Quote sent for Organic Turmeric Powder',
        details: { quoteId: 'quote_001' }
      }
    ],
    ownerId: 'user_001',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z'
  },
  {
    id: 'lead_003',
    companyId: 'c_003',
    companyName: 'Nordic Food Solutions',
    contactId: 'contact_003',
    contactName: 'Erik Larsson',
    email: 'erik@nordicfood.se',
    source: 'CSV',
    status: 'New',
    interestCommodity: 'Cardamom',
    interestSpec: 'Green pods, premium grade',
    estimatedValue: 8000,
    nextBestAction: 'Initial contact',
    dueDate: '2024-02-05',
    notes: 'Imported from trade show leads CSV',
    attachments: [],
    timeline: [
      {
        id: 'event_005',
        type: 'lead_created',
        timestamp: '2024-01-25T10:00:00Z',
        description: 'Lead created from CSV import',
        details: {}
      }
    ],
    ownerId: 'user_001',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  }
];

// Mock Enrichment Rules Settings
export const mockEnrichmentRulesSettings: EnrichmentRulesSettings = {
  max_per_company: 3,
  target_roles: ['Procurement', 'QA', 'Operations'],
  channels: ['Email', 'LinkedIn', 'Phone'],
  verification_mode: 'strict',
  geography: 'global',
  fields_to_enrich: ['contact_info', 'company_profile', 'trade_history', 'certifications']
};

// Mock Credit Balance
export const mockCreditBalance: CreditBalance = {
  totalCredits: 450,
  contactCredits: 280,
  profileCredits: 170,
  billedEvents: [
    {
      id: 'billing_001',
      type: 'contact',
      amount: 2,
      timestamp: '2024-01-20T14:30:00Z',
      description: 'Verified contacts for EuroSpice GmbH',
      companyName: 'EuroSpice GmbH',
      contactName: 'Anna Keller'
    },
    {
      id: 'billing_002',
      type: 'profile',
      amount: 5,
      timestamp: '2024-01-20T14:30:00Z',
      description: 'Profile enrichment for EuroSpice GmbH',
      companyName: 'EuroSpice GmbH'
    },
    {
      id: 'billing_003',
      type: 'contact',
      amount: 1,
      timestamp: '2024-01-18T09:15:00Z',
      description: 'Verified contact for Mediterranean Imports Ltd',
      companyName: 'Mediterranean Imports Ltd',
      contactName: 'Carlos Rodriguez'
    }
  ]
};

// Feature flag for credit split
let creditSplitEnabled = true;

// Parse Query into Assumptions
export const parseQuery = (query: string): SearchAssumptions => {
  const assumptions: SearchAssumptions = {
    hs: [],
    markets: [],
    days: 180
  };

  // Extract markets
  if (query.toLowerCase().includes('eu') || query.toLowerCase().includes('europe')) {
    assumptions.markets = ['EU'];
  }
  if (query.toLowerCase().includes('us') || query.toLowerCase().includes('usa')) {
    assumptions.markets = ['US'];
  }
  if (query.toLowerCase().includes('asia')) {
    assumptions.markets = ['Asia'];
  }

  // Extract timeframe
  const daysMatch = query.match(/(\d+)d/);
  if (daysMatch) {
    assumptions.days = parseInt(daysMatch[1]);
  }

  // Extract grade
  const astaMatch = query.match(/ASTA\s?(\d+)/i);
  if (astaMatch) {
    assumptions.grade = `ASTA ${astaMatch[1]}`;
  }

  // Extract pack size
  const packMatch = query.match(/(\d+g?\s?\w*)/);
  if (packMatch && !packMatch[1].includes('d')) {
    assumptions.pack = packMatch[1];
  }

  // Generate HS codes based on product type
  if (query.toLowerCase().includes('pepper')) {
    assumptions.hs = [
      { code: "090411", confidence: 0.76 },
      { code: "090412", confidence: 0.62 }
    ];
  } else if (query.toLowerCase().includes('turmeric')) {
    assumptions.hs = [
      { code: "091030", confidence: 0.85 }
    ];
  } else if (query.toLowerCase().includes('cardamom')) {
    assumptions.hs = [
      { code: "090830", confidence: 0.90 }
    ];
  }

  return assumptions;
};

// Mock Search API
export const mockSearch = async (query: string): Promise<SearchResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const assumptions = parseQuery(query);
  const totalCandidates = Math.floor(Math.random() * 200) + 50; // 50-250 candidates
  const resultsShown = Math.min(totalCandidates, 50);
  
  // Generate refine/broaden suggestions based on results
  const refineSuggestions = totalCandidates > 50 ? [
    'Limit to EU ports',
    'Set recency ≤ 90d',
    'Pick grade ASTA 500',
    'Min volume 10MT'
  ] : [];
  
  const broadenSuggestions = resultsShown < 20 ? [
    'Extend to 365 days',
    'Include ASTA 450 grade',
    'Add US market',
    'Include distributors'
  ] : [];

  // Return subset of mock companies
  const companies = mockCompanies.slice(0, resultsShown);

  return {
    query,
    assumptions,
    resultsShown,
    totalCandidates,
    refineSuggestions,
    broadenSuggestions,
    companies
  };
};

// Mock Upload and Match API
export const mockUploadMatch = async (file: File): Promise<UploadMatchResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Simulate CSV parsing and matching
  const mockEntries = [
    { name: 'EuroSpice GmbH', country: 'Germany', email: 'info@eurospice.de' },
    { name: 'Mediterranean Foods', country: 'Spain', email: 'contact@medfoods.es' },
    { name: 'Unknown Spice Co', country: 'Italy', email: 'hello@unknownspice.it' },
    { name: 'Global Spice Ltd', country: 'UK', email: 'sales@globalspice.co.uk' },
    { name: 'Nordic Food Solutions', country: 'Sweden', email: 'info@nordicfood.se' }
  ];

  return mockEntries.map((entry, index) => {
    let status: 'Matched' | 'Multiple' | 'New';
    let confidence: number | undefined;
    let matchedCompanyId: string | undefined;
    let matchedCompanyName: string | undefined;
    let multipleMatches: Array<{ companyId: string; name: string; confidence: number }> | undefined;

    if (entry.name === 'EuroSpice GmbH') {
      status = 'Matched';
      confidence = 95;
      matchedCompanyId = 'c_001';
      matchedCompanyName = 'EuroSpice GmbH';
    } else if (entry.name === 'Global Spice Ltd') {
      status = 'Multiple';
      multipleMatches = [
        { companyId: 'c_006', name: 'Global Spice Ltd', confidence: 85 },
        { companyId: 'c_007', name: 'Global Spices International', confidence: 78 }
      ];
    } else if (entry.name === 'Nordic Food Solutions') {
      status = 'Matched';
      confidence = 92;
      matchedCompanyId = 'c_003';
      matchedCompanyName = 'Nordic Food Solutions';
    } else {
      status = 'New';
    }

    return {
      id: `upload_${index}`,
      originalEntry: entry,
      status,
      confidence,
      matchedCompanyId,
      matchedCompanyName,
      multipleMatches
    };
  });
};

// Mock Enrichment Estimate
export const mockGetEnrichmentEstimate = async (companyIds: string[]): Promise<EnrichmentEstimate> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const breakdown = companyIds.map(companyId => {
    const company = mockCompanies.find(c => c.companyId === companyId);
    const estimatedContacts = 2; // Default to 2 contacts per company
    const contactCredits = estimatedContacts * 2; // 2 credits per verified contact
    const profileCredits = 5; // 5 credits for profile data

    return {
      companyId,
      companyName: company?.name || 'Unknown Company',
      estimatedContacts,
      contactCredits,
      profileCredits
    };
  });

  const totalContactCredits = breakdown.reduce((sum, b) => sum + b.contactCredits, 0);
  const totalProfileCredits = breakdown.reduce((sum, b) => sum + b.profileCredits, 0);

  return {
    totalCredits: totalContactCredits + totalProfileCredits,
    contactCredits: totalContactCredits,
    profileCredits: totalProfileCredits,
    breakdown
  };
};

// Mock Enrichment API
export const mockEnrich = async (
  companyIds: string[],
  settings?: ContactEnrichmentSettings
): Promise<EnrichmentResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return companyIds.map(companyId => {
    const company = mockCompanies.find(c => c.companyId === companyId);
    const hasRisks = Math.random() > 0.9;
    const contactCount = Math.floor(Math.random() * 3) + 1;

    return {
      companyId,
      company: company?.name || 'Unknown Company',
      verified: contactCount >= 1 ? [
        {
          name: 'Anna Keller',
          title: 'Head of Procurement',
          email: `anna.keller@${company?.name.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: '+49 30 1234567',
          confidence: 'high',
          why: ['role match', 'smtp verified', 'linkedin match']
        },
        ...(contactCount >= 2 ? [{
          name: 'Marcus Weber',
          title: 'Category Manager',
          email: `marcus.weber@${company?.name.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: '+49 30 7654321',
          confidence: 'high',
          why: ['role match', 'smtp verified']
        }] : [])
      ] : [],
      generic: [
        {
          name: 'HQ inbox',
          email: `info@${company?.name.toLowerCase().replace(/\s+/g, '')}.com`,
          why: ['domain verified'],
          mutual: 'DHL Global (3 lanes)'
        }
      ],
      not_found: contactCount === 0 ? [{ reason: 'No contacts found for specified roles' }] : [],
      billing: {
        verified_count: contactCount,
        chargeable: contactCount,
        profile_credit_used: true
      },
      enrichedAt: new Date().toISOString(),
      verificationLevel: contactCount >= 2 ? 'high' : contactCount === 1 ? 'medium' : 'low',
      shipmentHistory: {
        timeline: [
          ['2024-06', 12], ['2024-07', 15], ['2024-08', 15],
          ['2024-09', 18], ['2024-10', 14]
        ],
        rfv: { lastShip: '2024-10-28', shipments90d: 7, vol90dMt: 42 }
      },
      tradePartners: {
        suppliers: ['VN Spice Co', 'IndoPepper', 'Thai Premium Foods'],
        forwarders: ['DHL Global', 'Maersk Line', 'CMA CGM'],
        recentPartners: [
          { name: 'VN Spice Co', since: '2023-01' },
          { name: 'DHL Global', since: '2022-06' }
        ]
      },
      lanes: [
        { from: 'Ho Chi Minh', to: 'Rotterdam', mt: 28 },
        { from: 'Chennai', to: 'Hamburg', mt: 14 }
      ],
      keyPeople: [
        { name: 'Anna Keller', title: 'Head of Procurement', linkedin: 'linkedin.com/in/annakeller', confidence: 'high', lastSeen: '2024-10-15' },
        { name: 'Marcus Weber', title: 'Operations Manager', confidence: 'medium', lastSeen: '2024-09-20' }
      ],
      priceTrends: [
        { period: '2024-06', avgPrice: 3.2, delta: 0.1, trend: 'up' },
        { period: '2024-07', avgPrice: 3.3, delta: 0.1, trend: 'up' },
        { period: '2024-08', avgPrice: 3.4, delta: 0.1, trend: 'stable' }
      ],
      certificates: ['Organic', 'BAP'],
      risks: hasRisks ? [
        { type: 'alert', description: 'Recent customs delay reported', severity: 'low' }
      ] : [],
      companyMeta: {
        domain: `${company?.name.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${company?.name.toLowerCase().replace(/\s+/g, '')}.com`,
        socials: [
          { platform: 'LinkedIn', url: `https://linkedin.com/company/${company?.name.toLowerCase().replace(/\s+/g, '-')}` }
        ],
        aliases: [company?.name || '']
      },
      evidence: [
        { fact: '7 shipments in 90d', source: 'datamyne', ts: '2024-10-30', confidence: 95 },
        { fact: 'Exact grade match', source: 'panjiva', ts: '2024-10-29', confidence: 88 },
        { fact: 'Shared forwarder DHL', source: 'customs_data', ts: '2024-10-28', confidence: 92 },
        { fact: 'Recent activity spike', source: 'manifest_data', ts: '2024-10-27', confidence: 85 },
        { fact: 'Price band stable', source: 'market_intel', ts: '2024-10-26', confidence: 80 }
      ]
    };
  });
};

// Get single enriched company data
export const mockGetEnrichedCompany = async (companyId: string): Promise<EnrichmentResult | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const results = await mockEnrich([companyId]);
  return results[0] || null;
};

// Find more contacts for a company
export const mockFindMoreContacts = async (
  companyId: string,
  additionalRoles: string[],
  maxContacts: number
): Promise<{ contacts: VerifiedContact[]; creditsUsed: number }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newContactCount = Math.min(maxContacts, Math.floor(Math.random() * 2) + 1);
  const contacts: VerifiedContact[] = [];

  for (let i = 0; i < newContactCount; i++) {
    contacts.push({
      name: `Contact ${i + 1}`,
      title: additionalRoles[i % additionalRoles.length],
      email: `contact${i + 1}@company.com`,
      phone: `+49 30 ${Math.floor(Math.random() * 9000000) + 1000000}`,
      confidence: 'medium',
      why: ['role match', 'email verified']
    });
  }

  return {
    contacts,
    creditsUsed: newContactCount * 2
  };
};

// Mock Hot Leads APIs
export const mockGetLeads = async (): Promise<Lead[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockLeads];
};

export const mockCreateLead = async (leadData: Partial<Lead>): Promise<Lead> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newLead: Lead = {
    id: `lead_${Date.now()}`,
    companyName: leadData.companyName || '',
    contactName: leadData.contactName || '',
    email: leadData.email,
    source: leadData.source || 'Manual',
    status: leadData.status || 'New',
    interestCommodity: leadData.interestCommodity,
    interestSpec: leadData.interestSpec,
    estimatedValue: leadData.estimatedValue,
    nextBestAction: leadData.nextBestAction || 'Initial contact',
    dueDate: leadData.dueDate,
    notes: leadData.notes,
    attachments: leadData.attachments || [],
    timeline: [
      {
        id: `event_${Date.now()}`,
        type: 'lead_created',
        timestamp: new Date().toISOString(),
        description: `Lead created via ${leadData.source || 'Manual'}`,
        details: {}
      }
    ],
    ownerId: 'user_001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...leadData
  };
  
  mockLeads.push(newLead);
  return newLead;
};

export const mockBulkCreateLeads = async (leadsData: Partial<Lead>[]): Promise<Lead[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newLeads = await Promise.all(leadsData.map(leadData => mockCreateLead(leadData)));
  return newLeads;
};

export const mockUpdateLeadStatus = async (leadId: string, status: Lead['status'], reason?: string): Promise<Lead> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const leadIndex = mockLeads.findIndex(l => l.id === leadId);
  if (leadIndex === -1) {
    throw new Error('Lead not found');
  }
  
  const lead = mockLeads[leadIndex];
  const oldStatus = lead.status;
  
  lead.status = status;
  lead.statusReason = reason;
  lead.updatedAt = new Date().toISOString();
  
  // Add status change event to timeline
  lead.timeline.push({
    id: `event_${Date.now()}`,
    type: 'status_change',
    timestamp: new Date().toISOString(),
    description: `Status changed from ${oldStatus} to ${status}${reason ? `: ${reason}` : ''}`,
    details: { oldStatus, newStatus: status }
  });
  
  return lead;
};

export const mockCreateQuote = async (quoteData: Omit<Quote, 'id' | 'pdfUrl' | 'sentDate'>): Promise<Quote> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const quote: Quote = {
    ...quoteData,
    id: `quote_${Date.now()}`,
    pdfUrl: `https://example.com/quotes/${Date.now()}.pdf`,
    sentDate: new Date().toISOString()
  };
  
  // Add quote sent event to lead timeline
  const leadIndex = mockLeads.findIndex(l => l.id === quoteData.leadId);
  if (leadIndex !== -1) {
    mockLeads[leadIndex].timeline.push({
      id: `event_${Date.now()}`,
      type: 'quote_sent',
      timestamp: new Date().toISOString(),
      description: `Quote sent for ${quoteData.productName}`,
      details: { quoteId: quote.id }
    });
    
    // Auto-update lead status if not already in Sample or Quote stage
    if (!['Sample or Quote', 'Negotiation', 'PO or Won'].includes(mockLeads[leadIndex].status)) {
      mockLeads[leadIndex].status = 'Sample or Quote';
      mockLeads[leadIndex].statusReason = 'Quote sent automatically';
      mockLeads[leadIndex].updatedAt = new Date().toISOString();
    }
  }
  
  return quote;
};

// Mock Settings APIs
export const mockGetEnrichmentRules = async (): Promise<EnrichmentRulesSettings> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { ...mockEnrichmentRulesSettings };
};

export const mockUpdateEnrichmentRules = async (settings: EnrichmentRulesSettings): Promise<EnrichmentRulesSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  Object.assign(mockEnrichmentRulesSettings, settings);
  return { ...mockEnrichmentRulesSettings };
};

export const mockGetCredits = async (): Promise<CreditBalance> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { ...mockCreditBalance };
};

export const mockConsumeCredits = async (type: 'contact' | 'profile', amount: number, description: string): Promise<CreditBalance> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Update credit balance
  mockCreditBalance.totalCredits -= amount;
  if (creditSplitEnabled) {
    if (type === 'contact') {
      mockCreditBalance.contactCredits = (mockCreditBalance.contactCredits || 0) - amount;
    } else {
      mockCreditBalance.profileCredits = (mockCreditBalance.profileCredits || 0) - amount;
    }
  }
  
  // Add billing event
  mockCreditBalance.billedEvents.unshift({
    id: `billing_${Date.now()}`,
    type,
    amount,
    timestamp: new Date().toISOString(),
    description
  });
  
  return { ...mockCreditBalance };
};

export const mockGetCreditSplitFeatureFlag = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return creditSplitEnabled;
};

export const mockSetCreditSplitFeatureFlag = async (enabled: boolean): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  creditSplitEnabled = enabled;
  return creditSplitEnabled;
};

// Mock Segments API
export const mockGetSegments = async (): Promise<Segment[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: 'seg_001',
      name: 'EU Pepper Importers',
      description: 'European companies importing pepper from Asia',
      memberCount: 12,
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20',
      companies: mockCompanies.slice(0, 3)
    },
    {
      id: 'seg_002',
      name: 'High Volume Traders',
      description: 'Companies with >100MT monthly volume',
      memberCount: 8,
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-18',
      companies: mockCompanies.slice(1, 3)
    }
  ];
};

export const mockCreateSegment = async (name: string, description: string, companyIds: string[]): Promise<Segment> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const companies = mockCompanies.filter(c => companyIds.includes(c.companyId));
  
  return {
    id: `seg_${Date.now()}`,
    name,
    description,
    memberCount: companies.length,
    createdAt: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    companies
  };
};

export const mockAddCompaniesToSegment = async (segmentId: string, companyIds: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Mock adding companies to existing segment
};

// Mock Bookmarks API
export const mockGetBookmarks = async (): Promise<Bookmark[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: 'bm_001',
      companyId: 'c_001',
      companyName: 'EuroSpice GmbH',
      bookmarkedAt: '2024-01-15'
    },
    {
      id: 'bm_002',
      companyId: 'c_002',
      companyName: 'Mediterranean Imports Ltd',
      bookmarkedAt: '2024-01-12'
    }
  ];
};

export const mockAddBookmark = async (companyId: string): Promise<Bookmark> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const company = mockCompanies.find(c => c.companyId === companyId);
  
  return {
    id: `bm_${Date.now()}`,
    companyId,
    companyName: company?.name || 'Unknown Company',
    bookmarkedAt: new Date().toISOString().split('T')[0]
  };
};

// Mock Enriched Profiles API
export const mockGetEnrichedProfiles = async (): Promise<EnrichedProfile[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      companyId: 'c_001',
      companyName: 'EuroSpice GmbH',
      verificationLevel: 'high',
      lastEnrichedDate: '2024-01-15',
      verifiedCount: 2,
      genericCount: 1,
      partialCount: 0,
      rfvSummary: { recency: 15, frequency: 8, volume: 'High' },
      commodity: 'Pepper',
      geography: 'Europe',
      industry: 'Food Import',
      charged: true
    },
    {
      companyId: 'c_002',
      companyName: 'Mediterranean Imports Ltd',
      verificationLevel: 'medium',
      lastEnrichedDate: '2024-01-12',
      verifiedCount: 1,
      genericCount: 2,
      partialCount: 1,
      rfvSummary: { recency: 25, frequency: 5, volume: 'Medium' },
      commodity: 'Pepper',
      geography: 'Europe',
      industry: 'Food Import',
      charged: true
    }
  ];
};

// Mock Products API
export const mockGetProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'prod_001',
      name: 'Premium Black Pepper',
      commodity: 'Pepper',
      grade: 'ASTA 500',
      packaging: '500g pouches',
      origin: 'Vietnam',
      hsCodes: ['090411', '090412'],
      description: 'High-quality black pepper with consistent ASTA 500 grade',
      availableForCampaigns: true,
      pricing: {
        id: 'pricing_001',
        productId: 'prod_001',
        cost: 2.50,
        margin: 0.30,
        fxRate: 1.08,
        duty: 0.15,
        freight: 0.25,
        surcharges: 0.10,
        fobPrice: 3.20,
        cifPrices: [
          { port: 'Rotterdam', price: 3.70 },
          { port: 'Hamburg', price: 3.75 },
          { port: 'Antwerp', price: 3.68 }
        ],
        effectiveDate: '2024-01-15',
        version: 1
      }
    },
    {
      id: 'prod_002',
      name: 'Organic Turmeric Powder',
      commodity: 'Turmeric',
      grade: 'Curcumin 3%+',
      packaging: '1kg bags',
      origin: 'India',
      hsCodes: ['091030'],
      description: 'Certified organic turmeric powder with high curcumin content',
      availableForCampaigns: true,
      pricing: {
        id: 'pricing_002',
        productId: 'prod_002',
        cost: 4.20,
        margin: 0.25,
        fxRate: 1.08,
        duty: 0.12,
        freight: 0.30,
        surcharges: 0.08,
        fobPrice: 5.50,
        cifPrices: [
          { port: 'Rotterdam', price: 6.00 },
          { port: 'Hamburg', price: 6.05 },
          { port: 'Felixstowe', price: 5.95 }
        ],
        effectiveDate: '2024-01-20',
        version: 1
      }
    }
  ];
};

export const mockCreateProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    ...product,
    id: `prod_${Date.now()}`
  };
};

export const mockGetProductPricing = async (productId: string): Promise<Pricing | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const products = await mockGetProducts();
  const product = products.find(p => p.id === productId);
  return product?.pricing || null;
};

export const mockUpdateProductPricing = async (pricing: Pricing): Promise<Pricing> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    ...pricing,
    version: pricing.version + 1,
    effectiveDate: new Date().toISOString().split('T')[0]
  };
};

export const mockComputeCIF = async (productId: string, countryOrPort: string): Promise<{ productId: string; port: string; cifPrice: number }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const pricing = await mockGetProductPricing(productId);
  if (!pricing) {
    throw new Error('Product pricing not found');
  }
  
  // Mock CIF calculation based on port
  const basePrice = pricing.fobPrice;
  const freightMultiplier = countryOrPort.toLowerCase().includes('rotterdam') ? 1.15 : 
                           countryOrPort.toLowerCase().includes('hamburg') ? 1.17 : 
                           countryOrPort.toLowerCase().includes('antwerp') ? 1.14 : 1.16;
  
  return {
    productId,
    port: countryOrPort,
    cifPrice: Math.round(basePrice * freightMultiplier * 100) / 100
  };
};

export const mockUploadOutreachCSV = async (file: File): Promise<{ contacts: Contact[]; errors: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate CSV parsing and validation
  const mockContacts: Contact[] = [
    {
      id: 'contact_1',
      company_name: 'EuroSpice GmbH',
      contact_name: 'Anna Keller',
      email: 'anna.keller@eurospice.de',
      title: 'Head of Procurement',
      country: 'Germany',
      phone: '+49 30 1234567',
      verification: 'verified',
      billed: false,
      product: 'Black Pepper',
      grade: 'ASTA 500',
      pack: '500g',
      market: 'EU'
    },
    {
      id: 'contact_2',
      company_name: 'Mediterranean Foods',
      contact_name: 'Marcus Weber',
      email: 'marcus.weber@medfoods.es',
      title: 'Operations Manager',
      country: 'Spain',
      phone: '+34 91 1234567',
      verification: 'verified',
      billed: false,
      product: 'Turmeric',
      grade: 'Curcumin 3%',
      pack: '1kg',
      market: 'EU'
    }
  ];

  const mockErrors: string[] = [
    'Row 3: Invalid email format for john.doe@invalid',
    'Row 5: Missing required field "email"'
  ];

  return {
    contacts: mockContacts,
    errors: mockErrors
  };
};

// Mock Campaign API
export const mockStartCampaign = async (
  audience: Contact[],
  message: OutreachMessage,
  sequence?: OutreachSequence
): Promise<{ campaign_id: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return { campaign_id: `campaign_${Date.now()}` };
};

export const mockGetCampaigns = async (): Promise<Campaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      name: 'EU Pepper Outreach Q1',
      sent: 45,
      delivered: 43,
      opens: 28,
      clicks: 12,
      replies: 8,
      meetings: 3,
      hotLeads: 5,
      bounces: 2,
      pos: 1,
      poCount: 1,
      source: 'Build Audience',
      created_at: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Nordic Market Expansion',
      sent: 23,
      delivered: 22,
      opens: 15,
      clicks: 7,
      replies: 4,
      meetings: 2,
      hotLeads: 3,
      bounces: 1,
      pos: 0,
      poCount: 0,
      source: 'Segment',
      created_at: '2024-01-20',
      status: 'sending'
    },
    {
      id: '3',
      name: 'Price Update - Premium Pepper',
      sent: 67,
      delivered: 65,
      opens: 42,
      clicks: 18,
      replies: 12,
      meetings: 6,
      hotLeads: 8,
      bounces: 2,
      pos: 2,
      poCount: 2,
      source: 'Enriched Profiles',
      created_at: '2024-01-25',
      status: 'completed'
    }
  ];
};

export const mockGetCampaignDetail = async (campaignId: string): Promise<CampaignDetail> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const campaigns = await mockGetCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  
  return {
    id: campaign.id,
    name: campaign.name,
    metrics: {
      sent: campaign.sent,
      delivered: campaign.delivered,
      opens: campaign.opens,
      clicks: campaign.clicks,
      replies: campaign.replies,
      meetings: campaign.meetings,
      hotLeads: campaign.hotLeads,
      bounces: campaign.bounces,
      poCount: campaign.poCount
    },
    audience: [
      {
        contactId: 'contact_1',
        contactName: 'Anna Keller',
        companyName: 'EuroSpice GmbH',
        email: 'anna.keller@eurospice.de',
        status: 'replied',
        timeline: [
          {
            type: 'sent',
            timestamp: '2024-01-15T09:00:00Z',
            details: {
              subject: 'Partnership opportunity for premium spices',
              body: 'Hi Anna, I noticed your company...'
            }
          },
          {
            type: 'delivered',
            timestamp: '2024-01-15T09:01:00Z'
          },
          {
            type: 'opened',
            timestamp: '2024-01-15T14:30:00Z'
          },
          {
            type: 'replied',
            timestamp: '2024-01-16T08:15:00Z',
            details: {
              replyText: 'Thank you for reaching out. We are interested in learning more about your products.'
            }
          }
        ]
      },
      {
        contactId: 'contact_2',
        contactName: 'Marcus Weber',
        companyName: 'Mediterranean Foods',
        email: 'marcus.weber@medfoods.es',
        status: 'opened',
        timeline: [
          {
            type: 'sent',
            timestamp: '2024-01-15T09:00:00Z',
            details: {
              subject: 'Partnership opportunity for premium spices',
              body: 'Hi Marcus, I noticed your company...'
            }
          },
          {
            type: 'delivered',
            timestamp: '2024-01-15T09:01:00Z'
          },
          {
            type: 'opened',
            timestamp: '2024-01-15T16:45:00Z'
          }
        ]
      }
    ]
  };
};

export const mockGetCampaignMessage = async (campaignId: string, recipientId: string): Promise<{ subject: string; body: string; replyText?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    subject: 'Partnership opportunity for premium spices',
    body: `Hi there,

I noticed your company has been actively importing spices from Southeast Asia, particularly:

• 7 shipments in the last 90 days
• Exact ASTA 500 grade match with our products  
• Shared logistics partner: DHL Global

We're a premium spice supplier with 15+ years experience serving European buyers. Our ASTA 500 pepper consistently meets the quality standards you require.

Would you be interested in a brief call to discuss how we can support your procurement needs?

Best regards,
[Your name]`,
    replyText: recipientId === 'contact_1' ? 'Thank you for reaching out. We are interested in learning more about your products.' : undefined
  };
};

// CSV Templates
export const downloadCompanyCSVTemplate = () => {
  const csvContent = `Company Name,Country,Email,Phone,Website,Industry,Notes
EuroSpice GmbH,Germany,info@eurospice.de,+49301234567,www.eurospice.de,Food Import,
Mediterranean Foods,Spain,contact@medfoods.es,,www.medfoods.es,Food Distribution,
Nordic Spice Co,Sweden,sales@nordicspice.se,+46812345678,,Spice Trading,`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'company_upload_template.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const downloadLeadCSVTemplate = () => {
  const csvContent = `Company Name,Contact Name,Email,Phone,Interest Commodity,Interest Spec,Estimated Value,Notes,Due Date
EuroSpice GmbH,Anna Keller,anna.keller@eurospice.de,+49301234567,Black Pepper,ASTA 500 500g pouches,25000,Premium quality requirements,2024-02-15
Mediterranean Foods,Carlos Rodriguez,carlos@medfoods.es,+34911234567,Turmeric Powder,Organic 1kg bags,15000,Price sensitive organic buyer,2024-02-10
Nordic Spice Co,Erik Larsson,erik@nordicspice.se,+46812345678,Cardamom,Green pods premium grade,8000,Trade show contact,2024-02-05`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lead_upload_template.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

// Mock Lead CSV Upload
export const mockUploadLeadCSV = async (file: File): Promise<{ leads: Partial<Lead>[]; errors: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate CSV parsing and validation
  const mockLeads: Partial<Lead>[] = [
    {
      companyName: 'EuroSpice GmbH',
      contactName: 'Anna Keller',
      email: 'anna.keller@eurospice.de',
      source: 'CSV',
      status: 'New',
      interestCommodity: 'Black Pepper',
      interestSpec: 'ASTA 500 500g pouches',
      estimatedValue: 25000,
      notes: 'Premium quality requirements',
      dueDate: '2024-02-15'
    },
    {
      companyName: 'Mediterranean Foods',
      contactName: 'Carlos Rodriguez',
      email: 'carlos@medfoods.es',
      source: 'CSV',
      status: 'New',
      interestCommodity: 'Turmeric Powder',
      interestSpec: 'Organic 1kg bags',
      estimatedValue: 15000,
      notes: 'Price sensitive organic buyer',
      dueDate: '2024-02-10'
    }
  ];

  const mockErrors: string[] = [
    'Row 4: Invalid email format for invalid@email',
    'Row 6: Missing required field "Company Name"'
  ];

  return {
    leads: mockLeads,
    errors: mockErrors
  };
};

// Export CSV Template
export const downloadCSVTemplate = downloadCompanyCSVTemplate;

// Mock Upload CSV API
export const mockUploadCSV = async (file: File): Promise<{ contacts: Contact[]; errors: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate CSV parsing and validation
  const mockContacts: Contact[] = [
    {
      id: 'contact_1',
      contact_name: 'Anna Keller',
      email: 'anna.keller@eurospice.de',
      company_name: 'EuroSpice GmbH',
      title: 'Head of Procurement',
      phone: '+49 30 1234567',
      verification: 'verified',
      billed: false
    },
    {
      id: 'contact_2',
      contact_name: 'Marcus Weber',
      email: 'marcus.weber@medfoods.es',
      company_name: 'Mediterranean Foods',
      title: 'Operations Manager',
      phone: '+34 91 1234567',
      verification: 'verified',
      billed: false
    }
  ];

  const mockErrors: string[] = [
    'Row 3: Invalid email format for john.doe@invalid',
    'Row 5: Missing required field "email"'
  ];

  return {
    contacts: mockContacts,
    errors: mockErrors
  };
};