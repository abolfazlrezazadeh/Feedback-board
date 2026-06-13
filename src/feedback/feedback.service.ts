import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<FeedbackDocument> {
    const feedback = new this.feedbackModel(dto);
    return feedback.save();
  }

  async findAll(): Promise<FeedbackDocument[]> {
    return this.feedbackModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
  ): Promise<FeedbackDocument> {
    const feedback = await this.feedbackModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .exec();

    if (!feedback) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    return feedback;
  }
}
