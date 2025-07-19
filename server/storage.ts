import { 
  users, 
  organizations, 
  programs, 
  metrics, 
  reports, 
  statistics,
  invitations,
  verificationRequests,
  notifications,
  targetPartners,
  activityLogs,
  workflows,
  type User, 
  type InsertUser, 
  type Organization,
  type InsertOrganization,
  type Program,
  type InsertProgram,
  type Metric,
  type InsertMetric,
  type Report,
  type InsertReport,
  type Invitation,
  type InsertInvitation,
  type VerificationRequest,
  type InsertVerificationRequest,
  type Notification,
  type InsertNotification,
  type TargetPartner,
  type InsertTargetPartner,
  type ActivityLog,
  type InsertActivityLog,
  type Workflow,
  type InsertWorkflow,
  type Statistic
} from "@shared/schema";
import { 
  LeaderboardItem, 
  TrendingItem, 
  OrganizationProfile,
  SolutionItem,
  VerificationType,
  ImpactGrade,
  Sector,
  Region,
  SDG,
  Demographic
} from "@/lib/types";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  listUsers(filters?: { role?: string, query?: string, page?: number, limit?: number }): Promise<{ users: User[], total: number }>;

  // Statistics
  getStatistics(): Promise<{
    organizationCount: number;
    programCount: number;
    impactValue: number;
    pendingInvites?: number;
    pendingVerifications?: number;
    activeUsers?: number;
  }>;
  updateStatistics(data: Partial<Statistic>): Promise<Statistic>;

  // Trending
  getTrendingOrganizations(): Promise<TrendingItem[]>;

  // Leaderboard
  getLeaderboard(filters: {
    sector: string;
    region: string;
    sdg: string;
    query: string;
    page: number;
    sortBy: string;
    sortOrder: string;
  }): Promise<{
    items: LeaderboardItem[];
    total: number;
  }>;

  // Organizations
  getFeaturedOrganization(): Promise<OrganizationProfile[]>;
  getOrganizationById(id: number): Promise<OrganizationProfile | undefined>;
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  updateOrganization(id: number, data: Partial<InsertOrganization>): Promise<Organization | undefined>;
  deleteOrganization(id: number): Promise<boolean>;
  listOrganizations(filters?: { 
    sector?: string, 
    region?: string, 
    verificationType?: string, 
    query?: string, 
    page?: number, 
    limit?: number 
  }): Promise<{ organizations: Organization[], total: number }>;
  importOrganizations(organizations: InsertOrganization[]): Promise<{ 
    successful: number, 
    failed: number, 
    errors: Array<{ index: number, error: string }> 
  }>;
  generateProfileLink(organizationId: number): Promise<string>;
  getSuccessStories(): Promise<OrganizationProfile[]>;

  // Solutions
  getSolutions(filters: {
    query: string;
    sector: string;
    region: string;
    businessType: string;
    sdg: string;
    demographic: string;
    page: number;
  }): Promise<SolutionItem[]>;

  // Programs
  getProgramsByOrganization(organizationId: number): Promise<Program[]>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, data: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<boolean>;

  // Metrics
  getMetric(id: number): Promise<Metric | undefined>;
  getMetricsByOrganization(organizationId: number): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  updateMetric(id: number, data: Partial<InsertMetric>): Promise<Metric | undefined>;

  // Reports
  getReportsByOrganization(organizationId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, data: Partial<InsertReport>): Promise<Report | undefined>;
  deleteReport(id: number): Promise<boolean>;
  extractReportData(reportId: number): Promise<any>;

  // Invitations
  createInvitation(invitation: InsertInvitation): Promise<Invitation>;
  getInvitationByToken(token: string): Promise<Invitation | undefined>;
  getInvitationsByOrganization(organizationId: number): Promise<Invitation[]>;
  listInvitations(filters?: { 
    status?: string, 
    page?: number, 
    limit?: number 
  }): Promise<{ invitations: Invitation[], total: number }>;
  updateInvitation(id: number, data: Partial<InsertInvitation>): Promise<Invitation | undefined>;

  // Verification Requests
  createVerificationRequest(request: InsertVerificationRequest): Promise<VerificationRequest>;
  getVerificationRequestsByOrganization(organizationId: number): Promise<VerificationRequest[]>;
  listVerificationRequests(filters?: { 
    status?: string, 
    requestType?: string, 
    page?: number, 
    limit?: number 
  }): Promise<{ requests: VerificationRequest[], total: number }>;
  updateVerificationRequest(id: number, data: Partial<InsertVerificationRequest>): Promise<VerificationRequest | undefined>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<boolean>;
  deleteNotification(id: number): Promise<boolean>;

  // Target Partners
  createTargetPartner(partner: InsertTargetPartner): Promise<TargetPartner>;
  getTargetPartnersByOrganization(organizationId: number): Promise<TargetPartner[]>;
  updateTargetPartner(id: number, data: Partial<InsertTargetPartner>): Promise<TargetPartner | undefined>;
  deleteTargetPartner(id: number): Promise<boolean>;

  // Activity Logs
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogsByUser(userId: number): Promise<ActivityLog[]>;
  getActivityLogsByEntity(entityType: string, entityId: number): Promise<ActivityLog[]>;
  listActivityLogs(filters?: { 
    userId?: number, 
    action?: string, 
    entityType?: string, 
    page?: number, 
    limit?: number 
  }): Promise<{ logs: ActivityLog[], total: number }>;

  // Workflows
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  getWorkflowById(id: number): Promise<Workflow | undefined>;
  updateWorkflow(id: number, data: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;
  listWorkflows(filters?: { 
    isActive?: boolean, 
    createdBy?: number, 
    page?: number, 
    limit?: number 
  }): Promise<{ workflows: Workflow[], total: number }>;

  // AI and Data Processing
  parseOrganizationJson(jsonData: string): Promise<{ 
    parsed: boolean, 
    data?: Partial<InsertOrganization>, 
    metrics?: Partial<InsertMetric>,
    programs?: Partial<InsertProgram>[],
    targetPartners?: Partial<InsertTargetPartner>[],
    error?: string 
  }>;
  getRecommendedOrganizationsToAdd(limit?: number): Promise<{ 
    name: string, 
    sector: string, 
    region: string, 
    potentialImpact: string 
  }[]>;
  getRecommendationsForOrganization(organizationId: number): Promise<{ 
    title: string, 
    description: string, 
    impactPotential: string,
    difficulty: string 
  }[]>;
  getPotentialPartnersForOrganization(organizationId: number): Promise<{ 
    organizationId: number, 
    name: string, 
    sector: string, 
    compatibilityScore: number 
  }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private organizations: Map<number, Organization>;
  private programs: Map<number, Program>;
  private metrics: Map<number, Metric>;
  private reports: Map<number, Report>;
  private invitations: Map<number, Invitation>;
  private verificationRequests: Map<number, VerificationRequest>;
  private notifications: Map<number, Notification>;
  private targetPartners: Map<number, TargetPartner>;
  private activityLogs: Map<number, ActivityLog>;
  private workflows: Map<number, Workflow>;
  private stats: Statistic;

  currentId: number;

  constructor() {
    this.users = new Map();
    this.organizations = new Map();
    this.programs = new Map();
    this.metrics = new Map();
    this.reports = new Map();
    this.invitations = new Map();
    this.verificationRequests = new Map();
    this.notifications = new Map();
    this.targetPartners = new Map();
    this.activityLogs = new Map();
    this.workflows = new Map();
    this.currentId = 1;

    // Initialize with sample data for demo
    this.initSampleData();

    // Set initial statistics
    this.stats = {
      id: 1,
      organizationCount: 2418,
      programCount: 7142,
      impactValue: 4200000000, // $4.2B
      pendingInvites: 32,
      pendingVerifications: 18,
      activeUsers: 1243,
      updatedAt: new Date()
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      updatedAt: now,
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async listOrganizations(filters: any = {}): Promise<{ organizations: Organization[]; total: number }> {
    let organizations = Array.from(this.organizations.values());

    // Apply filters
    if (filters.sector) {
      organizations = organizations.filter(org => org.sector === filters.sector);
    }

    if (filters.region) {
      organizations = organizations.filter(org => org.region === filters.region);
    }

    if (filters.verificationType) {
      organizations = organizations.filter(org => org.verificationType === filters.verificationType);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      organizations = organizations.filter(org => 
        org.name.toLowerCase().includes(query)
      );
    }

    // Sort by latest created
    organizations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;

    return {
      organizations: organizations.slice(startIndex, startIndex + limit),
      total: organizations.length
    };
  }

  async listUsers(filters: { 
    role?: string; 
    query?: string; 
    page?: number; 
    limit?: number; 
  } = {}): Promise<{ users: User[]; total: number; }> {
    let users = Array.from(this.users.values());

    // Apply filters
    if (filters.role) {
      users = users.filter(user => user.role === filters.role);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      users = users.filter(user => 
        user.username.toLowerCase().includes(query) || 
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.name && user.name.toLowerCase().includes(query))
      );
    }

    // Sort by latest created
    users.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;

    return {
      users: users.slice(startIndex, startIndex + limit),
      total: users.length
    };
  }

  // Statistics operations
  async getStatistics(): Promise<{
    organizationCount: number;
    programCount: number;
    impactValue: number;
    pendingInvites?: number;
    pendingVerifications?: number;
    activeUsers?: number;
  }> {
    return {
      organizationCount: this.stats.organizationCount || 0,
      programCount: this.stats.programCount || 0,
      impactValue: this.stats.impactValue || 0,
      pendingInvites: this.stats.pendingInvites || 0,
      pendingVerifications: this.stats.pendingVerifications || 0,
      activeUsers: this.stats.activeUsers || 0
    };
  }

  async updateStatistics(data: Partial<Statistic>): Promise<Statistic> {
    this.stats = {
      ...this.stats,
      ...data,
      updatedAt: new Date()
    };

    return this.stats;
  }

  // Trending operations
  async getTrendingOrganizations(): Promise<TrendingItem[]> {
    return [
      { id: 6, name: 'FoodShare Toronto', change: 12.3 },
      { id: 20, name: 'The Narwhal', change: 7.2 },
      { id: 1, name: 'Jack.org', change: 8.5 },
      { id: 10, name: 'Aga Khan Foundation Canada', change: 6.3 },
      { id: 12, name: 'Indspire', change: 5.4 },
      { id: 2, name: 'Canadian Food Banks Network', change: 5.2 },
      { id: 11, name: 'MaRS Discovery District', change: 4.7 }
    ];
  }

  // Leaderboard operations
  async getLeaderboard(filters: {
    sector: string;
    region: string;
    sdg: string;
    query: string;
    page: number;
    sortBy: string;
    sortOrder: string;
  }): Promise<{
    items: LeaderboardItem[];
    total: number;
  }> {
    // Enhanced leaderboard data based on organizations from JSON file
    const leaderboard: LeaderboardItem[] = [
      {
        id: 2,
        rank: 1,
        name: 'Canadian Food Banks Network',
        sector: 'Food Security',
        impactScore: 92,
        yearlyChange: 5.2,
        socialROI: 8.7,
        region: 'National',
        impactGrade: ImpactGrade.APlus,
        verificationType: VerificationType.Verified
      },
      {
        id: 10,
        rank: 2,
        name: 'Aga Khan Foundation Canada',
        sector: 'International Development',
        impactScore: 92,
        yearlyChange: 6.3,
        socialROI: 5.2,
        region: 'National',
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited
      },
      {
        id: 11,
        rank: 3,
        name: 'MaRS Discovery District',
        sector: 'Innovation & Entrepreneurship',
        impactScore: 90,
        yearlyChange: 4.7,
        socialROI: 5.0,
        region: 'Ontario',
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified
      },
      {
        id: 5,
        rank: 4,
        name: 'Pathways to Education',
        sector: 'Education',
        impactScore: 91,
        yearlyChange: 4.8,
        socialROI: 7.9,
        region: 'National',
        impactGrade: ImpactGrade.APlus,
        verificationType: VerificationType.Verified
      },
      {
        id: 3,
        rank: 6,
        name: 'Housing First Canada',
        sector: 'Housing',
        impactScore: 89,
        yearlyChange: 4.1,
        socialROI: 6.8,
        region: 'National',
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited
      },
      {
        id: 1,
        rank: 7,
        name: 'Jack.org',
        sector: 'Youth Mental Health',
        impactScore: 87,
        yearlyChange: 8.5,
        socialROI: 6.2,
        region: 'National',
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.SelfReported
      },
      {
        id: 6,
        rank: 5,
        name: 'FoodShare Toronto',
        sector: 'Food Security',
        impactScore: 87,
        yearlyChange: 12.3,
        socialROI: 6.4,
        region: 'Ontario',
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified
      },
      {
        id: 4,
        rank: 8,
        name: 'Environmental Defence Canada',
        sector: 'Environment',
        impactScore: 85,
        yearlyChange: 2.8,
        socialROI: 5.7,
        region: 'National',
        impactGrade: ImpactGrade.BPlus,
        verificationType: VerificationType.Verified
      }
    ];

    // Apply filters (simple implementation for demo)
    let filtered = [...leaderboard];

    if (filters.sector) {
      filtered = filtered.filter(item => item.sector === filters.sector);
    }

    if (filters.region) {
      filtered = filtered.filter(item => item.region === filters.region);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.sector.toLowerCase().includes(query)
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof LeaderboardItem];
      const bValue = b[filters.sortBy as keyof LeaderboardItem];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    // Pagination
    const page = filters.page || 1;
    const pageSize = 5;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    // Remove duplicates by name and get paginated items
    const uniqueItems = filtered.reduce((acc, current) => {
      const exists = acc.find(item => item.name === current.name);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof filtered);

    // Create final paginated items from unique items
    const finalPaginatedItems = uniqueItems.slice(startIndex, endIndex);

    return {
      items: finalPaginatedItems,
      total: 243 // Mock total for pagination
    };
  }

  // Organization operations
  async getFeaturedOrganization(): Promise<OrganizationProfile[]> {
    return [
      {
        id: 2,
        name: 'Canadian Food Banks Network',
        logo: undefined,
        mission: 'Working to relieve hunger today and prevent hunger tomorrow through community-based food programs, advocacy, and sustainable solutions.',
        sector: 'Food Security',
        region: 'National',
        established: 1985,
        impactScore: 92,
        impactGrade: ImpactGrade.APlus,
        verificationType: VerificationType.Verified,
        yearlyChange: 5.2,
        sdgAlignment: [
          'SDG 2: Zero Hunger',
          'SDG 1: No Poverty',
          'SDG 10: Reduced Inequalities'
        ],
        metrics: {
          reportingQuality: 18,
          reach: 18,
          socialROI: 19,
          outcomeEffectiveness: 18,
          transparencyGovernance: 18
        },
        stats: {
          peopleReached: '1.1M annually',
          socialROI: 8.7,
          programs: 12,
          funding: '$22.5M',
          programAllocation: 85
        },
        yearlyTrend: [82, 85, 89, 92, 95],
        topPrograms: [
          {
            name: 'Emergency Food Relief',
            peopleReached: 425000,
            socialROI: 12.45,
            impactGrade: ImpactGrade.APlus
          },
          {
            name: 'Community Kitchen Network',
            peopleReached: 312000,
            socialROI: 8.76,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Food Waste Reduction',
            peopleReached: 275000,
            socialROI: 7.92,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 1,
        name: 'Jack.org',
        logo: undefined,
        mission: 'Jack.org trains and empowers young leaders to revolutionize mental health in Canada through peer-to-peer education, community building, and advocacy initiatives.',
        sector: 'Youth Mental Health',
        region: 'National',
        established: 2010,
        impactScore: 87,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.SelfReported,
        yearlyChange: 8.5,
        sdgAlignment: [
          'SDG 3: Good Health and Well-being',
          'SDG 4: Quality Education',
          'SDG 10: Reduced Inequalities'
        ],
        metrics: {
          reportingQuality: 17,
          reach: 18,
          socialROI: 16,
          outcomeEffectiveness: 17,
          transparencyGovernance: 16
        },
        stats: {
          peopleReached: '170,500 annually',
          socialROI: 6.2,
          programs: 5,
          funding: '$9.26M',
          programAllocation: 65.8
        },
        yearlyTrend: [78, 79, 82, 85, 87],
        topPrograms: [
          {
            name: 'Jack Chapters',
            peopleReached: 120000,
            socialROI: 6.8,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Jack Talks',
            peopleReached: 26000,
            socialROI: 7.2,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Be There Certificate',
            peopleReached: 24500,
            socialROI: 5.8,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 8,
        name: 'National Education Access',
        logo: undefined,
        mission: 'National Education Access works to eliminate barriers to education through scholarships, mentoring programs, and digital learning tools that create pathways to success for underserved students.',
        sector: 'Education',
        region: 'National',
        established: 2005,
        impactScore: 90,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        yearlyChange: 3.8,
        sdgAlignment: [
          'SDG 4: Quality Education',
          'SDG 10: Reduced Inequalities',
          'SDG 8: Decent Work and Economic Growth'
        ],
        metrics: {
          reportingQuality: 18,
          reach: 18,
          socialROI: 18,
          outcomeEffectiveness: 19,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '625,000 annually',
          socialROI: 8.75,
          programs: 9,
          funding: '$19.5M',
          programAllocation: 85
        },
        yearlyTrend: [78, 82, 85, 88, 90],
        topPrograms: [
          {
            name: 'First Generation Scholarship',
            peopleReached: 245000,
            socialROI: 9.85,
            impactGrade: ImpactGrade.APlus
          },
          {
            name: 'Digital Learning Initiative',
            peopleReached: 215000,
            socialROI: 8.45,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Career Pathways Mentoring',
            peopleReached: 165000,
            socialROI: 7.95,
            impactGrade: ImpactGrade.A
          }
        ]
      },
      {
        id: 9,
        name: 'Urban Housing Solutions',
        logo: undefined,
        mission: 'Urban Housing Solutions creates affordable, sustainable housing in urban centers through innovative development models, tenant support services, and advocacy for inclusive housing policies.',
        sector: 'Housing',
        region: 'Ontario',
        established: 2003,
        impactScore: 88,
        impactGrade: ImpactGrade.AMinus,
        verificationType: VerificationType.Verified,
        yearlyChange: 5.2,
        sdgAlignment: [
          'SDG 11: Sustainable Cities and Communities',
          'SDG 1: No Poverty',
          'SDG 10: Reduced Inequalities'
        ],
        metrics: {
          reportingQuality: 17,
          reach: 17,
          socialROI: 18,
          outcomeEffectiveness: 18,
          transparencyGovernance: 18
        },
        stats: {
          peopleReached: '58,000 annually',
          socialROI: 8.15,
          programs: 7,
          funding: '$16.2M',
          programAllocation: 83
        },
        yearlyTrend: [76, 79, 83, 86, 88],
        topPrograms: [
          {
            name: 'Affordable Housing Development',
            peopleReached: 28000,
            socialROI: 9.25,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Community Integration Services',
            peopleReached: 18000,
            socialROI: 7.85,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Housing Stability Program',
            peopleReached: 12000,
            socialROI: 7.25,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 10,
        name: 'Health Access Network',
        logo: undefined,
        mission: 'Health Access Network improves healthcare accessibility for underserved communities through mobile clinics, telemedicine services, and preventive health education programs.',
        sector: 'Health',
        region: 'Quebec',
        established: 2007,
        impactScore: 87,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        yearlyChange: 2.8,
        sdgAlignment: [
          'SDG 3: Good Health',
          'SDG 10: Reduced Inequalities'
        ],
        metrics: {
          reportingQuality: 17,
          reach: 18,
          socialROI: 18,
          outcomeEffectiveness: 17,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '165,000 annually',
          socialROI: 7.85,
          programs: 8,
          funding: '$14.5M',
          programAllocation: 84
        },
        yearlyTrend: [77, 80, 83, 85, 87],
        topPrograms: [
          {
            name: 'Mobile Health Clinics',
            peopleReached: 75000,
            socialROI: 8.65,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Preventive Health Education',
            peopleReached: 52000,
            socialROI: 7.45,
            impactGrade: ImpactGrade.AMinus
          },
          {
            name: 'Telemedicine for Rural Areas',
            peopleReached: 38000,
            socialROI: 7.25,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 11,
        name: 'Regional Economic Development',
        logo: undefined,
        mission: 'Regional Economic Development fosters sustainable economic growth in rural and underserved regions through small business development, skills training, and infrastructure investment.',
        sector: 'Economic Development',
        region: 'Atlantic',
        established: 2009,
        impactScore: 85,
        impactGrade: ImpactGrade.AMinus,
        verificationType: VerificationType.Verified,
        yearlyChange: 4.8,
        sdgAlignment: [
          'SDG 8: Decent Work and Economic Growth',
          'SDG 9: Industry, Innovation and Infrastructure',
          'SDG 10: Reduced Inequalities'
        ],
        metrics: {
          reportingQuality: 17,
          reach: 16,
          socialROI: 17,
          outcomeEffectiveness: 17,
          transparencyGovernance: 18
        },
        stats: {
          peopleReached: '72,000 annually',
          socialROI: 7.45,
          programs: 6,
          funding: '$12.8M',
          programAllocation: 82
        },
        yearlyTrend: [74, 77, 80, 83, 85],
        topPrograms: [
          {
            name: 'Small Business Development',
            peopleReached: 32000,
            socialROI: 8.15,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Skills Training Initiative',
            peopleReached: 25000,
            socialROI: 7.35,
            impactGrade: ImpactGrade.AMinus
          },
          {
            name: 'Infrastructure Investment',
            peopleReached: 15000,
            socialROI: 6.85,
            impactGrade: ImpactGrade.BMinus
          }
        ]
      },
      {
        id: 12,
        name: 'Arts & Heritage Foundation',
        logo: undefined,
        mission: 'Arts & Heritage Foundation preserves and promotes Canada\'s cultural heritage through community arts programming, cultural preservation initiatives, and inclusive artistic education.',
        sector: 'Arts & Culture',
        region: 'Quebec',
        established: 2004,
        impactScore: 83,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        yearlyChange: 2.5,
        sdgAlignment: [
          'SDG 4: Quality Education',
          'SDG 10: Reduced Inequalities',
          'SDG 11: Sustainable Cities and Communities'
        ],
        metrics: {
          reportingQuality: 16,
          reach: 17,
          socialROI: 17,
          outcomeEffectiveness: 16,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '190,000 annually',
          socialROI: 6.85,
          programs: 9,
          funding: '$13.5M',
          programAllocation: 81
        },
        yearlyTrend: [75, 78, 80, 82, 83],
        topPrograms: [
          {
            name: 'Community Arts Access',
            peopleReached: 85000,
            socialROI: 7.25,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Cultural Heritage Preservation',
            peopleReached: 65000,
            socialROI: 6.75,
            impactGrade: ImpactGrade.AMinus
          },
          {
            name: 'Arts Education for Youth',
            peopleReached: 40000,
            socialROI: 6.45,
            impactGrade: ImpactGrade.B
          }
        ]
      },
      {
        id: 13,
        name: 'Indigenous Community Alliance',
        logo: undefined,
        mission: 'Indigenous Community Alliance strengthens Indigenous communities through cultural revitalization, economic sovereignty initiatives, and land-based education programs.',
        sector: 'Social Services',
        region: 'British Columbia',
        established: 2006,
        impactScore: 89,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited,
        yearlyChange: 5.6,
        sdgAlignment: [
          'SDG 4: Quality Education',
          'SDG 10: Reduced Inequalities',
          'SDG 15: Life on Land',
          'SDG 16: Peace, Justice and Strong Institutions'
        ],
        metrics: {
          reportingQuality: 18,
          reach: 18,
          socialROI: 17,
          outcomeEffectiveness: 18,
          transparencyGovernance: 18
        },
        stats: {
          peopleReached: '35,000 annually',
          socialROI: 8.65,
          programs: 8,
          funding: '$15.2M',
          programAllocation: 86
        },
        yearlyTrend: [76, 80, 84, 87, 89],
        topPrograms: [
          {
            name: 'Cultural Revitalization',
            peopleReached: 16000,
            socialROI: 9.15,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Economic Sovereignty',
            peopleReached: 12000,
            socialROI: 8.45,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Land-Based Education',
            peopleReached: 7000,
            socialROI: 8.25,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 21,
        name: 'Youth Mental Health Collective',
        logo: undefined,
        mission: 'Youth Mental Health Collective promotes mental wellness among young Canadians through peer support networks, digital wellness resources, and mental health education in schools.',
        sector: 'Health & Wellbeing',
        region: 'Ontario',
        established: 2010,
        impactScore: 86,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        yearlyChange: 6.2,
        sdgAlignment: [
          'SDG 3: Good Health',
          'SDG 4: Quality Education',
          'SDG 10: Reduced Inequalities'
        ],
        metrics: {
          reportingQuality: 17,
          reach: 18,
          socialROI: 17,
          outcomeEffectiveness: 17,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '225,000 annually',
          socialROI: 7.95,
          programs: 7,
          funding: '$16.8M',
          programAllocation: 83
        },
        yearlyTrend: [72, 76, 79, 82, 86],
        topPrograms: [
          {
            name: 'Peer Support Networks',
            peopleReached: 95000,
            socialROI: 8.35,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Digital Wellness Platform',
            peopleReached: 75000,
            socialROI: 7.85,
            impactGrade: ImpactGrade.AMinus
          },
          {
            name: 'School Mental Health Program',
            peopleReached: 55000,
            socialROI: 7.65,
            impactGrade: ImpactGrade.B
          }
        ]
      },
      {
        id: 15,
        name: 'Rural Food Security Initiative',
        logo: undefined,
        mission: 'Rural Food Security Initiative improves access to nutritious food in rural and remote communities through local food systems development, nutrition education, and food distribution networks.',
        sector: 'Food Security',
        region: 'Prairies',
        established: 2008,
        impactScore: 84,
        impactGrade: ImpactGrade.AMinus,
        verificationType: VerificationType.Verified,
        yearlyChange: 3.7,
        sdgAlignment: [
          'SDG 2: Zero Hunger',
          'SDG 3: Good Health',
          'SDG 12: Responsible Consumption'
        ],
        metrics: {
          reportingQuality: 16,
          reach: 17,
          socialROI: 17,
          outcomeEffectiveness: 17,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '85,000 annually',
          socialROI: 7.35,
          programs: 6,
          funding: '$11.2M',
          programAllocation: 84
        },
        yearlyTrend: [74, 77, 80, 82, 84],
        topPrograms: [
          {
            name: 'Local Food Systems Development',
            peopleReached: 38000,
            socialROI: 8.05,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Nutrition Education',
            peopleReached: 26000,
            socialROI: 7.15,
            impactGrade: ImpactGrade.AMinus
          },
          {
            name: 'Rural Food Distribution Network',
            peopleReached: 21000,
            socialROI: 6.85,
            impactGrade: ImpactGrade.B
          }
        ]
      },
      {
        id: 16,
        name: 'Northern Conservation Network',
        logo: undefined,
        mission: 'Northern Conservation Network protects Canada\'s northern ecosystems through community-based conservation, climate adaptation strategies, and sustainable resource management.',
        sector: 'Environment',
        region: 'Northern',
        established: 2007,
        impactScore: 82,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        yearlyChange: 4.2,
        sdgAlignment: [
          'SDG 13: Climate Action',
          'SDG 14: Life Below Water',
          'SDG 15: Life on Land'
        ],
        metrics: {
          reportingQuality: 16,
          reach: 16,
          socialROI: 17,
          outcomeEffectiveness: 16,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '28,000 annually',
          socialROI: 8.15,
          programs: 5,
          funding: '$10.5M',
          programAllocation: 85
        },
        yearlyTrend: [71, 74, 77, 80, 82],
        topPrograms: [
          {
            name: 'Community-Based Conservation',
            peopleReached: 12000,
            socialROI: 8.45,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Climate Adaptation Strategies',
            peopleReached: 9000,
            socialROI: 8.15,
            impactGrade: ImpactGrade.AMinus
          },
          {
            name: 'Sustainable Resource Management',
            peopleReached: 7000,
            socialROI: 7.85,
            impactGrade: ImpactGrade.B
          }
        ]
      }
    ];
  }

  async getOrganizationById(id: number): Promise<OrganizationProfile | undefined> {
    // Return the specific organization by ID
    const organizations = await this.getFeaturedOrganization();
    return organizations.find(org => org.id === id);
  }

  async getSuccessStories(): Promise<OrganizationProfile[]> {
    // Return showcase organizations as success stories
    return [
      {
        id: 3,
        name: 'Housing First Canada',
        logo: undefined,
        mission: 'Ending chronic homelessness through evidence-based housing first approaches and systems change.',
        sector: 'Housing',
        region: 'National',
        established: 2009,
        impactScore: 89,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited,
        yearlyChange: 4.1,
        sdgAlignment: [
          'SDG 11: Sustainable Cities and Communities',
          'SDG 1: No Poverty',
          'SDG 3: Good Health and Well-being'
        ],
        metrics: {
          reportingQuality: 18,
          reach: 17,
          socialROI: 19,
          outcomeEffectiveness: 18,
          transparencyGovernance: 20
        },
        stats: {
          peopleReached: '45,000 annually',
          socialROI: 7.26,
          programs: 8,
          funding: '$18.3M',
          programAllocation: 84
        },
        yearlyTrend: [78, 81, 85, 89, 92],
        topPrograms: [
          {
            name: 'Permanent Supportive Housing',
            peopleReached: 22000,
            socialROI: 9.52,
            impactGrade: ImpactGrade.APlus
          },
          {
            name: 'Rapid Rehousing',
            peopleReached: 14000,
            socialROI: 6.81,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Homelessness Prevention',
            peopleReached: 9000,
            socialROI: 5.44,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 5,
        name: 'Pathways to Education',
        logo: undefined,
        mission: 'Breaking the cycle of poverty through education by helping youth from low-income communities graduate from high school and transition to post-secondary education.',
        sector: 'Education',
        region: 'National',
        established: 2001,
        impactScore: 91,
        impactGrade: ImpactGrade.APlus,
        verificationType: VerificationType.Verified,
        yearlyChange: 4.8,
        sdgAlignment: [
          'SDG 4: Quality Education',
          'SDG 1: No Poverty',
          'SDG 10: Reduced Inequalities'
        ],
        metrics: {
          reportingQuality: 18,
          reach: 19,
          socialROI: 19,
          outcomeEffectiveness: 18,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '25,000 annually',
          socialROI: 24.5,
          programs: 4,
          funding: '$31.9M',
          programAllocation: 83
        },
        yearlyTrend: [81, 84, 87, 89, 91],
        topPrograms: [
          {
            name: 'Student Parent Support Program',
            peopleReached: 10500,
            socialROI: 25.6,
            impactGrade: ImpactGrade.APlus
          },
          {
            name: 'Academic Support & Tutoring',
            peopleReached: 8700,
            socialROI: 22.8,
            impactGrade: ImpactGrade.APlus
          },
          {
            name: 'Post-Secondary & Career Transition',
            peopleReached: 5800,
            socialROI: 19.5,
            impactGrade: ImpactGrade.A
          }
        ]
      },
      {
        id: 4,
        name: 'Environmental Defence Canada',
        logo: undefined,
        mission: 'Defending environmental rights, creating sustainable communities and protecting Canadians from toxic pollution through research, education and advocacy.',
        sector: 'Environment',
        region: 'National',
        established: 1984,
        impactScore: 87,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited,
        yearlyChange: 3.2,
        sdgAlignment: [
          'SDG 13: Climate Action',
          'SDG 12: Responsible Consumption and Production',
          'SDG 11: Sustainable Cities and Communities'
        ],
        metrics: {
          reportingQuality: 17,
          reach: 16,
          socialROI: 18,
          outcomeEffectiveness: 19,
          transparencyGovernance: 17
        },
        stats: {
          peopleReached: '580,000 annually',
          socialROI: 7.4,
          programs: 12,
          funding: '$8.3M',
          programAllocation: 79
        },
        yearlyTrend: [79, 82, 85, 86, 87],
        topPrograms: [
          {
            name: 'Toxics Program',
            peopleReached: 210000,
            socialROI: 8.6,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Climate Change Campaign',
            peopleReached: 185000,
            socialROI: 7.3,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Plastics Reduction Initiative',
            peopleReached: 165000,
            socialROI: 6.8,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 7,
        name: 'Indspire',
        logo: undefined,
        mission: 'Indspire invests in the education of Indigenous people through financial awards, resources, and role models, delivering programs that support educators, and partnering with communities and other stakeholders.',
        sector: 'Education',
        region: 'National',
        established: 1985,
        impactScore: 89,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        yearlyChange: 4.1,
        sdgAlignment: [
          'SDG 4: Quality Education',
          'SDG 10: Reduced Inequalities',
          'SDG 8: Decent Work and Economic Growth'
        ],
        metrics: {
          reportingQuality: 18,
          reach: 18,
          socialROI: 17,
          outcomeEffectiveness: 18,
          transparencyGovernance: 18
        },
        stats: {
          peopleReached: '130,000 annually',
          socialROI: 7.8,
          programs: 6,
          funding: '$25.4M',
          programAllocation: 84
        },
        yearlyTrend: [81, 84, 86, 88, 89],
        topPrograms: [
          {
            name: 'Building Brighter Futures Scholarships',
            peopleReached: 62500,
            socialROI: 8.3,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Rivers to Success Mentorship',
            peopleReached: 38700,
            socialROI: 7.2,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'Indspire Awards',
            peopleReached: 21000,
            socialROI: 6.9,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      },
      {
        id: 6,
        name: 'FoodShare Toronto',
        logo: undefined,
        mission: 'Working to increase access to good, healthy food through community-led initiatives and advocating for food justice.',
        sector: 'Food Security',
        region: 'Ontario',
        established: 1985,
        impactScore: 85,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited,
        yearlyChange: 6.2,
        sdgAlignment: [
          'SDG 2: Zero Hunger',
          'SDG 10: Reduced Inequalities',
          'SDG 11: Sustainable Cities and Communities'
        ],
        metrics: {
          reportingQuality: 17,
          reach: 17,
          socialROI: 16,
          outcomeEffectiveness: 17,
          transparencyGovernance: 18
        },
        stats: {
          peopleReached: '260,000 annually',
          socialROI: 5.7,
          programs: 11,
          funding: '$7.8M',
          programAllocation: 81
        },
        yearlyTrend: [75, 78, 80, 82, 85],
        topPrograms: [
          {
            name: 'Good Food Markets',
            peopleReached: 95000,
            socialROI: 6.1,
            impactGrade: ImpactGrade.A
          },
          {
            name: 'School Grown',
            peopleReached: 62000,
            socialROI: 5.8,
            impactGrade: ImpactGrade.AMinus
          },
          {
            name: 'FoodShare Warehouse & Distribution',
            peopleReached: 45000,
            socialROI: 5.2,
            impactGrade: ImpactGrade.AMinus
          }
        ]
      }
    ];
  }

  // Solution operations
  async getSolutions(filters: {
    query: string;
    sector: string;
    region: string;
    businessType: string;
    sdg: string;
    demographic: string;
    page: number;
  }): Promise<SolutionItem[]> {
    // Solutions data based on JSON file
    const mockSolutions: SolutionItem[] = [
      {
        id: 1,
        name: 'Rural Food Security Initiative',
        organizationName: 'Canadian Food Bank Network',
        icon: 'volunteer_activism',
        sector: 'Food Security',
        businessType: 'Non-Profit',
        region: 'National',
        description: 'Distributes nutritious food to rural and remote communities through innovative mobile pantries and community partnerships.',
        peopleReached: 185000,
        socialROI: 11.32,
        impactGrade: ImpactGrade.APlus,
        verificationType: VerificationType.Audited,
        effectiveness: 92,
        tags: ['Food Security', 'Rural', 'SDG 2']
      },
      {
        id: 10,
        name: 'World of Difference Education Initiative',
        organizationName: 'Aga Khan Foundation Canada',
        icon: 'school',
        sector: 'International Development',
        businessType: 'Non-Profit',
        region: 'National',
        description: 'Promotes significant improvements in literacy, numeracy, and school retention rates, particularly for girls, with a focus on teacher training and resource provision.',
        peopleReached: 500000,
        socialROI: 5.5,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited,
        effectiveness: 89,
        tags: ['Education', 'Gender Equality', 'SDG 4', 'SDG 5']
      },
      {
        id: 11,
        name: 'MaRS Venture Services',
        organizationName: 'MaRS Discovery District',
        icon: 'trending_up',
        sector: 'Innovation & Entrepreneurship',
        businessType: 'Non-Profit',
        region: 'Ontario',
        description: 'Provides startups with critical advisory, connections, and resources to scale their businesses, leading to job creation, innovation, and economic growth.',
        peopleReached: 1400,
        socialROI: 5.5,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        effectiveness: 90,
        tags: ['Innovation', 'Economic Growth', 'SDG 8', 'SDG 9']
      },
      {
        id: 2,
        name: 'Sustainable Food Waste Reduction',
        organizationName: 'Climate Action Coalition',
        icon: 'eco',
        sector: 'Environment',
        businessType: 'Social Enterprise',
        region: 'British Columbia',
        description: 'Rescues surplus food from restaurants and grocers to reduce waste while addressing food insecurity in urban centers.',
        peopleReached: 92000,
        socialROI: 8.65,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        effectiveness: 87,
        tags: ['Food Security', 'Environment', 'SDG 12']
      },
      {
        id: 3,
        name: 'Indigenous Food Sovereignty',
        organizationName: 'Community Harvest Network',
        icon: 'school',
        sector: 'Food Security',
        businessType: 'Non-Profit',
        region: 'Ontario',
        description: 'Partners with First Nations communities to revitalize traditional food systems and build food sovereignty through education and infrastructure.',
        peopleReached: 43000,
        socialROI: 7.29,
        impactGrade: ImpactGrade.AMinus,
        verificationType: VerificationType.Verified,
        effectiveness: 85,
        tags: ['Food Security', 'Indigenous', 'SDG 2']
      },
      {
        id: 4,
        name: 'Affordable Housing Network',
        organizationName: 'Housing First Initiative',
        icon: 'house',
        sector: 'Housing',
        businessType: 'Non-Profit',
        region: 'Ontario',
        description: 'Develops and manages affordable housing units along with supportive services for vulnerable populations, focusing on the Housing First model.',
        peopleReached: 65000,
        socialROI: 9.45,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Audited,
        effectiveness: 89,
        tags: ['Housing', 'Urban', 'SDG 11']
      },
      {
        id: 5,
        name: 'Digital Literacy for Seniors',
        organizationName: 'Youth STEM Foundation',
        icon: 'computer',
        sector: 'Education',
        businessType: 'Non-Profit',
        region: 'Quebec',
        description: 'Pairs seniors with youth volunteers for technology training, helping older adults gain digital skills while fostering intergenerational connections.',
        peopleReached: 42000,
        socialROI: 7.85,
        impactGrade: ImpactGrade.AMinus,
        verificationType: VerificationType.Verified,
        effectiveness: 84,
        tags: ['Education', 'Seniors', 'SDG 4', 'Technology']
      },
      {
        id: 6,
        name: 'Clean Energy Community Co-op',
        organizationName: 'Clean Energy Alliance',
        icon: 'wb_sunny',
        sector: 'Environment',
        businessType: 'Social Enterprise',
        region: 'British Columbia',
        description: 'Establishes community-owned renewable energy projects, allowing local residents to invest in and benefit from clean energy generation in their neighborhoods.',
        peopleReached: 58000,
        socialROI: 10.25,
        impactGrade: ImpactGrade.APlus,
        verificationType: VerificationType.Audited,
        effectiveness: 91,
        tags: ['Environment', 'Energy', 'SDG 7', 'SDG 13']
      },
      {
        id: 7,
        name: 'Remote Indigenous Healthcare',
        organizationName: 'Indigenous Health Network',
        icon: 'healing',
        sector: 'Health',
        businessType: 'Non-Profit',
        region: 'Northern',
        description: 'Provides healthcare access to remote Indigenous communities through telemedicine, mobile clinics, and traditional healing integration.',
        peopleReached: 32000,
        socialROI: 8.75,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        effectiveness: 86,
        tags: ['Health', 'Indigenous', 'SDG 3', 'Rural']
      },
      {
        id: 8,
        name: 'Rural Business Incubator',
        organizationName: 'Rural Economic Innovation',
        icon: 'trending_up',
        sector: 'Economic Development',
        businessType: 'Social Enterprise',
        region: 'Prairies',
        description: 'Supports rural entrepreneurs with business development resources, mentorship, and capital access to create sustainable local economies.',
        peopleReached: 25000,
        socialROI: 7.65,
        impactGrade: ImpactGrade.A,
        verificationType: VerificationType.Verified,
        effectiveness: 83,
        tags: ['Economic Development', 'Rural', 'SDG 8', 'Entrepreneurship']
      }
    ];

    // Apply filters (simple implementation for demo)
    let filtered = [...mockSolutions];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.organizationName.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.sector && filters.sector !== 'All Sectors') {
      filtered = filtered.filter(item => item.sector === filters.sector);
    }

    if (filters.businessType && filters.businessType !== 'All Business Types') {
      filtered = filtered.filter(item => item.businessType === filters.businessType);
    }

    if (filters.region && filters.region !== 'All Regions') {
      filtered = filtered.filter(item => item.region === filters.region);
    }

    if (filters.sdg && filters.sdg !== 'All SDGs') {
      filtered = filtered.filter(item => 
        item.tags.some(tag => tag.includes(filters.sdg))
      );
    }

    if (filters.demographic && filters.demographic !== 'All Demographics') {
      filtered = filtered.filter(item => 
        item.tags.some(tag => tag.includes(filters.demographic))
      );
    }

    return filtered;
  }

  // Programs operations
  async getProgramsByOrganization(organizationId: number): Promise<Program[]> {
    return [];
  }

  // Reports operations
  async getReportsByOrganization(organizationId: number): Promise<Report[]> {
    return [];
  }

  async createOrganization(insertOrg: InsertOrganization): Promise<Organization> {
    const id = this.currentId++;
    const now = new Date();
    const organization: Organization = {
      id,
      name: insertOrg.name,
      sector: insertOrg.sector,
      sdgAlignment: insertOrg.sdgAlignment || [],
      region: insertOrg.region,
      established: insertOrg.established || new Date().getFullYear(),
      contactInfo: insertOrg.contactInfo || '',
      website: insertOrg.website || '',
      impactScore: insertOrg.impactScore || 80,
      impactGrade: insertOrg.impactGrade || 'B+',
      verified: false,
      isPublished: true,
      createdAt: now,
      updatedAt: now
    };

    this.organizations.set(id, organization);
    return organization;
  }

  // Helper method to initialize sample data with real Canadian organizations
  private initSampleData(): void {
    // Add real Canadian organizations
    const jackOrg: Organization = {
      id: 1,
      name: "Jack.org",
      logo: "",
      mission: "Jack.org measures impact through quantitative program reach metrics, participant feedback surveys, and qualitative testimonials. They track engagement across their three core programs and measure both immediate outputs and outcomes.",
      sector: "Youth Mental Health",
      region: "Canada (National)",
      established: 2010,
      verified: true,
      verificationType: "Self-Reported",
      claimedBy: undefined,
      website: "jack.org",
      contactInfo: "243 College Street, Suite 200, Toronto, ON, M5T 1R5, (416) 425-2494",
      contactEmail: "hello@jack.org",
      impactScore: 87,
      impactGrade: "A",
      yearlyChange: 3.5,
      sdgAlignment: ["SDG 3: Good Health and Well-being", "SDG 4: Quality Education", "SDG 10: Reduced Inequalities"],
      methodologySource: "2024 Impact Report",
      methodologySummary: "Jack.org measures impact through program reach metrics, participant feedback surveys, and qualitative testimonials. They track youth engagement across their core programs (Jack Talks, Jack Chapters, Be There) and measure both immediate outputs and participant-reported outcomes.",
      adminNotes: "Strong candidate for featured status due to national reach, innovative youth-led approach, and 15-year track record of impact",
      isPublished: true,
      shareableProfileLink: "https://basicimpacts.org/organization/1",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const canadianFoodBank: Organization = {
      id: 2,
      name: "Canadian Food Banks Network",
      logo: "",
      mission: "Working to relieve hunger today and prevent hunger tomorrow through community-based food programs, advocacy, and sustainable solutions.",
      sector: "Food Security",
      region: "Canada (National)",
      established: 1985,
      verified: true,
      verificationType: "Verified",
      claimedBy: undefined,
      website: "foodbankscanada.ca",
      contactInfo: "5100 Orbitor Drive, Mississauga, ON, L4W 5R8, 905-602-5234",
      contactEmail: "info@foodbankscanada.ca",
      impactScore: 92,
      impactGrade: "A+",
      yearlyChange: 5.2,
      sdgAlignment: ["SDG 2: Zero Hunger", "SDG 1: No Poverty", "SDG 10: Reduced Inequalities"],
      methodologySource: "Annual Impact Report 2023",
      methodologySummary: "The Canadian Food Banks Network uses a comprehensive impact measurement system tracking food distribution metrics, client outcomes, and community food security indicators.",
      adminNotes: "Premier food security organization with extensive national reach and strong measurement practices",
      isPublished: true,
      shareableProfileLink: "https://basicimpacts.org/organization/2",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const housingFirst: Organization = {
      id: 3,
      name: "Housing First Canada",
      logo: "",
      mission: "Ending chronic homelessness through evidence-based housing first approaches and systems change.",
      sector: "Housing",
      region: "Canada (National)",
      established: 2009,
      verified: true,
      verificationType: "Audited",
      claimedBy: undefined,
      website: "housingfirstcanada.org",
      contactInfo: "902-4th Avenue SW, Calgary, AB, T2P 3J4, 403-456-7890",
      contactEmail: "contact@housingfirstcanada.org",
      impactScore: 89,
      impactGrade: "A",
      yearlyChange: 4.1,
      sdgAlignment: ["SDG 11: Sustainable Cities and Communities", "SDG 1: No Poverty", "SDG 3: Good Health and Well-being"],
      methodologySource: "Housing First Impact Framework 2023",
      methodologySummary: "Housing First Canada employs a rigorous impact measurement approach based on housing stability metrics, client well-being assessments, and system cost-benefit analysis.",
      adminNotes: "Leading organization implementing the evidence-based Housing First model across Canada",
      isPublished: true,
      shareableProfileLink: "https://basicimpacts.org/organization/3",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const environmentalDefence: Organization = {
      id: 4,
      name: "Environmental Defence Canada",
      logo: "",
      mission: "Defending clean water, safe climate, and healthy communities through research, advocacy, and community engagement.",
      sector: "Environment",
      region: "Canada (National)",
      established: 1984,
      verified: true,
      verificationType: "Verified",
      claimedBy: undefined,
      website: "environmentaldefence.ca",
      contactInfo: "116 Spadina Avenue, Suite 300, Toronto, ON, M5V 2K6, 416-323-9521",
      contactEmail: "info@environmentaldefence.ca",
      impactScore: 85,
      impactGrade: "B+",
      yearlyChange: 2.8,
      sdgAlignment: ["SDG 13: Climate Action", "SDG 14: Life Below Water", "SDG 15: Life on Land"],
      methodologySource: "Environmental Impact Report 2023",
      methodologySummary: "Environmental Defence measures impact through policy change outcomes, public engagement metrics, and environmental indicators related to their campaign areas.",
      adminNotes: "Prominent environmental organization with strong policy influence and community mobilization",
      isPublished: true,
      shareableProfileLink: "https://basicimpacts.org/organization/4",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const pathwaysSuccess: Organization = {
      id: 5,
      name: "Pathways to Education",
      logo: "",
      mission: "Breaking the cycle of poverty through education by helping youth from low-income communities graduate from high school and transition to post-secondary education.",
      sector: "Education",
      region: "Canada (National)",
      established: 2001,
      verified: true,
      verificationType: "Verified",
      claimedBy: undefined,
      website: "pathwaystoeducation.ca",
      contactInfo: "439 University Avenue, Suite 1600, Toronto, ON M5G 1Y8, 416-646-0123",
      contactEmail: "info@pathwaystoeducation.ca",
      impactScore: 91,
      impactGrade: "A+",
      yearlyChange: 4.8,
      sdgAlignment: ["SDG 4: Quality Education", "SDG 1: No Poverty", "SDG 10: Reduced Inequalities"],
      methodologySource: "Pathways Impact Assessment 2023",
      methodologySummary: "Pathways uses comprehensive data collection tracking academic performance, graduation rates, post-secondary participation, and long-term economic outcomes.",
      adminNotes: "Award-winning education program with proven impact on graduation rates and post-secondary participation",
      isPublished: true,
      shareableProfileLink: "https://basicimpacts.org/organization/5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const foodshare: Organization = {
      id: 6,
      name: "FoodShare Toronto",
      logo: "",
      mission: "Working to increase access to good, healthy food through community-led initiatives and advocating for food justice.",
      sector: "Food Security",
      region: "ON",
      established: 1985,
      verified: true,
      verificationType: "Verified",
      claimedBy: undefined,
      website: "foodshare.net",
      contactInfo: "120 Industry Street, Toronto, ON M6M 4L8, 416-363-6441",
      contactEmail: "info@foodshare.net",
      impactScore: 87,
      impactGrade: "A",
      yearlyChange: 12.3, // Large increase for trending organizations
      sdgAlignment: ["SDG 2: Zero Hunger", "SDG 3: Good Health and Well-being", "SDG 10: Reduced Inequalities"],
      methodologySource: "FoodShare Impact Framework",
      methodologySummary: "FoodShare measures impact through food distribution metrics, participant surveys, and community food security indicators.",
      adminNotes: "Innovative food security organization with strong focus on food justice and community sovereignty",
      isPublished: true,
      shareableProfileLink: "https://basicimpacts.org/organization/6",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add organizations to the map
    [jackOrg, canadianFoodBank, housingFirst, environmentalDefence, pathwaysSuccess, foodshare].forEach(org => {
      this.organizations.set(org.id, org);
    });
    
    // Add programs for Jack.org
    const jackTalks: Program = {
      id: 1,
      name: "Jack Talks",
      description: "Mental health presentations delivered by trained youth speakers sharing personal stories to foster connection and normalize conversation",
      organizationId: 1,
      sector: "Youth Mental Health",
      region: "Canada (National)",
      peopleReached: 26000,
      socialROI: 4.7,
      impactScore: 88,
      sdgs: ["SDG 3", "SDG 4"],
      status: "Active",
      startYear: 2010,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const jackChapters: Program = {
      id: 2,
      name: "Jack Chapters",
      description: "161 youth-led groups working year-round to break down barriers to positive mental health in their communities",
      organizationId: 1,
      sector: "Youth Mental Health",
      region: "Canada (National)",
      peopleReached: 120000,
      socialROI: 4.5,
      impactScore: 86,
      sdgs: ["SDG 3", "SDG 10"],
      status: "Active",
      startYear: 2012,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const beThere: Program = {
      id: 3,
      name: "Be There Certificate",
      description: "Award-winning digital resource teaching users how to support peers through mental health struggles",
      organizationId: 1,
      sector: "Youth Mental Health",
      region: "Canada (National)",
      peopleReached: 24500,
      socialROI: 4.3,
      impactScore: 84,
      sdgs: ["SDG 3", "SDG 4"],
      status: "Active",
      startYear: 2018,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add programs to the map
    [jackTalks, jackChapters, beThere].forEach(program => {
      this.programs.set(program.id, program);
    });
    
    // Add some metrics for Jack.org
    const metric1: Metric = {
      id: 1,
      name: "Youth Leaders Engaged",
      value: "2200",
      unit: "people",
      year: 2023,
      category: "reach",
      organizationId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const metric2: Metric = {
      id: 2,
      name: "Program Confidence Improvement",
      value: "95",
      unit: "percent",
      year: 2023,
      category: "outcome",
      organizationId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const metric3: Metric = {
      id: 3,
      name: "Community Initiatives",
      value: "539",
      unit: "initiatives",
      year: 2023,
      category: "output",
      organizationId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add metrics to the map
    [metric1, metric2, metric3].forEach(metric => {
      this.metrics.set(metric.id, metric);
    });
    
    // Also create admin user
    const admin: User = {
      id: 1,
      username: "admin",
      password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // password = test
      email: "admin@basicimpacts.org",
      firstName: "Admin",
      lastName: "User",
      avatar: "",
      phone: "",
      bio: "Platform administrator",
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    this.users.set(admin.id, admin);
  }
}

export const storage = new MemStorage();