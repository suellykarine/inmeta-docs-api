import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTypesController } from './document-types.controller';
import { DocumentTypesService } from './document-types.service';

describe('DocumentTypesController', () => {
  let controller: DocumentTypesController;

  const mockDocumentTypesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypesController],
      providers: [
        {
          provide: DocumentTypesService,
          useValue: mockDocumentTypesService,
        },
      ],
    }).compile();

    controller = module.get<DocumentTypesController>(DocumentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a document type', async () => {
      const dto = { name: 'RG' };
      mockDocumentTypesService.create.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.create(dto);

      expect(result).toHaveProperty('id');
      expect(mockDocumentTypesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all document types', async () => {
      const types = [{ id: '1', name: 'RG' }];
      mockDocumentTypesService.findAll.mockResolvedValue(types);

      const result = await controller.findAll();

      expect(result).toEqual(types);
      expect(mockDocumentTypesService.findAll).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a document type', async () => {
      mockDocumentTypesService.remove.mockResolvedValue({
        message: 'Document successfully deleted.',
      });

      const result = await controller.remove('1');

      expect(result).toEqual({ message: 'Document successfully deleted.' });
      expect(mockDocumentTypesService.remove).toHaveBeenCalledWith('1');
    });
  });
});
