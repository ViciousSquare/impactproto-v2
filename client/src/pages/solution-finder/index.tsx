import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  SolutionItem, 
  SolutionSearchValues, 
  solutionSearchSchema,
  REGION_OPTIONS,
  SDG_OPTIONS,
  DEMOGRAPHIC_OPTIONS
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import BadgeWithIcon from '@/components/ui/badge-with-icon';
import { MetricTooltip } from '@/components/ui/metric-tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const SolutionFinder = () => {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [appliedFilters, setAppliedFilters] = useState<{ key: string; value: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Parse query parameters from URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = searchParams.get('query') || '';
  
  // Initialize form
  const form = useForm<SolutionSearchValues>({
    resolver: zodResolver(solutionSearchSchema),
    defaultValues: {
      query: initialQuery,
      region: '',
      sdg: '',
      demographic: '',
    }
  });
  
  // Set initial query if passed through URL
  useEffect(() => {
    if (initialQuery) {
      form.setValue('query', initialQuery);
      addFilter('query', initialQuery);
    }
  }, [initialQuery]);
  
  // Fetch solution finder data with filters
  const { data: solutions, isLoading } = useQuery<SolutionItem[]>({
    queryKey: ['/api/solutions', ...appliedFilters.map(f => f.value), currentPage],
  });

  // Add filter to the applied filters list
  const addFilter = (key: keyof SolutionSearchValues, value: string) => {
    if (!value) return;
    
    const label = getFilterLabel(key, value);
    
    // Check if filter already exists
    if (appliedFilters.some(f => f.key === key)) {
      setAppliedFilters(appliedFilters.map(f => 
        f.key === key ? { key, value: label } : f
      ));
    } else {
      setAppliedFilters([...appliedFilters, { key, value: label }]);
    }
  };

  // Remove filter from the applied filters list
  const removeFilter = (key: string) => {
    setAppliedFilters(appliedFilters.filter(f => f.key !== key));
    form.setValue(key as keyof SolutionSearchValues, '');
  };

  // Handle form submission
  const onSubmit = (values: SolutionSearchValues) => {
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        addFilter(key as keyof SolutionSearchValues, value);
      }
    });
    setCurrentPage(1); // Reset to first page on new search
  };

  // Clear all filters
  const clearAllFilters = () => {
    setAppliedFilters([]);
    form.reset({
      query: '',
      region: '',
      sdg: '',
      demographic: '',
    });
    setCurrentPage(1);
  };

  // Helper to get display label for filter value
  const getFilterLabel = (key: string, value: string): string => {
    if (key === 'query') return value;
    
    let options;
    switch (key) {
      case 'region':
        options = REGION_OPTIONS;
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
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">{t('solution.title')}</h2>
            <p className="text-neutral-600">{t('solution.subtitle')}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button 
              variant={view === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setView('grid')}
              className="flex items-center"
            >
              <span className="material-icons mr-1 text-sm">grid_view</span>
              Grid
            </Button>
            <Button 
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
              className="flex items-center"
            >
              <span className="material-icons mr-1 text-sm">view_list</span>
              List
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6 mb-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Search</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic">
                  <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="query"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="relative">
                              <span className="material-icons absolute left-3 top-3 text-neutral-500">search</span>
                              <Input 
                                placeholder={t('solution.searchPlaceholder')}
                                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="whitespace-nowrap">
                      <span className="material-icons mr-1 text-sm">search</span>
                      Search
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
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
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sdg"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
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
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="demographic"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
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
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="submit" className="flex items-center">
                      <span className="material-icons mr-1 text-sm">filter_alt</span>
                      Apply Filters
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={clearAllFilters}
                      className="flex items-center"
                    >
                      <span className="material-icons mr-1 text-sm">clear</span>
                      Clear All
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Applied filters */}
              {appliedFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-200 pt-4">
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
          </form>
        </Form>
        
        {/* Solutions */}
        {isLoading ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, i) => (
                <SolutionCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <SolutionListItemSkeleton key={i} />
              ))}
            </div>
          )
        ) : solutions && solutions.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {solutions.map((solution) => {
                const verificationDetails = getVerificationDetails(solution.verificationType);
                
                return (
                  <div key={solution.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
                    <div className="p-4 sm:p-5 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                          <span className="material-icons text-primary-500">{solution.icon}</span>
                        </div>
                        <MetricTooltip metric="impactGrade">
                          <BadgeWithIcon 
                            text={solution.impactGrade}
                            variant="success"
                          />
                        </MetricTooltip>
                      </div>
                      
                      <h4 className="font-semibold text-neutral-900 mb-1">{solution.name}</h4>
                      <p className="text-sm text-neutral-600 mb-2">{solution.organizationName}</p>
                      
                      <p className="text-sm text-neutral-700 mb-4">
                        {solution.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {solution.tags.map((tag, index) => (
                          <BadgeWithIcon
                            key={index}
                            text={tag}
                            className="bg-primary-100 text-primary-800"
                          />
                        ))}
                      </div>
                      
                      <div className="flex justify-between text-sm mb-1">
                        <MetricTooltip metric="peopleReached">
                          <span className="text-neutral-600">{t('org.stats.peopleReached')}</span>
                        </MetricTooltip>
                        <span className="font-medium text-neutral-900">{solution.peopleReached.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <MetricTooltip metric="socialROI">
                          <span className="text-neutral-600">{t('org.stats.socialROI')}</span>
                        </MetricTooltip>
                        <span className="font-medium text-neutral-900">${solution.socialROI.toFixed(2)} per $1</span>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex justify-between items-center">
                      <div className="flex items-center text-sm text-neutral-700">
                        <MetricTooltip metric="effectiveness">
                          <span className="flex items-center">
                            <span className="material-icons text-accent-orange text-sm">thumb_up</span>
                            <span className="ml-1">{solution.effectiveness}% {t('common.effective')}</span>
                          </span>
                        </MetricTooltip>
                        <span className="mx-2">•</span>
                        <MetricTooltip metric="verificationType">
                          <span className={`flex items-center ${verificationDetails.className}`}>
                            <span className="material-icons text-sm">{verificationDetails.icon}</span>
                            <span className="ml-1">{verificationDetails.text}</span>
                          </span>
                        </MetricTooltip>
                      </div>
                      
                      <Button variant="link" className="text-primary-500 hover:text-primary-600 p-0">
                        {t('common.details')}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {solutions.map((solution) => {
                const verificationDetails = getVerificationDetails(solution.verificationType);
                
                return (
                  <div key={solution.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex items-start">
                          <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                            <span className="material-icons text-primary-500">{solution.icon}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-neutral-900">{solution.name}</h4>
                              <p className="text-sm text-neutral-600">{solution.organizationName}</p>
                            </div>
                            
                            <div className="flex items-center mt-2 md:mt-0 space-x-2">
                              <MetricTooltip metric="impactGrade">
                                <BadgeWithIcon 
                                  text={solution.impactGrade}
                                  variant="success"
                                />
                              </MetricTooltip>
                              
                              <MetricTooltip metric="verificationType">
                                <div className={`flex items-center ${verificationDetails.className}`}>
                                  <span className="material-icons text-sm mr-1">{verificationDetails.icon}</span>
                                  <span className="text-xs">{verificationDetails.text}</span>
                                </div>
                              </MetricTooltip>
                            </div>
                          </div>
                          
                          <p className="text-sm text-neutral-700 mb-3">
                            {solution.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {solution.tags.map((tag, index) => (
                              <BadgeWithIcon
                                key={index}
                                text={tag}
                                className="bg-primary-100 text-primary-800"
                              />
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                            <div className="flex items-center">
                              <MetricTooltip metric="peopleReached">
                                <span className="text-sm text-neutral-600 mr-2">{t('org.stats.peopleReached')}</span>
                              </MetricTooltip>
                              <span className="text-sm font-medium text-neutral-900">{solution.peopleReached.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <MetricTooltip metric="socialROI">
                                <span className="text-sm text-neutral-600 mr-2">{t('org.stats.socialROI')}</span>
                              </MetricTooltip>
                              <span className="text-sm font-medium text-neutral-900">${solution.socialROI.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <MetricTooltip metric="effectiveness">
                                <span className="text-sm text-neutral-600 mr-2">Effectiveness:</span>
                              </MetricTooltip>
                              <span className="text-sm font-medium text-neutral-900">{solution.effectiveness}%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-3">
                            <Button variant="default" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center text-neutral-500">
            <div className="material-icons text-neutral-400 text-5xl mb-3">search_off</div>
            <h3 className="text-xl font-semibold mb-2">No solutions found</h3>
            <p className="mb-4">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear all filters
            </Button>
          </div>
        )}
        
        {/* Pagination (if needed) */}
        {solutions && solutions.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              className="text-primary-500 border-primary-500"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={isLoading || solutions.length < 9} // Assuming 9 items per page
            >
              {t('solution.viewMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
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

const SolutionListItemSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden p-4 sm:p-5">
    <div className="flex flex-col md:flex-row gap-4">
      <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
      
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
          <div>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="flex items-center mt-2 md:mt-0 space-x-2">
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        
        <div className="flex justify-end mt-3">
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

export default SolutionFinder;
