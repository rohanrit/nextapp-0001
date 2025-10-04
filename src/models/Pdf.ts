import mongoose, { Document } from 'mongoose';

export interface IPdf extends Document {
  owner: mongoose.Types.ObjectId;
  filename: string;
  data: Buffer;
  contentType: string;
  size: number;
  uploadedAt: Date;
}

const PdfSchema = new mongoose.Schema<IPdf>({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pdf || mongoose.model<IPdf>('Pdf', PdfSchema);
