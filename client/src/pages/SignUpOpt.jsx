import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUpOpt() {
    const [loading, setLoading] = useState(false);
  return (
    <div>
        <h1 className='text-3xl text-center font-semibold my-9 mt-7'>Sign Up</h1>
        <div className='flex flex-col h-60 justify-center items-center'>
            <div className='w-2/6 mb-3'>
            <Link to={'/sign-up-student'}>
            <button
          disabled={loading}
          className='bg-slate-700 w-full text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Register As Copper'}
        </button>
            </Link>
            
            </div>
            <div>
                <span className='mr-1'>------</span>
                <span>OR</span>
                <span className='ml-1'>------</span>
            </div>
            <div className='w-2/6 mt-3'>
            <Link to={'/sign-up-landlord'}>
            <button
          disabled={loading}
          className='bg-red-700 w-full text-white p-3 rounded-lg uppercase hover:opacity-95'        >
          {loading ? 'Loading...' : 'Register As LandLord'}
        </button>
            </Link>
            
            </div>
        </div>
    </div>
  )
}
