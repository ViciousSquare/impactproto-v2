import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { language, setLanguage, t } = useLanguage();

  const platformLinks = [
    { name: t('nav.leaderboard'), href: '/leaderboard' },
    { name: t('nav.solutionFinder'), href: '/solution-finder' },
    { name: 'Organization Directory', href: '/organizations' },
    { name: 'Impact Reports', href: '/reports' },
    { name: 'Methodology', href: '/methodology' },
  ];

  const organizationLinks = [
    { name: 'Join Basic Impacts', href: '/join' },
    { name: 'Claim Your Profile', href: '/claim' },
    { name: 'Upload Reports', href: '/upload' },
    { name: 'Verification Process', href: '/verification' },
    { name: 'Impact Measurement Guide', href: '/guide' },
  ];

  const aboutLinks = [
    { name: 'Our Mission', href: '/mission' },
    { name: 'Team', href: '/team' },
    { name: 'Partners', href: '/partners' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="relative text-neutral-200 py-12 md:py-16 overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900 to-amber-950 z-0"></div>
      
      {/* Decorative warm elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-teal-500 opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-700/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-700/20 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand section */}
          <div>
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <span className="material-icons text-sm">bar_chart</span>
              </div>
              <h2 className="ml-3 text-xl font-semibold text-white">Basic<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Impacts</span></h2>
            </div>
            <p className="text-amber-100/80 mb-6 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-8 w-8 rounded-full bg-amber-800/50 hover:bg-amber-700 flex items-center justify-center text-amber-200 hover:text-white transition-colors duration-200">
                <span className="material-icons text-sm">facebook</span>
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-amber-800/50 hover:bg-amber-700 flex items-center justify-center text-amber-200 hover:text-white transition-colors duration-200">
                <span className="material-icons text-sm">twitter</span>
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-amber-800/50 hover:bg-amber-700 flex items-center justify-center text-amber-200 hover:text-white transition-colors duration-200">
                <span className="material-icons text-sm">linkedin</span>
              </a>
            </div>
          </div>
          
          {/* Platform links */}
          <div>
            <h3 className="text-white font-medium mb-5 text-lg">{t('footer.platform')}</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-amber-200/80 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* For Organizations links */}
          <div>
            <h3 className="text-white font-medium mb-5 text-lg">{t('footer.forOrganizations')}</h3>
            <ul className="space-y-3">
              {organizationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-amber-200/80 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* About links */}
          <div>
            <h3 className="text-white font-medium mb-5 text-lg">{t('footer.about')}</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-amber-200/80 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-amber-800/30 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center mb-6 md:mb-0 space-y-2 md:space-y-0">
            <Link href="/terms">
              <span className="text-amber-200/70 hover:text-white text-sm cursor-pointer transition-colors duration-200">{t('footer.termsOfService')}</span>
            </Link>
            <span className="hidden md:inline mx-2 text-amber-700/80">•</span>
            <Link href="/privacy">
              <span className="text-amber-200/70 hover:text-white text-sm cursor-pointer transition-colors duration-200">{t('footer.privacyPolicy')}</span>
            </Link>
            <span className="hidden md:inline mx-2 text-amber-700/80">•</span>
            <Link href="/cookies">
              <span className="text-amber-200/70 hover:text-white text-sm cursor-pointer transition-colors duration-200">{t('footer.cookiePolicy')}</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="mr-6 flex items-center text-amber-200/70 text-sm">
              <span className="material-icons text-xs mr-1">language</span>
              <select 
                className="bg-transparent border-none text-amber-200/70 focus:text-white focus:ring-0 cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
              >
                <option className="bg-amber-950 text-white" value="en">English</option>
                <option className="bg-amber-950 text-white" value="fr">Français</option>
              </select>
            </div>
            <p className="text-sm text-amber-200/60">{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
