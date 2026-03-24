"use client";

import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose, isOpen }) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isOpen && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                "barcode-scanner-container",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                false
            );

            scanner.render(
                (decodedText) => {
                    onScan(decodedText);
                    scanner.clear();
                    scannerRef.current = null;
                },
                (errorMessage) => {
                    console.log('Scanner error:', errorMessage);
                }
            );

            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
                scannerRef.current = null;
            }
        };
    }, [isOpen, onScan]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-slideUp">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Camera size={24} />
                        <h2 className="text-2xl font-bold">Scan Barcode</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div id="barcode-scanner-container" className="w-full rounded-lg overflow-hidden"></div>
                    <p className="text-center text-slate-600 mt-4 text-sm">
                        Position the barcode within the frame to scan
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BarcodeScanner;
