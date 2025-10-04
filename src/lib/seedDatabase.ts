import { connectMongo } from './mongoose';
import User from '../models/User';
import Pdf from '../models/Pdf';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import fs from 'fs';

async function seedDatabase() {
  await connectMongo();

  // Create dummy user
  let user = await User.findOne({ email: 'testuser@example.com' });
  if (!user) {
    const passwordHash = await bcrypt.hash('Password123', 10);
    user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      passwordHash
    });
    console.log('User created');
  }

  // Create dummy PDF
  const pdfFilePath = './dummy.pdf'; // replace with an actual PDF path
  if (!fs.existsSync(pdfFilePath)) {
    console.log('No PDF file found for seeding');
    return;
  }

  const pdfData = fs.readFileSync(pdfFilePath);
  await Pdf.create({
    filename: 'example.pdf',
    contentType: 'application/pdf',
    data: pdfData,
    owner: user._id,
  });

  console.log('PDF inserted');
}

seedDatabase().then(() => process.exit(0));
