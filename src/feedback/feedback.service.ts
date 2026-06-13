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

  /** Persist a new feedback with default NEW status */
  async create(dto: CreateFeedbackDto): Promise<FeedbackDocument> {
    const feedback = new this.feedbackModel(dto);
    return feedback.save();
  }

  /** Retrieve all feedbacks sorted by most recent first */
  async findAll(search?: string): Promise<FeedbackDocument[]> {
    const filter = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};
    return this.feedbackModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  /**
   * Update the status of a feedback document.
   * Throws NotFoundException when the id does not match any document.
   */
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
