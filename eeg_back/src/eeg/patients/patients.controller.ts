import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('eeg/patients')
export class PatientsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getPatients(@Query('search') search?: string) {
    return this.prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { nom: { contains: search } },
              { prenom: { contains: search } },
              { idDossier: { contains: search } },
            ],
          }
        : undefined,
      include: {
        _count: { select: { demandes: true, rdvs: true } },
      },
      orderBy: { nom: 'asc' },
    });
  }

  @Get('dossier/:idDossier')
  async getPatientByDossier(@Param('idDossier') idDossier: string) {
    return this.prisma.patient.findUnique({
      where: { idDossier },
      include: {
        demandes: {
          orderBy: { dateCreation: 'desc' },
          take: 5,
        },
        _count: { select: { demandes: true, rdvs: true } },
      },
    });
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        demandes: {
          orderBy: { dateCreation: 'desc' },
          take: 10,
          include: {
            resultat: {
              select: { estImmutable: true, estCritique: true, dateValidation: true },
            },
          },
        },
        rdvs: {
          orderBy: { dateRdv: 'desc' },
          take: 5,
        },
        _count: { select: { demandes: true, rdvs: true } },
      },
    });
  }

  @Post()
  async creerPatient(@Body() body: any) {
    return this.prisma.patient.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        age: body.age,
        sexe: body.sexe,
        idDossier: body.idDossier,
      },
    });
  }

  @Patch(':id')
  async modifierPatient(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    if (body.nom) data.nom = body.nom;
    if (body.prenom) data.prenom = body.prenom;
    if (body.age) data.age = body.age;
    if (body.sexe) data.sexe = body.sexe;
    if (body.idDossier) data.idDossier = body.idDossier;
    return this.prisma.patient.update({ where: { id }, data });
  }
}
