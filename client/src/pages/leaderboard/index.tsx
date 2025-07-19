import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  LeaderboardItem, 
  TrendingItem, 
  SECTOR_OPTIONS, 
  REGION_OPTIONS, 
  SDG_OPTIONS 
} from '@/lib/types';
import TrendingTicker from '@/components/ui/trending-ticker';
import BadgeWithIcon from '@/components/ui/badge-with-icon';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const Leaderboard = () => {
  const { t } = useLanguage();
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [sdg, setSdg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('impactScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [size, setSize] = useState(''); // Added size state

  const ORGANIZATION_SIZE_OPTIONS = [
    { value: 'large', label: t('leaderboard.large') },
    { value: 'medium', label: t('leaderboard.medium') },
    { value: 'small', label: t('leaderboard.small') },
  ]; // Added organization size options

  // Fetch trending items
  const { data: trendingItems, isLoading: trendingLoading } = useQuery<TrendingItem[]>({
    queryKey: ['/api/trending'],
  });

  // Fetch leaderboard data with filters
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery<{
    items: LeaderboardItem[];
    total: number;
  }>({
    queryKey: ['/api/leaderboard', sector, region, sdg, searchQuery, currentPage, sortBy, sortOrder, size], // Added size to query key
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new column
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

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

  // Helper to show sort icons
  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return 'unfold_more';
    }
    return sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
  };

  const itemsPerPage = 10; // More items for the full leaderboard page

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">{t('leaderboard.title')}</h2>
            <p className="text-neutral-600">{t('leaderboard.subtitle')}</p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <form onSubmit={handleSearch} className="relative md:col-span-2">
              <span className="material-icons absolute left-3 top-3 text-neutral-500">search</span>
              <Input 
                type="text" 
                placeholder="Search organizations..."
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <Select value={sector} onValueChange={(value) => { setSector(value); setCurrentPage(1); }}>
              <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 h-auto">
                <SelectValue placeholder={t('leaderboard.allSectors')} />
              </SelectTrigger>
              <SelectContent>
                {SECTOR_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Select value={region} onValueChange={(value) => { setRegion(value); setCurrentPage(1); }}>
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 h-auto">
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

              <Select value={size} onValueChange={(value) => { setSize(value); setCurrentPage(1); }}> {/* Added size filter */}
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 h-auto">
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

              <Select value={sdg} onValueChange={(value) => { setSdg(value); setCurrentPage(1); }}>
                <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-neutral-700 h-auto">
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

        {/* Leaderboard table */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('impactScore')}>
                      <span>{t('leaderboard.table.impactIQ')}</span>
                      <span className="material-icons ml-1 text-neutral-500">
                        {getSortIcon('impactScore')}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                    {t('leaderboard.table.organization')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('socialROI')}>
                      <span>{t('leaderboard.table.socialROI')}</span>
                      <span className="material-icons ml-1 text-neutral-500">
                        {getSortIcon('socialROI')}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                    {t('leaderboard.table.sector')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                    {t('leaderboard.table.region')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('impactGrade')}>
                      <span>{t('leaderboard.table.grade')}</span>
                      <span className="material-icons ml-1 text-neutral-500">
                        {getSortIcon('impactGrade')}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                    {t('leaderboard.table.verification')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {leaderboardLoading ? (
                  Array(itemsPerPage).fill(0).map((_, i) => (
                    <tr key={i} className="table-row-hover">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-4" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="ml-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20 mt-1" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-8 rounded-full" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    </tr>
                  ))
                ) : leaderboardData && leaderboardData.items.length > 0 ? (
                  leaderboardData.items.map((item) => {
                    const verificationDetails = getVerificationDetails(item.verificationType);

                    return (
                      <tr key={item.id} className="table-row-hover">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                          {item.rank}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link href={`/organization/${item.id}`}>
                            <a className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                                <span className="material-icons">
                                  {item.sector === 'Food Security' ? 'volunteer_activism' : 
                                   item.sector === 'Housing' ? 'house' :
                                   item.sector === 'Education' ? 'school' :
                                   item.sector === 'Environment' ? 'eco' :
                                   'healing'}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                                <div className="text-xs text-neutral-500">{item.sector}</div>
                              </div>
                            </a>
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">{item.impactScore}</div>
                          <div className={`text-xs ${item.yearlyChange >= 0 ? 'text-success' : 'text-error'}`}>
                            {item.yearlyChange > 0 ? '+' : ''}{item.yearlyChange}% {t('common.fromLastYear')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                          ${item.socialROI.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {item.sector}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {item.region}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <BadgeWithIcon 
                            text={item.impactGrade} 
                            variant="success"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                          <div className={`flex items-center ${verificationDetails.className}`}>
                            <span className="material-icons text-sm mr-1">{verificationDetails.icon}</span>
                            {verificationDetails.text}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-neutral-500">
                      No organizations found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {leaderboardData && leaderboardData.total > 0 && (
            <div className="bg-neutral-50 px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  {t('leaderboard.pagination.previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * itemsPerPage >= leaderboardData.total}
                >
                  {t('leaderboard.pagination.next')}
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-700">
                    {t('leaderboard.pagination.showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> {t('leaderboard.pagination.to')} <span className="font-medium">{Math.min(currentPage * itemsPerPage, leaderboardData.total)}</span> {t('leaderboard.pagination.of')} <span className="font-medium">{leaderboardData.total}</span> {t('leaderboard.pagination.results')}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 text-sm font-medium"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">{t('leaderboard.pagination.previous')}</span>
                      <span className="material-icons text-sm">chevron_left</span>
                    </Button>

                    {/* Page buttons */}
                    {Array.from({ length: Math.min(5, Math.ceil(leaderboardData.total / itemsPerPage)) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page 
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' 
                            : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}

                    {/* Conditional ellipsis */}
                    {Math.ceil(leaderboardData.total / itemsPerPage) > 5 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700">
                        ...
                      </span>
                    )}

                    {/* Last page button */}
                    {Math.ceil(leaderboardData.total / itemsPerPage) > 5 && (
                      <Button
                        variant={currentPage === Math.ceil(leaderboardData.total / itemsPerPage) ? "default" : "outline"}
                        size="sm"
                        className="bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        onClick={() => handlePageChange(Math.ceil(leaderboardData.total / itemsPerPage))}
                      >
                        {Math.ceil(leaderboardData.total / itemsPerPage)}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 text-sm font-medium"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage * itemsPerPage >= leaderboardData.total}
                    >
                      <span className="sr-only">{t('leaderboard.pagination.next')}</span>
                      <span className="material-icons text-sm">chevron_right</span>
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;