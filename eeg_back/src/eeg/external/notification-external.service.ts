import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationExternalService {
  private readonly logger = new Logger(NotificationExternalService.name);
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.NOTIFICATION_SERVICE_URL || 'https://service-notification.onrender.com';
  }

  async sendNotification(dto: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/notifications`, dto, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      this.logger.log(`Notification envoyée: ${response.data?.id || 'OK'}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur envoi notification: ${error.message}`);
      return null;
    }
  }
}
