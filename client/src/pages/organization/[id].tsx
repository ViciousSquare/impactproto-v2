import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { OrganizationProfile as OrganizationProfileType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import BadgeWithIcon from '@/components/ui/badge-with-icon';
import ProgressWithLabel from '@/components/ui/progress-with-label';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricTooltip } from '@/components/ui/metric-tooltip';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const OrganizationProfilePage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [match, params] = useRoute('/organization/:id');
  
  const { data: organization, isLoading } = useQuery<OrganizationProfileType>({
    queryKey: [`/api/organizations/${params?.id}`],
  });

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="text-2xl">Organization not found</div>
        <Link href="/leaderboard">
          <Button className="mt-4">Return to Leaderboard</Button>
        </Link>
      </div>
    );
  }

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

  // Create chart data from yearly trend
  const prepareChartData = (trend: number[]) => {
    if (!trend || trend.length === 0) return [];
    
    // Calculate base year (last 5 years)
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - trend.length;
    
    return trend.map((value, index) => ({
      year: startYear + index,
      score: value
    }));
  };

  return (
    <div className="py-0 md:py-0">
      {isLoading ? (
        <OrganizationProfileSkeleton />
      ) : organization ? (
        <>
          {/* Organization header */}
          <div className="relative">
            <div className="bg-primary-600 h-32 md:h-48"></div>
            <div className="absolute top-2 right-2">
              {organization.verificationType && (
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-md px-3 py-1 text-xs font-medium text-primary-500 flex items-center">
                  <span className="material-icons text-sm mr-1">
                    {getVerificationBadge(organization.verificationType).icon}
                  </span>
                  {getVerificationBadge(organization.verificationType).text}
                </div>
              )}
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4 relative -mt-16 flex flex-col md:flex-row">
              <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
                <div className="h-24 w-24 bg-primary-100 rounded-md flex items-center justify-center">
                  <span className="material-icons text-primary-500 text-4xl">
                    {getSectorIcon(organization.sector)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-4 md:pt-12 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-900">{organization.name}</h1>
                    <p className="text-neutral-600 text-sm">
                      {organization.sector} | {organization.region} {organization.established ? `| Est. ${organization.established}` : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className="text-2xl font-serif font-bold text-neutral-900">{organization.impactScore}</span>
                    <span className="ml-2 text-xs text-neutral-700 leading-tight">
                      Impact IQ<br />Score
                    </span>
                    <BadgeWithIcon
                      text={organization.impactGrade}
                      variant="success"
                      className="ml-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Organization tabs */}
          <div className="border-t border-neutral-200 bg-white sticky top-16 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap py-4 px-1 font-medium text-sm mr-8 border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {t('org.tabs.overview')}
                </button>
                <button 
                  onClick={() => setActiveTab('impactMetrics')}
                  className={`whitespace-nowrap py-4 px-1 font-medium text-sm mr-8 border-b-2 ${
                    activeTab === 'impactMetrics'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {t('org.tabs.impactMetrics')}
                </button>
                <button 
                  onClick={() => setActiveTab('programs')}
                  className={`whitespace-nowrap py-4 px-1 font-medium text-sm mr-8 border-b-2 ${
                    activeTab === 'programs'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {t('org.tabs.programs')}
                </button>
                <button 
                  onClick={() => setActiveTab('reports')}
                  className={`whitespace-nowrap py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'reports'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {t('org.tabs.reports')}
                </button>
              </nav>
            </div>
          </div>
          
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div className="bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left column - description */}
                  <div className="md:col-span-1">
                    <div className="mb-6">
                      <h4 className="font-medium text-neutral-900 mb-2">{t('org.mission')}</h4>
                      <p className="text-sm text-neutral-700">
                        {organization.mission}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-neutral-900 mb-2">{t('org.sdgAlignment')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {organization.sdgAlignment.map((sdg, index) => (
                          <BadgeWithIcon
                            key={index}
                            text={sdg}
                            className="bg-primary-100 text-primary-800"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">{t('org.keyStats')}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{t('org.stats.peopleReached')}</span>
                          <span className="font-medium text-neutral-900">{organization.stats.peopleReached}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{t('org.stats.socialROI')}</span>
                          <span className="font-medium text-neutral-900">${organization.stats.socialROI} per $1</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{t('org.stats.programs')}</span>
                          <span className="font-medium text-neutral-900">{organization.stats.programs} nationwide</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{t('org.stats.funding')}</span>
                          <span className="font-medium text-neutral-900">{organization.stats.funding} (2023)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{t('org.stats.programAllocation')}</span>
                          <span className="font-medium text-neutral-900">{organization.stats.programAllocation}% of funds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right columns - metrics */}
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Impact IQ Breakdown */}
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <h4 className="font-medium text-neutral-900 mb-3">
                          <MetricTooltip metric="impactBreakdown">{t('org.impactBreakdown')}</MetricTooltip>
                        </h4>
                        <div className="space-y-3">
                          <ProgressWithLabel
                            label={t('org.metrics.reportingQuality')}
                            value={organization.metrics.reportingQuality}
                            max={20}
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.reach')}
                            value={organization.metrics.reach}
                            max={20}
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.socialROI')}
                            value={organization.metrics.socialROI}
                            max={20}
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.outcomeEffectiveness')}
                            value={organization.metrics.outcomeEffectiveness}
                            max={20}
                          />
                          
                          <ProgressWithLabel
                            label={t('org.metrics.transparencyGovernance')}
                            value={organization.metrics.transparencyGovernance}
                            max={20}
                          />
                        </div>
                      </div>
                      
                      {/* Annual Impact Trend */}
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <h4 className="font-medium text-neutral-900 mb-3">{t('org.annualTrend')}</h4>
                        <div className="h-48">
                          {organization.yearlyTrend && organization.yearlyTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={prepareChartData(organization.yearlyTrend)}
                                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip 
                                  formatter={(value) => [`${value}`, 'Impact Score']}
                                  labelFormatter={(label) => `Year: ${label}`}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="score" 
                                  stroke="hsl(var(--primary))" 
                                  activeDot={{ r: 8 }} 
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="w-full h-full bg-white rounded border border-neutral-200 p-2 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-neutral-400 material-icons text-4xl">insert_chart</div>
                                <p className="text-xs text-neutral-500 mt-2">Impact IQ Score Trend (2019-2023)</p>
                              </div>
                            </div>
                          )}
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
                                  <td className="px-3 py-2 text-sm text-neutral-900">${program.socialROI.toFixed(2)}</td>
                                  <td className="px-3 py-2">
                                    <BadgeWithIcon 
                                      text={program.impactGrade}
                                      variant="success"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3 text-center">
                          <Link href={`/organization/${organization.id}/programs`}>
                            <Button variant="link" className="text-primary-500 hover:text-primary-600">
                              {t('org.viewAllPrograms').replace('{count}', organization.stats.programs.toString())}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Impact Metrics Tab Content */}
          {activeTab === 'impactMetrics' && (
            <div className="bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                    <h3 className="text-lg font-semibold mb-4">
                      <MetricTooltip metric="impactBreakdown">Impact Score Breakdown</MetricTooltip>
                    </h3>
                    <div className="space-y-5">
                      <ProgressWithLabel
                        label={t('org.metrics.reportingQuality')}
                        value={organization.metrics.reportingQuality}
                        max={20}
                      />
                      
                      <ProgressWithLabel
                        label={t('org.metrics.reach')}
                        value={organization.metrics.reach}
                        max={20}
                      />
                      
                      <ProgressWithLabel
                        label={t('org.metrics.socialROI')}
                        value={organization.metrics.socialROI}
                        max={20}
                      />
                      
                      <ProgressWithLabel
                        label={t('org.metrics.outcomeEffectiveness')}
                        value={organization.metrics.outcomeEffectiveness}
                        max={20}
                      />
                      
                      <ProgressWithLabel
                        label={t('org.metrics.transparencyGovernance')}
                        value={organization.metrics.transparencyGovernance}
                        max={20}
                      />
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <h4 className="font-medium mb-3">Composite Score</h4>
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary-600">{organization.impactScore}</span>
                        </div>
                        <div className="ml-4">
                          <BadgeWithIcon 
                            text={organization.impactGrade}
                            variant="success"
                            className="mb-1"
                          />
                          <div className={`text-sm ${organization.yearlyChange >= 0 ? 'text-success' : 'text-error'}`}>
                            {organization.yearlyChange > 0 ? '+' : ''}{organization.yearlyChange}% from last year
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                    <h3 className="text-lg font-semibold mb-4">Historical Performance</h3>
                    <div className="h-80">
                      {organization.yearlyTrend && organization.yearlyTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={prepareChartData(organization.yearlyTrend)}
                            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip 
                              formatter={(value) => [`${value}`, 'Impact Score']}
                              labelFormatter={(label) => `Year: ${label}`}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              name="Impact IQ Score"
                              dataKey="score" 
                              stroke="hsl(var(--primary))" 
                              activeDot={{ r: 8 }} 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full bg-white rounded border border-neutral-200 p-2 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-neutral-400 material-icons text-4xl">insert_chart</div>
                            <p className="text-xs text-neutral-500 mt-2">Impact IQ Score Trend (2019-2023)</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <h4 className="font-medium mb-3">Key Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-neutral-200">
                          <div className="text-sm text-neutral-600">Social ROI</div>
                          <div className="text-lg font-bold">${organization.stats.socialROI} <span className="text-xs font-normal">per $1</span></div>
                        </div>
                        <div className="bg-white p-3 rounded border border-neutral-200">
                          <div className="text-sm text-neutral-600">People Reached</div>
                          <div className="text-lg font-bold">{organization.stats.peopleReached}</div>
                        </div>
                        <div className="bg-white p-3 rounded border border-neutral-200">
                          <div className="text-sm text-neutral-600">Program Allocation</div>
                          <div className="text-lg font-bold">{organization.stats.programAllocation}%</div>
                        </div>
                        <div className="bg-white p-3 rounded border border-neutral-200">
                          <div className="text-sm text-neutral-600">Verification</div>
                          <div className="text-base font-medium flex items-center">
                            <span className="material-icons text-sm mr-1">{getVerificationBadge(organization.verificationType).icon}</span>
                            {getVerificationBadge(organization.verificationType).text}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Programs Tab Content */}
          {activeTab === 'programs' && (
            <div className="bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Programs ({organization.stats.programs})</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <span className="material-icons text-sm mr-1">filter_list</span>
                      Filter
                    </Button>
                    <Select>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Sort by Impact Score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="impact">Impact Score (High to Low)</SelectItem>
                        <SelectItem value="roi">Social ROI (High to Low)</SelectItem>
                        <SelectItem value="reach">People Reached (High to Low)</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organization.topPrograms.concat(organization.topPrograms).map((program, index) => (
                    <div key={index} className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="h-10 w-10 bg-primary-100 rounded-md flex items-center justify-center">
                            <span className="material-icons text-primary-500">volunteer_activism</span>
                          </div>
                          <BadgeWithIcon 
                            text={program.impactGrade}
                            variant="success"
                          />
                        </div>
                        
                        <h4 className="font-semibold text-neutral-900 mb-3">{program.name}</h4>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">People Reached:</span>
                            <span className="font-medium text-neutral-900">{program.peopleReached.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Social ROI:</span>
                            <span className="font-medium text-neutral-900">${program.socialROI.toFixed(2)} per $1</span>
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline" className="w-full">
                          View Program Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Reports Tab Content */}
          {activeTab === 'reports' && (
            <div className="bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Impact Reports</h3>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  {/* Reports would be displayed here */}
                  <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                        <span className="material-icons text-primary-500">description</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-neutral-900">Annual Impact Report 2023</h4>
                            <p className="text-sm text-neutral-600">Published: March, 2023</p>
                          </div>
                          <div className="flex items-center mt-2 md:mt-0">
                            <BadgeWithIcon
                              text="Verified"
                              icon="fact_check"
                              className="text-info"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-neutral-700 mb-3">
                          Annual report detailing the organization's impact, financials, and key metrics for 2023.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="flex items-center">
                        <span className="material-icons text-sm mr-1">file_download</span>
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                        <span className="material-icons text-primary-500">description</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-neutral-900">Annual Impact Report 2022</h4>
                            <p className="text-sm text-neutral-600">Published: March, 2022</p>
                          </div>
                          <div className="flex items-center mt-2 md:mt-0">
                            <BadgeWithIcon
                              text="Verified"
                              icon="fact_check"
                              className="text-info"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-neutral-700 mb-3">
                          Annual report detailing the organization's impact, financials, and key metrics for 2022.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="flex items-center">
                        <span className="material-icons text-sm mr-1">file_download</span>
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container mx-auto px-4 py-10 text-center">
          <div className="text-2xl">Organization not found</div>
          <Link href="/leaderboard">
            <Button className="mt-4">Return to Leaderboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

const OrganizationProfileSkeleton = () => (
  <>
    <div className="relative">
      <div className="bg-primary-600 h-32 md:h-48"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4 relative -mt-16 flex flex-col md:flex-row">
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
    
    <div className="border-t border-neutral-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex -mb-px py-4 space-x-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
    
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
    </div>
  </>
);

export default OrganizationProfilePage;
