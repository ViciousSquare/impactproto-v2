import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  SolutionItem, 
  SolutionSearchValues, 
  solutionSearchSchema,
  SECTOR_OPTIONS,
  REGION_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  SDG_OPTIONS,
  DEMOGRAPHIC_OPTIONS
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MetricTooltip } from '@/components/ui/metric-tooltip';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import BadgeWithIcon from '@/components/ui/badge-with-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { X, ChevronRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious
} from '@/components/ui/carousel';

const SolutionFinderSection = () => {
  const { t } = useLanguage();
  const [searchValues, setSearchValues] = useState<SolutionSearchValues>({
    query: '',
    sector: 'all',
    region: 'all',
    businessType: 'all',
    sdg: 'all',
    demographic: 'all',
  });
  const [appliedFilters, setAppliedFilters] = useState<{ key: string; value: string }[]>([]);
  const [searchInput, setSearchInput] = useState('');
  
  // Carousel ref for scrolling
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch solution finder data with filters
  const { data: solutions, isLoading } = useQuery<SolutionItem[]>({
    queryKey: [
      '/api/solutions', 
      searchValues.query,
      searchValues.sector,
      searchValues.region,
      searchValues.businessType,
      searchValues.sdg,
      searchValues.demographic
    ],
  });

  const handleFilterChange = (key: keyof SolutionSearchValues, value: string) => {
    setSearchValues(prev => ({ ...prev, [key]: value }));
    
    // If this is a new filter and it has a value, add it to applied filters
    if (value && !appliedFilters.some(f => f.key === key)) {
      const label = getFilterLabel(key, value);
      setAppliedFilters([...appliedFilters, { key, value: label }]);
    } 
    // If it's changing an existing filter
    else if (value && appliedFilters.some(f => f.key === key)) {
      const label = getFilterLabel(key, value);
      setAppliedFilters(appliedFilters.map(f => f.key === key ? { key, value: label } : f));
    }
    // If it's removing a filter
    else if (!value) {
      setAppliedFilters(appliedFilters.filter(f => f.key !== key));
    }
  };

  const removeFilter = (key: string) => {
    setAppliedFilters(appliedFilters.filter(f => f.key !== key));
    setSearchValues(prev => ({ ...prev, [key]: '' }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      handleFilterChange('query', searchInput);
    }
  };

  // Helper to get display label for filter value
  const getFilterLabel = (key: string, value: string): string => {
    if (key === 'query') return value;
    
    let options;
    switch (key) {
      case 'sector':
        options = SECTOR_OPTIONS;
        break;
      case 'region':
        options = REGION_OPTIONS;
        break;
      case 'businessType':
        options = BUSINESS_TYPE_OPTIONS;
        break;
      case 'sdg':
        options = SDG_OPTIONS;
        break;
      case 'demographic':
        options = DEMOGRAPHIC_OPTIONS;
        break;
      default:
        return value;
    }
    
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Helper for verification badge
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

  return (
    <section className="py-6 md:py-10 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 mb-1">{t('solution.title')}</h2>
            <p className="text-neutral-600">{t('solution.subtitle')}</p>
          </div>
          
          <Link
            href="/solution-finder"
            className="mt-2 md:mt-0 inline-flex items-center text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
          >
            {t('solution.advancedSearch')}
            <span className="material-icons ml-1 text-sm">tune</span>
          </Link>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form onSubmit={handleSearch} className="relative">
              <span className="material-icons absolute left-3 top-3 text-neutral-500">search</span>
              <Input 
                type="text"
                placeholder={t('solution.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:col-span-2">
              <Select 
                value={searchValues.sector} 
                onValueChange={(value) => handleFilterChange('sector', value)}
              >
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 w-full h-auto">
                  <SelectValue placeholder={t('solution.allSectors')} />
                </SelectTrigger>
                <SelectContent>
                  {SECTOR_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={searchValues.region} 
                onValueChange={(value) => handleFilterChange('region', value)}
              >
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 w-full h-auto">
                  <SelectValue placeholder={t('solution.allRegions')} />
                </SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={searchValues.businessType} 
                onValueChange={(value) => handleFilterChange('businessType', value)}
              >
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 w-full h-auto">
                  <SelectValue placeholder={t('solution.allBusinessTypes')} />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={searchValues.sdg} 
                onValueChange={(value) => handleFilterChange('sdg', value)}
              >
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 w-full h-auto">
                  <SelectValue placeholder={t('solution.allSDGs')} />
                </SelectTrigger>
                <SelectContent>
                  {SDG_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={searchValues.demographic} 
                onValueChange={(value) => handleFilterChange('demographic', value)}
              >
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 w-full h-auto">
                  <SelectValue placeholder={t('solution.allDemographics')} />
                </SelectTrigger>
                <SelectContent>
                  {DEMOGRAPHIC_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Applied filters */}
          {appliedFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {appliedFilters.map((filter) => (
                <div 
                  key={filter.key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {filter.value}
                  <button 
                    onClick={() => removeFilter(filter.key)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Solutions carousel */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900">Featured Solutions</h3>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <MetricTooltip metric="impactGrade">Impact Grade</MetricTooltip>
              <MetricTooltip metric="socialROI">Social ROI</MetricTooltip>
              <MetricTooltip metric="effectiveness">Effectiveness</MetricTooltip>
            </div>
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
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <SolutionCardSkeleton />
                  </CarouselItem>
                ))
              ) : solutions && solutions.length > 0 ? (
                solutions.map((solution) => {
                  const verificationDetails = getVerificationDetails(solution.verificationType);
                  
                  return (
                    <CarouselItem key={solution.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="h-full bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
                        <div className="p-4 sm:p-5 flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                              <span className="material-icons text-primary-500">{solution.icon}</span>
                            </div>
                            <BadgeWithIcon 
                              text={solution.impactGrade}
                              variant="success"
                            />
                          </div>
                          
                          <h4 className="font-semibold text-neutral-900 mb-1">{solution.name}</h4>
                          <p className="text-sm text-neutral-600 mb-2">{solution.organizationName}</p>
                          
                          <p className="text-sm text-neutral-700 mb-4 line-clamp-3">
                            {solution.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {solution.tags.slice(0, 3).map((tag, index) => (
                              <BadgeWithIcon
                                key={index}
                                text={tag}
                                className="bg-primary-100 text-primary-800"
                              />
                            ))}
                            {solution.tags.length > 3 && (
                              <span className="text-xs text-neutral-500 flex items-center">
                                +{solution.tags.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">{t('org.stats.peopleReached')}</span>
                            <span className="font-medium text-neutral-900">{solution.peopleReached.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">{t('org.stats.socialROI')}</span>
                            <span className="font-medium text-neutral-900">${solution.socialROI.toFixed(2)} per $1</span>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex justify-between items-center">
                          <div className="flex items-center text-sm text-neutral-700">
                            <span className="flex items-center">
                              <span className="material-icons text-accent-orange text-sm">thumb_up</span>
                              <span className="ml-1">{solution.effectiveness}% {t('common.effective')}</span>
                            </span>
                            <span className="mx-2">•</span>
                            <span className={`flex items-center ${verificationDetails.className}`}>
                              <span className="material-icons text-sm">{verificationDetails.icon}</span>
                              <span className="ml-1">{verificationDetails.text}</span>
                            </span>
                          </div>
                          
                          <Link 
                            href={`/solution/${solution.id}`}
                            className="text-primary-500 hover:text-primary-600 font-medium text-sm"
                          >
                            {t('common.details')}
                          </Link>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })
              ) : (
                <CarouselItem className="pl-4 basis-full">
                  <div className="py-8 text-center text-neutral-500">
                    No solutions found matching the selected filters.
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
          </Carousel>
        </div>
        
        {/* View more button */}
        {solutions && solutions.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/solution-finder">
              <Button 
                variant="outline" 
                className="text-primary-500 border-primary-500"
              >
                {t('solution.viewMore')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

const SolutionCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
    <div className="p-4 sm:p-5 flex-1">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-12 w-12 rounded-md" />
        <Skeleton className="h-6 w-10 rounded-full" />
      </div>
      
      <Skeleton className="h-5 w-3/4 mb-1" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
    
    <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex justify-between items-center">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export default SolutionFinderSection;
