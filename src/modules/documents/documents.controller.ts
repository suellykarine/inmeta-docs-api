import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('requirement')
  @ApiOperation({
    summary: 'Criar uma pendência de documento para um colaborador',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        collaboratorId: {
          type: 'string',
          example: 'id',
        },
        documentTypeId: {
          type: 'string',
          example: 'id',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Requirement created successfully.',
  })
  async createRequirement(
    @Body() data: { collaboratorId: string; documentTypeId: string },
  ) {
    return this.documentsService.createRequirement(
      data.collaboratorId,
      data.documentTypeId,
    );
  }

  @Get('pending')
  @ApiOperation({
    summary:
      'Listar todos os documentos pendentes de envio (com paginação e busca)',
  })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of pending requirements.' })
  async findPending(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    return this.documentsService.findPending(
      Number(page) || 1,
      Number(limit) || 10,
      search,
    );
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Obter estatísticas gerais (Dashboard) sobre uploads',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully.',
  })
  async getDashboard() {
    return this.documentsService.getStats();
  }

  @Post('upload')
  @ApiOperation({
    summary:
      'Fazer o upload de um arquivo para cumprir uma pendência de documento',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        collaboratorId: {
          type: 'string',
          example: '',
        },
        documentTypeId: {
          type: 'string',
          example: '',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF or Image file (max 5MB)',
        },
      },
      required: ['collaboratorId', 'documentTypeId', 'file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully and version created.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({
            fileType: /image\/(jpeg|jpg|png)|application\/pdf/,
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.documentsService.create(createDocumentDto, file);
  }

  @Get('collaborator/:id')
  @ApiOperation({
    summary:
      'Listar todos os documentos (e versões) de um colaborador específico',
  })
  @ApiParam({
    name: 'id',
    description: 'Collaborator ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of documents for the collaborator.',
  })
  async findAll(@Param('id') id: string) {
    return this.documentsService.findAllByCollaborator(id);
  }

  @Get('download/:versionId')
  @ApiOperation({
    summary:
      'Fazer download ou visualizar um documento específico via ID da Versão',
  })
  @ApiParam({
    name: 'versionId',
    description: 'Document Version ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The requested document file.',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async download(
    @Param('versionId') versionId: string,
    @Res({ passthrough: true }) res: any,
  ): Promise<StreamableFile> {
    const { stream, filePath } = await this.documentsService.getFileStream(versionId);

    const ext = extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename=document${ext}`,
    });

    return stream;
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary:
      'Desativar um documento (Soft Delete), inativando todas as suas versões',
  })
  @ApiParam({
    name: 'id',
    description: 'Document ID related to the document type.',
  })
  @ApiResponse({
    status: 200,
    description: 'Document deactivated successfully.',
  })
  async deactivate(@Param('id') id: string) {
    return this.documentsService.deactivateDocument(id);
  }
}
