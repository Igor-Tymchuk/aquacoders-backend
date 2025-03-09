import { model, Schema } from 'mongoose';
import {GENDER_TYPES} from '../../constants/index.js'

const usersSchema = new Schema(
  {
    name: {
      type: String,
      default: '',
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: GENDER_TYPES,
      default: 'none',
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
      required: true,
    },
    dailySportTime: {
      type: Number,
      default: 0,
      required: true,
    },
    dailyNorm: {
      type: Number,
      default: 1500,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
