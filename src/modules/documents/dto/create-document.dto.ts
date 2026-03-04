import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'ID único do colaborador (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty()
  @IsUUID()
  collaboratorId: string;

  @ApiProperty({
    description: 'ID do tipo de documento (RG, CPF, etc)',
    example: 'b1f2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  })
  @IsNotEmpty()
  @IsUUID()
  documentTypeId: string;
}
