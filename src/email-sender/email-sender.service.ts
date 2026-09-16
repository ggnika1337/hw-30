import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dtos/send-email.dto';

@Injectable()
export class EmailSenderService {
  constructor(private emailService: MailerService) {}

  async sendEmailToSomeone({ subject, text, to }: SendEmailDto) {
    const options = {
      to,
      subject,
      from: 'gamesense <bloxnick2000@gmail.com>',
      text,
    };

    await this.emailService.sendMail(options);
    console.log('Email Sent successfully');
  }

  async sendEmailToSomeonBCC(bcc: string) {
    const options = {
      bcc,
      subject: 'Test',
      from: 'gamesense <bloxnick2000@gmail.com>',
      text: 'Random text again',
    };

    await this.emailService.sendMail(options);
    console.log('Email Sent successfully');
  }

  async sendWelcomeMessage(to: string) {
    const options = {
      to,
      subject: 'Welcome',
      from: 'gamesense <bloxnick2000@gmail.com>',
      text: 'Welcome aboard! Your account is ready. Sign in and start exploring.',
    };

    await this.emailService.sendMail(options);
    console.log('Welcome email sent successfully');
  }

  async verifyUser(to: string, OTPCode: string) {
    const options = {
      to,
      subject: `${OTPCode} is your gamesense verification code`,
      from: 'gamesense <bloxnick2000@gmail.com>',
      text: `Your verification code is ${OTPCode}. It expires in 10 minutes. If you did not request it, ignore this email.`,
    };

    await this.emailService.sendMail(options);
    console.log('OTP email sent successfully');
  }
}
