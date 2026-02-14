'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from '@/constants/data';
import { Icons } from '@/components/icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconChevronDown } from '@tabler/icons-react';
import { UserNav } from './user-nav';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ModeToggle } from './ThemeToggle/theme-toggle';

export default function TopNav() {
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo Section */}
                <div className="mr-8 flex items-center gap-2">
                    <Link href="/dashboard/overview" className="flex items-center gap-2">
                        {/* <Image
                            src="/logo.svg"
                            width={140}
                            height={40}
                            alt="Logo"
                            className="dark:invert"
                        /> */}
                        <h1>Abdul's Garage</h1>
                    </Link>
                </div>

                {/* Navigation Section */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => {
                        const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                        const isActive = pathname === item.url || item.items?.some(sub => pathname === sub.url);

                        if (item.items && item.items.length > 0) {
                            return (
                                <DropdownMenu key={item.title}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "flex items-center gap-2 px-2 text-muted-foreground transition-colors hover:text-foreground",
                                                isActive && "text-foreground font-bold bg-accent"
                                            )}
                                        >
                                            {item.icon && <Icon className="h-4 w-4" />}
                                            {item.title}
                                            <IconChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-48">
                                        {item.items.map((subItem) => (
                                            <DropdownMenuItem key={subItem.title} asChild>
                                                <Link
                                                    href={subItem.url}
                                                    className={cn(
                                                        "flex items-center gap-2 cursor-pointer",
                                                        pathname === subItem.url && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    {subItem.title}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        }

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={cn(
                                    "flex items-center gap-2 transition-colors hover:text-foreground/80",
                                    isActive ? "text-foreground font-bold" : "text-muted-foreground"
                                )}
                            >
                                {item.icon && <Icon className="h-4 w-4" />}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Section: User Profile & Utils */}
                <div className="flex items-center gap-4">
                    {/* <ModeToggle /> */}
                    {user && <UserNav user={user} />}
                </div>
            </div>
        </header>
    );
}
