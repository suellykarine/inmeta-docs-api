import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';

@ApiTags('document-types')
@Controller('document-types')
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo tipo de documento' })
  @ApiResponse({
    status: 201,
    description: 'The document type has been successfully created.',
  })
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypesService.create(createDocumentTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os tipos de documento' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all document types.',
  })
  findAll() {
    return this.documentTypesService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um tipo de documento' })
  @ApiParam({
    name: 'id',
    description: 'Document Type ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The document type has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.documentTypesService.remove(id);
  }
}
