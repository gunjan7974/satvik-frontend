"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Scan, Printer } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';

const inventoryItemSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity must be a positive number' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  minLevel: z.coerce.number().min(0, { message: 'Minimum level must be a positive number' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  supplier: z.string().optional(),
  barcode: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventoryItemSchema>;

import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

// ... (imports remain the same)

const AddInventoryPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [codeType, setCodeType] = useState<'barcode' | 'qr'>('barcode');
  const printRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      quantity: 0,
      minLevel: 5,
      price: 0,
      unit: 'kg',
    },
  });

  const onSubmit = async (data: InventoryFormValues) => {
    setIsLoading(true);
    try {
      await apiClient.createInventoryItem(data);
      toast.success('Inventory item added successfully!');
      router.push('/admin/inventory');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add inventory item.');
    } finally {
      setIsLoading(false);
    }
  };

  const mapSmartCodeToForm = (data: any) => {
    const mapping: Record<string, keyof InventoryFormValues> = {
      n: 'name',
      name: 'name',
      cat: 'category',
      category: 'category',
      qty: 'quantity',
      quantity: 'quantity',
      unit: 'unit',
      min: 'minLevel',
      minLevel: 'minLevel',
      price: 'price',
      sup: 'supplier',
      supplier: 'supplier',
      barcode: 'barcode'
    };

    Object.keys(data).forEach((key) => {
      const formKey = mapping[key];
      if (formKey) {
        setValue(formKey, data[key]);
      }
    });
  };

  const handleScan = (data: string) => {
    setIsScannerOpen(false);
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        mapSmartCodeToForm(parsed);
        toast.success('Form populated from Smart Barcode!');
      } else {
        setValue('barcode', data);
        toast.success('Barcode scanned!');
      }
    } catch (e) {
      setValue('barcode', data);
      toast.success('Barcode scanned!');
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Barcode Label',
    onAfterPrint: () => toast.success('Label printed!'),
  });

  const formValues = watch();

  // Prepare Smart Code Data (Compact Format)
  const smartCodeData = {
    n: formValues.name,
    cat: formValues.category,
    qty: formValues.quantity,
    unit: formValues.unit,
    min: formValues.minLevel,
    price: formValues.price,
    sup: formValues.supplier,
    barcode: formValues.barcode,
    t: Date.now() // Timestamp
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/inventory" className="mr-4">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add Inventory Item</h1>
        </div>
        <Button onClick={() => setIsScannerOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Scan size={18} />
          Scan Barcode
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Barcode (Auto-filled or manual) */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="barcode">Barcode / SKU</Label>
                <div className="flex gap-2">
                  <Input id="barcode" {...register('barcode')} placeholder="Scan or enter barcode" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsScannerOpen(true)}>
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Scan a standard barcode or a Smart QR Code to autofill.</p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" {...register('name')} placeholder="e.g., All-Purpose Flour" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register('category')} placeholder="e.g., Grains" />
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" {...register('quantity')} />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="l">Liter (l)</SelectItem>
                        <SelectItem value="ml">Milliliter (ml)</SelectItem>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="box">Boxes</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (per unit)</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              {/* Minimum Level */}
              <div className="space-y-2">
                <Label htmlFor="minLevel">Minimum Stock Level</Label>
                <Input id="minLevel" type="number" {...register('minLevel')} />
                {errors.minLevel && <p className="text-red-500 text-sm">{errors.minLevel.message}</p>}
              </div>

              {/* Supplier */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" {...register('supplier')} placeholder="e.g., Local Farm Co." />
                {errors.supplier && <p className="text-red-500 text-sm">{errors.supplier.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto">
                {isLoading ? 'Adding Item...' : 'Save Inventory Item'}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview & Generator Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Scan className="text-indigo-600" size={20} />
              Generated Code
            </h3>

            {/* Code Type Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setCodeType('barcode')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${codeType === 'barcode' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Barcode (ID)
              </button>
              <button
                type="button"
                onClick={() => setCodeType('qr')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${codeType === 'qr' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Smart QR (All Data)
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
              {/* Display Logic */}
              {codeType === 'barcode' ? (
                formValues.barcode ? (
                  <>
                    <div className="bg-white p-4 rounded shadow-sm w-full flex justify-center overflow-x-auto">
                      <Barcode
                        value={formValues.barcode}
                        width={1.5}
                        height={60}
                        fontSize={14}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="font-bold text-gray-800">{formValues.name || 'Item Name'}</p>
                      <p className="text-xs text-indigo-600 mt-2">Scan for lookup (ID Only)</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Scan size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Enter Barcode/SKU</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        const randomSku = 'SKU-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                        setValue('barcode', randomSku);
                      }}
                    >
                      Generate Random SKU
                    </Button>
                  </div>
                )
              ) : (
                /* QR Code View */
                formValues.name ? (
                  <>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <QRCodeSVG
                        value={JSON.stringify(smartCodeData)}
                        size={180}
                        level="M"
                        includeMargin
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="font-bold text-gray-800">{formValues.name}</p>
                      <p className="text-xs text-indigo-600 mt-2">Contains Full Item Data</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Scan size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Fill form to generate QR</p>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full" onClick={handlePrint} disabled={codeType === 'barcode' ? !formValues.barcode : !formValues.name}>
                <Printer size={16} className="mr-2" /> Print Label
              </Button>
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
                <strong>Tip:</strong> {codeType === 'barcode' ? 'Standard barcode useful for database lookups.' : 'Smart QR works offline and contains all item details.'}
              </div>
            </div>

            {/* Hidden Printable Label */}
            <div style={{ display: 'none' }}>
              <div ref={printRef} className="p-4 bg-white" style={{ width: '400px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <div style={{ border: '2px solid #000', padding: '20px', borderRadius: '10px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{formValues.name || 'Item Name'}</h2>
                  {formValues.price > 0 && (
                    <p style={{ fontSize: '18px', margin: '0 0 15px 0' }}>Price: ₹{formValues.price}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    {codeType === 'barcode' && formValues.barcode ? (
                      <Barcode
                        value={formValues.barcode}
                        width={2}
                        height={80}
                        fontSize={16}
                      />
                    ) : codeType === 'qr' && formValues.name ? (
                      <QRCodeSVG
                        value={JSON.stringify(smartCodeData)}
                        size={150}
                        level="M"
                      />
                    ) : null}
                  </div>
                  {codeType === 'qr' && <p style={{ fontSize: '12px', marginTop: '5px' }}>Smart QR (All Data)</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
};

export default AddInventoryPage;
