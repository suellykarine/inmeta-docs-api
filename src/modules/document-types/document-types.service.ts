import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';

@Injectable()
export class DocumentTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    const typeExists = await this.prisma.documentType.findUnique({
      where: { name: createDocumentTypeDto.name },
    });

    if (typeExists) {
      throw new ConflictException('This type of document already exists.');
    }

    return this.prisma.documentType.create({
      data: createDocumentTypeDto,
    });
  }

  async findAll() {
    return this.prisma.documentType.findMany();
  }
  async remove(id: string) {
    const type = await this.prisma.documentType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException('Document type not found.');
    }

    try {
      await this.prisma.documentType.delete({
        where: { id },
      });

      return { message: 'Document successfully deleted.' };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new UnprocessableEntityException(
            'This type of document cannot be deleted because there are already collaborator documents linked to it.',
          );
        }
      }
      throw error;
    }
  }
}
