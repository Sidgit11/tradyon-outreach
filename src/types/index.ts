// Navigation and Core Types
export type NavigationScreen = 'buildAudience' | 'enrichedProfiles' | 'segmentsBookmarks' | 'campaigns' | 'hotLeads' | 'myProducts' | 'settings';
export type BuildAudienceTab = 'findBuyers' | 'uploadList';
export type CampaignTab = 'viewCampaigns' | 'startNewCampaign';

// Search and Company Types
export interface HSCode {
  code: string;
  confidence: number;
}

export interface SearchAssumptions {
  hs: HSCode[];
  markets: string[];
  days: number;
  grade?: string;
  pack?: string;
  moq_mt?: number;
  certs?: string[];
}

export interface Company {
  companyId: string;
  name: string;
  commodities: string[];
  hqCountry: string;
  originCountries: string[];
  destinationCountries: string[];
  profileType: string;
  industry: string;
  matchScore: number;
  enriched?: boolean;
  enrichedAt?: string;
  verifiedCount?: number;
  genericCount?: number;
  notFoundCount?: number;
  enrichmentStatus?: 'estimating' | 'queued' | 'fetching' | 'complete' | 'partial' | 'error';
}

export interface SearchResponse {
  query: string;
  assumptions: SearchAssumptions;
  resultsShown: number;
  totalCandidates: number;
  refineSuggestions: string[];
  broadenSuggestions: string[];
  companies: Company[];
}

// Upload and Matching Types
export interface UploadMatchResult {
  id: string;
  originalEntry: {
    name: string;
    country?: string;
    email?: string;
    [key: string]: any;
  };
  status: 'Matched' | 'Multiple' | 'New';
  confidence?: number;
  matchedCompanyId?: string;
  matchedCompanyName?: string;
  multipleMatches?: Array<{
    companyId: string;
    name: string;
    confidence: number;
  }>;
}

// Enrichment Types
export interface ContactEnrichmentSettings {
  max_per_company: number;
  target_roles: string[];
  region: string;
  channels: string[];
  verification_mode: 'strict' | 'relaxed';
}

export interface VerifiedContact {
  name: string;
  title: string;
  email: string;
  phone?: string;
  confidence: 'high' | 'medium' | 'low';
  why: string[];
}

export interface GenericContact {
  name: string;
  email: string;
  why: string[];
  mutual?: string;
}

export interface NotFoundContact {
  reason: string;
}

export interface EnrichmentResult {
  companyId: string;
  company: string;
  verified: VerifiedContact[];
  generic: GenericContact[];
  not_found: NotFoundContact[];
  billing: {
    verified_count: number;
    chargeable: number;
    profile_credit_used?: boolean;
  };
  enrichedAt: string;
  verificationLevel: 'high' | 'medium' | 'low' | 'partial';
  shipmentHistory?: {
    timeline: Array<[string, number]>;
    rfv: { lastShip: string; shipments90d: number; vol90dMt: number };
  };
  tradePartners?: {
    suppliers: string[];
    forwarders: string[];
    recentPartners?: Array<{ name: string; since: string }>;
  };
  lanes?: Array<{
    from: string;
    to: string;
    mt: number;
  }>;
  keyPeople?: Array<{
    name: string;
    title: string;
    linkedin?: string;
    confidence: string;
    lastSeen?: string;
  }>;
  priceTrends?: Array<{
    period: string;
    avgPrice: number;
    delta?: number;
    trend?: 'up' | 'down' | 'stable';
  }>;
  certificates?: string[];
  risks?: Array<{
    type: 'sanctions' | 'pep' | 'alert';
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  companyMeta?: {
    domain: string;
    website?: string;
    socials?: Array<{ platform: string; url: string }>;
    aliases?: string[];
  };
  evidence?: Array<{
    fact: string;
    source: string;
    ts: string;
    confidence?: number;
  }>;
}

export interface EnrichmentEstimate {
  totalCredits: number;
  contactCredits: number;
  profileCredits: number;
  breakdown: Array<{
    companyId: string;
    companyName: string;
    estimatedContacts: number;
    contactCredits: number;
    profileCredits: number;
  }>;
}

// Segments and Bookmarks
export interface Segment {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  lastUpdated: string;
  companies: Company[];
}

export interface Bookmark {
  id: string;
  companyId: string;
  companyName: string;
  bookmarkedAt: string;
}

// Campaign Types
export interface Contact {
  id: string;
  companyId?: string;
  company_name: string;
  contact_name: string;
  email: string;
  title?: string;
  country?: string;
  phone?: string;
  whatsapp_phone?: string;
  linkedin_url?: string;
  verification: 'verified' | 'generic' | 'partial';
  billed: boolean;
  confidence?: string;
  why?: string[];
  // Additional fields for CSV upload
  product?: string;
  grade?: string;
  pack?: string;
  hs_code?: string;
  lane_origin?: string;
  lane_destination?: string;
  market?: string;
  moq_mt?: number;
  notes?: string;
}

export interface OutreachMessage {
  template: 'intro' | 'sample' | 'price' | 'priceUpdate' | 'newProductLaunch' | 'festiveGreetings' | 'custom';
  tone: 'neutral' | 'formal' | 'concise';
  subject: string;
  body: string;
  include_evidence: boolean;
  attach_lead_card: boolean;
  channel?: 'email' | 'whatsapp' | 'telecall';
  productId?: string;
  includeCIF?: boolean;
}

export interface OutreachSequence {
  days: number[];
  stop_on_reply: boolean;
  timezone: string;
}

export interface Campaign {
  id: string;
  name: string;
  sent: number;
  delivered: number;
  opens: number;
  clicks: number;
  replies: number;
  meetings: number;
  hotLeads: number;
  bounces: number;
  pos: number;
  poCount: number;
  source: 'Build Audience' | 'Enriched Profiles' | 'Segment' | 'CSV';
  created_at: string;
  status: 'draft' | 'sending' | 'completed' | 'paused';
}

export interface CampaignDetail {
  id: string;
  name: string;
  metrics: {
    sent: number;
    delivered: number;
    opens: number;
    clicks: number;
    replies: number;
    meetings: number;
    hotLeads: number;
    bounces: number;
    poCount: number;
  };
  audience: CampaignRecipient[];
}

export interface CampaignRecipient {
  contactId: string;
  contactName: string;
  companyName: string;
  email: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'meeting' | 'po';
  timeline: CampaignRecipientEvent[];
}

export interface CampaignRecipientEvent {
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'meeting' | 'po';
  timestamp: string;
  details?: {
    subject?: string;
    body?: string;
    replyText?: string;
  };
}

// Product and Pricing Types
export interface Product {
  id: string;
  name: string;
  commodity: string;
  grade: string;
  packaging: string;
  origin: string;
  hsCodes: string[];
  description: string;
  availableForCampaigns: boolean;
  pricing?: Pricing;
}

export interface Pricing {
  id: string;
  productId: string;
  cost: number;
  margin: number;
  fxRate: number;
  duty: number;
  freight: number;
  surcharges: number;
  fobPrice: number;
  cifPrices: { port: string; price: number }[];
  effectiveDate: string;
  version: number;
}

export type OutreachType = 'priceUpdate' | 'introduction' | 'newProductLaunch' | 'festiveGreetings' | 'custom';
export type OutreachChannel = 'email' | 'whatsapp' | 'telecall';

// UI State Types
export interface StickyActionBarState {
  visible: boolean;
  selectedCompanies: Company[];
  enrichmentEstimate?: EnrichmentEstimate;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Enriched Profiles
export interface EnrichedProfile {
  companyId: string;
  companyName: string;
  verificationLevel: 'high' | 'medium' | 'low';
  lastEnrichedDate: string;
  verifiedCount: number;
  genericCount: number;
  partialCount: number;
  rfvSummary: {
    recency: number;
    frequency: number;
    volume: string;
  };
  commodity: string;
  geography: string;
  industry: string;
  charged: boolean;
}

// Hot Leads CRM Types
export interface Lead {
  id: string;
  companyId?: string;
  companyName: string;
  contactId?: string;
  contactName: string;
  email?: string;
  source: 'Campaign' | 'Manual' | 'CSV';
  status: 'New' | 'Qualified' | 'Meeting' | 'Sample or Quote' | 'Negotiation' | 'PO or Won' | 'Lost';
  statusReason?: string;
  interestCommodity?: string;
  interestSpec?: string;
  estimatedValue?: number;
  nextBestAction?: string;
  dueDate?: string;
  notes?: string;
  attachments?: string[];
  timeline: LeadEvent[];
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadEvent {
  id: string;
  type: 'status_change' | 'note_added' | 'quote_sent' | 'campaign_reply' | 'meeting_scheduled' | 'sample_sent' | 'po_received' | 'lead_created';
  timestamp: string;
  description: string;
  details?: {
    oldStatus?: string;
    newStatus?: string;
    quoteId?: string;
    campaignId?: string;
    [key: string]: any;
  };
}

export interface Quote {
  id: string;
  leadId: string;
  productId: string;
  productName: string;
  fobPrice: number;
  cifPrice?: number;
  incoterms: string;
  portOfLoading: string;
  portOfDischarge?: string;
  validityDate: string;
  pdfUrl: string;
  sentDate: string;
  quantity?: number;
  unit?: string;
  paymentTerms?: string;
  notes?: string;
}

// Settings Types
export interface EnrichmentRulesSettings {
  max_per_company: number;
  target_roles: string[];
  channels: string[];
  verification_mode: 'strict' | 'relaxed';
  geography: string;
  fields_to_enrich: string[];
}

export interface CreditBalance {
  totalCredits: number;
  contactCredits?: number;
  profileCredits?: number;
  billedEvents: CreditConsumptionEvent[];
}

export interface CreditConsumptionEvent {
  id: string;
  type: 'contact' | 'profile';
  amount: number;
  timestamp: string;
  description: string;
  companyName?: string;
  contactName?: string;
}

// Provenance and Evidence
export interface EnrichedProfileDrawerData {
  company: Company;
  enrichmentResult: EnrichmentResult;
  loading: boolean;
}

export type EnrichmentProgressStatus = 'queued' | 'fetching' | 'contacts_done' | 'profile_done' | 'complete' | 'error';

export interface BulkEnrichmentProgress {
  total: number;
  completed: number;
  verifiedContactsFound: number;
  companyStatuses: Map<string, EnrichmentProgressStatus>;
}

export interface ProvenanceInfo {
  source: string;
  field: string;
  ts: string;
}