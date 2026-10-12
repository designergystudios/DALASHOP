import React from 'react';
import { MarketplaceCityMapGrid } from '../../components/marketplace/MarketplaceCityMapGrid';

export const MarketplaceHome: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <MarketplaceCityMapGrid />
    </div>
  );
};
