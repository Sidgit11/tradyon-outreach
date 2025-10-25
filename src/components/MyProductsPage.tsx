import React from 'react';
import { Package, Plus, Edit3, Trash2, DollarSign, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { Product, Pricing } from '../types';
import { mockCreateProduct, mockUpdateProductPricing } from '../mockApi';

interface MyProductsPageProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function MyProductsPage({ products, onProductsChange, showToast }: MyProductsPageProps) {
  const [editingPricing, setEditingPricing] = React.useState<string | null>(null);
  const [pricingForm, setPricingForm] = React.useState<Partial<Pricing>>({});
  const [showAddProduct, setShowAddProduct] = React.useState(false);
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    name: '',
    commodity: '',
    grade: '',
    packaging: '',
    origin: '',
    hsCodes: [],
    description: '',
    availableForCampaigns: true
  });

  const handleEditPricing = (product: Product) => {
    setEditingPricing(product.id);
    setPricingForm(product.pricing || {
      id: '',
      productId: product.id,
      cost: 0,
      margin: 0.25,
      fxRate: 1.08,
      duty: 0.15,
      freight: 0.25,
      surcharges: 0.10,
      fobPrice: 0,
      cifPrices: [],
      effectiveDate: new Date().toISOString().split('T')[0],
      version: 1
    });
  };

  const calculateFOBPrice = (pricing: Partial<Pricing>) => {
    const { cost = 0, margin = 0, fxRate = 1 } = pricing;
    return Math.round(cost * (1 + margin) * fxRate * 100) / 100;
  };

  const calculateCIFPrices = (fobPrice: number) => {
    return [
      { port: 'Rotterdam', price: Math.round(fobPrice * 1.15 * 100) / 100 },
      { port: 'Hamburg', price: Math.round(fobPrice * 1.17 * 100) / 100 },
      { port: 'Antwerp', price: Math.round(fobPrice * 1.14 * 100) / 100 },
      { port: 'Felixstowe', price: Math.round(fobPrice * 1.16 * 100) / 100 }
    ];
  };

  const handleSavePricing = async () => {
    if (!editingPricing || !pricingForm) return;

    try {
      const fobPrice = calculateFOBPrice(pricingForm);
      const cifPrices = calculateCIFPrices(fobPrice);
      
      const updatedPricing: Pricing = {
        ...pricingForm,
        id: pricingForm.id || `pricing_${Date.now()}`,
        productId: editingPricing,
        fobPrice,
        cifPrices,
        effectiveDate: new Date().toISOString().split('T')[0],
        version: (pricingForm.version || 0) + 1
      } as Pricing;

      await mockUpdateProductPricing(updatedPricing);
      
      const updatedProducts = products.map(p => 
        p.id === editingPricing 
          ? { ...p, pricing: updatedPricing }
          : p
      );
      
      onProductsChange(updatedProducts);
      setEditingPricing(null);
      setPricingForm({});
      showToast('Pricing updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update pricing:', error);
      showToast('Failed to update pricing', 'error');
    }
  };

  const handleToggleAvailability = (productId: string) => {
    const updatedProducts = products.map(p => 
      p.id === productId 
        ? { ...p, availableForCampaigns: !p.availableForCampaigns }
        : p
    );
    onProductsChange(updatedProducts);
    showToast('Product availability updated', 'success');
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.commodity) {
      showToast('Please fill in required fields', 'warning');
      return;
    }

    try {
      const product = await mockCreateProduct(newProduct as Omit<Product, 'id'>);
      onProductsChange([...products, product]);
      setNewProduct({
        name: '',
        commodity: '',
        grade: '',
        packaging: '',
        origin: '',
        hsCodes: [],
        description: '',
        availableForCampaigns: true
      });
      setShowAddProduct(false);
      showToast('Product added successfully!', 'success');
    } catch (error) {
      console.error('Failed to add product:', error);
      showToast('Failed to add product', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog and specifications
          </p>
        </div>
        
        <button
          onClick={() => setShowAddProduct(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.grade}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => showToast('Edit product functionality coming soon!', 'info')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => showToast('Delete product functionality coming soon!', 'info')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Packaging:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.packaging}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Origin:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.origin}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">HS Codes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.hsCodes.map((code) => (
                        <span
                          key={code}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{product.description}</p>
                  
                  {/* Campaign Availability Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Available for Price Update campaigns</span>
                    <button
                      onClick={() => handleToggleAvailability(product.id)}
                      className="flex items-center"
                    >
                      {product.availableForCampaigns ? (
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span>Pricing</span>
                  </h4>
                  <button
                    onClick={() => handleEditPricing(product)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {editingPricing === product.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($/kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.cost || ''}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Margin (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={(pricingForm.margin || 0) * 100}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, margin: parseFloat(e.target.value) / 100 || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FX Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.fxRate || ''}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, fxRate: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duty ($/kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.duty || ''}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, duty: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Freight ($/kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.freight || ''}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, freight: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Surcharges ($/kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pricingForm.surcharges || ''}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, surcharges: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingPricing(null);
                          setPricingForm({});
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePricing}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Pricing</span>
                      </button>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-medium text-green-800 mb-2">Calculated Prices:</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-green-700">FOB Price:</span>
                          <span className="font-medium text-green-900">${calculateFOBPrice(pricingForm).toFixed(2)}/kg</span>
                        </div>
                        {calculateCIFPrices(calculateFOBPrice(pricingForm)).map(({ port, price }) => (
                          <div key={port} className="flex justify-between text-sm">
                            <span className="text-green-600">CIF {port}:</span>
                            <span className="text-green-800">${price.toFixed(2)}/kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {product.pricing ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-sm font-medium text-gray-800 mb-2">Current Pricing:</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-700">FOB Price:</span>
                              <span className="font-medium text-gray-900">${product.pricing.fobPrice.toFixed(2)}/kg</span>
                            </div>
                            {product.pricing.cifPrices.map(({ port, price }) => (
                              <div key={port} className="flex justify-between text-sm">
                                <span className="text-gray-600">CIF {port}:</span>
                                <span className="text-gray-800">${price.toFixed(2)}/kg</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last updated: {product.pricing.effectiveDate} (v{product.pricing.version})
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm text-yellow-800">
                          No pricing set for this product. Click "Edit" to add pricing information.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Find Buyers Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => showToast(`Finding buyers for ${product.name}...`, 'info')}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                Find Buyers for This Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for when no products exist */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-6">
            Add your products to create targeted buyer searches and track market opportunities
          </p>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Premium Black Pepper"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commodity *
                    </label>
                    <input
                      type="text"
                      value={newProduct.commodity}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, commodity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Pepper"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <input
                      type="text"
                      value={newProduct.grade}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., ASTA 500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Packaging
                    </label>
                    <input
                      type="text"
                      value={newProduct.packaging}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, packaging: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 500g pouches"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      value={newProduct.origin}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, origin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Vietnam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HS Codes
                    </label>
                    <input
                      type="text"
                      value={newProduct.hsCodes?.join(', ') || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, hsCodes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 090411, 090412"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of the product..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="availableForCampaigns"
                    checked={newProduct.availableForCampaigns}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, availableForCampaigns: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="availableForCampaigns" className="text-sm text-gray-700">
                    Available for Price Update campaigns
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}