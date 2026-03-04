import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentTypesService } from './document-types.service';

describe('DocumentTypesService', () => {
  let service: DocumentTypesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    documentType: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DocumentTypesService>(DocumentTypesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a document type', async () => {
      const dto = { name: 'RG' };
      mockPrismaService.documentType.findUnique.mockResolvedValue(null);
      mockPrismaService.documentType.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(prisma.documentType.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if name already exists', async () => {
      const dto = { name: 'RG' };
      mockPrismaService.documentType.findUnique.mockResolvedValue({ id: '1', ...dto });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all document types', async () => {
      const types = [{ id: '1', name: 'RG' }];
      mockPrismaService.documentType.findMany.mockResolvedValue(types);

      const result = await service.findAll();

      expect(result).toEqual(types);
      expect(prisma.documentType.findMany).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a document type', async () => {
      const type = { id: '1', name: 'RG' };
      mockPrismaService.documentType.findUnique.mockResolvedValue(type);
      mockPrismaService.documentType.delete.mockResolvedValue(type);

      const result = await service.remove('1');

      expect(result).toEqual({ message: 'Document successfully deleted.' });
      expect(prisma.documentType.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if type does not exist', async () => {
      mockPrismaService.documentType.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnprocessableEntityException if restricted by foreign keys', async () => {
      const type = { id: '1', name: 'RG' };
      mockPrismaService.documentType.findUnique.mockResolvedValue(type);
      const error = new Prisma.PrismaClientKnownRequestError('Foreign key constraint', {
        code: 'P2003',
        clientVersion: '6.x',
      });
      mockPrismaService.documentType.delete.mockRejectedValue(error);

      await expect(service.remove('1')).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
