import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - all prefixed with /api
  
  // Get platform statistics
  app.get('/api/statistics', async (req, res) => {
    try {
      const statistics = await storage.getStatistics();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Get trending organizations
  app.get('/api/trending', async (req, res) => {
    try {
      const trending = await storage.getTrendingOrganizations();
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trending organizations' });
    }
  });

  // Get leaderboard data with filters
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const { sector, region, sdg, size, query, page = '1', sortBy = 'impactScore', sortOrder = 'desc' } = req.query;
      
      const filters = {
        sector: sector as string || '',
        region: region as string || '',
        sdg: sdg as string || '',
        size: size as string || '',
        query: query as string || '',
        page: parseInt(page as string, 10),
        sortBy: sortBy as string,
        sortOrder: sortOrder as string
      };
      
      const leaderboard = await storage.getLeaderboard(filters);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch leaderboard data' });
    }
  });

  // Get featured organizations
  app.get('/api/organizations/featured', async (req, res) => {
    try {
      const organizations = await storage.getFeaturedOrganization();
      if (!organizations || organizations.length === 0) {
        return res.status(404).json({ message: 'No featured organizations found' });
      }
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch featured organizations' });
    }
  });

  // Get success stories
  app.get('/api/organizations/success-stories', async (req, res) => {
    try {
      const successStories = await storage.getSuccessStories();
      res.json(successStories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch success stories' });
    }
  });

  // Get organization by ID
  app.get('/api/organizations/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const organization = await storage.getOrganizationById(parseInt(id, 10));
      
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
      
      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch organization' });
    }
  });

  // Create new organization
  app.post('/api/organizations', async (req, res) => {
    try {
      const organization = await storage.createOrganization(req.body);
      res.status(201).json(organization);
    } catch (error) {
      console.error('Failed to create organization:', error);
      res.status(500).json({ message: 'Failed to create organization' });
    }
  });

  // Get solutions with filters
  app.get('/api/solutions', async (req, res) => {
    try {
      const { query, sector, region, businessType, sdg, demographic, page = '1' } = req.query;
      
      const filters = {
        query: query as string || '',
        sector: sector as string || '',
        region: region as string || '',
        businessType: businessType as string || '',
        sdg: sdg as string || '',
        demographic: demographic as string || '',
        page: parseInt(page as string, 10)
      };
      
      const solutions = await storage.getSolutions(filters);
      res.json(solutions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch solutions' });
    }
  });

  // Get programs by organization ID
  app.get('/api/organizations/:id/programs', async (req, res) => {
    try {
      const { id } = req.params;
      const programs = await storage.getProgramsByOrganization(parseInt(id, 10));
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch programs' });
    }
  });

  // Get reports by organization ID
  app.get('/api/organizations/:id/reports', async (req, res) => {
    try {
      const { id } = req.params;
      const reports = await storage.getReportsByOrganization(parseInt(id, 10));
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reports' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
