import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  LeaderboardItem, 
  TrendingItem, 
  SECTOR_OPTIONS, 
  REGION_OPTIONS, 
  SDG_OPTIONS,
  ORGANIZATION_SIZE_OPTIONS,
  Sector,
  ImpactGrade
} from '@/lib/types';
import TrendingTicker from '@/components/ui/trending-ticker';
import BadgeWithIcon from '@/components/ui/badge-with-icon';
import { MetricTooltip } from '@/components/ui/metric-tooltip';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';

const LeaderboardSection = () => {
  const { t } = useLanguage();
  const [region, setRegion] = useState('all');
  const [sdg, setSdg] = useState('all');
  const [size, setSize] = useState('all');
  
  // Carousel ref for manual scrolling
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch trending items
  const { data: trendingItems, isLoading: trendingLoading } = useQuery<TrendingItem[]>({
    queryKey: ['/api/trending'],
  });

  // Fetch leaderboard data with filters
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery<{
    items: LeaderboardItem[];
    total: number;
  }>({
    queryKey: ['/api/leaderboard', 'all', region, sdg, 1],
  });

  // Function to get real organization names by sector (moved outside the component for accessibility throughout the file)
const getOrganizationNameBySector = (sector: string, index: number): string => {
    const sectorOrganizations: Record<string, string[]> = {
      'Food Security': [
        'Canadian Food Bank Network', 
        'FoodShare Toronto', 
        'Community Food Centres Canada', 
        'Daily Bread Food Bank', 
        'Second Harvest'
      ],
      'Housing': [
        'Housing First Canada', 
        'Habitat for Humanity Canada', 
        'Homeless Hub', 
        'Canada Mortgage and Housing Corporation', 
        'Raising the Roof'
      ],
      'Youth Mental Health': [
        'Jack.org', 
        'Youth Mental Health Collective', 
        'Kids Help Phone', 
        'Centre for Addiction and Mental Health', 
        'Canadian Mental Health Association'
      ],
      'Education': [
        'Pathways to Education', 
        'Indspire', 
        'Let\'s Talk Science', 
        'Frontier College', 
        'Learning Disabilities Association of Canada'
      ],
      'Environment': [
        'Environmental Defence Canada', 
        'Evergreen', 
        'The Narwhal', 
        'Ecojustice', 
        'David Suzuki Foundation'
      ],
      'Indigenous Services': [
        'Indspire', 
        'Native Women\'s Association of Canada', 
        'Assembly of First Nations', 
        'National Association of Friendship Centres', 
        'Inuit Tapiriit Kanatami'
      ],
      'International Development': [
        'Aga Khan Foundation Canada', 
        'CARE Canada', 
        'Plan International Canada', 
        'Save the Children Canada', 
        'World Vision Canada'
      ],
      'Innovation & Entrepreneurship': [
        'MaRS Discovery District', 
        'Communitech', 
        'Startup Canada', 
        'Digital Main Street', 
        'Futurpreneur Canada'
      ],
      'Health & Wellbeing': [
        'Heart & Stroke Foundation', 
        'Canadian Cancer Society', 
        'Canadian Diabetes Association', 
        'Alzheimer Society of Canada', 
        'YMCA Canada'
      ],
      'Social Services': [
        'United Way Centraide Canada', 
        'YWCA Canada', 
        'The Salvation Army Canada', 
        'Canadian Red Cross', 
        'Big Brothers Big Sisters of Canada'
      ],
      'Arts & Culture': [
        'Canada Council for the Arts', 
        'Banff Centre for Arts and Creativity', 
        'Art Gallery of Ontario', 
        'National Film Board of Canada', 
        'Centaur Theatre Company'
      ],
      'Economic Development': [
        'Community Futures Network of Canada', 
        'Economic Development Association of Canada', 
        'Canadian Community Economic Development Network', 
        'Canadian Council for Aboriginal Business', 
        'Business Development Bank of Canada'
      ]
    };
    
    if (sectorOrganizations[sector] && index < sectorOrganizations[sector].length) {
      return sectorOrganizations[sector][index];
    }
    
    return `${sector} Organization ${index+1}`;
  };

  // Generate data for sectors that don't have enough organizations
  const generateMockOrganizationsForSectors = () => {
    if (!leaderboardData || !leaderboardData.items) return {};
    
    const sectorData: Record<string, LeaderboardItem[]> = {};
    
    // Group existing items by sector
    leaderboardData.items.forEach(item => {
      if (!sectorData[item.sector]) {
        sectorData[item.sector] = [];
      }
      sectorData[item.sector].push(item);
    });
    
    // Make sure each sector has at least 5 items by creating variations of existing items
    SECTOR_OPTIONS.filter(s => s.value !== 'all').forEach(sectorOption => {
      const sector = sectorOption.value as Sector; // Type assertion to Sector
      if (!sectorData[sector] || sectorData[sector].length < 5) {
        // Use items from other sectors if this sector has no items
        const sourceItems = sectorData[sector] || leaderboardData.items;
        const neededItems = 5 - (sectorData[sector]?.length || 0);
        
        if (!sectorData[sector]) {
          sectorData[sector] = [];
        }
        
        for (let i = 0; i < neededItems; i++) {
          const baseItem = sourceItems[i % sourceItems.length];
          if (baseItem) {
            // Get valid ImpactGrade and ensure type safety
            const gradeOptions: ImpactGrade[] = [ImpactGrade.APlus, ImpactGrade.A, ImpactGrade.AMinus, ImpactGrade.BPlus, ImpactGrade.B];
            const randomGrade = gradeOptions[Math.floor(Math.random() * gradeOptions.length)];
            
            sectorData[sector].push({
              ...baseItem,
              id: baseItem.id + 1000 + (Math.floor(Math.random() * 9000) + i), // Create a unique ID
              name: getOrganizationNameBySector(sector, i),
              sector: sector,
              rank: i + 1, // Assign sequential ranks
              impactScore: Math.floor(75 + Math.random() * 20),
              impactGrade: randomGrade,
              yearlyChange: Math.floor(Math.random() * 12) - 2,
            });
          }
        }
      }
    });
    
    // Sort organizations within each sector by impact score in descending order and update ranks
    Object.keys(sectorData).forEach(sector => {
      sectorData[sector].sort((a, b) => b.impactScore - a.impactScore);
      // Update ranks based on sorted order
      sectorData[sector].forEach((org, index) => {
        org.rank = index + 1;
      });
    });
    
    return sectorData;
  };
  
  const sectorData = generateMockOrganizationsForSectors();

  // Define verification type icon and text
  const getVerificationDetails = (type: string) => {
    switch (type) {
      case 'audited':
        return { icon: 'verified', text: t('verification.audited'), className: 'text-info' };
      case 'verified':
        return { icon: 'fact_check', text: t('verification.verified'), className: 'text-neutral-500' };
      default:
        return { icon: 'description', text: t('verification.selfReported'), className: 'text-neutral-500' };
    }
  };
  
  // No need for mouse drag functionality as we now use natural overflow scrolling

  return (
    <section className="py-6 md:py-10 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 mb-1">{t('leaderboard.title')}</h2>
            <p className="text-neutral-600">{t('leaderboard.subtitle')}</p>
          </div>
          
          {/* Filter controls */}
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm text-neutral-700 h-auto w-auto">
                <SelectValue placeholder={t('leaderboard.allRegions')} />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm text-neutral-700 h-auto w-auto">
                <SelectValue placeholder={t('leaderboard.allSizes')} />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATION_SIZE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sdg} onValueChange={setSdg}>
              <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm text-neutral-700 h-auto w-auto">
                <SelectValue placeholder={t('leaderboard.allSDGs')} />
              </SelectTrigger>
              <SelectContent>
                {SDG_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Trending tickers */}
        {trendingLoading ? (
          <div className="mb-6 bg-neutral-900 text-white rounded-md p-4 h-10">
            <Skeleton className="h-4 w-full bg-white/20" />
          </div>
        ) : trendingItems && trendingItems.length > 0 ? (
          <TrendingTicker items={trendingItems} />
        ) : (
          <div className="mb-6 bg-neutral-900 text-white rounded-md p-4 text-center">
            No trending data available
          </div>
        )}
        
        {/* Sector-based horizontal scrolling leaderboards */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          
          {/* Sector Lists - Horizontal Scrolling */}
          <div className="py-6 border-t border-neutral-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{t('leaderboard.bySector')}</h3>
                <p className="text-sm text-neutral-600">{t('leaderboard.exploreBySector')}</p>
              </div>
              <Link 
                href="/leaderboard" 
                className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
              >
                {t('leaderboard.viewAll')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              {/* Removed arrow buttons in favor of side scrolling */}
              <CarouselContent className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {SECTOR_OPTIONS.filter(s => s.value !== 'all').map((sectorOption) => (
                  <CarouselItem key={sectorOption.value} className="sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden h-full flex flex-col">
                      {/* Sector Header */}
                      <div className="bg-primary-50 p-4 border-b border-neutral-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary-100 rounded-md p-2">
                              <span className="material-icons text-primary-600">
                                {sectorOption.value === 'Food Security' ? 'volunteer_activism' : 
                                sectorOption.value === 'Housing' ? 'house' :
                                sectorOption.value === 'Education' ? 'school' :
                                sectorOption.value === 'Environment' ? 'eco' :
                                sectorOption.value === 'Economic Development' ? 'trending_up' :
                                sectorOption.value === 'Social Services' ? 'support' :
                                sectorOption.value === 'Arts & Culture' ? 'palette' :
                                'healing'}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900">{sectorOption.label}</h3>
                          </div>
                          <Link 
                            href={`/leaderboard?sector=${encodeURIComponent(sectorOption.value)}`}
                            className="text-primary-500 hover:text-primary-600"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Vertical List of Organizations */}
                      {leaderboardData ? (
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                  <MetricTooltip metric="impactScore">
                                    {t('leaderboard.table.impactIQ')}
                                  </MetricTooltip>
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                  {t('leaderboard.table.organization')}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                  <MetricTooltip metric="impactGrade">
                                    {t('leaderboard.table.grade')}
                                  </MetricTooltip>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                              {sectorData[sectorOption.value as Sector]
                                ?.slice(0, 5)
                                .map((item) => (
                                  <tr key={item.id} className="hover:bg-neutral-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="text-sm font-medium text-neutral-900">
                                        {item.impactScore}
                                        {item.yearlyChange !== 0 && (
                                          <span className={`ml-1 text-xs ${item.yearlyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.yearlyChange > 0 ? '▲' : '▼'}{Math.abs(item.yearlyChange)}%
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <Link 
                                        href={`/organization/${item.id}`} 
                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                      >
                                        {item.name}
                                      </Link>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="text-sm font-medium text-neutral-900">
                                        {item.impactScore}
                                        {item.yearlyChange !== 0 && (
                                          <span className={`ml-1 text-xs ${item.yearlyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.yearlyChange > 0 ? '▲' : '▼'}{Math.abs(item.yearlyChange)}%
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <BadgeWithIcon 
                                        text={item.impactGrade} 
                                        variant="success"
                                      />
                                    </td>
                                  </tr>
                                ))
                              }
                              {/* No results message */}
                              {(!sectorData[sectorOption.value as Sector] || sectorData[sectorOption.value as Sector].length === 0) && (
                                <tr>
                                  <td colSpan={4} className="px-4 py-4 text-center text-neutral-500">
                                    No organizations in this sector.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        // Loading state
                        <div className="p-4">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="mb-3 flex items-center">
                              <Skeleton className="h-4 w-6 mr-2" />
                              <Skeleton className="h-4 flex-1" />
                              <Skeleton className="h-4 w-12 ml-2" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* View More Link */}
                      <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 mt-auto">
                        <Link 
                          href={`/leaderboard?sector=${encodeURIComponent(sectorOption.value)}`} 
                          className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center justify-center w-full"
                        >
                          <span>{t('leaderboard.seeMoreInSector')}</span>
                          <span className="material-icons text-sm ml-1">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          
          {/* No pagination needed as we're showing all sectors in horizontal scroll */}
        </div>
        
        {/* View more link */}
        <div className="mt-6 text-center">
          <Link 
            href="/leaderboard"
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
          >
            View full leaderboard
            <span className="material-icons ml-1 text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
