'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GetCall } from '@/lib/apiClient';
import PageContainer from '@/components/layout/page-container';
import { Search, Car, Calendar, Activity, User } from 'lucide-react';
// import { useDebounce } from '@/hooks/use-debounce'; // Removed as we use manual debounce

// Interfaces
interface EmployeeStats {
    active: number;
    monthly: number;
    yearly: number;
}

interface EmployeeWithStats {
    _id: string;
    id?: string;
    firstName: string;
    lastName: string;
    stats: EmployeeStats;
}

export default function EmployeeStatsDashboard() {
    const [employees, setEmployees] = useState<EmployeeWithStats[]>([]);
    const [loading, setLoading] = useState(true);

    // Search State
    const [nameSearch, setNameSearch] = useState('');
    const [vehicleSearch, setVehicleSearch] = useState('');

    // Debounce search values to avoid too many API calls
    // Using simple timeout effect instead of hook to avoid dependency issues if hook is missing
    const [debouncedName, setDebouncedName] = useState(nameSearch);
    const [debouncedVehicle, setDebouncedVehicle] = useState(vehicleSearch);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(nameSearch);
        }, 500);
        return () => clearTimeout(handler);
    }, [nameSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedVehicle(vehicleSearch);
        }, 500);
        return () => clearTimeout(handler);
    }, [vehicleSearch]);

    // Fetch Data
    useEffect(() => {
        const fetchEmployeeStats = async () => {
            setLoading(true);
            try {
                let query = '/api/stats/employees?';
                if (debouncedName) query += `name=${encodeURIComponent(debouncedName)}&`;
                if (debouncedVehicle) query += `vehicle=${encodeURIComponent(debouncedVehicle)}&`;

                const response: any = await GetCall(query);

                if (response && response.data) {
                    setEmployees(response.data);
                } else if (Array.isArray(response)) {
                    setEmployees(response);
                }
            } catch (error) {
                console.error("Failed to fetch employee stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeStats();
    }, [debouncedName, debouncedVehicle]);

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-6 min-h-screen pb-10">
                {/* Header Section */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Employee Statistics</h2>
                    <p className="text-muted-foreground">
                        Monitor employee performance, active jobs, and work history.
                    </p>
                </div>

                {/* Search / Filter Section */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="relative">
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Employee Name..."
                                className="pl-9"
                                value={nameSearch}
                                onChange={(e) => setNameSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Car className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by worked-on Vehicle Number..."
                                className="pl-9"
                                value={vehicleSearch}
                                onChange={(e) => setVehicleSearch(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Employee List Grid */}
                {loading ? (
                    <div className="flex items-center justify-center p-10">
                        <Activity className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading stats...</span>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center p-10 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">No employees found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {employees.map((emp) => (
                            <Card key={emp._id || emp.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="truncate">{emp.firstName} {emp.lastName}</span>
                                        <Badge variant={emp.stats.active > 0 ? "default" : "secondary"}>
                                            {emp.stats.active > 0 ? 'Active' : 'Idle'}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Employee ID: {(emp._id || emp.id)?.slice(-6).toUpperCase()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 grid gap-4">

                                    {/* Active Jobs */}
                                    <div className="flex items-center justify-between p-2 rounded-lg border bg-background">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                <Activity className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium">In Progress</span>
                                        </div>
                                        <span className="text-lg font-bold">{emp.stats.active}</span>
                                    </div>

                                    {/* Monthly Stats */}
                                    <div className="flex items-center justify-between p-2 rounded-lg border bg-background">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium">This Month</span>
                                        </div>
                                        <span className="text-lg font-bold">{emp.stats.monthly}</span>
                                    </div>

                                    {/* Yearly Stats */}
                                    <div className="flex items-center justify-between p-2 rounded-lg border bg-background">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                                <Car className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium">This Year</span>
                                        </div>
                                        <span className="text-lg font-bold">{emp.stats.yearly}</span>
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
