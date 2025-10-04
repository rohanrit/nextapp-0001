import SigninForm from './SigninForm';

export default function SigninPage() {
  return (
    <div className='max-w-md mx-auto mt-8 p-6 border rounded bg-white shadow'>
      <h1 className='text-2xl mb-4'>Sign In</h1>
      <SigninForm />
    </div>
  );
}
