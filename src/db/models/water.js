import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    volume: {
      type: Number,
      required: true,
    },
    date: { type: Date, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    collection: 'water',
    timestamps: false,
    versionKey: false,
  },
);

export const WaterCollection = model('water', waterSchema);
