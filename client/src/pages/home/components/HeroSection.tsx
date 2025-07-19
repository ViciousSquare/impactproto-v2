import { useLanguage } from '@/contexts/LanguageContext';
import { PlatformStatistics } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSectionProps {
  stats: PlatformStatistics;
  loading: boolean;
}

const HeroSection = ({ stats, loading }: HeroSectionProps) => {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/solution-finder?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Format the impact value as currency
  const formatImpactValue = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <section className="relative overflow-hidden text-white py-20 md:py-28">
      {/* Enhanced gradient background with more depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-orange-600 to-amber-800 z-0"></div>
      
      {/* Improved decorative pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptNiAwaDZ2LTZoLTZ2NnptLTEyIDBoLTZ2Nmg2di02eiIvPjwvZz48L2c+PC9zdmc+Cg==')]
        opacity-20 z-0"></div>
      
      {/* Enhanced decorative elements with subtle animation */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400 opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500 opacity-10 rounded-full -translate-x-1/3 translate-y-1/3 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-300 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-amber-900/20 z-0"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-4 shadow-glow-sm">
              <span className="text-xs font-medium text-white flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                {t('common.preview')} • Basic Impacts Platform 2024
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-amber-100 text-lg md:text-xl mb-8 max-w-xl leading-relaxed opacity-90">
              {t('hero.subtitle')}
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">search</span>
                <Input 
                  type="text" 
                  placeholder={t('hero.search')}
                  className="pl-10 pr-4 py-6 rounded-xl w-full text-neutral-800 focus:ring-2 focus:ring-amber-300 border-0 shadow-xl text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl px-8 py-3 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300 h-[52px]"
              >
                {t('hero.cta')}
              </Button>
            </form>
            <div className="flex flex-wrap gap-5 mt-6">
              <span className="text-white/80 text-sm flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-300 inline-block mr-2"></span>
                Trusted by 2400+ organizations
              </span>
              <span className="text-white/80 text-sm flex items-center">
                <span className="h-2 w-2 rounded-full bg-orange-300 inline-block mr-2"></span>
                Impact measurement verified
              </span>
              <span className="text-white/80 text-sm flex items-center">
                <span className="h-2 w-2 rounded-full bg-teal-300 inline-block mr-2"></span>
                Real Canadian organizations
              </span>
            </div>
          </div>
          
          <div className="md:w-5/12 w-full">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-8 px-6 flex flex-col md:flex-row justify-between shadow-2xl gap-6 md:gap-2">
              {loading ? (
                <>
                  <StatSkeleton />
                  <StatSkeleton />
                  <StatSkeleton />
                </>
              ) : (
                <>
                  <div className="text-center px-3 flex-1">
                    <div className="bg-gradient-to-br from-amber-500/30 to-amber-600/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-amber">
                      <span className="text-amber-100 material-icons text-2xl">business</span>
                    </div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-white to-amber-200 bg-clip-text text-transparent">
                      {stats.organizationCount.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-white/80">{t('hero.stats.organizations')}</p>
                  </div>
                  
                  <div className="text-center px-3 flex-1">
                    <div className="bg-gradient-to-br from-orange-500/30 to-orange-600/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-orange">
                      <span className="text-orange-100 material-icons text-2xl">dashboard</span>
                    </div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-white to-orange-200 bg-clip-text text-transparent">
                      {stats.programCount.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-white/80">{t('hero.stats.programs')}</p>
                  </div>
                  
                  <div className="text-center px-3 flex-1">
                    <div className="bg-gradient-to-br from-teal-500/30 to-teal-600/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-teal">
                      <span className="text-teal-100 material-icons text-2xl">attach_money</span>
                    </div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-white to-teal-200 bg-clip-text text-transparent whitespace-nowrap">
                      {formatImpactValue(stats.impactValue)}
                    </p>
                    <p className="text-sm font-medium text-white/80">{t('hero.stats.impactValue')}</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Added trusted logos */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-xs text-center text-white/60 mb-3">Trusted by leading Canadian organizations</p>
              <div className="flex justify-between items-center">
                <div className="w-1/3 text-center text-white/70 font-medium">Jack.org</div>
                <div className="w-1/3 text-center text-white/70 font-medium">CFBN</div>
                <div className="w-1/3 text-center text-white/70 font-medium">Pathways</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatSkeleton = () => (
  <div className="text-center px-1 sm:px-2 flex-1">
    <Skeleton className="h-7 w-16 sm:w-20 mb-1 mx-auto bg-white/40" />
    <Skeleton className="h-3 w-16 sm:w-20 mx-auto bg-white/30" />
  </div>
);

export default HeroSection;
