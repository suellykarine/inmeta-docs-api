import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentTypeDto {
  @ApiProperty({
    description: 'Nome do tipo de documento exigido',
    example: 'Carteira de Identidade (RG)',
  })
  @IsString()
  @IsNotEmpty({ message: 'The document type name is required.' })
  name: string;
}
