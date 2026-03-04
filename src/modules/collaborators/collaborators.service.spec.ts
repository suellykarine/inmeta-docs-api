import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CollaboratorsService } from './collaborators.service';

describe('CollaboratorsService', () => {
  let service: CollaboratorsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    collaborator: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaboratorsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CollaboratorsService>(CollaboratorsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('must be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('must create a successful collaborator.', async () => {
      const dto = { name: 'Suélly Araujo', email: 'suelly@example.com' };
      mockPrismaService.collaborator.findUnique.mockResolvedValue(null);
      mockPrismaService.collaborator.create.mockResolvedValue({
        id: '1',
        ...dto,
      });

      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(prisma.collaborator.create).toHaveBeenCalled();
    });

    it('must throw ConflictException if the email is already registered.', async () => {
      const dto = { name: 'Suélly Araujo', email: 'suelly@example.com' };
      mockPrismaService.collaborator.findUnique.mockResolvedValue({ id: '1', ...dto });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('must list all active collaborators.', async () => {
      const collaborators = [{ id: '1', name: 'Colab 1', deletedAt: null }];
      mockPrismaService.collaborator.findMany.mockResolvedValue(collaborators);

      const result = await service.findAll();

      expect(result).toEqual(collaborators);
      expect(prisma.collaborator.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
    });
  });

  describe('findOne', () => {
    it('must search for a specific collaborator by ID with success.', async () => {
      const collaborator = { id: '1', name: 'Suélly', deletedAt: null };
      mockPrismaService.collaborator.findFirst.mockResolvedValue(collaborator);

      const result = await service.findOne('1');

      expect(result).toEqual(collaborator);
    });

    it('must throw NotFoundException if the collaborator does not exist or is deleted.', async () => {
      mockPrismaService.collaborator.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('must update a collaborator correctly.', async () => {
      const collaborator = { id: '1', name: 'Suélly', deletedAt: null };
      const dto = { name: 'Suélly Alterada' };
      mockPrismaService.collaborator.findFirst.mockResolvedValue(collaborator);
      mockPrismaService.collaborator.update.mockResolvedValue({ ...collaborator, ...dto });

      const result = await service.update('1', dto);

      expect(result.name).toBe('Suélly Alterada');
      expect(prisma.collaborator.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('It should throw an error if the collaborator does not exist when trying to delete.', async () => {
      mockPrismaService.collaborator.findFirst.mockResolvedValue(null);

      await expect(service.remove('id-invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('you must perform a soft delete', async () => {
      const collaborator = { id: '1', name: 'Suélly', deletedAt: null };
      mockPrismaService.collaborator.findFirst.mockResolvedValue(collaborator);
      mockPrismaService.collaborator.update.mockResolvedValue({
        ...collaborator,
        deletedAt: new Date(),
      });

      await service.remove('1');

      expect(prisma.collaborator.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
