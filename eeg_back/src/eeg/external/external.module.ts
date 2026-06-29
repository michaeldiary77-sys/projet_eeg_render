import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationExternalService } from './notification-external.service';
import { ExternalPrescriptionService } from './external-prescription.service';
import { ExternalPrescriptionController } from './external-prescription.controller';
import { PatientLookupService } from '../patients/patient-lookup.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [NotificationExternalService, ExternalPrescriptionService, PatientLookupService],
  controllers: [ExternalPrescriptionController],
  exports: [NotificationExternalService, ExternalPrescriptionService, PatientLookupService],
})
export class ExternalModule {}
