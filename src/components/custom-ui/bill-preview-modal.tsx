
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface BillPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleData: any;
    services: any[];
    discount: number;
    total: number;
}

export function BillPreviewModal({ isOpen, onClose, vehicleData, services, discount, total }: BillPreviewModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
                {/* Print Content Wrapper with ID for print CSS */}
                <div ref={contentRef} className="p-12 bg-white text-black font-serif max-w-[210mm] mx-auto min-h-screen">

                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8 relative">
                        {/* Border Line */}
                        <div className="absolute bottom-0 left-0 right-0 border-b-2 border-black mb-4" style={{ bottom: '-20px' }}></div>

                        <div>
                            <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">ABDUL<br />GARAGE</h1>
                            <div className="text-sm space-y-1 mt-4">
                                <p>123, Auto Repair Lane, Garage City</p>
                                <p>Phone: +91 98765 43210</p>
                                <p>Email: contact@abdulgarage.com</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold uppercase text-gray-500 mb-4">INVOICE</h2>
                            <div className="text-sm font-semibold space-y-1">
                                <p><span className="text-gray-600 mr-2">Date:</span> {vehicleData.date ? format(new Date(vehicleData.date), 'MMMM do,\nyyyy') : format(new Date(), 'MMMM do,\nyyyy')}</p>
                                <p className="mt-2"><span className="text-gray-600 mr-2">Vehicle No:</span> {vehicleData.vehicleNo.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for the border line */}
                    <div className="h-8"></div>

                    {/* Customer & Vehicle Details */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="font-bold text-sm border-b border-gray-300 mb-4 pb-1">Bill To:</h3>
                            <p className="font-bold text-xl">{vehicleData.name || 'Customer'}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm border-b border-gray-300 mb-4 pb-1">Vehicle Details:</h3>
                            <div className="space-y-1">
                                <p><span className="font-bold">Current Reading:</span> {vehicleData.currentReading || 'N/A'}</p>
                                <p><span className="font-bold">Next Service:</span> {vehicleData.nextReading || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Services Table */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-y-2 border-black bg-gray-100">
                                    <th className="py-3 px-4 text-left font-bold uppercase text-sm w-16">#</th>
                                    <th className="py-3 px-4 text-left font-bold uppercase text-sm">SERVICE /<br />PRODUCT</th>
                                    <th className="py-3 px-4 text-left font-bold uppercase text-sm">DESCRIPTION</th>
                                    <th className="py-3 px-4 text-right font-bold uppercase text-sm w-32">PRICE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-4 px-4 align-top text-sm font-semibold">{index + 1}</td>
                                        <td className="py-4 px-4 align-top text-sm font-medium">{service.name}</td>
                                        <td className="py-4 px-4 align-top text-sm text-gray-500">{service.separate}</td>
                                        <td className="py-4 px-4 align-top text-right font-mono font-medium">
                                            {Number(service.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {services.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-400 italic">No services added</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="border-t-2 border-black mt-0"></div>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-16">
                        <div className="w-80">
                            <div className="flex justify-between py-2 mb-2">
                                <span className="text-right flex-1 mr-8">Subtotal:</span>
                                <span className="font-mono text-right w-32">{Number(Number(total) + Number(discount)).toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between py-2 mb-2 text-red-600">
                                    <span className="text-right flex-1 mr-8">Discount:</span>
                                    <span className="font-mono text-right w-32">-{Number(discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-4 border-t border-gray-200">
                                <span className="text-2xl font-bold flex-1 text-right mr-8">Total:</span>
                                <span className="text-2xl font-bold font-mono text-right w-32">{Number(total).toFixed(2)}</span>
                            </div>
                            <div className="border-b-2 border-black mt-2"></div>
                        </div>
                    </div>

                    {/* Footer */}
                    {/* <div className="text-center text-gray-500 mt-auto pt-8">
                        <p className="text-sm">Thank you for your business!</p>
                    </div> */}

                </div>

                <DialogFooter className="print:hidden">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={() => handlePrint()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Bill
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
