import React from 'react';
import SidebarMenu from '@/components/profile/SidebarMenu';

export default function SubscriptionsPage() {
  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200">
      <SidebarMenu />
      <h1>Your Subscription Items</h1>
      <p>List of favorites will go here.</p>
    </div>
  );
}
