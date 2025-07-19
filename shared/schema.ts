import { pgTable, text, serial, integer, boolean, timestamp, json, real, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),
  phone: text("phone"),
  bio: text("bio"),
  role: text("role").default("user").notNull(),
  lastLogin: timestamp("last_login"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  firstName: true,
  lastName: true,
  avatar: true,
  phone: true,
  bio: true,
  role: true,
  isVerified: true,
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  mission: text("mission"),
  sector: text("sector").notNull(),
  region: text("region").notNull(),
  established: integer("established"),
  verified: boolean("verified").default(false),
  verificationType: text("verification_type").default("self-reported"),
  claimedBy: integer("claimed_by").references(() => users.id),
  website: text("website"),
  contactInfo: text("contact_info"),
  contactEmail: text("contact_email"),
  impactScore: integer("impact_score"),
  impactGrade: text("impact_grade"),
  yearlyChange: real("yearly_change"),
  sdgAlignment: text("sdg_alignment").array(),
  methodologySource: text("methodology_source"),
  methodologySummary: text("methodology_summary"),
  adminNotes: text("admin_notes"),
  isPublished: boolean("is_published").default(false),
  shareableProfileLink: text("shareable_profile_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrganizationSchema = createInsertSchema(organizations).pick({
  name: true,
  logo: true,
  mission: true,
  sector: true,
  region: true,
  established: true,
  verified: true,
  verificationType: true,
  claimedBy: true,
  website: true,
  contactInfo: true,
  contactEmail: true,
  impactScore: true,
  impactGrade: true,
  yearlyChange: true,
  sdgAlignment: true,
  methodologySource: true,
  methodologySummary: true,
  adminNotes: true,
  isPublished: true,
  shareableProfileLink: true,
});

// Programs table
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  sector: text("sector").notNull(),
  region: text("region"),
  peopleReached: integer("people_reached"),
  socialROI: real("social_roi"),
  impactScore: integer("impact_score"),
  impactGrade: text("impact_grade"),
  sdgAlignment: text("sdg_alignment").array(),
  demographics: text("demographics").array(),
  yearlyChange: real("yearly_change"),
  effectiveness: integer("effectiveness"),
  verified: boolean("verified").default(false),
  verificationType: text("verification_type").default("self-reported"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  budget: integer("budget"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProgramSchema = createInsertSchema(programs).pick({
  name: true,
  description: true,
  organizationId: true,
  sector: true,
  region: true,
  peopleReached: true,
  socialROI: true,
  impactScore: true,
  impactGrade: true,
  sdgAlignment: true,
  demographics: true,
  yearlyChange: true,
  effectiveness: true,
  verified: true,
  verificationType: true,
  startDate: true,
  endDate: true,
  isActive: true,
  budget: true,
  location: true,
});

// Metrics table for Impact IQ Breakdown
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  reportingQuality: integer("reporting_quality").notNull(),
  reach: integer("reach").notNull(),
  socialROI: integer("social_roi").notNull(),
  outcomeEffectiveness: integer("outcome_effectiveness").notNull(),
  transparencyGovernance: integer("transparency_governance").notNull(),
  keyStatistics: jsonb("key_statistics"),
  keyInsights: text("key_insights"),
  keyRecommendations: text("key_recommendations"),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMetricSchema = createInsertSchema(metrics).pick({
  organizationId: true,
  reportingQuality: true,
  reach: true,
  socialROI: true,
  outcomeEffectiveness: true,
  transparencyGovernance: true,
  keyStatistics: true,
  keyInsights: true,
  keyRecommendations: true,
  year: true,
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  year: integer("year").notNull(),
  verified: boolean("verified").default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
  extracted: boolean("extracted").default(false),
  extractedData: jsonb("extracted_data"),
  summary: text("summary"),
  adminReviewed: boolean("admin_reviewed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  title: true,
  organizationId: true,
  fileUrl: true,
  fileType: true,
  year: true,
  verified: true,
  verifiedBy: true,
  extracted: true,
  extractedData: true,
  summary: true,
  adminReviewed: true,
});

// Invitations
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").default("member").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status").default("pending").notNull(),
  invitedBy: integer("invited_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInvitationSchema = createInsertSchema(invitations).pick({
  email: true,
  organizationId: true,
  role: true,
  token: true,
  expiresAt: true,
  status: true,
  invitedBy: true,
});

// Verification Requests
export const verificationRequests = pgTable("verification_requests", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  requestType: text("request_type").notNull(), // self-reported, verified, audited
  status: text("status").default("pending").notNull(),
  requestedBy: integer("requested_by").references(() => users.id).notNull(),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVerificationRequestSchema = createInsertSchema(verificationRequests).pick({
  organizationId: true,
  requestType: true,
  status: true,
  requestedBy: true,
  assignedTo: true,
  notes: true,
  completedAt: true,
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
  link: true,
});

// Target Members/Partners
export const targetPartners = pgTable("target_partners", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // funder, advisor, partner, member
  status: text("status").default("prospect").notNull(),
  notes: text("notes"),
  contactInfo: text("contact_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTargetPartnerSchema = createInsertSchema(targetPartners).pick({
  organizationId: true,
  name: true,
  type: true,
  status: true,
  notes: true,
  contactInfo: true,
});

// Activity Logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // user, organization, program, etc.
  entityId: integer("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  entityType: true,
  entityId: true,
  details: true,
  ipAddress: true,
});

// Workflows
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  steps: jsonb("steps").notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).pick({
  name: true,
  description: true,
  steps: true,
  createdBy: true,
  isActive: true,
});

// Statistics table
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  organizationCount: integer("organization_count").default(0),
  programCount: integer("program_count").default(0),
  impactValue: real("impact_value").default(0),
  pendingInvites: integer("pending_invites").default(0),
  pendingVerifications: integer("pending_verifications").default(0),
  activeUsers: integer("active_users").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStatisticsSchema = createInsertSchema(statistics).pick({
  organizationCount: true,
  programCount: true,
  impactValue: true,
  pendingInvites: true, 
  pendingVerifications: true,
  activeUsers: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;

export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type InsertVerificationRequest = z.infer<typeof insertVerificationRequestSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type TargetPartner = typeof targetPartners.$inferSelect;
export type InsertTargetPartner = z.infer<typeof insertTargetPartnerSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = z.infer<typeof insertStatisticsSchema>;

// Organization Profile JSON Schema for AI-generated data parsing
export const organizationProfileSchema = z.object({
  name: z.string(),
  sector: z.string(),
  sdgAlignment: z.array(z.string()).optional(),
  region: z.string(),
  established: z.number().optional(),
  contactInfo: z.string().optional(),
  website: z.string().optional(),
  contactEmail: z.string().optional(),
  impactIQScore: z.number(),
  impactGrade: z.string(),
  reportingQuality: z.number(),
  reach: z.number(),
  socialROI: z.number(),
  outcomeEffectiveness: z.number(),
  transparencyGovernance: z.number(),
  verificationType: z.enum(["self-reported", "verified", "audited"]),
  methodologySource: z.string().optional(),
  methodologySummary: z.string().optional(),
  keyStatistics: z.record(z.any()).optional(),
  keyInsights: z.string().optional(),
  keyRecommendations: z.string().optional(),
  programs: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      peopleReached: z.number().optional(),
      socialROI: z.number().optional(),
      impactGrade: z.string(),
    })
  ).optional(),
  targetPartners: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      status: z.string().optional(),
      notes: z.string().optional(),
      contactInfo: z.string().optional(),
    })
  ).optional(),
  adminNotes: z.string().optional(),
});
