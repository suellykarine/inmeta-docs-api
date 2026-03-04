import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

describe('DocumentsController', () => {
  let controller: DocumentsController;

  const mockDocumentsService = {
    create: jest.fn(),
    createRequirement: jest.fn(),
    findPending: jest.fn(),
    getStats: jest.fn(),
    findAllByCollaborator: jest.fn(),
    getFileStream: jest.fn(),
    deactivateDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRequirement', () => {
    it('should call service.createRequirement', async () => {
      const dto = { collaboratorId: '1', documentTypeId: '1' };
      mockDocumentsService.createRequirement.mockResolvedValue({ id: 'doc-1' });

      const result = await controller.createRequirement(dto);

      expect(result).toEqual({ id: 'doc-1' });
      expect(mockDocumentsService.createRequirement).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('findPending', () => {
    it('should call service.findPending', async () => {
      mockDocumentsService.findPending.mockResolvedValue({ data: [], meta: {} });

      const result = await controller.findPending('1', '10', 'search');

      expect(result).toHaveProperty('data');
      expect(mockDocumentsService.findPending).toHaveBeenCalledWith(1, 10, 'search');
    });
  });

  describe('getDashboard', () => {
    it('should call service.getStats', async () => {
      const stats = {
        feeConclusion: '50%',
        totalDocuments: 10,
        documentsSubmitted: 5,
        mostPendingTypes: [],
        latestShipping: [],
      };
      mockDocumentsService.getStats.mockResolvedValue(stats);

      const result = await controller.getDashboard();

      expect(result.totalDocuments).toBe(10);
      expect(mockDocumentsService.getStats).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call service.create with file', async () => {
      const dto = { collaboratorId: '1', documentTypeId: '1' };
      const file = { path: 'path/to/file' } as any;
      mockDocumentsService.create.mockResolvedValue({ id: 'version-1' });

      const result = await controller.create(dto, file);

      expect(result).toEqual({ id: 'version-1' });
      expect(mockDocumentsService.create).toHaveBeenCalledWith(dto, file);
    });
  });

  describe('findAll', () => {
    it('should call service.findAllByCollaborator', async () => {
      mockDocumentsService.findAllByCollaborator.mockResolvedValue([]);

      const result = await controller.findAll('1');

      expect(result).toBeInstanceOf(Array);
      expect(mockDocumentsService.findAllByCollaborator).toHaveBeenCalledWith('1');
    });
  });

  describe('deactivate', () => {
    it('should call service.deactivateDocument', async () => {
      mockDocumentsService.deactivateDocument.mockResolvedValue({ message: 'ok' });

      const result = await controller.deactivate('1');

      expect(result.message).toBe('ok');
      expect(mockDocumentsService.deactivateDocument).toHaveBeenCalledWith('1');
    });
  });
});
