"use client";

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import type { InventoryItem } from '@/lib/api';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ScanBarcode,
  Package,
  AlertTriangle,
  X,
  Camera,
  Loader2,
  Sparkles,
  Printer,
  QrCode,
  FileBarChart,
  Image as ImageIcon
} from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';

// Helper component to display either Barcode or QR Code
const BarcodeDisplay = ({ value, width = 1.5, height = 40, fontSize = 12 }: { value: string, width?: number, height?: number, fontSize?: number }) => {
  const isJSON = value.trim().startsWith('{') || value.trim().startsWith('[');

  if (isJSON) {
    return (
      <div className="flex flex-col items-center">
        <QRCodeSVG value={value} size={height * 2.5} level={"M"} />
      </div>
    );
  }

  return <Barcode value={value} width={width} height={height} fontSize={fontSize} />;
};

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showModalScanner, setShowModalScanner] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [generatedBarcode, setGeneratedBarcode] = useState<string>('');

  // Print data state
  const [printData, setPrintData] = useState<any>(null);

  // Hidden file input ref for uploading barcode images
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    minLevel: 5,
    price: 0,
    supplier: '',
    barcode: '',
  });

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const modalScannerRef = useRef<Html5QrcodeScanner | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Barcode Label',
    onAfterPrint: () => toast.success('Label printed!'),
  });

  // ... (inside the component)



  const triggerPrint = (data: any) => {
    if (!data.barcode) {
      toast.error('No barcode to print');
      return;
    }
    // Ensure all fields are present for printing
    setPrintData({
      name: data.name,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      unit: data.unit,
      supplier: data.supplier,
      barcode: data.barcode
    });

    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
      if (modalScannerRef.current) {
        modalScannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getInventory();
      if (response.success && response.data) {
        setInventory(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const response = await apiClient.updateInventoryItem(editingItem._id, formData);
        if (response.success) {
          toast.success('Inventory item updated successfully');
          fetchInventory();
          closeModal();
        }
      } else {
        const response = await apiClient.createInventoryItem(formData);
        if (response.success) {
          toast.success('Inventory item created successfully');
          fetchInventory();
          closeModal();
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save inventory item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await apiClient.deleteInventoryItem(id);
      if (response.success) {
        toast.success('Inventory item deleted successfully');
        fetchInventory();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete inventory item');
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minLevel: item.minLevel,
      price: item.price,
      supplier: item.supplier || '',
      barcode: item.barcode || '',
    });
    setGeneratedBarcode(item.barcode || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setGeneratedBarcode('');
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: 'kg',
      minLevel: 5,
      price: 0,
      supplier: '',
      barcode: '',
    });
    if (modalScannerRef.current) {
      modalScannerRef.current.clear().catch(console.error);
      modalScannerRef.current = null;
    }
    setShowModalScanner(false);
  };

  const generateStandardBarcode = () => {
    if (!formData.name) {
      toast.error('Item name is required');
      return;
    }
    const timestamp = Date.now().toString().slice(-6);
    const nameCode = formData.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6)
      .padEnd(6, '0');
    const generated = `${nameCode}${timestamp}`;
    setFormData({ ...formData, barcode: generated });
    setGeneratedBarcode(generated);
    toast.success('Standard Barcode generated!');
  };

  const generateSmartQRCode = () => {
    if (!formData.name) {
      toast.error('Item name is required');
      return;
    }
    const smartData = {
      name: formData.name,
      cat: formData.category,
      qty: formData.quantity,
      unit: formData.unit,
      min: formData.minLevel,
      price: formData.price,
      sup: formData.supplier,
      t: Date.now()
    };
    const jsonString = JSON.stringify(smartData);
    setFormData({ ...formData, barcode: jsonString });
    setGeneratedBarcode(jsonString);
    toast.success('Smart QR Code generated!');
  };

  const handleScannedData = async (decodedText: string) => {
    console.log("Processing Scanned Data:", decodedText);

    // 1. Try JSON (Smart Code)
    try {
      const parsedData = JSON.parse(decodedText);
      if (parsedData && (parsedData.name || parsedData.n)) { // Loose check for smart code structure
        console.log("Smart Code Detected:", parsedData);
        setFormData(prev => ({
          ...prev,
          name: parsedData.name || prev.name,
          category: parsedData.cat || prev.category,
          quantity: parsedData.qty !== undefined ? Number(parsedData.qty) : prev.quantity,
          unit: parsedData.unit || prev.unit,
          minLevel: parsedData.min !== undefined ? Number(parsedData.min) : prev.minLevel,
          price: parsedData.price !== undefined ? Number(parsedData.price) : prev.price,
          supplier: parsedData.sup || prev.supplier,
          barcode: decodedText
        }));
        setGeneratedBarcode(decodedText);

        if (!showModal) {
          setShowModal(true);
          toast.success('Restored Item from Smart Code!');
        } else {
          toast.success('Form filled from Smart Code');
        }
        return;
      }
    } catch (e) {
      // Not JSON, continue
    }

    // 2. Try Database Lookup (Standard Barcode)
    try {
      const response = await apiClient.getInventoryByBarcode(decodedText);
      if (response.success && response.data) {
        openEditModal(response.data);
        toast.success("Item found!");
      } else {
        // Not in DB (e.g. deleted standard barcode or new one)
        if (!showModal) {
          setFormData(prev => ({ ...prev, barcode: decodedText }));
          setGeneratedBarcode(decodedText);
          setShowModal(true);
          toast("New/Deleted item detected (ID Only)", { icon: '🆕' });
        } else {
          setFormData(prev => ({ ...prev, barcode: decodedText }));
          setGeneratedBarcode(decodedText);
          toast.success("Barcode ID set");
        }
      }
    } catch (error) {
      // Error fallback
      if (!showModal) {
        setFormData(prev => ({ ...prev, barcode: decodedText }));
        setGeneratedBarcode(decodedText);
        setShowModal(true);
      } else {
        setFormData(prev => ({ ...prev, barcode: decodedText }));
        setGeneratedBarcode(decodedText);
      }
    }
  };

  // Dedicated File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const html5QrCode = new Html5Qrcode("upload-scanner-hidden");

    try {
      toast.loading('Scanning image...', { id: 'scan-toast' });
      const decodedText = await html5QrCode.scanFile(file, true);
      toast.dismiss('scan-toast');
      await handleScannedData(decodedText);
    } catch (err) {
      toast.dismiss('scan-toast');
      toast.error("Could not read code. Try a clearer image.");
      console.error("File scan error:", err);
    } finally {
      html5QrCode.clear();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startScanner = () => {
    setShowScanner(true);
    setScannerActive(true);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "barcode-reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        false
      );
      scanner.render(
        async (decodedText) => {
          await handleScannedData(decodedText);
          scanner.clear();
          scannerRef.current = null;
          setShowScanner(false);
          setScannerActive(false);
        },
        (err) => { }
      );
      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setShowScanner(false);
    setScannerActive(false);
  };

  const startModalScanner = () => {
    setShowModalScanner(true);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "modal-barcode-reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        false
      );
      scanner.render(
        async (decodedText) => {
          await handleScannedData(decodedText);
          scanner.clear();
          modalScannerRef.current = null;
          setShowModalScanner(false);
        },
        (err) => { }
      );
      modalScannerRef.current = scanner;
    }, 100);
  };

  const stopModalScanner = () => {
    if (modalScannerRef.current) {
      modalScannerRef.current.clear().catch(console.error);
      modalScannerRef.current = null;
    }
    setShowModalScanner(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.quantity <= item.minLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Inventory Management
          </h1>
          <p className="text-slate-600">Scan codes, generate labels, and track stock</p>
        </div>

        {lowStockItems.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-600" size={24} />
              <div>
                <h3 className="font-semibold text-amber-900">Low Stock Alert</h3>
                <p className="text-sm text-amber-700">
                  {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low on stock
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search items or scan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto items-center">
              {/* Hidden File Input for Upload */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                title="Upload Barcode Image"
              >
                <ImageIcon size={20} />
              </button>

              <button
                onClick={startScanner}
                disabled={scannerActive}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-black rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {scannerActive ? <Loader2 className="animate-spin" size={20} /> : <ScanBarcode size={20} />}
                Scan Code
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-black rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-slate-200">
            <Package className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Inventory Items</h3>
            <p className="text-slate-500">Start by adding your first inventory item</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <div
                key={item._id}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${item.quantity <= item.minLevel
                  ? 'border-amber-400 bg-gradient-to-br from-white to-amber-50'
                  : 'border-slate-200 hover:border-blue-300'
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerPrint(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Print Label"
                      disabled={!item.barcode}
                    >
                      <Printer size={18} />
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Quantity:</span>
                    <span className={`font-bold text-lg ${item.quantity <= item.minLevel ? 'text-amber-600' : 'text-slate-800'}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Price:</span>
                    <span className="font-semibold text-green-600">₹{item.price}/{item.unit}</span>
                  </div>

                  {item.supplier && (
                    <div className="flex text-xs text-slate-500">
                      Supplier: {item.supplier}
                    </div>
                  )}

                  {item.barcode && (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1 mb-2 text-slate-600">
                        {item.barcode.startsWith('{') ? <QrCode size={16} /> : <ScanBarcode size={16} />}
                        <span className="text-sm">{item.barcode.startsWith('{') ? 'Smart Code' : 'Barcode'}:</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 flex justify-center">
                        <BarcodeDisplay value={item.barcode} />
                      </div>
                    </div>
                  )}
                </div>

                {item.quantity <= item.minLevel && (
                  <div className="mt-4 flex items-center gap-2 text-amber-700 bg-amber-100 px-3 py-2 rounded-lg">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-medium">Low Stock!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Form Fields... (Name, Category, Quantity, Unit, MinLevel, Price, Supplier) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Rice" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                    <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Grains" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity *</label>
                    <input type="number" required min="0" step="0.01" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Unit *</label>
                    <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="l">Liters (l)</option>
                      <option value="ml">Milliliters (ml)</option>
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="box">Boxes</option>
                      <option value="pack">Packs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Min Level *</label>
                    <input type="number" required min="0" step="0.01" value={formData.minLevel} onChange={(e) => setFormData({ ...formData, minLevel: parseFloat(e.target.value) })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Unit *</label>
                    <input type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="₹" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier</label>
                    <input type="text" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Supplier name" />
                  </div>

                  {/* Enhanced Barcode Section with 3 Options */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Barcode / Smart Code
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => {
                          setFormData({ ...formData, barcode: e.target.value });
                          setGeneratedBarcode(e.target.value);
                        }}
                        className="flex-1 min-w-[200px] px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Scan or enter code"
                      />
                      <button
                        type="button"
                        onClick={startModalScanner}
                        className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-black rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold flex items-center gap-2"
                      >
                        <ScanBarcode size={20} />
                        Scan
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all shadow-sm font-semibold flex items-center gap-2"
                        title="Upload Barcode Image"
                      >
                        <ImageIcon size={20} />
                      </button>
                    </div>

                    {/* Generation Buttons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const randomSku = 'SKU-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                          setFormData({ ...formData, barcode: randomSku });
                          setGeneratedBarcode(randomSku);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-black rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all font-semibold flex items-center justify-center gap-2 text-sm border border-gray-400"
                      >
                        <FileBarChart size={16} />
                        Generate Random SKU
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.name) {
                            toast.error('Item name is required');
                            return;
                          }
                          const smartData = {
                            name: formData.name,
                            cat: formData.category,
                            qty: formData.quantity,
                            unit: formData.unit,
                            min: formData.minLevel,
                            price: formData.price,
                            sup: formData.supplier,
                            t: Date.now()
                          };
                          const jsonString = JSON.stringify(smartData);
                          setFormData({ ...formData, barcode: jsonString });
                          setGeneratedBarcode(jsonString);
                          toast.success('Smart QR Code generated!');
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-black rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md font-semibold flex items-center justify-center gap-2 text-sm border border-green-600"
                      >
                        <QrCode size={16} />
                        Generate Smart QR
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  {generatedBarcode && (
                    <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          {generatedBarcode.startsWith('{') ? <QrCode size={16} /> : <ScanBarcode size={16} />}
                          {generatedBarcode.startsWith('{') ? 'Smart QR Preview:' : 'Barcode Preview:'}
                        </p>
                        <button
                          type="button"
                          onClick={() => triggerPrint(formData)}
                          className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          <Printer size={16} /> Print Label
                        </button>
                      </div>
                      <div className="bg-white p-4 rounded border border-slate-300 flex justify-center overflow-auto">
                        <BarcodeDisplay value={generatedBarcode} height={50} width={1.5} fontSize={14} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-black rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold">{editingItem ? 'Update Item' : 'Add Item'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Scanners */}
        {(showScanner || showModalScanner) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Camera size={24} />
                  <h2 className="text-2xl font-bold">Scan Code</h2>
                </div>
                <button
                  onClick={showScanner ? stopScanner : stopModalScanner}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div id={showScanner ? "barcode-reader" : "modal-barcode-reader"} className="w-full"></div>
                <p className="text-center text-slate-600 mt-4">Position the code within the frame</p>

                {/* Fallback hidden file scanner container for the Html5Qrcode instance */}
                <div id="upload-scanner-hidden" className="hidden"></div>
              </div>
            </div>
          </div>
        )}

        {/* COMPREHENSIVE PRINT LABEL - SHOWS ALL DETAILS */}
        <div style={{ display: 'none' }}>
          <div ref={printRef} className="p-4 bg-white" style={{ width: '400px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            {printData && (
              <div style={{ border: '2px solid #000', padding: '20px', borderRadius: '10px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{printData.name || 'Item Name'}</h2>
                {printData.price > 0 && (
                  <p style={{ fontSize: '18px', margin: '0 0 15px 0' }}>Price: ₹{printData.price}</p>
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {printData.barcode && (
                    <Barcode
                      value={printData.barcode}
                      width={2}
                      height={80}
                      fontSize={16}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InventoryPage;
