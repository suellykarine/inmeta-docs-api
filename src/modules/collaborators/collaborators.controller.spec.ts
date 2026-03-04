import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';

describe('CollaboratorsController', () => {
  let controller: CollaboratorsController;

  const mockCollaboratorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorsController],
      providers: [
        {
          provide: CollaboratorsService,
          useValue: mockCollaboratorsService,
        },
      ],
    }).compile();

    controller = module.get<CollaboratorsController>(CollaboratorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a collaborator', async () => {
      const dto = { name: 'Suélly', email: 'suelly@example.com' };
      mockCollaboratorsService.create.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.create(dto);

      expect(result).toHaveProperty('id');
      expect(mockCollaboratorsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of collaborators', async () => {
      const collaborators = [{ id: '1', name: 'Suélly' }];
      mockCollaboratorsService.findAll.mockResolvedValue(collaborators);

      const result = await controller.findAll();

      expect(result).toEqual(collaborators);
      expect(mockCollaboratorsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single collaborator', async () => {
      const collaborator = { id: '1', name: 'Suélly' };
      mockCollaboratorsService.findOne.mockResolvedValue(collaborator);

      const result = await controller.findOne('1');

      expect(result).toEqual(collaborator);
      expect(mockCollaboratorsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a collaborator', async () => {
      const dto = { name: 'Suélly Updated' };
      mockCollaboratorsService.update.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.update('1', dto);

      expect(result.name).toBe('Suélly Updated');
      expect(mockCollaboratorsService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a collaborator', async () => {
      mockCollaboratorsService.remove.mockResolvedValue({ message: 'removed' });

      const result = await controller.remove('1');

      expect(result).toEqual({ message: 'removed' });
      expect(mockCollaboratorsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
