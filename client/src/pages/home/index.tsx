import React from 'react';
import HeroSection from './components/HeroSection';
import LeaderboardSection from './components/LeaderboardSection';
import OrganizationProfileSection from './components/OrganizationProfileSection';
import SuccessStoriesSection from './components/SuccessStoriesSection';
import SolutionFinderSection from './components/SolutionFinderSection';
import CTASection from './components/CTASection';
import { useQuery } from '@tanstack/react-query';
import { PlatformStatistics } from '@/lib/types';

const Home = () => {
  // Fetch platform statistics
  const { data: statistics, isLoading: statsLoading } = useQuery<PlatformStatistics>({
    queryKey: ['/api/statistics'],
  });

  // Basic placeholders for loading state
  const statsPlaceholder: PlatformStatistics = {
    organizationCount: 0,
    programCount: 0,
    impactValue: 0
  };

  return (
    <>
      <HeroSection stats={statistics || statsPlaceholder} loading={statsLoading} />
      <LeaderboardSection />
      <OrganizationProfileSection />
      <SuccessStoriesSection />
      <SolutionFinderSection />
      <CTASection />
    </>
  );
};

export default Home;
