import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <div className='max-w-md mx-auto mt-8 p-6 border rounded bg-white shadow'>
      <h1 className='text-2xl mb-4'>Sign Up</h1>
      <SignupForm />
    </div>
  );
}
