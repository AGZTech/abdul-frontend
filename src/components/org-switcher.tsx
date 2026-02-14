'use client';

import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { Separator } from './ui/separator';

interface Tenant {
  id: string;
  name: string;
}

export function OrgSwitcher({
  tenants,
  defaultTenant,
  onTenantSwitch
}: {
  tenants: Tenant[];
  defaultTenant: Tenant;
  onTenantSwitch?: (tenantId: string) => void;
}) {
  const [selectedTenant, setSelectedTenant] = React.useState<
    Tenant | undefined
  >(defaultTenant || (tenants.length > 0 ? tenants[0] : undefined));
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const handleTenantSwitch = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    if (onTenantSwitch) {
      onTenantSwitch(tenant.id);
    }
  };

  if (!selectedTenant) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-start'
            >
              {/* <div className='flex flex-col items-center justify-center'>
                {state === 'collapsed' && !openMobile ? (
                  <Image
                    src='/assets/icon-colored.svg'
                    width={22}
                    height={22}
                    alt='Logo'
                    className=''
                  />
                ) : (
                  <Image
                    src='/logo.svg'
                    width={150}
                    height={150}
                    alt='Logo'
                    className='flex justify-start'
                  />
                )}
              </div>
              {state === 'expanded' && openMobile && (
                <Image src='/logo.svg' width={150} height={150} alt='Logo' />
              )} */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width]'
            align='start'
          >
            {tenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onSelect={() => handleTenantSwitch(tenant)}
              >
                {tenant.name}{' '}
                {tenant.id === selectedTenant.id && (
                  <Check className='ml-auto' />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator className='!m-0 mx-0 w-full !p-0' />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
