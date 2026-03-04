import {
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    collaborator: {
      findFirst: jest.fn(),
    },
    documentType: {
      findUnique: jest.fn(),
    },
    documentVersion: {
      create: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRequirement', () => {
    it('should create a document requirement', async () => {
      mockPrismaService.collaborator.findFirst.mockResolvedValue({ id: 'colab-1' });
      mockPrismaService.documentType.findUnique.mockResolvedValue({ id: 'type-1' });
      mockPrismaService.document.findUnique.mockResolvedValue(null);
      mockPrismaService.document.create.mockResolvedValue({ id: 'doc-1' });

      const result = await service.createRequirement('colab-1', 'type-1');

      expect(result).toEqual({ id: 'doc-1' });
    });

    it('should throw NotFoundException if collaborator does not exist', async () => {
      mockPrismaService.collaborator.findFirst.mockResolvedValue(null);

      await expect(service.createRequirement('invalid', 'type-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if requirement already exists', async () => {
      mockPrismaService.collaborator.findFirst.mockResolvedValue({ id: 'colab-1' });
      mockPrismaService.documentType.findUnique.mockResolvedValue({ id: 'type-1' });
      mockPrismaService.document.findUnique.mockResolvedValue({ id: 'doc-1' });

      await expect(service.createRequirement('colab-1', 'type-1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findPending', () => {
    it('should return pending documents with pagination', async () => {
      const docs = [{ id: '1', status: 'PENDING' }];
      mockPrismaService.document.findMany.mockResolvedValue(docs);
      mockPrismaService.document.count.mockResolvedValue(1);

      const result = await service.findPending(1, 10);

      expect(result.data).toEqual(docs);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should return dashboard statistics', async () => {
      mockPrismaService.document.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5);
      mockPrismaService.document.groupBy.mockResolvedValue([]);
      mockPrismaService.documentVersion.findMany.mockResolvedValue([]);

      const result = await service.getStats();

      expect(result.totalDocuments).toBe(10);
      expect(result.documentsSubmitted).toBe(5);
      expect(result.feeConclusion).toBe('50.00%');
    });
  });

  describe('deactivateDocument', () => {
    it('should deactivate all versions of a document', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue({ id: 'doc-1' });
      mockPrismaService.document.update.mockResolvedValue({ id: 'doc-1' });

      const result = await service.deactivateDocument('doc-1');

      expect(result.message).toContain('deactivated successfully');
      expect(prisma.document.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if document does not exist', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(null);

      await expect(service.deactivateDocument('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
