import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  message: string;
}
