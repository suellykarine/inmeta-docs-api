import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCollaboratorDto {
  @IsString({ message: 'The name must be a sequence of characters.' })
  @IsNotEmpty({ message: 'The name is required.' })
  @MinLength(3, { message: 'The name must have at least 3 characters.' })
  name: string;
  @IsEmail({}, { message: 'The email address provided is invalid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;
}
