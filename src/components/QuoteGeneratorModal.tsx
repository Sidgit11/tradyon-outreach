import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Calendar, FileText, Download, Send } from 'lucide-react';
import { Lead, Product, Quote } from '../types';
import { mockCreateQuote, mockComputeCIF } from '../mockApi';

interface QuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  products: Product[];
  onQuoteGenerated: (lead: Lead) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function QuoteGeneratorModal({ 
  isOpen, 
  onClose, 
  lead, 
  products, 
  onQuoteGenerated, 
  showToast 
}: QuoteGeneratorModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteData, setQuoteData] = useState({
    quantity: 1,
    unit: 'MT',
    incoterms: 'FOB',
    portOfLoading: 'Ho Chi Minh City',
    portOfDischarge: '',
    validityDate: '',
    paymentTerms: '30 days LC at sight',
    notes: ''
  });
  const [includeCIF, setIncludeCIF] = useState(false);
  const [cifPrice, setCifPrice] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);

  // Set default validity date (30 days from now)
  useEffect(() => {
    const defaultValidityDate = new Date();
    defaultValidityDate.setDate(defaultValidityDate.getDate() + 30);
    setQuoteData(prev => ({
      ...prev,
      validityDate: defaultValidityDate.toISOString().split('T')[0]
    }));
  }, []);

  // Auto-select product if lead has interest commodity
  useEffect(() => {
    if (lead.interestCommodity && products.length > 0) {
      const matchingProduct = products.find(p => 
        p.commodity.toLowerCase().includes(lead.interestCommodity!.toLowerCase()) ||
        p.name.toLowerCase().includes(lead.interestCommodity!.toLowerCase())
      );
      if (matchingProduct) {
        setSelectedProduct(matchingProduct);
      }
    }
  }, [lead.interestCommodity, products]);

  // Calculate CIF when product or port changes
  useEffect(() => {
    if (selectedProduct && includeCIF && quoteData.portOfDischarge) {
      calculateCIF();
    }
  }, [selectedProduct, includeCIF, quoteData.portOfDischarge]);

  const calculateCIF = async () => {
    if (!selectedProduct || !quoteData.portOfDischarge) return;

    try {
      const result = await mockComputeCIF(selectedProduct.id, quoteData.portOfDischarge);
      setCifPrice(result.cifPrice);
    } catch (error) {
      console.error('Failed to calculate CIF:', error);
      setCifPrice(null);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCifPrice(null);
  };

  const handleGenerateQuote = async () => {
    if (!selectedProduct) {
      showToast('Please select a product', 'warning');
      return;
    }

    if (!quoteData.validityDate) {
      showToast('Please set a validity date', 'warning');
      return;
    }

    setGenerating(true);
    try {
      const quote: Omit<Quote, 'id' | 'pdfUrl' | 'sentDate'> = {
        leadId: lead.id,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        fobPrice: selectedProduct.pricing?.fobPrice || 0,
        cifPrice: includeCIF ? cifPrice || undefined : undefined,
        incoterms: quoteData.incoterms,
        portOfLoading: quoteData.portOfLoading,
        portOfDischarge: includeCIF ? quoteData.portOfDischarge : undefined,
        validityDate: quoteData.validityDate,
        quantity: quoteData.quantity,
        unit: quoteData.unit,
        paymentTerms: quoteData.paymentTerms,
        notes: quoteData.notes
      };

      const createdQuote = await mockCreateQuote(quote);
      
      // Update lead with quote sent event (this is handled in mockCreateQuote)
      // Trigger callback to refresh lead data
      onQuoteGenerated(lead);
      
      showToast(`Quote generated successfully! Quote ID: ${createdQuote.id}`, 'success');
      onClose();
    } catch (error) {
      console.error('Failed to generate quote:', error);
      showToast('Failed to generate quote', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const availableProducts = products.filter(p => p.availableForCampaigns);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generate Quote</h3>
            <p className="text-sm text-gray-600">
              For {lead.companyName} - {lead.contactName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Selection */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <Package className="w-4 h-4" />
                  <span>Select Product</span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedProduct?.id === product.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.grade} • {product.packaging}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            ${product.pricing?.fobPrice.toFixed(2)}/kg
                          </div>
                          <div className="text-xs text-gray-500">FOB</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {availableProducts.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm text-yellow-800">
                      No products available for quotes. Please add products in My Products and mark them as available for campaigns.
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quoteData.quantity}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={quoteData.unit}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="MT">Metric Tons (MT)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quote Details */}
            <div className="space-y-4">
              {/* Pricing Display */}
              {selectedProduct && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Pricing Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">FOB Price:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${selectedProduct.pricing?.fobPrice.toFixed(2)}/kg
                      </span>
                    </div>
                    {includeCIF && cifPrice && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">CIF Price:</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${cifPrice.toFixed(2)}/kg
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-900">Total Value:</span>
                        <span className="text-sm font-bold text-gray-900">
                          ${((selectedProduct.pricing?.fobPrice || 0) * quoteData.quantity * 1000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trade Terms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incoterms
                  </label>
                  <select
                    value={quoteData.incoterms}
                    onChange={(e) => {
                      setQuoteData(prev => ({ ...prev, incoterms: e.target.value }));
                      setIncludeCIF(e.target.value === 'CIF');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="FOB">FOB (Free on Board)</option>
                    <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                    <option value="CFR">CFR (Cost and Freight)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port of Loading
                  </label>
                  <input
                    type="text"
                    value={quoteData.portOfLoading}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, portOfLoading: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Ho Chi Minh City"
                  />
                </div>
              </div>

              {/* CIF Options */}
              {includeCIF && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port of Discharge
                  </label>
                  <input
                    type="text"
                    value={quoteData.portOfDischarge}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, portOfDischarge: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Rotterdam"
                  />
                </div>
              )}

              {/* Payment Terms and Validity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <select
                    value={quoteData.paymentTerms}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="30 days LC at sight">30 days LC at sight</option>
                    <option value="LC at sight">LC at sight</option>
                    <option value="T/T in advance">T/T in advance</option>
                    <option value="30 days T/T">30 days T/T</option>
                    <option value="60 days T/T">60 days T/T</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Valid Until</span>
                  </label>
                  <input
                    type="date"
                    value={quoteData.validityDate}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, validityDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Additional Notes</span>
                </label>
                <textarea
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add any special terms, conditions, or notes..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={() => showToast('Preview functionality coming soon!', 'info')}
            disabled={!selectedProduct}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          <button
            onClick={handleGenerateQuote}
            disabled={!selectedProduct || generating}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{generating ? 'Generating...' : 'Generate & Send Quote'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}