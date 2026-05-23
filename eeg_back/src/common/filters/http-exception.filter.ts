import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erreur interne du serveur';
    let erreur: string | string[] = 'ERREUR_INTERNE';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        erreur = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = Array.isArray(resObj.message) ? resObj.message.join(", ") : (resObj.message as string) ?? exception.message;
        erreur = (resObj.error as string) ?? 'ERREUR_HTTP';
      }
    }

    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Un enregistrement avec ces données existe déjà';
          erreur = 'DOUBLON';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Enregistrement introuvable';
          erreur = 'INTROUVABLE';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Référence étrangère invalide';
          erreur = 'REFERENCE_INVALIDE';
          break;
        case 'P2014':
          status = HttpStatus.BAD_REQUEST;
          message = 'La relation requise est manquante';
          erreur = 'RELATION_MANQUANTE';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = `Erreur base de données (${exception.code})`;
          erreur = 'ERREUR_BD';
      }
      this.logger.error(
        `Prisma ${exception.code} — ${request.method} ${request.url}`,
        exception.stack,
      );
    }

    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Données invalides envoyées à la base de données';
      erreur = 'VALIDATION_BD';
      this.logger.error(
        `Prisma validation — ${request.method} ${request.url}`,
        exception.stack,
      );
    }

    else {
      this.logger.error(
        `Exception non gérée — ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      erreur,
      message,
      chemin: request.url,
      horodatage: new Date().toISOString(),
    });
  }
}
