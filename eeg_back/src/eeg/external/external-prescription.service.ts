import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientLookupService } from '../patients/patient-lookup.service';
import { DemandesService } from '../demandes/demandes.service';
import { ExternalEegPrescriptionDto } from '../demandes/dto/external-prescription.dto';

@Injectable()
export class ExternalPrescriptionService {
  private readonly logger = new Logger(ExternalPrescriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly patientLookup: PatientLookupService,
    private readonly demandesService: DemandesService,
  ) {}

  /**
   * Receive and process an external EEG prescription from the Prescription API
   * @param dto - External prescription data
   * @returns Acknowledgment with created demand ID
   */
  async receiveExternalPrescription(dto: ExternalEegPrescriptionDto) {
    try {
      // Step 1: Get or create external patient
      const patient = await this.patientLookup.getOrCreateExternalPatient(
        dto.patientId,
        dto.patient,
      );

      this.logger.log(
        `Patient resolved: ${patient.id} (external: ${patient.isExternal}) - ID: ${dto.patientId}`,
      );

      // Step 2: Get or create prescripteur (can be external too)
      let prescripteur = await this.prisma.utilisateur.findUnique({
        where: { id: dto.prescripteurId },
      });

      if (!prescripteur) {
        // Create a minimal external prescripteur if not found
        prescripteur = await this.prisma.utilisateur.create({
          data: {
            id: dto.prescripteurId,
            nom: 'Prescripteur',
            prenom: 'Externe',
            email: `prescripteur-${dto.prescripteurId}@chu.local`,
            password: 'EXTERNAL',
            role: 'TECHNICIEN',
            actif: true,
          },
        });

        this.logger.log(
          `Created external prescripteur: ${prescripteur.id}`,
        );
      }

      // Step 3: Create the EEG demand using the existing service
      const demande = await this.demandesService.creerDemande(
        {
          patientId: patient.id,
          typeEEG: dto.typeEEG,
          urgence: dto.urgence || 'NORMALE',
          motifPrescription: dto.renseignements,
          episodeSoinsId: dto.episodeSoinsId || dto.chuId || `EXTERNAL-${Date.now()}`,
          patient: dto.patient,
        },
        prescripteur.id,
      );

      this.logger.log(
        `Created EEG demand: ${demande.id} for patient ${patient.externalPatientId || patient.id}`,
      );

      // Step 4: Return acknowledgment
      return {
        success: true,
        message: 'Prescription EEG reçue et traitée',
        data: {
          demandeId: demande.id,
          numeroEEG: demande.numeroEEG,
          patientId: patient.id,
          externalPatientId: patient.externalPatientId,
          statut: demande.statut,
          createdAt: demande.dateCreation,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error processing external prescription: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to process prescription: ${error.message}`,
      );
    }
  }

  /**
   * Get ACK status for a prescription
   * @param demandeId - Demand ID
   * @returns Demand status
   */
  async getPrescriptionStatus(demandeId: string) {
    const demande = await this.prisma.eegDemande.findUnique({
      where: { id: demandeId },
      include: { patient: true, resultat: true },
    });

    if (!demande) {
      throw new BadRequestException(`Demand ${demandeId} not found`);
    }

    return {
      demandeId: demande.id,
      numeroEEG: demande.numeroEEG,
      statut: demande.statut,
      patientId: demande.patient.externalPatientId || demande.patient.id,
      dateCreation: demande.dateCreation,
      dateRealisation: demande.dateRealisation,
      dateValidation: demande.dateValidation,
      hasResult: !!demande.resultat,
      resultPreliminary: demande.resultat
        ? {
            conclusion: demande.resultat.conclusionDiagnostique,
            anomalies: demande.resultat.anomaliesDetectees,
          }
        : null,
    };
  }
}
