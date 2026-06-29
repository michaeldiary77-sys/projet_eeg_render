import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Patient, SourceSystem } from '@prisma/client';

@Injectable()
export class PatientLookupService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a patient by local UUID or external patient ID
   * @param patientId - Can be a local UUID or external ID (e.g., CHU-2026-00001)
   * @returns Patient or null if not found
   */
  async findPatientByIdOrExternal(patientId: string): Promise<Patient | null> {
    return this.prisma.patient.findFirst({
      where: {
        OR: [{ id: patientId }, { externalPatientId: patientId }],
      },
    });
  }

  /**
   * Get or create a patient for external prescriptions
   * If patient doesn't exist, create a minimal external patient
   * @param patientId - External patient ID
   * @param patientInfo - Optional patient information
   * @returns Created or found Patient
   */
  async getOrCreateExternalPatient(
    patientId: string,
    patientInfo?: {
      nom?: string;
      prenom?: string;
      age?: number;
      sexe?: string;
    },
  ): Promise<Patient> {
    let patient = await this.findPatientByIdOrExternal(patientId);

    if (!patient) {
      patient = await this.prisma.patient.create({
        data: {
          externalPatientId: patientId,
          sourceSystem: 'PRESCRIPTION' as SourceSystem,
          isExternal: true,
          nom: patientInfo?.nom,
          prenom: patientInfo?.prenom,
          age: patientInfo?.age,
          sexe: patientInfo?.sexe,
        },
      });
    } else if (patientInfo && patient.isExternal) {
      // Update existing external patient with new information
      patient = await this.prisma.patient.update({
        where: { id: patient.id },
        data: {
          nom: patientInfo.nom || patient.nom,
          prenom: patientInfo.prenom || patient.prenom,
          age: patientInfo.age || patient.age,
          sexe: patientInfo.sexe || patient.sexe,
        },
      });
    }

    return patient;
  }

  /**
   * Create or update an external patient with upsert
   * @param externalPatientId - External patient ID
   * @param patientInfo - Patient information to create/update
   * @returns Patient record
   */
  async upsertExternalPatient(
    externalPatientId: string,
    patientInfo?: {
      nom?: string;
      prenom?: string;
      age?: number;
      sexe?: string;
    },
  ): Promise<Patient> {
    return this.prisma.patient.upsert({
      where: { externalPatientId },
      update: {
        nom: patientInfo?.nom,
        prenom: patientInfo?.prenom,
        age: patientInfo?.age,
        sexe: patientInfo?.sexe,
      },
      create: {
        externalPatientId,
        sourceSystem: 'PRESCRIPTION' as SourceSystem,
        isExternal: true,
        nom: patientInfo?.nom,
        prenom: patientInfo?.prenom,
        age: patientInfo?.age,
        sexe: patientInfo?.sexe,
      },
    });
  }
}
