'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { PostCall } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' })
});

export function LoginForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            // Login API call
            // Login API call
            const response = await PostCall('/api/auth/login', values);

            if (response?.code && typeof response.code === 'number' && response.code >= 400) {
                toast.error(response.message || 'Invalid credentials. Please try again.');
            } else {
                toast.success('Login successful! Redirecting...');

                // Handle token if returned in response body (for manual cookie setting)
                // This ensures middleware (which checks 'token' cookie) works even if server doesn't set HttpOnly cookie
                const token = response.token || response.accessToken || (response.data && response.data.token);
                if (token) {
                    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
                }

                // Dispatch user data
                // The backend response might be the user object itself, inside 'user', or inside 'data'
                const userData = response.user || response.data?.user || response.data || response;
                dispatch(loginSuccess({ user: userData }));

                // Redirect to dashboard
                router.push('/dashboard/overview');
            }
        } catch (error) {
            toast.error('Something went wrong. Please check your connection.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-2">
                        <Icons.logo className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your email and password to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full size-lg text-md font-semibold" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                </CardFooter>
            </Card>
        </div>
    );
}
