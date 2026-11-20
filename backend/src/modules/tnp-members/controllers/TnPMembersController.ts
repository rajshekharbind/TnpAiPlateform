import { Router, Request, Response } from 'express';
import { asyncHandler } from '@api/middleware/error.middleware';
import { LocalStore } from '@core/database/LocalStore';

const DEFAULT_MEMBERS = [
  { id: '1', name: 'Prof. Kumar', role: 'Coordinator', email: 'kumar@college.edu', department: 'CSE', phone: '9876543210' },
  { id: '2', name: 'Prof. Singh', role: 'Advisor', email: 'singh@college.edu', department: 'IT', phone: '9876543211' },
];

/**
 * TnP Members Controller
 * Manages TnP cell members and their roles with disk persistence
 */
export class TnPMembersController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/', asyncHandler((req, res) => this.getMembers(req, res)));
    this.router.get('/:id', asyncHandler((req, res) => this.getMemberById(req, res)));
    this.router.post('/', asyncHandler((req, res) => this.createMember(req, res)));
    this.router.put('/:id', asyncHandler((req, res) => this.updateMember(req, res)));
    this.router.delete('/:id', asyncHandler((req, res) => this.deleteMember(req, res)));
    this.router.patch('/:id/role', asyncHandler((req, res) => this.updateRole(req, res)));
  }

  private async getMembers(_req: Request, res: Response): Promise<void> {
    const members = LocalStore.get('tnpMembers', DEFAULT_MEMBERS);
    res.json({
      status: 'success',
      data: members,
      message: 'TnP members retrieved',
    });
  }

  private async getMemberById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const members = LocalStore.get('tnpMembers', DEFAULT_MEMBERS);
    const member = members.find(m => m.id === id);
    if (!member) {
      res.status(404).json({ status: 'error', message: 'Member not found' });
      return;
    }
    res.json({
      status: 'success',
      data: member,
      message: 'TnP member retrieved',
    });
  }

  private async createMember(req: Request, res: Response): Promise<void> {
    const newMember = {
      id: Date.now().toString(),
      ...req.body,
    };
    LocalStore.insert('tnpMembers', newMember);
    res.status(201).json({
      status: 'success',
      data: newMember,
      message: 'TnP member created',
    });
  }

  private async updateMember(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updated = LocalStore.update('tnpMembers', 'id', id, req.body);
    if (!updated) {
      res.status(404).json({ status: 'error', message: 'Member not found' });
      return;
    }
    res.json({
      status: 'success',
      data: updated,
      message: 'TnP member updated',
    });
  }

  private async deleteMember(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    LocalStore.delete('tnpMembers', 'id', id);
    res.json({
      status: 'success',
      data: { id, deleted: true },
      message: 'TnP member deleted',
    });
  }

  private async updateRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;
    const updated = LocalStore.update('tnpMembers', 'id', id, { role });
    res.json({
      status: 'success',
      data: updated || { id, role },
      message: 'Role updated',
    });
  }
}

export default TnPMembersController;
