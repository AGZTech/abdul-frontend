'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GetCall } from '@/lib/apiClient';
import PageContainer from '@/components/layout/page-container';
import { Search, Car, Calendar, History as HistoryIcon, User } from 'lucide-react';
import { format } from 'date-fns';

// Interfaces
interface VehicleStats {
    _id: string; // vehicleNumber
    lastServiceDate: string;
    lastCustomerName: string;
    totalServices: number;
    totalAmountSpent: number;
}

export default function HistoryPage() {
    const [vehicles, setVehicles] = useState<VehicleStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Fetch Data
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                let query = '/api/stats/vehicles?';
                if (debouncedSearch) query += `search=${encodeURIComponent(debouncedSearch)}&`;

                const response: any = await GetCall(query);

                if (response && response.data) {
                    setVehicles(response.data);
                } else if (Array.isArray(response)) {
                    setVehicles(response);
                }
            } catch (error) {
                console.error("Failed to fetch vehicle history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [debouncedSearch]);

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-6 min-h-screen pb-10">
                {/* Header Section */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Vehicle History</h2>
                    <p className="text-muted-foreground">
                        Browse comprehensive service history for all vehicles.
                    </p>
                </div>

                {/* Search Section */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium">Search Directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative max-w-md">
                            <Car className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Vehicle Number..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Vehicle List Grid */}
                {loading ? (
                    <div className="flex items-center justify-center p-10">
                        <HistoryIcon className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading history...</span>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center p-10 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">No vehicles found.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {vehicles.map((v) => (
                            <Card key={v._id} className="overflow-hidden hover:shadow-md transition-shadow group">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="uppercase tracking-wider font-mono text-lg">{v._id}</span>
                                        <Badge variant="outline" className="bg-background">
                                            {v.totalServices} Service{v.totalServices !== 1 ? 's' : ''}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 text-xs pt-1">
                                        <User className="h-3 w-3" />
                                        <span className="truncate max-w-[150px]">{v.lastCustomerName || 'Unknown Customer'}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Last Service</span>
                                        </div>
                                        <span className="font-medium">
                                            {v.lastServiceDate ? format(new Date(v.lastServiceDate), 'MMM dd, yyyy') : 'N/A'}
                                        </span>
                                    </div>

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
