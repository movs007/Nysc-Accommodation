import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import Select from 'react-select';
import States from '../state';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    location: '',
    availabilityOfWater:'yes',
    distanceFromSchool: '',
    type: 'rent',
    roomType: 'Single Room',
    apartmentType: 'Bungalow',
    regularPrice: 100000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

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

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (e.target.id === 'Single Room' || e.target.id === 'Self Contain') {
      setFormData({
        ...formData,
        roomType: e.target.id,
      });
    }

    if (e.target.id === 'Bungalow' || e.target.id === 'Duplex') {
      setFormData({
        ...formData,
        apartmentType: e.target.id,
      });
    }
  
    if (e.target.id === 'yes' || e.target.id === 'no') {
      setFormData({
        ...formData,
        availabilityOfWater: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' || e.target.type === 'text' ||
      e.target.type === 'textarea'|| e.target.id === 'distanceFromSchool'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          state: selectedState.value, // Add selected state to formData
          university: selectedUniversity.value, // Add selected university to formData
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      console.log(data)
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Location'
            className='border p-3 rounded-lg'
            id='location'
            required
            onChange={handleChange}
            value={formData.location}
          />
          
          <select
        className='border p-3 rounded-lg w-full'
        id='distanceFromSchool'
        value={formData.distanceFromSchool}
        onChange={handleChange}
      >
        <option value=''>Select distance from school</option>
        <option value='5'>5min-10min</option>
        <option value='10'>10min-15min</option>
        <option value='15'>15min-20min</option>
        {/* Add more options as needed */}
      </select>

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
        </div>
      )}

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className=''>
              <div> 
                  <h2>What is your  room type?</h2>
                  <div className='flex'>
                  <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='Single Room'
                    // name='roomType'
                    className='w-5'
                    checked={formData.roomType === 'Single Room'}
                    onChange={handleChange}
                  />
                  <label className='ml-1 mr-4' htmlFor='roomTypeSingle'>Single Room</label>
                  </div>
                <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='Self Contain'
                    // name='roomType'
                    className='w-5'
                    checked={formData.roomType === 'Self Contain'}
                    onChange={handleChange}
                  />
                  <label className='ml-1 mr-4' htmlFor='roomTypeSelfContain'>Self Contain</label>
                </div>

                  </div>
             </div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <h2>What is your Apartment type?</h2>
                <div className='flex'>
                <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='Bungalow'
                    className='w-5'
                   
                    checked={formData.apartmentType === 'Bungalow'}
                    onChange={handleChange}
                  />
                  <label className='ml-1 mr-4' htmlFor='apartmentTypeBungalow'>Bungalow</label>
                  
                </div>
                <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='Duplex'
                    className='w-5'
                    
                    checked={formData.apartmentType === 'Duplex'}
                    onChange={handleChange}
                  />
                  <label className='ml-1 mr-4' htmlFor='apartmentTypeDuplex'>Duplex</label>
                </div>
                </div>
                 
                </div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <h2>Availability of Water</h2>
                <div className='flex'>
                <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='yes'
                    className='w-5'
                   
                    checked={formData.availabilityOfWater === 'yes'}
                    onChange={handleChange}
                  />
                  <label className='ml-1 mr-4' htmlFor='apartmentTypeBungalow'>yes</label>
                  
                </div>
                <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='no'
                    className='w-5'
                    
                    checked={formData.availabilityOfWater === 'no'}
                    onChange={handleChange}
                  />
                  <label className='ml-1 mr-4' htmlFor='apartmentTypeDuplex'>no</label>
                </div>
                </div>
                 
                </div>
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(NGN / yearly)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
