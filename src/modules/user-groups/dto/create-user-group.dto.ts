import { IsOptional, IsString } from 'class-validator';

export class CreateUserGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
