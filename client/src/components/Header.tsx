import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Header = () => {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: t('nav.leaderboard'), href: '/leaderboard', icon: 'leaderboard' },
    { name: t('nav.solutionFinder'), href: '/solution-finder', icon: 'search' },
    { name: t('nav.methodology'), href: '/methodology', icon: 'science' },
    { name: t('nav.reports'), href: '/reports', icon: 'insights' },
    { name: t('nav.about'), href: '/about', icon: 'info' },
  ];

  const isActive = (path: string) => {
    const [location] = useLocation();
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  <span className="material-icons text-sm">bar_chart</span>
                </div>
                <div className="ml-2">
                  <h1 className="text-xl font-semibold text-neutral-900">Basic<span className="text-primary-500">Impacts</span></h1>
                  <p className="text-xs text-neutral-600">Impact Accountability Platform</p>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span 
                  className={`font-medium flex items-center cursor-pointer ${
                    isActive(item.href) 
                      ? 'text-primary-500 border-b-2 border-primary-500 pb-4 -mb-4' 
                      : 'text-neutral-700 hover:text-primary-500'
                  }`}
                >
                  <span className="material-icons mr-1 text-sm">{item.icon}</span> {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="hidden md:flex items-center">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-2 text-neutral-700 rounded-l-md ${
                  language === 'en' ? 'bg-primary-100 font-medium' : 'bg-neutral-100 hover:bg-neutral-200'
                } border-r border-neutral-300`}
              >
                <span>EN</span>
              </button>
              <button 
                onClick={() => setLanguage('fr')}
                className={`px-3 py-2 text-neutral-700 rounded-r-md ${
                  language === 'fr' ? 'bg-primary-100 font-medium' : 'bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                <span>FR</span>
              </button>
            </div>
            
            {/* Sign In button */}
            <Button className="flex items-center">
              <span className="material-icons mr-1 text-sm">login</span>
              <span>{t('nav.signIn')}</span>
            </Button>
            
            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 pt-12">
                <div className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <span 
                        className={`font-medium flex items-center p-2 rounded cursor-pointer ${
                          isActive(item.href) 
                            ? 'bg-primary-50 text-primary-600' 
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="material-icons mr-2 text-sm">{item.icon}</span> {item.name}
                      </span>
                    </Link>
                  ))}
                  
                  {/* Mobile language switcher */}
                  <div className="flex items-center p-2 mt-4">
                    <button 
                      onClick={() => {
                        setLanguage('en');
                        setIsOpen(false);
                      }}
                      className={`px-3 py-2 text-neutral-700 rounded-l-md ${
                        language === 'en' ? 'bg-primary-100 font-medium' : 'bg-neutral-100 hover:bg-neutral-200'
                      } border-r border-neutral-300 flex-1`}
                    >
                      <span>EN</span>
                    </button>
                    <button 
                      onClick={() => {
                        setLanguage('fr');
                        setIsOpen(false);
                      }}
                      className={`px-3 py-2 text-neutral-700 rounded-r-md ${
                        language === 'fr' ? 'bg-primary-100 font-medium' : 'bg-neutral-100 hover:bg-neutral-200'
                      } flex-1`}
                    >
                      <span>FR</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
