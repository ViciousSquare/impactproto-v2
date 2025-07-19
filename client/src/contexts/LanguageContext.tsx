import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

type TranslationKey = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.leaderboard': 'Leaderboard',
    'nav.solutionFinder': 'Solution Finder',
    'nav.methodology': 'Methodology',
    'nav.reports': 'Reports',
    'nav.about': 'About',
    'nav.signIn': 'Sign In',
    
    // Hero Section
    'hero.title': 'Discover Real Impact',
    'hero.subtitle': 'Track, compare, and validate the social impact of Canadian organizations across sectors.',
    'hero.search': 'Search organizations or causes...',
    'hero.cta': 'Find Impact',
    'hero.stats.organizations': 'Organizations',
    'hero.stats.programs': 'Programs',
    'hero.stats.impactValue': 'Impact Value',
    
    // Leaderboard
    'leaderboard.title': 'Impact Leaderboard',
    'leaderboard.subtitle': 'Top performing organizations by Impact IQ score',
    'leaderboard.allSectors': 'All Sectors',
    'leaderboard.allRegions': 'All Regions',
    'leaderboard.allSDGs': 'All SDGs',
    'leaderboard.bySector': 'By Sector',
    'leaderboard.exploreBySector': 'Explore top organizations across different sectors',
    'leaderboard.viewAll': 'View All',
    'leaderboard.seeMoreInSector': 'See more in this sector',
    'leaderboard.table.rank': 'Rank',
    'leaderboard.table.organization': 'Organization',
    'leaderboard.table.impactIQ': 'Impact IQ',
    'leaderboard.table.socialROI': 'Social ROI',
    'leaderboard.table.sector': 'Sector',
    'leaderboard.table.region': 'Region',
    'leaderboard.table.grade': 'Grade',
    'leaderboard.table.verification': 'Verification',
    'leaderboard.pagination.previous': 'Previous',
    'leaderboard.pagination.next': 'Next',
    'leaderboard.pagination.showing': 'Showing',
    'leaderboard.pagination.to': 'to',
    'leaderboard.pagination.of': 'of',
    'leaderboard.pagination.results': 'results',
    
    // Organization Profile
    'org.featuredTitle': 'Featured Organization',
    'org.featuredSubtitle': 'Detailed performance insights and impact metrics',
    'org.viewAll': 'View all organizations',
    'org.tabs.overview': 'Overview',
    'org.tabs.impactMetrics': 'Impact Metrics',
    'org.tabs.programs': 'Programs',
    'org.tabs.reports': 'Reports',
    'org.mission': 'Mission',
    'org.sdgAlignment': 'UN SDG Alignment',
    'org.keyStats': 'Key Statistics',
    'org.stats.peopleReached': 'People Reached:',
    'org.stats.socialROI': 'Social ROI:',
    'org.stats.programs': 'Programs:',
    'org.stats.funding': 'Funding:',
    'org.stats.programAllocation': 'Program Allocation:',
    'org.impactBreakdown': 'Impact IQ Breakdown',
    'org.metrics.reportingQuality': 'Reporting Quality',
    'org.metrics.reach': 'Reach',
    'org.metrics.socialROI': 'Social ROI',
    'org.metrics.outcomeEffectiveness': 'Outcome Effectiveness',
    'org.metrics.transparencyGovernance': 'Transparency & Governance',
    'org.annualTrend': 'Annual Impact Trend',
    'org.topPrograms': 'Top Programs by Impact',
    'org.program.peopleReached': 'People Reached',
    'org.program.socialROI': 'Social ROI',
    'org.program.score': 'Score',
    'org.viewAllPrograms': 'View all {count} programs',
    
    // Success Stories
    'successStories.title': 'Impact Success Stories',
    'successStories.subtitle': 'Learn how organizations are making measurable impacts across Canada',
    'successStories.viewAll': 'View All Stories',
    'successStories.viewFullProfile': 'View Full Organization Profile',
    
    // Solution Finder
    'solution.title': 'Solution Finder',
    'solution.subtitle': 'Find effective programs addressing specific social needs',
    'solution.advancedSearch': 'Advanced search',
    'solution.searchPlaceholder': 'Search by problem or need...',
    'solution.allSectors': 'All Sectors',
    'solution.allRegions': 'All Regions',
    'solution.allBusinessTypes': 'All Business Types',
    'solution.allSDGs': 'All SDGs',
    'solution.allDemographics': 'All Demographics',
    'solution.viewMore': 'View More Solutions',
    
    // CTA Section
    'cta.title': 'Is your organization making an impact?',
    'cta.subtitle': 'Join Basic Impacts to showcase your organization\'s impact, improve transparency, and connect with funders and partners.',
    'cta.feature1': 'Create and manage your organization\'s profile',
    'cta.feature2': 'Upload and validate impact reports',
    'cta.feature3': 'Showcase your programs and impact metrics',
    'cta.feature4': 'Connect with funders and potential partners',
    'cta.join': 'Join Basic Impacts',
    'cta.learnMore': 'Learn More',
    'cta.portal': 'Organization Portal',
    'cta.portalSubtitle': 'Manage your impact profile',
    'cta.uploadReport': 'Upload Impact Report',
    'cta.updateMetrics': 'Update Impact Metrics',
    'cta.managePrograms': 'Manage Programs',
    'cta.requestVerification': 'Request Verification',
    
    // Footer
    'footer.tagline': 'Setting a new global standard for transparency, usability, and data-driven social impact measurement.',
    'footer.platform': 'Platform',
    'footer.forOrganizations': 'For Organizations',
    'footer.about': 'About',
    'footer.termsOfService': 'Terms of Service',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.copyright': '© 2023 Basic Impacts. All rights reserved.',
    
    // Verification types
    'verification.audited': 'Audited',
    'verification.verified': 'Verified',
    'verification.selfReported': 'Self-Reported',
    
    // About page
    'about.title': 'Why Basic Impacts Exists',
    'about.subtitle': 'We\'re building a future where social impact is transparent, measurable, and accountable — addressing the critical gaps in Canada\'s social sector.',
    'about.problem.title': 'The Problem',
    'about.problem.description': 'Canada\'s social sector lacks standardized impact measurement, leading to inefficient resource allocation, duplicated efforts, and an inability to identify truly effective approaches to our most pressing social challenges.',
    'about.solution.title': 'Our Solution',
    'about.solution.description': 'Basic Impacts provides a comprehensive platform that standardizes impact measurement, creates transparency, and enables data-driven decision making across the social sector.',
    'about.stats.title': 'The Urgent Need for Impact Accountability',
    'about.stats.subtitle': 'Real-world statistics show the critical gaps in Canada\'s social impact ecosystem',
    'about.wastage.title': 'The Cost of Inaction',
    'about.wastage.subtitle': 'Ineffective impact measurement leads to significant resource wastage',
    'about.approach.title': 'Our Approach',
    'about.approach.subtitle': 'Basic Impacts combines robust methodology with user-friendly tools',
    'about.cta.title': 'Join the Impact Accountability Movement',
    'about.cta.subtitle': 'Together, we can transform how social impact is measured, reported, and improved across Canada.',
    'about.cta.register': 'Register Your Organization',
    'about.cta.learnMore': 'Learn More About Our Methodology',
    
    // Common terms
    'common.fromLastYear': 'from last year',
    'common.annually': 'annually',
    'common.nationwide': 'nationwide',
    'common.preview': 'Preview',
    'common.details': 'Details',
    'common.effective': 'effective',
  },
  fr: {
    // Navigation
    'nav.leaderboard': 'Tableau de classement',
    'nav.solutionFinder': 'Chercheur de solutions',
    'nav.methodology': 'Méthodologie',
    'nav.reports': 'Rapports',
    'nav.about': 'À propos',
    'nav.signIn': 'Se connecter',
    
    // Hero Section
    'hero.title': 'Découvrez l\'impact réel',
    'hero.subtitle': 'Suivez, comparez et validez l\'impact social des organisations canadiennes dans tous les secteurs.',
    'hero.search': 'Rechercher des organisations ou des causes...',
    'hero.cta': 'Trouver l\'impact',
    'hero.stats.organizations': 'Organisations',
    'hero.stats.programs': 'Programmes',
    'hero.stats.impactValue': 'Valeur d\'impact',
    
    // Leaderboard
    'leaderboard.title': 'Tableau d\'impact',
    'leaderboard.subtitle': 'Les meilleures organisations par score d\'impact IQ',
    'leaderboard.allSectors': 'Tous les secteurs',
    'leaderboard.allRegions': 'Toutes les régions',
    'leaderboard.allSDGs': 'Tous les ODD',
    'leaderboard.bySector': 'Par Secteur',
    'leaderboard.exploreBySector': 'Explorez les meilleures organisations dans différents secteurs',
    'leaderboard.viewAll': 'Voir Tout',
    'leaderboard.seeMoreInSector': 'Voir plus dans ce secteur',
    'leaderboard.table.rank': 'Rang',
    'leaderboard.table.organization': 'Organisation',
    'leaderboard.table.impactIQ': 'IQ d\'impact',
    'leaderboard.table.socialROI': 'RSI social',
    'leaderboard.table.sector': 'Secteur',
    'leaderboard.table.region': 'Région',
    'leaderboard.table.grade': 'Note',
    'leaderboard.table.verification': 'Vérification',
    'leaderboard.pagination.previous': 'Précédent',
    'leaderboard.pagination.next': 'Suivant',
    'leaderboard.pagination.showing': 'Affichage de',
    'leaderboard.pagination.to': 'à',
    'leaderboard.pagination.of': 'sur',
    'leaderboard.pagination.results': 'résultats',
    
    // Organization Profile
    'org.featuredTitle': 'Organisation en vedette',
    'org.featuredSubtitle': 'Aperçus détaillés des performances et métriques d\'impact',
    'org.viewAll': 'Voir toutes les organisations',
    'org.tabs.overview': 'Aperçu',
    'org.tabs.impactMetrics': 'Métriques d\'impact',
    'org.tabs.programs': 'Programmes',
    'org.tabs.reports': 'Rapports',
    'org.mission': 'Mission',
    'org.sdgAlignment': 'Alignement ODD de l\'ONU',
    'org.keyStats': 'Statistiques clés',
    'org.stats.peopleReached': 'Personnes atteintes:',
    'org.stats.socialROI': 'RSI social:',
    'org.stats.programs': 'Programmes:',
    'org.stats.funding': 'Financement:',
    'org.stats.programAllocation': 'Allocation aux programmes:',
    'org.impactBreakdown': 'Ventilation de l\'IQ d\'impact',
    'org.metrics.reportingQuality': 'Qualité des rapports',
    'org.metrics.reach': 'Portée',
    'org.metrics.socialROI': 'RSI social',
    'org.metrics.outcomeEffectiveness': 'Efficacité des résultats',
    'org.metrics.transparencyGovernance': 'Transparence et gouvernance',
    'org.annualTrend': 'Tendance d\'impact annuelle',
    'org.topPrograms': 'Meilleurs programmes par impact',
    'org.program.peopleReached': 'Personnes atteintes',
    'org.program.socialROI': 'RSI social',
    'org.program.score': 'Score',
    'org.viewAllPrograms': 'Voir tous les {count} programmes',
    
    // Success Stories
    'successStories.title': 'Histoires de réussite d\'impact',
    'successStories.subtitle': 'Découvrez comment les organisations créent des impacts mesurables au Canada',
    'successStories.viewAll': 'Voir toutes les histoires',
    'successStories.viewFullProfile': 'Voir le profil complet de l\'organisation',
    
    // Solution Finder
    'solution.title': 'Chercheur de solutions',
    'solution.subtitle': 'Trouvez des programmes efficaces répondant à des besoins sociaux spécifiques',
    'solution.advancedSearch': 'Recherche avancée',
    'solution.searchPlaceholder': 'Rechercher par problème ou besoin...',
    'solution.allSectors': 'Tous les secteurs',
    'solution.allRegions': 'Toutes les régions',
    'solution.allBusinessTypes': 'Tous les types d\'entreprises',
    'solution.allSDGs': 'Tous les ODD',
    'solution.allDemographics': 'Toutes les démographies',
    'solution.viewMore': 'Voir plus de solutions',
    
    // CTA Section
    'cta.title': 'Votre organisation a-t-elle un impact?',
    'cta.subtitle': 'Rejoignez Basic Impacts pour présenter l\'impact de votre organisation, améliorer la transparence et vous connecter avec des bailleurs de fonds et des partenaires.',
    'cta.feature1': 'Créez et gérez le profil de votre organisation',
    'cta.feature2': 'Téléchargez et validez les rapports d\'impact',
    'cta.feature3': 'Présentez vos programmes et métriques d\'impact',
    'cta.feature4': 'Connectez-vous avec des bailleurs de fonds et des partenaires potentiels',
    'cta.join': 'Rejoindre Basic Impacts',
    'cta.learnMore': 'En savoir plus',
    'cta.portal': 'Portail d\'organisation',
    'cta.portalSubtitle': 'Gérez votre profil d\'impact',
    'cta.uploadReport': 'Télécharger un rapport d\'impact',
    'cta.updateMetrics': 'Mettre à jour les métriques',
    'cta.managePrograms': 'Gérer les programmes',
    'cta.requestVerification': 'Demander une vérification',
    
    // Footer
    'footer.tagline': 'Établir une nouvelle norme mondiale pour la transparence, la convivialité et la mesure de l\'impact social basée sur les données.',
    'footer.platform': 'Plateforme',
    'footer.forOrganizations': 'Pour les organisations',
    'footer.about': 'À propos',
    'footer.termsOfService': 'Conditions d\'utilisation',
    'footer.privacyPolicy': 'Politique de confidentialité',
    'footer.cookiePolicy': 'Politique des cookies',
    'footer.copyright': '© 2023 Basic Impacts. Tous droits réservés.',
    
    // Verification types
    'verification.audited': 'Audité',
    'verification.verified': 'Vérifié',
    'verification.selfReported': 'Auto-déclaré',
    
    // About page
    'about.title': 'Pourquoi Basic Impacts Existe',
    'about.subtitle': 'Nous construisons un avenir où l\'impact social est transparent, mesurable et responsable — en comblant les lacunes critiques du secteur social canadien.',
    'about.problem.title': 'Le Problème',
    'about.problem.description': 'Le secteur social canadien manque de mesures d\'impact standardisées, ce qui entraîne une allocation inefficace des ressources, des efforts dupliqués et une incapacité à identifier des approches véritablement efficaces pour nos défis sociaux les plus pressants.',
    'about.solution.title': 'Notre Solution',
    'about.solution.description': 'Basic Impacts fournit une plateforme complète qui standardise la mesure d\'impact, crée de la transparence et permet une prise de décision basée sur les données dans tout le secteur social.',
    'about.stats.title': 'Le Besoin Urgent de Responsabilité d\'Impact',
    'about.stats.subtitle': 'Des statistiques réelles montrent les lacunes critiques dans l\'écosystème d\'impact social du Canada',
    'about.wastage.title': 'Le Coût de l\'Inaction',
    'about.wastage.subtitle': 'Des mesures d\'impact inefficaces entraînent un gaspillage important de ressources',
    'about.approach.title': 'Notre Approche',
    'about.approach.subtitle': 'Basic Impacts combine une méthodologie robuste avec des outils conviviaux',
    'about.cta.title': 'Rejoignez le Mouvement de Responsabilité d\'Impact',
    'about.cta.subtitle': 'Ensemble, nous pouvons transformer la façon dont l\'impact social est mesuré, rapporté et amélioré à travers le Canada.',
    'about.cta.register': 'Enregistrez Votre Organisation',
    'about.cta.learnMore': 'En Savoir Plus Sur Notre Méthodologie',
    
    // Common terms
    'common.fromLastYear': 'par rapport à l\'année dernière',
    'common.annually': 'annuellement',
    'common.nationwide': 'à l\'échelle nationale',
    'common.preview': 'Aperçu',
    'common.details': 'Détails',
    'common.effective': 'efficace',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
