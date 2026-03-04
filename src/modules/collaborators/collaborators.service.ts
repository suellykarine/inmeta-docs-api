import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCollaboratorDto: CreateCollaboratorDto) {
    const emailExists = await this.prisma.collaborator.findUnique({
      where: { email: createCollaboratorDto.email },
    });

    if (emailExists) {
      throw new ConflictException('This email address is already registered.');
    }

    return this.prisma.collaborator.create({
      data: createCollaboratorDto,
    });
  }

  async findAll() {
    return this.prisma.collaborator.findMany({
      where: { deletedAt: null },
    });
  }
  async findOne(id: string) {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: { id, deletedAt: null },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found.');
    }

    return collaborator;
  }
  async update(id: string, updateCollaboratorDto: UpdateCollaboratorDto) {
    await this.findOne(id);

    return this.prisma.collaborator.update({
      where: { id },
      data: updateCollaboratorDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.collaborator.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'collaborator successfully removed.' };
  }
}
