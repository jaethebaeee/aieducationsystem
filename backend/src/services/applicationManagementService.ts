import { logger } from '../utils/logger';
import { universityDatabaseService } from './universityDatabaseService';

export interface ApplicationStatus {
  id: string;
  userId: string;
  universityId: string;
  universityName: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted' | 'deferred';
  applicationType: 'early-decision' | 'early-action' | 'regular-decision' | 'transfer';
  deadline: string;
  submittedDate?: string;
  decisionDate?: string;
  decision?: 'accepted' | 'rejected' | 'waitlisted' | 'deferred';
  financialAidStatus?: 'pending' | 'awarded' | 'rejected';
  financialAidAmount?: number;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  type: 'transcript' | 'test-scores' | 'recommendation' | 'essay' | 'supplement' | 'financial-aid' | 'other';
  name: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  fileUrl?: string;
  uploadedDate?: string;
  verifiedDate?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationChecklist {
  id: string;
  applicationId: string;
  category: 'profile' | 'academic' | 'testing' | 'activities' | 'essays' | 'documents' | 'financial-aid';
  items: {
    id: string;
    name: string;
    description: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'verified';
    required: boolean;
    deadline?: string;
    completedDate?: string;
    notes?: string;
  }[];
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationTimeline {
  id: string;
  applicationId: string;
  events: {
    id: string;
    type: 'deadline' | 'submission' | 'decision' | 'financial-aid' | 'interview' | 'other';
    title: string;
    description: string;
    date: string;
    status: 'upcoming' | 'completed' | 'missed';
    importance: 'high' | 'medium' | 'low';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export class ApplicationManagementService {
  
  /**
   * Create new application
   */
  async createApplication(userId: string, universityId: string, applicationType: 'early-decision' | 'early-action' | 'regular-decision' | 'transfer'): Promise<ApplicationStatus> {
    const university = await universityDatabaseService.getUniversityById(universityId);
    if (!university) {
      throw new Error(`University not found: ${universityId}`);
    }
    
    // Determine deadline based on application type
    let deadline: string;
    switch (applicationType) {
      case 'early-decision':
        deadline = university.applicationDeadlines.earlyDecision;
        break;
      case 'regular-decision':
        deadline = university.applicationDeadlines.regularDecision;
        break;
      case 'transfer':
        deadline = university.applicationDeadlines.transfer;
        break;
      default:
        deadline = university.applicationDeadlines.regularDecision;
    }
    
    const application: ApplicationStatus = {
      id: `app_${Date.now()}`,
      userId,
      universityId,
      universityName: university.name,
      status: 'not-started',
      applicationType,
      deadline,
      notes: [`Application created for ${university.name}`],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create initial checklist
    await this.createApplicationChecklist(application.id);
    
    // Create timeline
    await this.createApplicationTimeline(application.id, deadline);
    
    logger.info(`Created application for user ${userId} to ${university.name}`);
    return application;
  }
  
  /**
   * Create application checklist
   */
  async createApplicationChecklist(applicationId: string): Promise<ApplicationChecklist> {
    const checklist: ApplicationChecklist = {
      id: `checklist_${Date.now()}`,
      applicationId,
      category: 'profile',
      items: [
        {
          id: 'profile_basic',
          name: 'Basic Profile Information',
          description: 'Complete personal information, contact details, and family background',
          status: 'not-started',
          required: true
        },
        {
          id: 'profile_addresses',
          name: 'Addresses',
          description: 'Current and permanent addresses',
          status: 'not-started',
          required: true
        },
        {
          id: 'profile_demographics',
          name: 'Demographics',
          description: 'Race, ethnicity, and other demographic information',
          status: 'not-started',
          required: false
        }
      ],
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return checklist;
  }
  
  /**
   * Create application timeline
   */
  async createApplicationTimeline(applicationId: string, deadline: string): Promise<ApplicationTimeline> {
    const deadlineDate = new Date(deadline);
    const timeline: ApplicationTimeline = {
      id: `timeline_${Date.now()}`,
      applicationId,
      events: [
        {
          id: 'deadline',
          type: 'deadline',
          title: 'Application Deadline',
          description: 'Final deadline for application submission',
          date: deadline,
          status: 'upcoming',
          importance: 'high'
        },
        {
          id: 'two_weeks_before',
          type: 'deadline',
          title: 'Two Weeks Before Deadline',
          description: 'Recommended to submit application',
          date: new Date(deadlineDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'upcoming',
          importance: 'medium'
        },
        {
          id: 'one_month_before',
          type: 'deadline',
          title: 'One Month Before Deadline',
          description: 'Start final review and submission preparation',
          date: new Date(deadlineDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'upcoming',
          importance: 'medium'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return timeline;
  }
  
  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId: string, status: ApplicationStatus['status'], notes?: string): Promise<ApplicationStatus> {
    // This would typically update the database
    // For now, return a mock updated application
    logger.info(`Updated application ${applicationId} status to ${status}`);
    
    return {
      id: applicationId,
      userId: 'user_123',
      universityId: 'harvard',
      universityName: 'Harvard University',
      status,
      applicationType: 'regular-decision',
      deadline: '2025-01-01',
      notes: notes ? [`Status updated to ${status}`, notes] : [`Status updated to ${status}`],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Submit application
   */
  async submitApplication(applicationId: string): Promise<ApplicationStatus> {
    // Check if all required documents are uploaded
    const checklist = await this.getApplicationChecklist(applicationId);
    const requiredItems = checklist.items.filter(item => item.required);
    const completedItems = requiredItems.filter(item => item.status === 'completed');
    
    if (completedItems.length < requiredItems.length) {
      throw new Error('Cannot submit application: Not all required items are completed');
    }
    
    // Update application status
    const application = await this.updateApplicationStatus(applicationId, 'submitted', 'Application submitted successfully');
    
    // Add submission event to timeline
    await this.addTimelineEvent(applicationId, {
      type: 'submission',
      title: 'Application Submitted',
      description: 'Application has been successfully submitted',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      importance: 'high'
    });
    
    logger.info(`Application ${applicationId} submitted successfully`);
    return application;
  }
  
  /**
   * Upload application document
   */
  async uploadDocument(applicationId: string, documentData: {
    type: ApplicationDocument['type'];
    name: string;
    fileUrl: string;
  }): Promise<ApplicationDocument> {
    const document: ApplicationDocument = {
      id: `doc_${Date.now()}`,
      applicationId,
      type: documentData.type,
      name: documentData.name,
      status: 'uploaded',
      fileUrl: documentData.fileUrl,
      uploadedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Update checklist item if applicable
    await this.updateChecklistItem(applicationId, documentData.type, 'completed');
    
    logger.info(`Uploaded document ${documentData.name} for application ${applicationId}`);
    return document;
  }
  
  /**
   * Get application checklist
   */
  async getApplicationChecklist(applicationId: string): Promise<ApplicationChecklist> {
    // This would typically fetch from database
    // For now, return a mock checklist
    return {
      id: `checklist_${applicationId}`,
      applicationId,
      category: 'profile',
      items: [
        {
          id: 'profile_basic',
          name: 'Basic Profile Information',
          description: 'Complete personal information, contact details, and family background',
          status: 'completed',
          required: true,
          completedDate: '2024-10-15'
        },
        {
          id: 'transcript',
          name: 'High School Transcript',
          description: 'Official transcript from high school',
          status: 'uploaded',
          required: true,
          deadline: '2024-12-01'
        },
        {
          id: 'sat_scores',
          name: 'SAT Scores',
          description: 'Official SAT score report',
          status: 'completed',
          required: true,
          completedDate: '2024-09-20'
        },
        {
          id: 'personal_statement',
          name: 'Personal Statement',
          description: 'Main application essay',
          status: 'in-progress',
          required: true,
          deadline: '2024-12-01'
        }
      ],
      progress: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Update checklist item
   */
  async updateChecklistItem(applicationId: string, itemType: string, status: 'not-started' | 'in-progress' | 'completed' | 'verified'): Promise<void> {
    logger.info(`Updated checklist item ${itemType} to ${status} for application ${applicationId}`);
    
    // This would typically update the database
    // For now, just log the update
  }
  
  /**
   * Add timeline event
   */
  async addTimelineEvent(applicationId: string, event: {
    type: 'deadline' | 'submission' | 'decision' | 'financial-aid' | 'interview' | 'other';
    title: string;
    description: string;
    date: string;
    status: 'upcoming' | 'completed' | 'missed';
    importance: 'high' | 'medium' | 'low';
  }): Promise<void> {
    logger.info(`Added timeline event ${event.title} for application ${applicationId}`);
    
    // This would typically add to the database
    // For now, just log the event
  }
  
  /**
   * Get user's applications
   */
  async getUserApplications(userId: string): Promise<ApplicationStatus[]> {
    // This would typically fetch from database
    // For now, return mock data
    return [
      {
        id: 'app_1',
        userId,
        universityId: 'harvard',
        universityName: 'Harvard University',
        status: 'in-progress',
        applicationType: 'regular-decision',
        deadline: '2025-01-01',
        notes: ['Application in progress'],
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-15')
      },
      {
        id: 'app_2',
        userId,
        universityId: 'stanford',
        universityName: 'Stanford University',
        status: 'not-started',
        applicationType: 'regular-decision',
        deadline: '2025-01-02',
        notes: ['Application not yet started'],
        createdAt: new Date('2024-10-10'),
        updatedAt: new Date('2024-10-10')
      }
    ];
  }
  
  /**
   * Get application progress summary
   */
  async getApplicationProgress(userId: string): Promise<{
    totalApplications: number;
    submitted: number;
    inProgress: number;
    notStarted: number;
    accepted: number;
    rejected: number;
    waitlisted: number;
    overallProgress: number;
  }> {
    const applications = await this.getUserApplications(userId);
    
    const submitted = applications.filter(app => app.status === 'submitted').length;
    const inProgress = applications.filter(app => app.status === 'in-progress').length;
    const notStarted = applications.filter(app => app.status === 'not-started').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const waitlisted = applications.filter(app => app.status === 'waitlisted').length;
    
    const overallProgress = applications.length > 0 ? 
      ((submitted + accepted) / applications.length) * 100 : 0;
    
    return {
      totalApplications: applications.length,
      submitted,
      inProgress,
      notStarted,
      accepted,
      rejected,
      waitlisted,
      overallProgress: Math.round(overallProgress)
    };
  }
  
  /**
   * Get upcoming deadlines
   */
  async getUpcomingDeadlines(userId: string, days: number = 30): Promise<{
    applicationId: string;
    universityName: string;
    deadline: string;
    daysRemaining: number;
    applicationType: string;
    status: string;
  }[]> {
    const applications = await this.getUserApplications(userId);
    const now = new Date();
    const cutoffDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return applications
      .filter(app => {
        const deadline = new Date(app.deadline);
        return deadline >= now && deadline <= cutoffDate;
      })
      .map(app => {
        const deadline = new Date(app.deadline);
        const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        
        return {
          applicationId: app.id,
          universityName: app.universityName,
          deadline: app.deadline,
          daysRemaining,
          applicationType: app.applicationType,
          status: app.status
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }
  
  /**
   * Record application decision
   */
  async recordDecision(applicationId: string, decision: 'accepted' | 'rejected' | 'waitlisted' | 'deferred', financialAidAmount?: number): Promise<ApplicationStatus> {
    const application = await this.updateApplicationStatus(applicationId, decision, `Decision: ${decision}`);
    
    // Add decision event to timeline
    await this.addTimelineEvent(applicationId, {
      type: 'decision',
      title: `Application ${decision.charAt(0).toUpperCase() + decision.slice(1)}`,
      description: `Application has been ${decision}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      importance: 'high'
    });
    
    logger.info(`Recorded ${decision} decision for application ${applicationId}`);
    return application;
  }
}

// Export singleton instance
export const applicationManagementService = new ApplicationManagementService(); 