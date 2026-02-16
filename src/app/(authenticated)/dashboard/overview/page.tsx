'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GetCall, PostCall, PutCall, DeleteCall } from '@/lib/apiClient';
import { Trash2, Plus, Eye, Calendar as CalendarIcon, RefreshCw, ChevronDown, ChevronUp, DollarSign, Activity, Users, FileText, Wrench, Pencil, Maximize2 } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Service {
    name: string;
    separate: string;
    price: number;
    productId?: string; // Selected product ID
}

interface StockItem {
    _id?: string;
    id?: string;
    name: string; // mapped from productName
    price: number;
    quantity: number;
    separate: string; // mapped from category
}

interface Bill {
    _id?: string;
    id?: string;
    vehicle: string;
    billDate: string;
    paymentStatus: string;
}

interface Employee {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
}

interface VehicleData {
    vehicleNo: string;
    date: Date | undefined;
    name: string;
    currentReading: string;
    nextReading: string;
    assignedTo: string; // Employee ID
}

interface StockData {
    product: string; // input for productName
    quantity: number;
    price: number;
    date: string;
    category: string;
}

interface BillFilter {
    date: Date | undefined;
    vehicleNo: string;
    status: 'all' | 'payed' | 'pending';
}

import { BillPreviewModal } from '@/components/custom-ui/bill-preview-modal';



export default function GarageManagement() {
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [vehicleData, setVehicleData] = useState<VehicleData>({
        vehicleNo: 'mh 28 s 1035',
        date: new Date('2027-01-26'),
        name: '',
        currentReading: '',
        nextReading: '',
        assignedTo: ''
    });
    const [isAutoEmail, setIsAutoEmail] = useState(false);
    const [discount, setDiscount] = useState<number>(0);
    const [editingServiceEntryId, setEditingServiceEntryId] = useState<string | null>(null);
    const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);

    const [services, setServices] = useState<Service[]>([
        { name: '', separate: '', price: 0, productId: '' }
    ]);

    const [stockData, setStockData] = useState<StockData>({
        product: '',
        quantity: 0,
        price: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        category: ''
    });
    const [editingStockIndex, setEditingStockIndex] = useState<number | null>(null);

    // Dashboard Stats State
    const [dashboardStats, setDashboardStats] = useState({
        customers: {
            today: 0,
            month: 0,
            year: 0
        },
        pendingBills: 0
    });

    // Fetch Dashboard Stats
    // Fetch Dashboard Stats
    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response: any = await GetCall('/api/stats/dashboard');
                if (response && response.data) {
                    setDashboardStats(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    // Card Expansion State
    const [expandedCard, setExpandedCard] = useState<'service' | 'stock' | 'bill'>('service');

    // Stock Items State
    const [stockItems, setStockItems] = useState<StockItem[]>([]);

    // Fetch Products
    // Fetch Products
    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response: any = await GetCall('/api/products');
                // Helper to find array
                const findArray = (obj: any): any[] | null => {
                    if (Array.isArray(obj)) return obj;
                    if (typeof obj === 'object' && obj !== null) {
                        for (const value of Object.values(obj)) {
                            if (Array.isArray(value)) return value;
                        }
                    }
                    return null;
                };

                const products = findArray(response);
                if (products) {
                    // Map API response to StockItem
                    const mappedItems = products.map((p: any) => ({
                        _id: p._id || p.id,
                        name: p.productName || p.name,
                        price: p.price,
                        quantity: p.quantity,
                        separate: p.category || p.separate || ''
                    }));
                    setStockItems(mappedItems);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    const [bills, setBills] = useState<Bill[]>([]);

    const [billSummaryDate, setBillSummaryDate] = useState<Date | undefined>(new Date('2027-01-26'));
    const [billFilter, setBillFilter] = useState<BillFilter>({
        date: undefined,
        vehicleNo: '',
        status: 'all'
    });

    // Fetch Bills (Service Entries)
    const fetchBills = React.useCallback(async () => {
        try {
            let query = '/api/service-entries?';
            if (billFilter.vehicleNo) {
                query += `vehicleNumber=${billFilter.vehicleNo}&`;
            }
            if (billFilter.date) {
                const dateStr = format(billFilter.date, 'yyyy-MM-dd');
                query += `startDate=${dateStr}&`;
            }

            const response: any = await GetCall(query);
            console.log("Bills API Response:", response);

            // Helper to find array
            const findArray = (obj: any): any[] | null => {
                if (Array.isArray(obj)) return obj;
                if (typeof obj === 'object' && obj !== null) {
                    for (const value of Object.values(obj)) {
                        if (Array.isArray(value)) return value;
                    }
                }
                return null;
            };

            const billData = findArray(response);

            if (billData) {
                const mappedBills = billData.map((b: any) => ({
                    _id: b._id || b.id,
                    vehicle: b.vehicleNumber || 'Unknown',
                    billDate: b.date || '',
                    paymentStatus: b.paymentStatus || (b.payed ? 'Payed' : 'Pending')
                }));
                setBills(mappedBills);
            }

            // Extract stats
            const statsData = response.stats || (response.data && response.data.stats);
            if (statsData) {
                setBillSummary({
                    total: statsData.total || 0,
                    paid: statsData.payed || 0,
                    pending: statsData.pending || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch bills", error);
        }
    }, [billFilter]);

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchBills();
        }, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [fetchBills]);

    const [billSummary, setBillSummary] = useState({
        paid: 0,
        pending: 0,
        total: 0
    });

    // Calculate Total dynamically
    const calculateTotal = () => {
        const servicesTotal = services.reduce((sum, service) => sum + (service.price || 0), 0);
        // Add product prices if selected
        const productsTotal = services.reduce((sum, service) => {
            if (service.productId) {
                const product = stockItems.find(p => (p._id === service.productId || p.id === service.productId));
                return sum + (product ? (product.price || 0) : 0);
            }
            return sum;
        }, 0);

        return servicesTotal + productsTotal - (discount || 0);
    };



    // Employee State
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState<Employee>({ firstName: '', lastName: '' });
    const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

    // Fetch Employees on Mount
    React.useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response: any = await GetCall('/api/employees');
                console.log("Employees API Response:", response);

                // Helper to find the first array in an object
                const findArray = (obj: any): any[] | null => {
                    if (Array.isArray(obj)) return obj;
                    if (typeof obj === 'object' && obj !== null) {
                        for (const key of Object.keys(obj)) {
                            // prioritizing common keys
                            if (['data', 'employees', 'result', 'items'].includes(key) && Array.isArray(obj[key])) {
                                return obj[key];
                            }
                        }
                        // Fallback: search all values
                        for (const value of Object.values(obj)) {
                            if (Array.isArray(value)) return value;
                        }
                    }
                    return null;
                };

                const employeeData = findArray(response);

                if (employeeData && employeeData.length > 0) {
                    setEmployees(employeeData);
                } else {
                    console.warn("No employee array found in response");
                }
            } catch (error) {
                console.error("Failed to fetch employees", error);
            }
        };
        fetchEmployees();
    }, []);

    const handleAddEmployee = async () => {
        if (newEmployee.firstName && newEmployee.lastName) {
            try {
                if (editingEmployeeId) {
                    // Update existing
                    await PutCall(`/api/employees/${editingEmployeeId}`, {
                        firstName: newEmployee.firstName,
                        lastName: newEmployee.lastName
                    });

                    // Optimistic Update
                    setEmployees(employees.map(emp =>
                        (emp.id === editingEmployeeId || emp._id === editingEmployeeId)
                            ? { ...emp, firstName: newEmployee.firstName, lastName: newEmployee.lastName }
                            : emp
                    ));
                } else {
                    // Create new
                    const response: any = await PostCall('/api/employees', {
                        firstName: newEmployee.firstName,
                        lastName: newEmployee.lastName
                    });

                    // Optimistic or use response
                    // If response contains the new ID, use it. usage assumption:
                    setEmployees([...employees, { ...newEmployee, id: response?.id || response?._id }]);
                }

                setNewEmployee({ firstName: '', lastName: '' });
                setEditingEmployeeId(null);
                setIsAddEmployeeOpen(false);
            } catch (error) {
                console.error("Failed to save employee", error);
            }
        }
    };

    const handleSaveServiceEntry = async (isPayed: boolean = false) => {
        try {
            const payload = {
                vehicleNumber: vehicleData.vehicleNo,
                name: vehicleData.name || "Customer",
                date: vehicleData.date ? format(vehicleData.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                currentReading: Number(vehicleData.currentReading),
                nextReading: Number(vehicleData.nextReading),
                assignedTo: vehicleData.assignedTo,
                discountPrice: Number(discount),
                services: services.map(s => ({
                    serviceName: s.name,
                    separateName: s.separate,
                    price: Number(s.price),
                    product: s.productId
                })),
                paymentStatus: isPayed ? 'Payed' : 'Pending',
                payed: isPayed
            };

            if (editingServiceEntryId) {
                // Update existing
                const response = await PutCall(`/api/service-entries/${editingServiceEntryId}`, payload);
                console.log("Service Entry Updated:", response);
                alert("Service entry updated successfully!");
            } else {
                // Create new
                const response = await PostCall('/api/service-entries', payload);
                console.log("Service Entry Saved:", response);
                alert("Service entry saved successfully!");
            }

            // Reset form
            setVehicleData({
                vehicleNo: '',
                date: new Date(),
                name: '',
                currentReading: '',
                nextReading: '',
                assignedTo: ''
            });
            setServices([{ name: '', separate: '', price: 0, productId: '' }]);
            setDiscount(0);
            setIsAutoEmail(false);
            setEditingServiceEntryId(null);

            fetchBills(); // Refresh list
        } catch (error) {
            console.error("Failed to save service entry", error);
            alert("Failed to save service entry.");
        }
    };

    const handleEditEmployeeClick = (e: React.MouseEvent | React.PointerEvent, employee: Employee) => {
        e.preventDefault();
        e.stopPropagation();
        setNewEmployee({ firstName: employee.firstName, lastName: employee.lastName });
        setEditingEmployeeId(employee.id || employee._id || null);
        setIsAddEmployeeOpen(true);
    }

    const handleDeleteEmployeeClick = async (e: React.MouseEvent | React.PointerEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this employee?')) return;

        try {
            await DeleteCall(`/api/employees/${id}`);
            setEmployees(employees.filter(emp => emp.id !== id && emp._id !== id));
        } catch (error) {
            console.error("Failed to delete employee", error);
        }
    }

    // Reset dialog state when closed
    const handleDialogOpenChange = (open: boolean) => {
        setIsAddEmployeeOpen(open);
        if (!open) {
            setNewEmployee({ firstName: '', lastName: '' });
            setEditingEmployeeId(null);
        }
    }


    const addService = () => {
        setServices([...services, { name: '', separate: '', price: 0, productId: '' }]);
    };

    const updateService = (index: number, field: keyof Service, value: string | number) => {
        const updated = [...services];
        // @ts-ignore
        updated[index][field] = value;
        setServices(updated);
    };

    const deleteService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const handleSaveStockItem = async () => {
        if (stockData.product) {
            try {
                if (editingStockIndex !== null) {
                    const itemToEdit = stockItems[editingStockIndex];
                    const id = itemToEdit._id || itemToEdit.id;

                    if (id) {
                        // Update existing via API
                        const payload = {
                            productName: stockData.product,
                            quantity: stockData.quantity,
                            price: stockData.price,
                            category: stockData.category
                        };

                        await PutCall(`/api/products/${id}`, payload);

                        const updatedItems = [...stockItems];
                        updatedItems[editingStockIndex] = {
                            ...itemToEdit,
                            name: stockData.product,
                            price: stockData.price,
                            quantity: stockData.quantity,
                            separate: stockData.category
                        };
                        setStockItems(updatedItems);
                        setEditingStockIndex(null);
                    }
                } else {
                    // Add new - CALL API
                    const payload = {
                        productName: stockData.product,
                        quantity: stockData.quantity,
                        price: stockData.price,
                        category: stockData.category
                    };

                    const response: any = await PostCall('/api/products', payload);

                    // Add to list (handle response ID if available)
                    setStockItems([
                        ...stockItems,
                        {
                            _id: response?._id || response?.id,
                            name: stockData.product,
                            price: stockData.price,
                            quantity: stockData.quantity,
                            separate: stockData.category
                        }
                    ]);
                }
                setStockData({ ...stockData, product: '', quantity: 0, price: 0, category: '' });
            } catch (error) {
                console.error("Failed to save product", error);
            }
        }
    };

    const handleEditStockItem = (index: number) => {
        const item = stockItems[index];
        setStockData({
            ...stockData,
            product: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.separate
        });
        setEditingStockIndex(index);
    };

    const handleDeleteStockItem = async (e: React.MouseEvent | React.PointerEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await DeleteCall(`/api/products/${id}`);
            setStockItems(stockItems.filter(item => item._id !== id && item.id !== id));
            // If deleting the item currently being edited, reset the form
            if (editingStockIndex !== null) {
                const editingItem = stockItems[editingStockIndex];
                if (editingItem._id === id || editingItem.id === id) {
                    setStockData({ ...stockData, product: '', quantity: 0, price: 0, category: '' });
                    setEditingStockIndex(null);
                }
            }
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    }

    // Filter Bills
    const filteredBills = bills.filter(bill => {
        const matchesVehicle = bill.vehicle.toLowerCase().includes(billFilter.vehicleNo.toLowerCase());
        // For date, doing string comparison as billDate is string yyyy-mm-dd
        const filterDateStr = billFilter.date ? format(billFilter.date, 'yyyy-MM-dd') : '';
        const matchesDate = !filterDateStr || bill.billDate === filterDateStr;
        const matchesStatus = billFilter.status === 'all' ||
            (billFilter.status === 'payed' && bill.paymentStatus === 'Payed') ||
            (billFilter.status === 'pending' && bill.paymentStatus !== 'Payed');
        return matchesVehicle && matchesDate && matchesStatus;
    });

    const handleBillClick = async (bill: Bill) => {
        const id = bill._id || bill.id;
        if (!id) return;

        try {
            const response: any = await GetCall(`/api/service-entries/${id}`);
            const data = response.data || response; // Adjust based on actual API response structure

            if (data) {
                // Robust mapping for potential API variations
                const mappedName = data.name || data.customerName || '';

                // Handle assignedTo: could be a string ID or an object with _id/id
                let mappedAssignedTo = '';
                if (data.assignedTo) {
                    if (typeof data.assignedTo === 'string') {
                        mappedAssignedTo = data.assignedTo;
                    } else if (typeof data.assignedTo === 'object') {
                        mappedAssignedTo = data.assignedTo._id || data.assignedTo.id || '';
                    }
                }

                setVehicleData({
                    vehicleNo: data.vehicleNumber || '',
                    date: new Date(data.date),
                    name: mappedName,
                    currentReading: String(data.currentReading || ''),
                    nextReading: String(data.nextReading || ''),
                    assignedTo: mappedAssignedTo
                });

                if (data.services && Array.isArray(data.services)) {
                    setServices(data.services.map((s: any) => {
                        let mappedProductId = '';
                        if (s.product) {
                            if (typeof s.product === 'string') {
                                mappedProductId = s.product;
                            } else if (typeof s.product === 'object') {
                                mappedProductId = s.product._id || s.product.id || '';
                            }
                        }
                        return {
                            name: s.serviceName || '',
                            separate: s.separateName || '',
                            price: s.price || 0,
                            productId: mappedProductId
                        };
                    }));
                } else {
                    setServices([{ name: '', separate: '', price: 0, productId: '' }]);
                }

                setDiscount(data.discountPrice || 0);
                setEditingServiceEntryId(id);
                // Expand the card to show details
                setExpandedCard('service');
            }
        } catch (error) {
            console.error("Failed to fetch service entry details", error);
        }
    };

    // Clear Handlers
    const handleClearServiceEntry = () => {
        setVehicleData({
            vehicleNo: '',
            date: new Date(),
            name: '',
            currentReading: '',
            nextReading: '',
            assignedTo: ''
        });
        setServices([{ name: '', separate: '', price: 0, productId: '' }]);
        setDiscount(0);
        setIsAutoEmail(false);
        setEditingServiceEntryId(null);
    };

    const handleClearStockCalculate = () => {
        setStockData({
            product: '',
            quantity: 0,
            price: 0,
            date: format(new Date(), 'yyyy-MM-dd'),
            category: ''
        });
        setEditingStockIndex(null);
    };

    const handleClearBillSummary = () => {
        setBills([]);
        setBillFilter({
            date: undefined,
            vehicleNo: '',
            status: 'all'
        });
    };

    return (
        <PageContainer scrollable={false}>
            <div className="min-h-screen space-y-4">
                {/* Collapsible Stats Panel */}
                <Collapsible
                    open={isStatsOpen}
                    onOpenChange={setIsStatsOpen}
                    className="w-full space-y-2 mb-3"
                >
                    <div className="flex items-center justify-center">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full flex flex-col gap-1 hover:bg-transparent">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {isStatsOpen ? 'Hide Stats' : 'Show Dashboard Stats'}
                                </span>
                                {isStatsOpen ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="space-y-4 data-[state=closed]:animate-smooth-collapse-up data-[state=open]:animate-smooth-collapse-down overflow-hidden">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                            <Card className='pb-2 gap-2'>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold has-[:disabled]:opacity-30">{dashboardStats.pendingBills}</div>
                                    <p className="text-xs text-muted-foreground w-full">Customers with outstanding dues</p>
                                </CardContent>
                            </Card>
                            <Card className='pb-2 gap-2'>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold">{dashboardStats.customers.today}</span>
                                            <span className="text-xs text-muted-foreground">Today</span>
                                        </div>
                                        <div className="flex flex-col border-l pl-4">
                                            <span className="text-2xl font-bold">{dashboardStats.customers.month}</span>
                                            <span className="text-xs text-muted-foreground">Month</span>
                                        </div>
                                        <div className="flex flex-col border-l pl-4">
                                            <span className="text-2xl font-bold">{dashboardStats.customers.year}</span>
                                            <span className="text-xs text-muted-foreground">Year</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div className="max-w-[1800px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Column 1: Vehicle Service Entry */}
                        <Card className={cn("shadow-lg hover:shadow-xl transition-shadow pt-0", expandedCard === 'service' ? "lg:col-span-2" : "lg:col-span-1")}>
                            <CardHeader className="bg-blue-600 text-white mt-0 pt-0">
                                <CardTitle className="flex items-center justify-between py-2" >
                                    <span>Vehicle Service Entry</span>
                                    <div className="flex gap-1">
                                        <Button variant="secondary" size="sm" onClick={() => setExpandedCard(expandedCard === 'service' ? 'stock' : 'service')}>
                                            <Maximize2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={handleClearServiceEntry}>
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Vehicle No</Label>
                                        <Input
                                            value={vehicleData.vehicleNo}
                                            onChange={(e) => setVehicleData({ ...vehicleData, vehicleNo: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Date</Label>
                                        <div className="mt-1">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !vehicleData.date && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {vehicleData.date ? format(vehicleData.date, 'PPP') : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={vehicleData.date}
                                                        onSelect={(date) => setVehicleData({ ...vehicleData, date })}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label>Name / Mob</Label>
                                    <Input
                                        value={vehicleData.name}
                                        onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Current Reading</Label>
                                        <Input
                                            type="number"
                                            value={vehicleData.currentReading}
                                            onChange={(e) => setVehicleData({ ...vehicleData, currentReading: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Next Reading</Label>
                                        <Input
                                            type="number"
                                            value={vehicleData.nextReading}
                                            onChange={(e) => setVehicleData({ ...vehicleData, nextReading: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">Assigned</label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={vehicleData.assignedTo}
                                            onValueChange={(value) => setVehicleData({ ...vehicleData, assignedTo: value })}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Select Option">Select Option</SelectItem>
                                                {employees.map((emp, index) => {
                                                    const empId = emp.id || emp._id || '';
                                                    const fullName = `${emp.firstName} ${emp.lastName}`;
                                                    return (
                                                        <SelectItem key={empId || index} value={empId} className="group">
                                                            <div className="flex items-center justify-between w-full min-w-[200px]">
                                                                <span>{fullName}</span>
                                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <div
                                                                        role="button"
                                                                        className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                                                                        onPointerDown={(e) => handleEditEmployeeClick(e, emp)}
                                                                    >
                                                                        <Pencil className="h-3 w-3 text-blue-500" />
                                                                    </div>
                                                                    <div
                                                                        role="button"
                                                                        className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                                                                        onPointerDown={(e) => empId && handleDeleteEmployeeClick(e, empId)}
                                                                    >
                                                                        <Trash2 className="h-3 w-3 text-red-500" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>

                                        <Dialog open={isAddEmployeeOpen} onOpenChange={handleDialogOpenChange}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>{editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="firstName" className="text-right">
                                                            First Name
                                                        </Label>
                                                        <Input
                                                            id="firstName"
                                                            value={newEmployee.firstName}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="lastName" className="text-right">
                                                            Last Name
                                                        </Label>
                                                        <Input
                                                            id="lastName"
                                                            value={newEmployee.lastName}
                                                            onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleAddEmployee}>Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="p-2 text-left text-sm font-semibold w-1/4">SERVICE NAME</th>
                                                <th className="p-2 text-left text-sm font-semibold w-1/4">SEPARATE</th>
                                                <th className="p-2 text-left text-sm font-semibold w-1/4">PRODUCT</th>
                                                <th className="p-2 text-left text-sm font-semibold w-1/4">PRICE</th>
                                                <th className="p-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map((service, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="p-2">
                                                        <Input
                                                            value={service.name}
                                                            onChange={(e) => updateService(index, 'name', e.target.value)}
                                                            className="h-8"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            value={service.separate}
                                                            onChange={(e) => updateService(index, 'separate', e.target.value)}
                                                            className="h-8"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Select
                                                            value={service.productId || ""}
                                                            onValueChange={(value) => updateService(index, 'productId', value)}
                                                        >
                                                            <SelectTrigger className="h-8">
                                                                <SelectValue placeholder="Select Product" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">None</SelectItem>
                                                                {stockItems.map((item, i) => (
                                                                    <SelectItem key={item._id || item.id || i} value={item._id || item.id || `unknown-${i}`}>
                                                                        {item.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            value={service.price}
                                                            onChange={(e) => updateService(index, 'price', parseFloat(e.target.value))}
                                                            className="h-8"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <button
                                                            onClick={() => deleteService(index)}
                                                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={5}>
                                                    <Button variant="ghost" size="sm" onClick={addService} className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Item
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <div className="space-y-2 pt-4 border-t px-4 pb-4">
                                        <div className="flex justify-between text-sm items-center">
                                            <span>Discount:</span>
                                            <Input
                                                type="number"
                                                value={discount}
                                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                                className="w-24 h-8 text-right"
                                            />
                                        </div>
                                        <div className="flex justify-between font-bold text-lg text-blue-600">
                                            <span>Total:</span>
                                            <span>{calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 py-2">
                                    <Checkbox
                                        id="auto-email"
                                        checked={isAutoEmail}
                                        onCheckedChange={(checked) => setIsAutoEmail(checked as boolean)}
                                    />
                                    <label
                                        htmlFor="auto-email"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Receive automatic emails for servicing updates
                                    </label>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleSaveServiceEntry(true)}>Payed</Button>
                                    <Button className="flex-1" variant="default" onClick={() => setIsBillPreviewOpen(true)}>Generate Bill</Button>
                                    <Button className="flex-1" variant="outline" onClick={() => handleSaveServiceEntry(false)}>Save Data</Button>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Column 2: Stock Calculate */}
                        <Card className={cn("shadow-lg hover:shadow-xl transition-shadow pt-0", expandedCard === 'stock' ? "lg:col-span-2" : "lg:col-span-1")}>
                            <CardHeader className="bg-green-600 text-white mt-0 pt-0">
                                <CardTitle className="flex items-center justify-between py-2" >
                                    <span>Stock Calculate</span>
                                    <div className="flex gap-1">
                                        <Button variant="secondary" size="sm" onClick={() => setExpandedCard('stock')}>
                                            <Maximize2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={handleClearStockCalculate}>
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label>Product</Label>
                                        <Input
                                            value={stockData.product}
                                            onChange={(e) => setStockData({ ...stockData, product: e.target.value })}
                                            className="mt-1"
                                            placeholder="Enter product name"
                                        />
                                    </div>
                                    <div>
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            value={stockData.quantity}
                                            onChange={(e) => setStockData({ ...stockData, quantity: parseInt(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            value={stockData.price}
                                            onChange={(e) => setStockData({ ...stockData, price: parseFloat(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Category</Label>
                                        <Input
                                            value={stockData.category}
                                            onChange={(e) => setStockData({ ...stockData, category: e.target.value })}
                                            className="mt-1"
                                            placeholder="Enter category"
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="sticky top-0 bg-slate-100">
                                            <tr className="border-b">
                                                <th className="p-2 text-left text-sm font-semibold">NAME</th>
                                                <th className="p-2 text-left text-sm font-semibold">PRICE</th>
                                                <th className="p-2 text-left text-sm font-semibold">QUANTITY</th>
                                                <th className="p-2 text-left text-sm font-semibold">SEPARATE</th>
                                                <th className="p-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockItems.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className={cn("hover:bg-slate-50 border-b cursor-pointer", editingStockIndex === index && "bg-slate-100")}
                                                    onClick={() => handleEditStockItem(index)}
                                                >
                                                    <td className="p-2 font-medium">{item.name}</td>
                                                    <td className="p-2">{item.price.toFixed(1)}</td>
                                                    <td className="p-2">
                                                        <Badge variant={item.quantity < 0 ? "destructive" : "default"}>
                                                            {item.quantity}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-2 text-sm text-slate-600">{item.separate}</td>
                                                    <td className="p-2">
                                                        <button
                                                            className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                                            onPointerDown={(e) => {
                                                                const itemId = item._id || item.id;
                                                                if (itemId) handleDeleteStockItem(e, itemId);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="font-semibold">Total:</span>
                                    <span className="text-2xl font-bold text-emerald-600">0.0</span>
                                </div>

                                <Button onClick={handleSaveStockItem} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    {editingStockIndex !== null ? (
                                        <><RefreshCw className="w-4 h-4 mr-2" /> Update Product</>
                                    ) : (
                                        <><Plus className="w-4 h-4 mr-2" /> Add Product</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Column 3: Bills Summary */}
                        <Card className={cn("shadow-lg hover:shadow-xl transition-shadow pt-0", expandedCard === 'bill' ? "lg:col-span-2" : "lg:col-span-1")}>
                            <CardHeader className="bg-purple-600 text-white mt-0 pt-0">
                                <CardTitle className="flex items-center justify-between py-2" >
                                    <span>Bill Summary</span>
                                    <div className="flex gap-1">
                                        <Button variant="secondary" size="sm" onClick={() => setExpandedCard('bill')}>
                                            <Maximize2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={handleClearBillSummary}>
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Date</Label>
                                        <div className="mt-1">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !billFilter.date && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {billFilter.date ? format(billFilter.date, 'PPP') : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={billFilter.date}
                                                        onSelect={(date) => setBillFilter({ ...billFilter, date })}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Vehicle No</Label>
                                        <Input
                                            value={billFilter.vehicleNo}
                                            onChange={(e) => setBillFilter({ ...billFilter, vehicleNo: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Select
                                        value={billFilter.status}
                                        onValueChange={(value: 'all' | 'payed' | 'pending') => setBillFilter({ ...billFilter, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="payed">Payed</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="all">Check All</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="sticky top-0 bg-slate-100">
                                            <tr className="border-b">
                                                <th className="p-2 text-left text-sm font-semibold">VEHICLE</th>
                                                <th className="p-2 text-left text-sm font-semibold">BILL_DATE</th>
                                                <th className="p-2 text-left text-sm font-semibold">PAYMENT_ST</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBills.map((bill, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-slate-50 border-b cursor-pointer hover:bg-blue-50"
                                                    onClick={() => handleBillClick(bill)}
                                                >
                                                    <td className="p-2 font-medium">{bill.vehicle}</td>
                                                    <td className="p-2">{bill.billDate}</td>
                                                    <td className="p-2">
                                                        {bill.paymentStatus && (
                                                            <Badge className={bill.paymentStatus === 'Payed' ? "bg-green-600" : "bg-red-600"}>{bill.paymentStatus}</Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="font-semibold text-green-800">Payed</span>
                                        <span className="text-xl font-bold text-green-600">{billSummary.paid}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                        <span className="font-semibold text-amber-800">Pending</span>
                                        <span className="text-xl font-bold text-amber-600">{billSummary.pending}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="font-semibold text-purple-800">Total</span>
                                        <span className="text-2xl font-bold text-purple-600">{billSummary.total}</span>
                                    </div>
                                </div>

                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    <Eye className="w-4 h-4 mr-2" /> View Bill
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {/* Bill Preview Modal */}
            <BillPreviewModal
                isOpen={isBillPreviewOpen}
                onClose={() => setIsBillPreviewOpen(false)}
                vehicleData={vehicleData}
                services={services}
                discount={discount}
                total={calculateTotal()}
            />
        </PageContainer>
    );
}