import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCollaboratorDto {
  @ApiProperty({
    description: 'Nome completo do colaborador',
    example: 'Suelly Araujo',
  })
  @IsString({ message: 'The name must be a sequence of characters.' })
  @IsNotEmpty({ message: 'The name is required.' })
  @MinLength(3, { message: 'The name must have at least 3 characters.' })
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail corporativo',
    example: 'seu.nome@empresa.com.br',
  })
  @IsEmail({}, { message: 'The email address provided is invalid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;
}
