'use client';
import KBar from '@/components/kbar';
import TopNav from '@/components/layout/top-nav';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <KBar>
      <div className="flex min-h-screen flex-col">
        <TopNav />
        <main className="flex-1 space-y-4 pt-2">
          {children}
        </main>
      </div>
    </KBar>
  );
}
