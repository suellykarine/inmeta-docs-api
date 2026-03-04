import { ConflictException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ) {
    const { collaboratorId, documentTypeId } = createDocumentDto;

    return this.prisma.$transaction(async (tx) => {
      let document = await tx.document.findUnique({
        where: {
          collaboratorId_documentTypeId: { collaboratorId, documentTypeId },
        },
      });

      if (!document) {
        document = await tx.document.create({
          data: { collaboratorId, documentTypeId, status: 'UPLOADED' },
        });
      } else {
        await tx.document.update({
          where: { id: document.id },
          data: { status: 'UPLOADED' },
        });

        await tx.documentVersion.updateMany({
          where: { documentId: document.id },
          data: { isActive: false },
        });
      }

      const lastVersion = await tx.documentVersion.findFirst({
        where: { documentId: document.id },
        orderBy: { versionNumber: 'desc' },
      });
      const nextVersion = lastVersion ? lastVersion.versionNumber + 1 : 1;

      return tx.documentVersion.create({
        data: {
          documentId: document.id,
          versionNumber: nextVersion,
          fileReference: file.path,
          isActive: true,
        },
      });
    });
  }

  async createRequirement(collaboratorId: string, documentTypeId: string) {
    return this.prisma.$transaction(async (tx) => {
      const collaborator = await tx.collaborator.findFirst({
        where: { id: collaboratorId, deletedAt: null },
      });
      if (!collaborator) throw new NotFoundException('Collaborator not found.');

      const documentType = await tx.documentType.findUnique({
        where: { id: documentTypeId },
      });
      if (!documentType) throw new NotFoundException('Document Type not found.');

      const existingDocument = await tx.document.findUnique({
        where: {
          collaboratorId_documentTypeId: { collaboratorId, documentTypeId },
        },
      });
      if (existingDocument) {
        throw new ConflictException('This requirement already exists for this collaborator.');
      }

      return tx.document.create({
        data: { collaboratorId, documentTypeId, status: 'PENDING' },
      });
    });
  }

  async findPending(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.document.findMany({
        where: {
          status: 'PENDING',
          collaborator: { name: { contains: search }, deletedAt: null },
        },
        include: { collaborator: true, documentType: true },
        skip,
        take: limit,
      }),
      this.prisma.document.count({ where: { status: 'PENDING' } }),
    ]);

    return { data, meta: { total, page, lastPage: Math.ceil(total / limit) } };
  }

  async getStats() {
    const totalDocs = await this.prisma.document.count();
    const uploadedDocs = await this.prisma.document.count({
      where: { status: 'UPLOADED' },
    });

    const percentage = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;

    const mostPending = await this.prisma.document.groupBy({
      by: ['documentTypeId'],
      where: { status: 'PENDING' },
      _count: { documentTypeId: true },
      orderBy: { _count: { documentTypeId: 'desc' } },
      take: 5,
    });

    const mostPendingFormatted = mostPending.map((item) => ({
      documentTypeId: item.documentTypeId,
      pendingCount: item._count.documentTypeId,
    }));

    const lastUploads = await this.prisma.documentVersion.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        document: {
          include: {
            collaborator: true,
            documentType: true,
          },
        },
      },
    });

    return {
      feeConclusion: `${percentage.toFixed(2)}%`,
      totalDocuments: totalDocs,
      documentsSubmitted: uploadedDocs,
      mostPendingTypes: mostPendingFormatted,
      latestShipping: lastUploads,
    };
  }

  async findAllByCollaborator(collaboratorId: string) {
    return this.prisma.document.findMany({
      where: { collaboratorId },
      include: {
        documentType: true,
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });
  }

  async getFileStream(
    versionId: string,
  ): Promise<{ stream: StreamableFile; filePath: string }> {
    const version = await this.prisma.documentVersion.findUnique({
      where: { id: versionId },
    });
    if (!version) throw new NotFoundException('Version not found');
    const filePath = join(process.cwd(), version.fileReference);
    return {
      stream: new StreamableFile(createReadStream(filePath)),
      filePath: version.fileReference,
    };
  }

  async deactivateDocument(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException('Document not found');
    await this.prisma.document.update({
      where: { id },
      data: {
        status: 'PENDING',
        versions: {
          updateMany: { where: { documentId: id }, data: { isActive: false } },
        },
      },
    });

    return {
      message:
        'Document versions deactivated successfully. Status reverted to PENDING.',
      documentId: id,
    };
  }
}
