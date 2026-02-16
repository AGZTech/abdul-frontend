'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function WizardTabs({ children, ...props }: any) {
    return (
        <Tabs {...props}>
            {children}
        </Tabs>
    );
}
