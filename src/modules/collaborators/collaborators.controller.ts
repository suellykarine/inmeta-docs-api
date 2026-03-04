import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@ApiTags('collaborators')
@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo colaborador' })
  @ApiResponse({
    status: 201,
    description: 'The collaborator has been successfully created.',
  })
  create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return this.collaboratorsService.create(createCollaboratorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os colaboradores ativos' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all active collaborators.',
  })
  findAll() {
    return this.collaboratorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um colaborador específico por ID' })
  @ApiParam({
    name: 'id',
    description: 'Collaborator ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the collaborator.',
  })
  findOne(@Param('id') id: string) {
    return this.collaboratorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar os dados de um colaborador' })
  @ApiParam({
    name: 'id',
    description: 'Collaborator ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The collaborator has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCollaboratorDto: UpdateCollaboratorDto,
  ) {
    return this.collaboratorsService.update(id, updateCollaboratorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desativar um colaborador (Soft Delete)' })
  @ApiParam({
    name: 'id',
    description: 'Collaborator ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The collaborator has been deactivated.',
  })
  remove(@Param('id') id: string) {
    return this.collaboratorsService.remove(id);
  }
}
