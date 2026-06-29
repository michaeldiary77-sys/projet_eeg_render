import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ChuServiceInfo {
  id: string;
  nom?: string;
  chuId?: string;
  [key: string]: any;
}

@Injectable()
export class ChuClientService {
  private readonly logger = new Logger(ChuClientService.name);
  private readonly baseUrl: string;
  private readonly chuId: string;
  private readonly serviceId: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.CHU_API_URL || 'https://service-chu-back-production-d6a8.up.railway.app/service-chu/api';
    this.chuId = process.env.CHU_ID || '72d49761-2a65-446d-b025-15a74cac1ad4';
    this.serviceId = process.env.EEG_SERVICE_ID || '9d965b9f-4737-435f-abe9-73db0d3cf973';
  }

  /**
   * Get EEG service info from CHU service
   * @returns Service information or null if unavailable
   */
  async getMyServiceInfo(): Promise<ChuServiceInfo | null> {
    try {
      this.logger.log(`Fetching EEG service info from CHU: ${this.chuId}/${this.serviceId}`);
      
      const response = await firstValueFrom(
        this.httpService.get<ChuServiceInfo>(
          `${this.baseUrl}/service/chu/${this.chuId}/service/${this.serviceId}`,
          {
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      this.logger.log(`Successfully fetched EEG service info from CHU`);
      return response.data;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch EEG service info from CHU: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Get the EEG service ID from environment
   * @returns EEG service ID
   */
  getEegServiceId(): string {
    return this.serviceId;
  }

  /**
   * Get the CHU ID from environment
   * @returns CHU ID
   */
  getChuId(): string {
    return this.chuId;
  }
}
