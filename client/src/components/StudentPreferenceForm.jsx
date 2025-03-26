import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function StudentPreferenceForm({setTrigger}) {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    regularPrice: '',
    location: '',
    distanceFromSchool: '',
    availabilityOfWater: 'Yes',
    roomType: 'Single Room',
    apartmentType: 'Bungalow'
  });
 

  const handleChange = (e) => {
    if (e.target.id === 'Yes' || e.target.id === 'No') {
      setPreferences({
        ...preferences,
        availabilityOfWater: e.target.id,
      });
    }

    if (e.target.id === 'Single Room' || e.target.id === 'Self Contain') {
      setPreferences({
        ...preferences,
        roomType: e.target.id,
      });
    }

    if (e.target.id === 'Bungalow' || e.target.id === 'Duplex') {
      setPreferences({
        ...preferences,
        apartmentType: e.target.id,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.id === 'distanceFromSchool'
    ) {
      setPreferences({
        ...preferences,
        [e.target.id]: e.target.value,
      });
    }

   
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
    const res = await fetch(`/api/preference/create/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...preferences,
        userRef: currentUser._id,
      }),
    }); 
    
      if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await res.json();
      setLoading(false);
      setError(null);
      if (data.success === false) {
        setError(data.message);
      }
      console.log(error);
      
      navigate('/search')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>What is your Prefered Rental Option?</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='w-full'>
      <h2>What is your budget?</h2>
      <input
        type='number'
        placeholder='Budget'
        className='border p-3 rounded-lg w-full'
        id='regularPrice'
        value={preferences.regularPrice}
        onChange={handleChange}
      />
      </div>
      <div className='w-full'>
      <h2>Where is your Prefered location?</h2>
      <input
        type='text'
        placeholder='Location'
        className='border p-3 rounded-lg w-full'
        id='location'
        value={preferences.location}
        onChange={handleChange}
      />
      </div>
      <div className='w-full'>
      <h2>Select your Prefered distance from school</h2>
      <select
        className='border p-3 rounded-lg w-full'
        id='distanceFromSchool'
        value={preferences.distanceFromSchool}
        onChange={handleChange}
      >
        <option value=''>Select distance from school</option>
        <option value='5'>5min-10min</option>
        <option value='10'>10min-15min</option>
        <option value='15'>15min-20min</option>
        {/* Add more options as needed */}
      </select>

      </div>
      
      

      <div>
        <h2>Availability of water</h2>
        <input
          type="checkbox"
          style={{display:"inline"}}
          id='Yes'
          name='availabilityOfWater'
          value='Yes'
          checked={preferences.availabilityOfWater === 'Yes'}
          onChange={handleChange}
        />
        <label className='ml-1 mr-4' htmlFor='waterAvailabilityYes'>Yes</label>
        <input
          type='checkbox'
          style={{display:"inline"}}
          id='No'
          name='availabilityOfWater'
          value='No'
          checked={preferences.availabilityOfWater === 'No'}
          onChange={handleChange}
        />
        <label className='ml-1 mr-4' htmlFor='waterAvailabilityNo'>No</label>
      </div>
      <div> 
        <h2>What is your preferded room type?</h2>
        <input
          type='checkbox'
          style={{display:"inline"}}
          id='Single Room'
          name='roomType'
          value='Single Room'
          checked={preferences.roomType === 'Single Room'}
          onChange={handleChange}
        />
        <label className='ml-1 mr-4' htmlFor='roomTypeSingle'>Single Room</label>
        <input
          type='checkbox'
          style={{display:"inline"}}
          id='Self Contain'
          name='roomType'
          value='Self Contain'
          checked={preferences.roomType === 'Self Contain'}
          onChange={handleChange}
        />
        <label className='ml-1 mr-4' htmlFor='roomTypeSelfContain'>Self Contain</label>
      </div>
      <div>
      <h2>What is your preferded Apartment type?</h2>
        <input
          type='checkbox'
          style={{display:"inline"}}
          id='Bungalow'
          name='apartmentType'
          value='Bungalow'
          checked={preferences.apartmentType === 'Bungalow'}
          onChange={handleChange}
        />
        <label className='ml-1 mr-4' htmlFor='apartmentTypeBungalow'>Bungalow</label>
        <input
          type='checkbox'
          style={{display:"inline"}}
          id='Duplex'
          name='apartmentType'
          value='Duplex'
          checked={preferences.apartmentType === 'Duplex'}
          onChange={handleChange}
        />
        <label className='ml-1 mr-4' htmlFor='apartmentTypeDuplex'>Duplex</label>
      </div>
      <button
        disabled={loading}
        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </form>
      
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}

