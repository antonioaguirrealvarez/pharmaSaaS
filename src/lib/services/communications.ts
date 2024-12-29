import { createModuleLogger } from '../logger';

const logger = createModuleLogger('communications');

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string | Buffer }>;
}

interface SMSOptions {
  to: string;
  message: string;
  from?: string;
}

class CommunicationsService {
  private static instance: CommunicationsService;

  private constructor() {}

  public static getInstance(): CommunicationsService {
    if (!CommunicationsService.instance) {
      CommunicationsService.instance = new CommunicationsService();
    }
    return CommunicationsService.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Implementation with your email service provider
      // Example: SendGrid, AWS SES, etc.
      logger.info('Sending email', { to: options.to, subject: options.subject });
    } catch (error) {
      logger.error('Failed to send email', { options, error });
      throw error;
    }
  }

  public async sendSMS(options: SMSOptions): Promise<void> {
    try {
      // Implementation with your SMS service provider
      // Example: Twilio, MessageBird, etc.
      logger.info('Sending SMS', { to: options.to });
    } catch (error) {
      logger.error('Failed to send SMS', { options, error });
      throw error;
    }
  }

  public async sendVerificationEmail(email: string, code: string): Promise<void> {
    return this.sendEmail({
      to: email,
      subject: 'Verify your email',
      body: `Your verification code is: ${code}`
    });
  }

  public async sendPasswordReset(email: string, resetLink: string): Promise<void> {
    return this.sendEmail({
      to: email,
      subject: 'Reset your password',
      body: `Click here to reset your password: ${resetLink}`
    });
  }

  public async sendAppointmentReminder(
    phone: string,
    appointment: { date: string; time: string; doctor: string }
  ): Promise<void> {
    return this.sendSMS({
      to: phone,
      message: `Reminder: Your appointment with ${appointment.doctor} is on ${appointment.date} at ${appointment.time}`
    });
  }
}

export const communicationsService = CommunicationsService.getInstance();