import { Router, Request, Response } from 'express';
import { asyncHandler } from '@api/middleware/error.middleware';
import { LocalStore } from '@core/database/LocalStore';

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 1,
    jobTitle: 'Senior Software Engineer',
    company: 'Google',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    stage: 'Technical Interview',
    nextDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-2',
    jobId: 2,
    jobTitle: 'Software Development Engineer',
    company: 'Amazon',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'rejected',
    stage: 'First Round',
    feedback: 'Position filled internally',
  },
  {
    id: 'app-3',
    jobId: 3,
    jobTitle: 'Frontend Engineer',
    company: 'Microsoft',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'applied',
    stage: 'Under Review',
  },
];

/**
 * Jobs Controller
 * Handles job listings, applications, and job details with persistent storage
 */
export class JobsController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  /**
   * Static method to add a job (can be called from other controllers)
   */
  public static addCreatedJob(job: any): void {
    LocalStore.insert('createdJobs', job);
  }

  /**
   * Register routes
   */
  private registerRoutes(): void {
    // GET /api/v1/jobs and /api/v1/jobs/list
    this.router.get(
      ['/', '/list'],
      asyncHandler((req, res) => this.getJobsList(req, res))
    );

    // POST /api/v1/jobs - Create a new job posting
    this.router.post(
      '/',
      asyncHandler((req, res) => this.createJob(req, res))
    );

    // GET /api/v1/jobs/:jobId
    this.router.get(
      '/:jobId',
      asyncHandler((req, res) => this.getJobDetail(req, res))
    );

    // POST /api/v1/jobs/:jobId/apply
    this.router.post(
      '/:jobId/apply',
      asyncHandler((req, res) => this.applyJob(req, res))
    );

    // GET /api/v1/jobs/user/applications
    this.router.get(
      '/user/applications',
      asyncHandler((req, res) => this.getUserApplications(req, res))
    );
  }

  /**
   * Get jobs list
   */
  private async getJobsList(_req: Request, res: Response): Promise<void> {
    const jobs = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Google',
        location: 'Mountain View, CA',
        salary: '$180K - $220K',
        type: 'Full-time',
        level: 'Senior',
        experience: '5+ years',
        tags: ['System Design', 'Algorithms', 'Leadership'],
        description: 'We are looking for a senior engineer with strong system design skills',
        posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        applications: 342,
        matched: 95,
      },
      {
        id: 2,
        title: 'Software Development Engineer',
        company: 'Amazon',
        location: 'Seattle, WA',
        salary: '$160K - $200K',
        type: 'Full-time',
        level: 'Mid',
        experience: '3+ years',
        tags: ['AWS', 'Java', 'Distributed Systems'],
        description: 'Join our AWS team and build scalable solutions for millions of users',
        posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        applications: 521,
        matched: 88,
      },
      {
        id: 3,
        title: 'Frontend Engineer',
        company: 'Microsoft',
        location: 'Redmond, WA',
        salary: '$150K - $190K',
        type: 'Full-time',
        level: 'Mid',
        experience: '2+ years',
        tags: ['React', 'TypeScript', 'UI/UX'],
        description: 'Create innovative user experiences with modern web technologies',
        posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        applications: 287,
        matched: 92,
      },
      {
        id: 4,
        title: 'DevOps Engineer',
        company: 'Meta',
        location: 'New York, NY',
        salary: '$170K - $210K',
        type: 'Full-time',
        level: 'Mid',
        experience: '3+ years',
        tags: ['Docker', 'Kubernetes', 'CI/CD'],
        description: 'Build and maintain infrastructure for billions of users',
        posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        applications: 198,
        matched: 85,
      },
    ];

    // Add any newly created jobs
    const createdJobs = LocalStore.get('createdJobs', []);
    if (createdJobs && createdJobs.length > 0) {
      jobs.push(...createdJobs);
    }

    res.json({
      success: true,
      data: jobs,
    });
  }

  /**
   * Get job detail
   */
  private async getJobDetail(req: Request, res: Response): Promise<void> {
    const { jobId } = req.params;

    const jobDetail = {
      id: jobId,
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$180K - $220K',
      type: 'Full-time',
      level: 'Senior',
      experience: '5+ years',
      posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description:
        'We are looking for a senior engineer with strong system design skills to join our core platform team.',
      responsibilities: [
        'Design and implement large-scale distributed systems',
        'Lead technical discussions and design reviews',
        'Mentor junior engineers and help grow the team',
        'Collaborate with product and business teams',
      ],
      requirements: [
        '5+ years of software engineering experience',
        'Strong foundation in data structures and algorithms',
        'Experience with distributed systems',
        'Leadership experience',
        'Bachelor degree in CS or related field',
      ],
      niceToHave: [
        'Experience with Google Cloud Platform',
        'Open source contributions',
        'Published technical articles or talks',
      ],
      benefits: [
        'Competitive salary and equity',
        'Health insurance',
        '401(k) matching',
        'Free lunch and snacks',
        'Professional development budget',
      ],
      interviewProcess: [
        { stage: 'Phone Screen', duration: '30 min', focus: 'Background & motivation' },
        { stage: 'Coding Round', duration: '60 min', focus: 'System Design' },
        { stage: 'Technical Interview', duration: '90 min', focus: 'Deep dive & problem solving' },
        { stage: 'Lunch Round', duration: '60 min', focus: 'Team fit' },
        { stage: 'Final Round', duration: '60 min', focus: 'Leadership & vision' },
      ],
      applicants: 342,
      viewedBy: 1250,
      matchScore: 95,
    };

    res.json({
      success: true,
      data: jobDetail,
    });
  }

  /**
   * Create new job
   */
  private async createJob(req: Request, res: Response): Promise<void> {
    const jobData = req.body;
    const newJob = {
      id: Date.now(),
      title: jobData.title || jobData.jobTitle || 'New Job Role',
      company: jobData.company || jobData.companyName || 'Campus Partner',
      location: jobData.location || 'Remote',
      salary: jobData.salary || jobData.ctc || 'Not disclosed',
      type: jobData.type || jobData.jobType || 'Full-time',
      level: jobData.level || 'Entry',
      experience: jobData.experience || 'Fresher',
      tags: jobData.tags || jobData.requiredSkills || ['General'],
      description: jobData.description || '',
      posted: new Date().toISOString(),
      applications: 0,
      matched: 85,
    };

    JobsController.addCreatedJob(newJob);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob,
    });
  }

  /**
   * Apply to job
   */
  private async applyJob(req: Request, res: Response): Promise<void> {
    const { jobId } = req.params;
    const { userId, resumeId, coverLetter, studentName } = req.body;

    const application = {
      id: `app-${Date.now()}`,
      jobId: isNaN(Number(jobId)) ? jobId : Number(jobId),
      userId: userId || 'student-1',
      studentName: studentName || 'Student',
      resumeId,
      coverLetter,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      stage: 'Under Review',
      nextAction: 'Waiting for recruiter response',
    };

    LocalStore.insert('userApplications', application);

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  }

  /**
   * Get user applications
   */
  private async getUserApplications(_req: Request, res: Response): Promise<void> {
    const apps = LocalStore.get('userApplications', DEFAULT_APPLICATIONS);
    res.json({
      success: true,
      data: apps,
    });
  }
}
