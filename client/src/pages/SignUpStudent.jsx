import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import States from '../state';
import OAuth from '../components/OAuth';
// import StudentPreferenceForm from '../components/StudentPreferenceForm'

export default function SignUpStudent() {
  const formArray = [1, 2];
  const [formData, setFormData] = useState({});
  // const [formNo, setFormNo] = useState(formArray[0])
  const [selectedState, setSelectedState] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedUniversity(null); // Reset university when state changes
  };

  const handleUniversityChange = (selectedOption) => {
    setSelectedUniversity(selectedOption);
  };

  const formStyles = {
    control: (styles) => ({...styles, padding:"5px", borderRadius:"8px", borderWidth:"1px"})
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // const next = () => {
  //   if (formNo === 1) {
  //     setFormNo(formNo + 1)
  //   }
  //   // else if (formNo === 2 && state.varsity && state.session && state.address) {
  //   //   setFormNo(formNo + 1)
  //   // } else {
  //   //   toast.error('Please fillup all input field')
  //   // }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataWithStateAndUniversity = {
        ...formData,
        state: selectedState.value, // Add selected state to formData
        university: selectedUniversity.value // Add selected university to formData
      };
      console.log(formDataWithStateAndUniversity)
      const res = await fetch('/api/auth/signup/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithStateAndUniversity),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        // setError(data.message);
        toast.data.message;
        return;
      }
      setLoading(false);
      setError(null);
      // next();
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
      
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
        <div>
         <h1 className='text-3xl text-center font-semibold my-7'>Register As Student</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

      <div>
        <Select
          value={selectedState}
          onChange={handleStateChange}
          options={States}
          styles={formStyles}
          placeholder={"Select State..."}
        />
      </div>
      {selectedState && (
        <div>
          <Select
            value={selectedUniversity}
            onChange={handleUniversityChange}
            options={selectedState.university.map((university) => ({ value: university, label: university }))}
            styles={formStyles}
            placeholder={"Select University..."}
          />
          <input
          type='text'
          placeholder='Reg No'
          className='border w-full p-3 mt-3 rounded-lg'
          id='regno'
          onChange={handleChange}
        />
        </div>
      )}

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
       </div>
    </div>
  );
}
