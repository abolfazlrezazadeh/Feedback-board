import { IsEnum } from 'class-validator';
import { FeedbackStatus } from '../schemas/feedback.schema';

export class UpdateStatusDto {
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;
}
