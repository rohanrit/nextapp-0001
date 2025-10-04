import { connectMongo } from './mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export async function seedDummyUser() {
  await connectMongo();

  const existing = await User.findOne({ email: 'testuser@example.com' });
  if (existing) return;

  const password = 'Password123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await User.create({
    name: 'Test User',
    email: 'testuser@example.com',
    passwordHash,
  });

  console.log('Dummy user created: testuser@example.com / Password123');
}

// Auto-run when script executed
if (require.main === module) {
  seedDummyUser().then(() => process.exit(0));
}
