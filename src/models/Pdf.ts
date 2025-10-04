import mongoose, { Schema, Document } from 'mongoose';

export interface IPdf extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PdfSchema: Schema = new Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pdf || mongoose.model<IPdf>('Pdf', PdfSchema);
