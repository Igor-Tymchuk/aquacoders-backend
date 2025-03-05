import { model, Schema } from 'mongoose';

const waterSchema = new Schema({
  volume: {
    type: Number,
    required: true,
    min: 50,
    max: 5000,
  },
  date: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
});

export const WaterCollection = model('water', waterSchema);
