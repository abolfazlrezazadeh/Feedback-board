import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

export enum FeedbackStatus {
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
}

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({
    required: true,
    enum: FeedbackStatus,
    default: FeedbackStatus.NEW,
  })
  status: FeedbackStatus;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
