import { Router, Request, Response } from 'express';
import { asyncHandler } from '@api/middleware/error.middleware';
import { LocalStore } from '@core/database/LocalStore';

const DEFAULT_NOTES = [
  {
    id: '1',
    recruiterName: 'John Smith',
    companyType: 'product',
    industry: 'Technology',
    recruitmentStatus: 'active',
    hiringType: 'full-time',
    offeredRoles: ['Software Engineer', 'DevOps'],
    numberOfOpenings: 5,
    packageCTC: 15,
    bond: 'no',
    selectionRounds: ['Online Test', 'Technical Interview', 'HR Round'],
    eligibility: { cgpa: 7.5, backlogsAllowed: 'no' },
    driveMode: 'online',
    expectedDriveDate: '2026-05-15',
    contactPerson: { name: 'Alice Johnson', email: 'alice@company.com', phone: '+1234567890' },
    communicationStatus: 'confirmed',
    internalNotes: 'Confirmed attendance for May drive',
    priorityLevel: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Recruiter Notes Controller
 * Handles recruiter notes and communication tracking with disk persistence
 */
export class RecruiterNotesController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    // GET /api/v1/recruiter-notes
    this.router.get(
      '/',
      asyncHandler((req, res) => this.getNotes(req, res))
    );

    // GET /api/v1/recruiter-notes/:id
    this.router.get(
      '/:id',
      asyncHandler((req, res) => this.getNoteById(req, res))
    );

    // POST /api/v1/recruiter-notes
    this.router.post(
      '/',
      asyncHandler((req, res) => this.createNote(req, res))
    );

    // PUT /api/v1/recruiter-notes/:id
    this.router.put(
      '/:id',
      asyncHandler((req, res) => this.updateNote(req, res))
    );

    // DELETE /api/v1/recruiter-notes/:id
    this.router.delete(
      '/:id',
      asyncHandler((req, res) => this.deleteNote(req, res))
    );

    // PATCH /api/v1/recruiter-notes/:id/communication-status
    this.router.patch(
      '/:id/communication-status',
      asyncHandler((req, res) => this.updateCommunicationStatus(req, res))
    );
  }

  private async getNotes(_req: Request, res: Response): Promise<void> {
    const notes = LocalStore.get('recruiterNotes', DEFAULT_NOTES);
    res.json({
      success: true,
      data: notes,
    });
  }

  private async getNoteById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const notes = LocalStore.get('recruiterNotes', DEFAULT_NOTES);
    const note = notes.find(n => n.id === id);
    if (!note) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }
    res.json({
      success: true,
      data: note,
    });
  }

  private async createNote(req: Request, res: Response): Promise<void> {
    const noteData = req.body;
    const newNote = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    LocalStore.insert('recruiterNotes', newNote);
    res.status(201).json({
      success: true,
      data: newNote,
    });
  }

  private async updateNote(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;
    const updated = LocalStore.update('recruiterNotes', 'id', id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }
    res.json({
      success: true,
      data: updated,
    });
  }

  private async deleteNote(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    LocalStore.delete('recruiterNotes', 'id', id);
    res.json({
      success: true,
      data: { id, deleted: true },
    });
  }

  private async updateCommunicationStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;
    const updated = LocalStore.update('recruiterNotes', 'id', id, {
      communicationStatus: status,
      updatedAt: new Date().toISOString(),
    });
    res.json({
      success: true,
      data: updated || { id, communicationStatus: status },
    });
  }
}

export default RecruiterNotesController;
