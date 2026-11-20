import { Router, Request, Response } from 'express';
import { asyncHandler } from '@api/middleware/error.middleware';
import { LocalStore } from '@core/database/LocalStore';

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    type: 'opportunity',
    title: 'Google is hiring for SDE roles!',
    description: 'Google is actively recruiting for Software Development Engineer positions across multiple locations.',
    date: new Date().toISOString(),
    priority: 'high',
    icon: '🔍',
    read: false,
    actionUrl: '/jobs?company=Google',
  },
  {
    id: 2,
    type: 'feature',
    title: 'New Mock Interview Feature Released',
    description: 'Practice live coding interviews with AI feedback and peer connections now available.',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    icon: '✨',
    read: false,
    actionUrl: '/mock-interview',
  },
  {
    id: 3,
    type: 'event',
    title: 'System Design Workshop Tomorrow at 6 PM',
    description: 'Join our expert panel discussing real-world system design challenges.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    icon: '📅',
    read: true,
    actionUrl: '/events',
  },
];

/**
 * Announcements Controller
 * Handles announcements, notifications, and updates with disk persistence
 */
export class AnnouncementsController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get(
      ['/', '/list'],
      asyncHandler((req, res) => this.getAnnouncements(req, res))
    );

    this.router.post(
      '/',
      asyncHandler((req, res) => this.createAnnouncement(req, res))
    );

    this.router.get(
      '/:announcementId',
      asyncHandler((req, res) => this.getAnnouncementDetail(req, res))
    );

    this.router.post(
      '/:announcementId/read',
      asyncHandler((req, res) => this.markAsRead(req, res))
    );

    this.router.get(
      '/user/:userId/unread',
      asyncHandler((req, res) => this.getUnreadCount(req, res))
    );
  }

  private async getAnnouncements(_req: Request, res: Response): Promise<void> {
    const list = LocalStore.get('announcements', DEFAULT_ANNOUNCEMENTS);
    res.json({
      success: true,
      data: list,
    });
  }

  private async createAnnouncement(req: Request, res: Response): Promise<void> {
    const annData = req.body;
    const newAnnouncement = {
      id: Date.now(),
      type: annData.type || 'opportunity',
      title: annData.title || 'New Announcement',
      description: annData.description || '',
      date: new Date().toISOString(),
      priority: annData.priority || 'medium',
      icon: annData.icon || '📢',
      read: false,
      actionUrl: annData.actionUrl,
    };
    LocalStore.insert('announcements', newAnnouncement);
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: newAnnouncement,
    });
  }

  private async getAnnouncementDetail(req: Request, res: Response): Promise<void> {
    const { announcementId } = req.params;

    const announcement = {
      id: announcementId,
      type: 'opportunity',
      title: 'Google is hiring for SDE roles!',
      description:
        'Google is actively recruiting for Software Development Engineer positions across multiple locations.',
      fullContent: `
# Google is Hiring for SDE Roles!

Google is actively expanding its engineering team and is looking for talented Software Development Engineers.

## Positions Available:
- Senior Software Engineer
- Software Engineer
- Junior Software Engineer

## Locations:
- Mountain View, CA
- Chicago, IL
- New York, NY
- Seattle, WA

## Requirements:
- Bachelor's degree in Computer Science or related field
- Strong foundation in data structures and algorithms
- Experience with at least one programming language
- Problem-solving and communication skills

## Application Deadline:
May 15, 2026

Start your application today to join one of the world's leading tech companies!
      `,
      date: new Date().toISOString(),
      priority: 'high',
      icon: '🔍',
      read: false,
      category: 'Job Opportunity',
      author: 'Google Careers',
      actionUrl: '/jobs?company=Google',
      actionText: 'View All Google Jobs',
    };

    res.json({
      success: true,
      data: announcement,
    });
  }

  private async markAsRead(req: Request, res: Response): Promise<void> {
    const { announcementId } = req.params;
    const { userId } = req.body;

    const result = {
      announcementId,
      userId,
      readAt: new Date().toISOString(),
      success: true,
    };

    res.json({
      success: true,
      data: result,
    });
  }

  private async getUnreadCount(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const unreadData = {
      userId,
      unreadCount: 5,
      unreadByType: {
        opportunity: 2,
        feature: 1,
        event: 1,
        achievement: 0,
        news: 1,
      },
      hasHighPriority: true,
    };

    res.json({
      success: true,
      data: unreadData,
    });
  }
}
