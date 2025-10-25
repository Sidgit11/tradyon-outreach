import React, { useState, useEffect } from 'react';
import { 
  NavigationScreen,
  CampaignTab,
  BuildAudienceTab,
  SearchAssumptions, 
  Company,
  UploadMatchResult,
  ContactEnrichmentSettings, 
  Contact, 
  OutreachMessage, 
  ToastMessage,
  Segment,
  Bookmark,
  StickyActionBarState,
  EnrichmentEstimate,
  Product,
  Campaign,
  CampaignDetail,
  Lead,
  EnrichmentRulesSettings,
  CreditBalance
} from './types';
import { 
  mockSearch,
  mockUploadMatch,
  mockGetEnrichmentEstimate,
  mockEnrich,
  mockGetSegments,
  mockGetBookmarks,
  mockAddBookmark,
  mockCreateSegment,
  mockAddCompaniesToSegment,
  mockGetProducts,
  mockGetCampaigns,
  mockGetCampaignDetail,
  mockGetLeads,
  mockGetEnrichmentRules,
  mockUpdateEnrichmentRules,
  mockGetCredits,
  mockGetCreditSplitFeatureFlag,
  mockSetCreditSplitFeatureFlag
} from './mockApi';

import Header from './components/Header';
import Navigation from './components/Navigation';
import AssumptionsBar from './components/AssumptionsBar';
import BuildAudiencePage from './components/BuildAudiencePage';
import EnrichedProfilesPage from './components/EnrichedProfilesPage';
import SegmentsBookmarksPage from './components/SegmentsBookmarksPage';
import CampaignsPage from './components/CampaignsPage';
import HotLeadsPage from './components/HotLeadsPage';
import MyProductsPage from './components/MyProductsPage';
import SettingsPage from './components/SettingsPage';
import Toast from './components/Toast';

function App() {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>('buildAudience');
  const [activeBuildAudienceTab, setActiveBuildAudienceTab] = useState<BuildAudienceTab>('findBuyers');
  const [activeCampaignTab, setActiveCampaignTab] = useState<CampaignTab>('viewCampaigns');
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentAssumptions, setCurrentAssumptions] = useState<SearchAssumptions>({
    hs: [],
    markets: [],
    days: 180
  });
  const [assumptionsHistory, setAssumptionsHistory] = useState<SearchAssumptions[]>([]);

  // Search and company state
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [resultsShown, setResultsShown] = useState(0);
  const [refineSuggestions, setRefineSuggestions] = useState<string[]>([]);
  const [broadenSuggestions, setBroadenSuggestions] = useState<string[]>([]);
  
  // Upload state
  const [uploadMatchResults, setUploadMatchResults] = useState<UploadMatchResult[]>([]);
  
  // Selection and action bar state
  const [stickyActionBar, setStickyActionBar] = useState<StickyActionBarState>({
    visible: false,
    selectedCompanies: []
  });
  
  // Enrichment settings
  const [enrichmentSettings, setEnrichmentSettings] = useState<ContactEnrichmentSettings>({
    max_per_company: 2,
    target_roles: ['Procurement', 'QA'],
    region: 'local',
    channels: ['Email', 'LinkedIn'],
    verification_mode: 'strict'
  });
  
  // Segments and bookmarks
  const [segments, setSegments] = useState<Segment[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  // Products and campaigns
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState<CampaignDetail | null>(null);
  
  // Hot Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Settings state
  const [enrichmentRulesSettings, setEnrichmentRulesSettings] = useState<EnrichmentRulesSettings>({
    max_per_company: 3,
    target_roles: ['Procurement', 'QA', 'Operations'],
    channels: ['Email', 'LinkedIn', 'Phone'],
    verification_mode: 'strict',
    geography: 'global',
    fields_to_enrich: ['contact_info', 'company_profile', 'trade_history', 'certifications']
  });
  const [creditBalance, setCreditBalance] = useState<CreditBalance>({
    totalCredits: 450,
    contactCredits: 280,
    profileCredits: 170,
    billedEvents: []
  });
  const [creditSplitEnabled, setCreditSplitEnabled] = useState(true);
  
  // Campaign and contact state
  const [selectedContactForOutreach, setSelectedContactForOutreach] = useState<Contact | null>(null);
  const [outreachMessageTemplate, setOutreachMessageTemplate] = useState<OutreachMessage['template']>('intro');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [
          segmentsData, 
          bookmarksData, 
          productsData, 
          campaignsData, 
          leadsData, 
          enrichmentRulesData, 
          creditsData, 
          creditSplitFlag
        ] = await Promise.all([
          mockGetSegments(),
          mockGetBookmarks(),
          mockGetProducts(),
          mockGetCampaigns(),
          mockGetLeads(),
          mockGetEnrichmentRules(),
          mockGetCredits(),
          mockGetCreditSplitFeatureFlag()
        ]);
        setSegments(segmentsData);
        setBookmarks(bookmarksData);
        setProducts(productsData);
        setCampaigns(campaignsData);
        setLeads(leadsData);
        setEnrichmentRulesSettings(enrichmentRulesData);
        setCreditBalance(creditsData);
        setCreditSplitEnabled(creditSplitFlag);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    };
    loadSavedData();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Command palette
      // Removed command palette for now
      
      if (event.key === 'Escape') {
        // Close any open modals/drawers
      }
      
      // Navigation shortcuts
      if (event.key === 'e' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        handleScreenChange('enrichedProfiles');
      }
      if (event.key === 'c' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        handleScreenChange('campaigns');
      }
      if (event.key === 's' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        handleScreenChange('segmentsBookmarks');
      }
      if (event.key === 'u' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (assumptionsHistory.length > 1) {
          handleUndo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search handlers
  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    try {
      const response = await mockSearch(query);
      setCurrentAssumptions(response.assumptions);
      setAssumptionsHistory(prev => [...prev, response.assumptions]);
      setSearchResults(response.companies);
      setTotalCandidates(response.totalCandidates);
      setResultsShown(response.resultsShown);
      setRefineSuggestions(response.refineSuggestions);
      setBroadenSuggestions(response.broadenSuggestions);
    } catch (error) {
      console.error('Search failed:', error);
      showToast('Search failed. Please try again.', 'error');
    }
  };

  // Upload handlers
  const handleFileUpload = async (file: File) => {
    try {
      const results = await mockUploadMatch(file);
      setUploadMatchResults(results);
      showToast(`Processed ${results.length} entries from CSV`, 'success');
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('Upload failed. Please try again.', 'error');
    }
  };

  // Company selection handlers
  const handleCompanySelection = (companies: Company[]) => {
    setStickyActionBar({
      visible: companies.length > 0,
      selectedCompanies: companies
    });
  };

  // Enrichment handlers
  const handleGetEnrichmentEstimate = async (companyIds: string[]) => {
    try {
      const estimate = await mockGetEnrichmentEstimate(companyIds);
      setStickyActionBar(prev => ({
        ...prev,
        enrichmentEstimate: estimate
      }));
    } catch (error) {
      console.error('Failed to get enrichment estimate:', error);
    }
  };

  const handleEnrichCompanies = async (companyIds: string[]) => {
    try {
      const results = await mockEnrich(companyIds, enrichmentSettings);
      showToast(`Enriched ${results.length} companies`, 'success');
      // Handle enrichment results
    } catch (error) {
      console.error('Enrichment failed:', error);
      showToast('Enrichment failed. Please try again.', 'error');
    }
  };

  // Segment handlers
  const handleCreateSegment = async (name: string, description: string, companyIds: string[]) => {
    try {
      const newSegment = await mockCreateSegment(name, description, companyIds);
      setSegments(prev => [...prev, newSegment]);
      showToast(`Created segment "${name}" with ${companyIds.length} companies`, 'success');
    } catch (error) {
      console.error('Failed to create segment:', error);
      showToast('Failed to create segment', 'error');
    }
  };

  const handleAddToSegment = async (segmentId: string, companyIds: string[]) => {
    try {
      await mockAddCompaniesToSegment(segmentId, companyIds);
      showToast(`Added ${companyIds.length} companies to segment`, 'success');
    } catch (error) {
      console.error('Failed to add to segment:', error);
      showToast('Failed to add companies to segment', 'error');
    }
  };

  // Bookmark handlers
  const handleAddBookmark = async (companyId: string) => {
    try {
      const bookmark = await mockAddBookmark(companyId);
      setBookmarks(prev => [...prev, bookmark]);
      showToast('Company bookmarked!', 'success');
    } catch (error) {
      console.error('Failed to bookmark company:', error);
      showToast('Failed to bookmark company', 'error');
    }
  };

  // Settings handlers
  const handleEnrichmentRulesChange = async (settings: EnrichmentRulesSettings) => {
    try {
      const updatedSettings = await mockUpdateEnrichmentRules(settings);
      setEnrichmentRulesSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update enrichment rules:', error);
      showToast('Failed to update enrichment rules', 'error');
    }
  };

  const handleCreditSplitToggle = async (enabled: boolean) => {
    try {
      const newFlag = await mockSetCreditSplitFeatureFlag(enabled);
      setCreditSplitEnabled(newFlag);
      showToast(`Credit split view ${enabled ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      console.error('Failed to toggle credit split:', error);
      showToast('Failed to update credit split setting', 'error');
    }
  };

  const handleAssumptionsChange = (assumptions: SearchAssumptions) => {
    setCurrentAssumptions(assumptions);
    setAssumptionsHistory(prev => [...prev, assumptions]);
  };

  const handleUndo = () => {
    if (assumptionsHistory.length > 1) {
      const newHistory = [...assumptionsHistory];
      newHistory.pop(); // Remove current
      const previousAssumptions = newHistory[newHistory.length - 1];
      setCurrentAssumptions(previousAssumptions);
      setAssumptionsHistory(newHistory);
    }
  };

  const handleScreenChange = (screen: NavigationScreen, options?: {
    companyId?: string;
    contact?: Contact;
    template?: OutreachMessage['template'];
    campaignTab?: CampaignTab;
  }) => {
    setCurrentScreen(screen);
    
    if (options?.campaignTab) {
      setActiveCampaignTab(options.campaignTab);
    }
    
    if (options?.contact && screen === 'campaigns') {
      setSelectedContactForOutreach(options.contact);
      if (options.template) {
        setOutreachMessageTemplate(options.template);
      }
    }
  };

  const handleBuildAudienceTabChange = (tab: BuildAudienceTab) => {
    setActiveBuildAudienceTab(tab);
    // Clear selections when switching tabs
    setStickyActionBar({ visible: false, selectedCompanies: [] });
  };

  const handleCampaignTabChange = (tab: CampaignTab) => {
    setActiveCampaignTab(tab);
  };

  const handleCampaignSelect = async (campaignId: string) => {
    try {
      const detail = await mockGetCampaignDetail(campaignId);
      setSelectedCampaignDetail(detail);
    } catch (error) {
      console.error('Failed to load campaign detail:', error);
      showToast('Failed to load campaign details', 'error');
    }
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info', duration?: number) => {
    const toast: ToastMessage = {
      id: `toast_${Date.now()}`,
      message,
      type,
      duration
    };
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showAssumptionsBar = currentScreen === 'buildAudience' && (searchResults.length > 0 || uploadMatchResults.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {showAssumptionsBar && (
        <AssumptionsBar
          assumptions={currentAssumptions}
          onAssumptionsChange={handleAssumptionsChange}
          onUndo={assumptionsHistory.length > 1 ? handleUndo : undefined}
        />
      )}

      <div className="flex h-screen pt-16">
        <Navigation
          currentScreen={currentScreen}
          segmentsCount={segments.length}
          onScreenChange={handleScreenChange}
        />
        
        <main className="flex-1 overflow-auto">
          {currentScreen === 'buildAudience' && (
            <BuildAudiencePage
              activeTab={activeBuildAudienceTab}
              onTabChange={handleBuildAudienceTabChange}
              currentQuery={currentQuery}
              currentAssumptions={currentAssumptions}
              onAssumptionsChange={handleAssumptionsChange}
              onSearch={handleSearch}
              searchResults={searchResults}
              totalCandidates={totalCandidates}
              resultsShown={resultsShown}
              refineSuggestions={refineSuggestions}
              broadenSuggestions={broadenSuggestions}
              uploadMatchResults={uploadMatchResults}
              onFileUpload={handleFileUpload}
              stickyActionBar={stickyActionBar}
              onCompanySelection={handleCompanySelection}
              onGetEnrichmentEstimate={handleGetEnrichmentEstimate}
              onEnrichCompanies={handleEnrichCompanies}
              onCreateSegment={handleCreateSegment}
              onAddToSegment={handleAddToSegment}
              onAddBookmark={handleAddBookmark}
              onStartCampaign={(companies) => handleScreenChange('campaigns', { contact: { id: 'bulk', company_name: 'Multiple Companies', contact_name: 'Bulk Audience', email: '', verification: 'generic', billed: false } })}
              segments={segments}
              showToast={showToast}
            />
          )}

          {currentScreen === 'enrichedProfiles' && (
            <EnrichedProfilesPage 
              onScreenChange={handleScreenChange}
              showToast={showToast}
            />
          )}
          
          {currentScreen === 'segmentsBookmarks' && (
            <SegmentsBookmarksPage
              segments={segments}
              bookmarks={bookmarks}
              onScreenChange={handleScreenChange}
              onCreateSegment={handleCreateSegment}
              onAddBookmark={handleAddBookmark}
              showToast={showToast}
            />
          )}
          
          {currentScreen === 'campaigns' && (
            <CampaignsPage 
              selectedContactForOutreach={selectedContactForOutreach}
              outreachMessageTemplate={outreachMessageTemplate}
              activeCampaignTab={activeCampaignTab}
              onCampaignTabChange={handleCampaignTabChange}
              campaigns={campaigns}
              selectedCampaignDetail={selectedCampaignDetail}
              onCampaignSelect={handleCampaignSelect}
              onCloseCampaignDetail={() => setSelectedCampaignDetail(null)}
              products={products}
              showToast={showToast}
            />
          )}
          
          {currentScreen === 'hotLeads' && (
            <HotLeadsPage 
              leads={leads}
              onLeadsChange={setLeads}
              products={products}
              onScreenChange={handleScreenChange}
              showToast={showToast}
            />
          )}
          
          {currentScreen === 'myProducts' && (
            <MyProductsPage 
              products={products}
              onProductsChange={setProducts}
              showToast={showToast}
            />
          )}
          
          {currentScreen === 'settings' && (
            <SettingsPage 
              enrichmentRulesSettings={enrichmentRulesSettings}
              onEnrichmentRulesChange={handleEnrichmentRulesChange}
              creditBalance={creditBalance}
              creditSplitEnabled={creditSplitEnabled}
              onCreditSplitToggle={handleCreditSplitToggle}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}

export default App;