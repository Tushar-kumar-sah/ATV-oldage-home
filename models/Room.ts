import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBed {
  bedNumber: string;
  isOccupied: boolean;
  residentId?: mongoose.Types.ObjectId;
  residentName?: string;
}

export interface IRoom extends Document {
  _id: mongoose.Types.ObjectId;
  roomNumber: string;
  floor: number;
  roomType: 'Single' | 'Double Sharing' | 'Triple Sharing' | 'Special Care';
  capacity: number;
  occupiedBeds: number;
  beds: IBed[];
  monthlyRate: number;
  amenities: string[];
  status: 'Available' | 'Full' | 'Maintenance';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BedSchema = new Schema<IBed>(
  {
    bedNumber: { type: String, required: true },
    isOccupied: { type: Boolean, default: false },
    residentId: { type: Schema.Types.ObjectId, ref: 'Resident' },
    residentName: { type: String, default: '' },
  },
  { _id: false }
);

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      default: 1,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double Sharing', 'Triple Sharing', 'Special Care'],
      default: 'Double Sharing',
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
    },
    beds: [BedSchema],
    monthlyRate: {
      type: Number,
      required: true,
      default: 15000,
    },
    amenities: [{ type: String }],
    status: {
      type: String,
      enum: ['Available', 'Full', 'Maintenance'],
      default: 'Available',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

RoomSchema.index({ floor: 1, status: 1 });

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
