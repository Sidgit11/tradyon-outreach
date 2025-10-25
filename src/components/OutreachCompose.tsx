import React, { useState } from 'react';
import { Upload, Send, Eye, AlertCircle, Users, Package, DollarSign } from 'lucide-react';
import { Contact, OutreachMessage, OutreachSequence, Product, OutreachType, OutreachChannel } from '../types';
import { mockUploadOutreachCSV, mockStartCampaign, mockComputeCIF } from '../mockApi';

interface OutreachComposeProps {
  selectedContactForOutreach?: Contact | null;
  outreachMessageTemplate?: OutreachMessage['template'];
  products: Product[];
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  loading?: boolean;
}

export default function OutreachCompose({ 
  selectedContactForOutreach, 
  outreachMessageTemplate = 'intro',
  products,
  showToast,
  loading = false 
}: OutreachComposeProps) {
  const [audience, setAudience] = useState<Contact[]>([]);
  const [audienceSource, setAudienceSource] = useState<'segments' | 'bookmarks' | 'enrichedProfiles' | 'csv'>('segments');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  
  // Campaign type and settings
  const [campaignType, setCampaignType] = useState<OutreachType>('introduction');
  const [channel, setChannel] = useState<OutreachChannel>('email');
  const [sendTiming, setSendTiming] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  
  // Price Update specific
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [includeCIF, setIncludeCIF] = useState(false);
  const [cifPreviews, setCifPreviews] = useState<{ [contactId: string]: number }>({});
  
  const [message, setMessage] = useState<OutreachMessage>({
    template: 'intro',
    tone: 'neutral',
    subject: '',
    body: '',
    include_evidence: true,
    attach_lead_card: true,
    channel: 'email',
    productId: undefined,
    includeCIF: false
  });
  
  const [useSequence, setUseSequence] = useState(false);
  const [sequence, setSequence] = useState<OutreachSequence>({
    days: [0, 3, 7],
    stop_on_reply: true,
    timezone: 'UTC'
  });

  // Pre-fill audience if contact is provided
  React.useEffect(() => {
    if (selectedContactForOutreach) {
      setAudience([selectedContactForOutreach]);
      setAudienceSource('segments');
    }
  }, [selectedContactForOutreach]);

  // Update message template when campaign type changes
  React.useEffect(() => {
    updateMessageTemplate();
  }, [campaignType, selectedProduct, includeCIF]);

  const updateMessageTemplate = () => {
    const templates = getTemplateContent(campaignType);
    setMessage(prev => ({
      ...prev,
      template: campaignType === 'introduction' ? 'intro' : campaignType,
      subject: templates.subject,
      body: templates.body,
      productId: selectedProduct?.id,
      includeCIF
    }));
  };

  // Compute CIF previews when product or includeCIF changes
  React.useEffect(() => {
    if (selectedProduct && includeCIF && audience.length > 0) {
      computeCIFPreviews();
    }
  }, [selectedProduct, includeCIF, audience]);

  const computeCIFPreviews = async () => {
    if (!selectedProduct) return;
    
    const previews: { [contactId: string]: number } = {};
    
    for (const contact of audience) {
      try {
        const result = await mockComputeCIF(selectedProduct.id, contact.country || 'Rotterdam');
        previews[contact.id] = result.cifPrice;
      } catch (error) {
        console.error('Failed to compute CIF for', contact.contact_name, error);
      }
    }
    
    setCifPreviews(previews);
  };

  const getTemplateContent = (type: OutreachType) => {
    switch (type) {
      case 'introduction':
        return {
          subject: 'Partnership opportunity for premium spices',
          body: `Hi {{name}},

I noticed your company has been actively importing spices from Southeast Asia, particularly:

• 7 shipments in the last 90 days
• Exact ASTA 500 grade match with our products  
• Shared logistics partner: DHL Global

We're a premium spice supplier with 15+ years experience serving European buyers. Our ASTA 500 pepper consistently meets the quality standards you require.

Would you be interested in a brief call to discuss how we can support your procurement needs?

Best regards,
[Your name]`
        };
      case 'priceUpdate':
        const productName = selectedProduct?.name || 'Premium Product';
        const fobPrice = selectedProduct?.pricing?.fobPrice || 0;
        return {
          subject: `Updated pricing for ${productName} - {{company}}`,
          body: `Hi {{name}},

I hope this message finds you well. I wanted to share our updated pricing for ${productName}:

• Product: ${productName}
• Grade: ${selectedProduct?.grade || 'Premium'}
• FOB Price: $${fobPrice.toFixed(2)}/kg
${includeCIF ? '• CIF Price: ${{cifPrice}}/kg (to {{port}})' : ''}
• Minimum Order: 5MT
• Payment Terms: 30 days LC

This pricing is competitive and reflects current market conditions. We have immediate availability and can ship within 2 weeks.

Would you like to discuss your requirements for the coming quarter?

Best regards,
[Your name]`
        };
      case 'newProductLaunch':
        return {
          subject: 'Introducing our new premium product line - {{company}}',
          body: `Hi {{name}},

I'm excited to introduce our latest product innovation that I believe would be perfect for your market:

• New premium grade with enhanced specifications
• Sustainable sourcing with full traceability
• Competitive pricing for early adopters
• Free samples available for evaluation

Given your focus on quality products, I'd love to arrange a brief call to discuss how this fits your procurement strategy.

Best regards,
[Your name]`
        };
      case 'festiveGreetings':
        return {
          subject: 'Season\'s Greetings from [Your Company] - {{company}}',
          body: `Hi {{name}},

As we approach the end of another successful year, I wanted to take a moment to thank you for your continued partnership and trust in our products.

Looking ahead to the new year, we're excited about new opportunities to serve your business better. We have some exciting developments planned that I'd love to share with you.

Wishing you and your team a wonderful holiday season and a prosperous new year!

Warm regards,
[Your name]`
        };
      case 'custom':
        return {
          subject: 'Custom message - {{company}}',
          body: `Hi {{name}},

[Your custom message here]

Best regards,
[Your name]`
        };
      default:
        return { subject: '', body: '' };
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    try {
      const result = await mockUploadOutreachCSV(file);
      setAudience(result.contacts);
      setCsvErrors(result.errors);
    } catch (error) {
      console.error('Failed to upload CSV:', error);
      setCsvErrors(['Failed to parse CSV file']);
      showToast('Failed to upload CSV file', 'error');
    }
  };

  const handleSend = async () => {
    if (audience.length === 0) {
      showToast('Please select an audience for your campaign', 'warning');
      return;
    }
    
    try {
      const result = await mockStartCampaign(audience, message, useSequence ? sequence : undefined);
      showToast(`Campaign started successfully! Campaign ID: ${result.campaign_id}`, 'success');
      // Reset form
      setAudience([]);
      setCsvFile(null);
    } catch (error) {
      console.error('Failed to start campaign:', error);
      showToast('Failed to start campaign', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WHO Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Who</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="audience"
                  value="segments"
                  checked={audienceSource === 'segments'}
                  onChange={(e) => setAudienceSource(e.target.value as any)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">From Segments</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="audience"
                  value="bookmarks"
                  checked={audienceSource === 'bookmarks'}
                  onChange={(e) => setAudienceSource(e.target.value as any)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">From Bookmarks</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="audience"
                  value="enrichedProfiles"
                  checked={audienceSource === 'enrichedProfiles'}
                  onChange={(e) => setAudienceSource(e.target.value as any)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Enriched Profiles</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="audience"
                  value="csv"
                  checked={audienceSource === 'csv'}
                  onChange={(e) => setAudienceSource(e.target.value as any)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Upload CSV</span>
              </label>
            </div>

            {audienceSource === 'csv' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-2">
                      Upload CSV with contacts
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                {csvFile && (
                  <div className="text-sm text-gray-600">
                    File: {csvFile.name} ({audience.length} contacts loaded)
                  </div>
                )}

                {csvErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-800">CSV Errors:</div>
                        <ul className="text-sm text-red-700 mt-1">
                          {csvErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Required: company_name, contact_name, email<br/>
                  Optional: title, country, phone, whatsapp_phone, linkedin_url, product, grade, pack, hs_code, lane_origin, lane_destination, market, moq_mt, notes
                </div>
              </div>
            )}

            {audienceSource !== 'csv' && audience.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Selected Audience</span>
                </div>
                <div className="text-sm text-gray-600">
                  {audience.length} contact{audience.length !== 1 ? 's' : ''} selected
                </div>
                <div className="mt-2 space-y-1">
                  {audience.slice(0, 3).map((contact, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {contact.contact_name} at {contact.company_name}
                    </div>
                  ))}
                  {audience.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{audience.length - 3} more contacts
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {audienceSource !== 'csv' && audience.length === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-800">
                  No audience selected. Please select companies from Build Audience or Enriched Profiles first.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WHEN Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">When</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="timing"
                  value="now"
                  checked={sendTiming === 'now'}
                  onChange={(e) => setSendTiming(e.target.value as any)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Send now</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="timing"
                  value="scheduled"
                  checked={sendTiming === 'scheduled'}
                  onChange={(e) => setSendTiming(e.target.value as any)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Schedule</span>
              </label>
            </div>

            {sendTiming === 'scheduled' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Berlin">Berlin</option>
                    <option value="America/New_York">New York</option>
                    <option value="Asia/Singapore">Singapore</option>
                  </select>
                </div>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Safe throttling:</strong> Messages will be sent with appropriate delays to ensure deliverability.
              </div>
            </div>
          </div>
        </div>

        {/* HOW Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="channel"
                  value="email"
                  checked={channel === 'email'}
                  onChange={(e) => setChannel(e.target.value as OutreachChannel)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="channel"
                  value="whatsapp"
                  checked={channel === 'whatsapp'}
                  onChange={(e) => setChannel(e.target.value as OutreachChannel)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="channel"
                  value="telecall"
                  checked={channel === 'telecall'}
                  onChange={(e) => setChannel(e.target.value as OutreachChannel)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Tele-call</span>
              </label>
            </div>

            {channel === 'telecall' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-800">
                  <strong>Tele-call mode:</strong> This will generate call tasks and provide a script based on your message content.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WHAT Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Type
              </label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as OutreachType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="introduction">Introduction</option>
                <option value="priceUpdate">Price Update</option>
                <option value="newProductLaunch">New Product Launch</option>
                <option value="festiveGreetings">Festive Greetings</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Price Update Widget */}
            {campaignType === 'priceUpdate' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-800">Price Update Settings</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product
                  </label>
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const product = products.find(p => p.id === e.target.value);
                      setSelectedProduct(product || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a product...</option>
                    {products.filter(p => p.availableForCampaigns).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.grade}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProduct && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                        <div className="text-sm text-gray-600">{selectedProduct.grade} • {selectedProduct.packaging}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900">
                            ${selectedProduct.pricing?.fobPrice.toFixed(2)}/kg FOB
                          </span>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeCIF}
                        onChange={(e) => setIncludeCIF(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Also send CIF for buyer's preferred port wherever available
                      </span>
                    </label>

                    {includeCIF && audience.length > 0 && Object.keys(cifPreviews).length > 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-2">CIF Price Preview:</div>
                        <div className="space-y-1">
                          {audience.slice(0, 3).map(contact => (
                            <div key={contact.id} className="flex justify-between text-sm">
                              <span className="text-blue-700">{contact.contact_name}</span>
                              <span className="font-medium text-blue-900">
                                ${cifPreviews[contact.id]?.toFixed(2) || 'N/A'}/kg CIF
                              </span>
                            </div>
                          ))}
                          {audience.length > 3 && (
                            <div className="text-xs text-blue-600">
                              +{audience.length - 3} more recipients
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  value={message.tone}
                  onChange={(e) => setMessage(prev => ({ ...prev, tone: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="neutral">Neutral</option>
                  <option value="formal">Formal</option>
                  <option value="concise">Concise</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Composition */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Content</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={message.subject}
              onChange={(e) => setMessage(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Body
            </label>
            <textarea
              value={message.body}
              onChange={(e) => setMessage(prev => ({ ...prev, body: e.target.value }))}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={message.include_evidence}
                onChange={(e) => setMessage(prev => ({ ...prev, include_evidence: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Include evidence bullets</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={message.attach_lead_card}
                onChange={(e) => setMessage(prev => ({ ...prev, attach_lead_card: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Attach Lead Card</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sequence Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequence Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="send_type"
                checked={!useSequence}
                onChange={() => setUseSequence(false)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Send now</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="send_type"
                checked={useSequence}
                onChange={() => setUseSequence(true)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Start sequence</span>
            </label>
          </div>

          {useSequence && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sequence Days
                </label>
                <input
                  type="text"
                  value={sequence.days.join(', ')}
                  onChange={(e) => setSequence(prev => ({ 
                    ...prev, 
                    days: e.target.value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d))
                  }))}
                  placeholder="0, 3, 7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sequence.stop_on_reply}
                  onChange={(e) => setSequence(prev => ({ ...prev, stop_on_reply: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Stop sequence on reply</span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => showToast('Preview functionality coming soon!', 'info')}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={handleSend}
                disabled={loading || audience.length === 0}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : useSequence ? 'Start Sequence' : sendTiming === 'now' ? 'Send Now' : 'Schedule Campaign'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}