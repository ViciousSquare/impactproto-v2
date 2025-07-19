import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { OrganizationProfile } from '@/lib/types';
import BadgeWithIcon from '@/components/ui/badge-with-icon';
import ProgressWithLabel from '@/components/ui/progress-with-label';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo, useRef, useEffect } from 'react';
import { MetricTooltip } from '@/components/ui/metric-tooltip';

const OrganizationProfileSection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const { data: organizations, isLoading } = useQuery<OrganizationProfile[]>({
    queryKey: ['/api/organizations/featured'],
  });
  
  // Add horizontal scrolling with mouse drag
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    
    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      carousel.classList.add('cursor-grabbing');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };
    
    const handleMouseLeave = () => {
      isDown = false;
      carousel.classList.remove('cursor-grabbing');
    };
    
    const handleMouseUp = () => {
      isDown = false;
      carousel.classList.remove('cursor-grabbing');
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      carousel.scrollLeft = scrollLeft - walk;
    };
    
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      if (carousel) {
        carousel.removeEventListener('mousedown', handleMouseDown);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
        carousel.removeEventListener('mouseup', handleMouseUp);
        carousel.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  // Determine which organization to display
  const organization = useMemo(() => {
    if (!organizations || organizations.length === 0) return undefined;
    
    // If we have a selected org ID, find that org
    if (selectedOrgId) {
      const selected = organizations.find(org => org.id === selectedOrgId);
      if (selected) return selected;
    }
    
    // Default to the first one
    return organizations[0];
  }, [organizations, selectedOrgId]);

  const getVerificationBadge = (type: string) => {
    switch (type) {
      case 'audited':
        return { text: t('verification.audited'), icon: 'verified', className: 'text-info' };
      case 'verified':
        return { text: t('verification.verified'), icon: 'fact_check', className: 'text-neutral-500' };
      default:
        return { text: t('verification.selfReported'), icon: 'description', className: 'text-neutral-500' };
    }
  };

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'Food Security':
        return 'volunteer_activism';
      case 'Housing':
        return 'house';
      case 'Education':
        return 'school';
      case 'Environment':
        return 'eco';
      case 'Health & Wellbeing':
      case 'Health':
        return 'healing';
      default:
        return 'category';
    }
  };

  // Placeholder for the chart that would use D3.js or Recharts in the real implementation
  const ChartPlaceholder = () => (
    <div className="w-full h-full bg-white rounded border border-neutral-200 p-2 flex items-center justify-center">
      <div className="text-center">
        <div className="text-neutral-400 material-icons text-4xl">insert_chart</div>
        <p className="text-xs text-neutral-500 mt-2">Impact IQ Score Trend (2019-2023)</p>
      </div>
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50/60 via-white to-teal-50/60 border-t border-b border-amber-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-100/60 mb-3">
              <span className="text-xs font-medium text-amber-800">Featured Organizations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-heading gradient-heading-primary mb-2">{t('org.featuredTitle')}</h2>
            <p className="text-neutral-600 text-lg max-w-xl">{t('org.featuredSubtitle')}</p>
          </div>
          
          <Link href="/organizations">
            <div className="mt-4 md:mt-0 inline-flex items-center bg-white hover:bg-amber-50 text-amber-700 font-medium px-5 py-2 rounded-full shadow-sm border border-amber-200 cursor-pointer transition-all duration-300">
              {t('org.viewAll')}
              <span className="material-icons ml-1 text-sm">arrow_forward</span>
            </div>
          </Link>
        </div>
        
        {/* Organization Selection Carousel */}
        {!isLoading && organizations && organizations.length > 1 && (
          <div className="mb-6 overflow-x-auto scrollbar-hide cursor-grab" ref={carouselRef} style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
              {organizations.map((org, index) => (
                <div 
                  key={org.id}
                  className={`flex-none cursor-pointer transition-all duration-300 rounded-xl p-5 border ${
                    organization?.id === org.id 
                      ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-md' 
                      : 'border-transparent hover:bg-white hover:shadow-sm hover:border-amber-200/50'
                  }`}
                  onClick={() => {
                    setSelectedOrgId(org.id);
                  }}
                  style={{ width: '220px' }}
                >
                  <div className="flex items-center">
                    <div className={`rounded-xl w-12 h-12 flex items-center justify-center 
                      ${organization?.id === org.id 
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' 
                        : 'bg-amber-100'
                      }`
                    }>
                      <span className={`material-icons text-xl 
                        ${organization?.id === org.id ? 'text-amber-700' : 'text-amber-600'}`
                      }>
                        {getSectorIcon(org.sector)}
                      </span>
                    </div>
                    <div className="ml-3 truncate">
                      <div className="font-medium text-sm text-neutral-900 truncate">{org.name}</div>
                      <div className="text-xs text-amber-700/80 truncate flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block mr-1.5"></span>
                        {org.sector}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          {isLoading ? (
            <OrganizationProfileSkeleton />
          ) : organization ? (
            <>
              {/* Organization header with gradient banner */}
              <div className="relative">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 h-20 md:h-28"></div>
                <div className="absolute top-3 right-3">
                  {organization.verificationType && (
                    <MetricTooltip metric="verificationType">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium text-amber-700 flex items-center shadow-glow-sm">
                        <span className="material-icons text-sm mr-1.5">
                          {getVerificationBadge(organization.verificationType).icon}
                        </span>
                        {getVerificationBadge(organization.verificationType).text}
                      </div>
                    </MetricTooltip>
                  )}
                </div>
                <div className="px-6 sm:px-8 pb-6 relative -mt-14 flex flex-col md:flex-row">
                  <div className="bg-white p-2 rounded-xl shadow-md inline-block border border-amber-100">
                    <div className="h-28 w-28 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
                      <span className="material-icons text-amber-600 text-5xl">
                        {getSectorIcon(organization.sector)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-5 md:mt-0 md:ml-6 md:pt-14 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold gradient-heading gradient-heading-primary">{organization.name}</h3>
                        <p className="text-neutral-600 text-sm flex items-center flex-wrap gap-3 mt-1">
                          <span className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block mr-1.5"></span>
                            {organization.sector}
                          </span>
                          <span className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 inline-block mr-1.5"></span>
                            {organization.region}
                          </span>
                          {organization.established && (
                            <span className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 inline-block mr-1.5"></span>
                              Est. {organization.established}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center mt-4 md:mt-0">
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-xl shadow-sm">
                          <MetricTooltip metric="impactScore">
                            <div className="flex items-end">
                              <span className="text-3xl font-bold text-amber-700">{organization.impactScore}</span>
                              <span className="ml-2 text-xs text-amber-700/80 leading-tight pb-1">
                                Impact<br />Score
                              </span>
                            </div>
                          </MetricTooltip>
                        </div>
                        <MetricTooltip metric="impactGrade" className="ml-3">
                          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-lg h-12 w-12 flex items-center justify-center rounded-full shadow-glow-teal">
                            {organization.impactGrade}
                          </div>
                        </MetricTooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Organization tabs - redesigned with warm colors */}
              <div className="border-t border-amber-100 bg-gradient-to-r from-amber-50/60 to-white">
                <div className="px-6 sm:px-8">
                  <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`whitespace-nowrap py-4 px-4 font-medium text-sm mr-6 border-b-2 transition-all duration-200 ${
                        activeTab === 'overview'
                          ? 'border-amber-500 text-amber-700 font-semibold'
                          : 'border-transparent text-neutral-500 hover:text-amber-600 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="material-icons text-base mr-1.5">info</span>
                        {t('org.tabs.overview')}
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('impactMetrics')}
                      className={`whitespace-nowrap py-4 px-4 font-medium text-sm mr-6 border-b-2 transition-all duration-200 ${
                        activeTab === 'impactMetrics'
                          ? 'border-amber-500 text-amber-700 font-semibold'
                          : 'border-transparent text-neutral-500 hover:text-amber-600 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="material-icons text-base mr-1.5">show_chart</span>
                        {t('org.tabs.impactMetrics')}
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('programs')}
                      className={`whitespace-nowrap py-4 px-4 font-medium text-sm mr-6 border-b-2 transition-all duration-200 ${
                        activeTab === 'programs'
                          ? 'border-amber-500 text-amber-700 font-semibold'
                          : 'border-transparent text-neutral-500 hover:text-amber-600 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="material-icons text-base mr-1.5">category</span>
                        {t('org.tabs.programs')}
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('reports')}
                      className={`whitespace-nowrap py-4 px-4 font-medium text-sm border-b-2 transition-all duration-200 ${
                        activeTab === 'reports'
                          ? 'border-amber-500 text-amber-700 font-semibold'
                          : 'border-transparent text-neutral-500 hover:text-amber-600 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="material-icons text-base mr-1.5">description</span>
                        {t('org.tabs.reports')}
                      </div>
                    </button>
                  </nav>
                </div>
              </div>
              
              {/* Organization content */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left column - description */}
                  <div className="md:col-span-1">
                    <div className="mb-8 bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                      <h4 className="font-semibold text-amber-800 flex items-center mb-3">
                        <span className="material-icons text-amber-500 mr-2">auto_awesome</span>
                        {t('org.mission')}
                      </h4>
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {organization.mission}
                      </p>
                    </div>
                    
                    <div className="mb-8 bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                      <h4 className="font-semibold text-amber-800 flex items-center mb-3">
                        <span className="material-icons text-amber-500 mr-2">public</span>
                        {t('org.sdgAlignment')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {organization.sdgAlignment.map((sdg, index) => (
                          <BadgeWithIcon
                            key={index}
                            text={sdg}
                            className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                      <h4 className="font-semibold text-amber-800 flex items-center mb-4">
                        <span className="material-icons text-amber-500 mr-2">analytics</span>
                        {t('org.keyStats')}
                      </h4>
                      <div className="space-y-3.5">
                        <div className="flex justify-between text-sm items-center pb-2 border-b border-amber-100">
                          <span className="text-neutral-700 flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 inline-block mr-1.5"></span>
                            {t('org.stats.peopleReached')}
                          </span>
                          <span className="font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                            {organization.stats.peopleReached}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center pb-2 border-b border-amber-100">
                          <MetricTooltip metric="socialROI">
                            <span className="text-neutral-700 flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block mr-1.5"></span>
                              {t('org.stats.socialROI')}
                            </span>
                          </MetricTooltip>
                          <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                            ${organization.stats.socialROI} per $1
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center pb-2 border-b border-amber-100">
                          <span className="text-neutral-700 flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 inline-block mr-1.5"></span>
                            {t('org.stats.programs')}
                          </span>
                          <span className="font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md">
                            {organization.stats.programs} nationwide
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center pb-2 border-b border-amber-100">
                          <span className="text-neutral-700 flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block mr-1.5"></span>
                            {t('org.stats.funding')}
                          </span>
                          <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                            {organization.stats.funding} (2023)
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-neutral-700 flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1.5"></span>
                            {t('org.stats.programAllocation')}
                          </span>
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                            {organization.stats.programAllocation}% of funds
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right columns - metrics */}
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Impact IQ Breakdown */}
                      <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                        <h4 className="font-semibold text-amber-800 flex items-center mb-4">
                          <span className="material-icons text-amber-500 mr-2">equalizer</span>
                          <MetricTooltip metric="impactBreakdown">{t('org.impactBreakdown')}</MetricTooltip>
                        </h4>
                        <div className="space-y-4">
                          <ProgressWithLabel
                            label={t('org.metrics.reportingQuality')}
                            value={organization.metrics.reportingQuality}
                            max={20}
                            color="bg-gradient-to-r from-teal-400 to-teal-500"
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.reach')}
                            value={organization.metrics.reach}
                            max={20}
                            color="bg-gradient-to-r from-amber-400 to-amber-500"
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.socialROI')}
                            value={organization.metrics.socialROI}
                            max={20}
                            color="bg-gradient-to-r from-orange-400 to-orange-500"
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.outcomeEffectiveness')}
                            value={organization.metrics.outcomeEffectiveness}
                            max={20}
                            color="bg-gradient-to-r from-indigo-400 to-indigo-500"
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.transparencyGovernance')}
                            value={organization.metrics.transparencyGovernance}
                            max={20}
                            color="bg-gradient-to-r from-emerald-400 to-emerald-500"
                          />
                        </div>
                      </div>
                      
                      {/* Annual Impact Trend */}
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <h4 className="font-medium text-neutral-900 mb-3">{t('org.annualTrend')}</h4>
                        <div className="h-48 flex items-center justify-center">
                          <ChartPlaceholder />
                        </div>
                      </div>
                      
                      {/* Top Programs */}
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 md:col-span-2">
                        <h4 className="font-medium text-neutral-900 mb-3">{t('org.topPrograms')}</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-neutral-200">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700">Program</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700">{t('org.program.peopleReached')}</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700">{t('org.program.socialROI')}</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700">{t('org.program.score')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white">
                              {organization.topPrograms.map((program, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 text-sm text-neutral-900">{program.name}</td>
                                  <td className="px-3 py-2 text-sm text-neutral-900">{program.peopleReached.toLocaleString()}</td>
                                  <td className="px-3 py-2 text-sm text-neutral-900">
                                    <MetricTooltip metric="socialROI">
                                      ${program.socialROI.toFixed(2)}
                                    </MetricTooltip>
                                  </td>
                                  <td className="px-3 py-2">
                                    <MetricTooltip metric="impactGrade">
                                      <BadgeWithIcon 
                                        text={program.impactGrade}
                                        variant="success"
                                      />
                                    </MetricTooltip>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3 text-center">
                          <span 
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
                            onClick={() => window.location.href = `/organization/${organization.id}/programs`}
                          >
                            {t('org.viewAllPrograms').replace('{count}', organization.stats.programs.toString())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              No featured organization data available
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const OrganizationProfileSkeleton = () => (
  <>
    <div className="relative">
      <div className="bg-primary-600 h-16 md:h-24"></div>
      <div className="px-4 sm:px-6 pb-4 relative -mt-12 flex flex-col md:flex-row">
        <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
          <Skeleton className="h-24 w-24 rounded-md" />
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-4 md:pt-12 flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            
            <div className="flex items-center mt-2 md:mt-0">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="ml-3 h-6 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="border-t border-neutral-200">
      <div className="px-4 sm:px-6">
        <div className="flex -mb-px py-4 space-x-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
    
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>
          
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <Skeleton className="h-5 w-36 mb-3" />
              <Skeleton className="h-48 w-full rounded" />
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 md:col-span-2">
              <Skeleton className="h-5 w-44 mb-3" />
              <Skeleton className="h-32 w-full rounded" />
              <div className="mt-3 text-center">
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default OrganizationProfileSection;
