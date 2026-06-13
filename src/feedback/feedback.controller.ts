import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /** Create a new feedback entry */
  @Post()
  async create(@Body() dto: CreateFeedbackDto) {
    const feedback = await this.feedbackService.create(dto);
    return { data: feedback };
  }

  /** List all feedbacks, newest first */
  @Get()
  async findAll() {
    const feedbacks = await this.feedbackService.findAll();
    return { data: feedbacks };
  }

  /** Transition a feedback to a new status (NEW / IN_REVIEW / RESOLVED) */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    const feedback = await this.feedbackService.updateStatus(id, dto);
    return { data: feedback };
  }
}
