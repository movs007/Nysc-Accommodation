import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function Rating({ propertyId }) {
    const [cumulativeRating, setCumulativeRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
    const fetchComments = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comment/get/${propertyId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch comments');
          }
          const data = await response.json();
        //   console.log(data.length);
          setLoading(false);
  
          // Calculate Cumulative Rating
          let totalRating = 0;
          data.forEach(comment => {
            totalRating += comment.rating;
          });
        //   console.log(totalRating);
          const averageRating = data.length > 0 ? totalRating / data.length : 0;
          setCumulativeRating(averageRating);
        //   console.log(cumulativeRating);
        } catch (error) {
          setError(error.message || 'Failed to fetch comments');
          setLoading(false);
        }
      };
  
      fetchComments();
    }, [propertyId]);
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
    }
  return (
    <div>
        <div className='flex'>
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              const isSelected = ratingValue <= cumulativeRating
              return (
                <label key={index}>
                  <input
                    type="radio"
                    style={{display:'none'}}
                    name="rating"
                    value={ratingValue}
                    disabled
                  />
                  <FaStar
                    size={20}
                    className="star"
                    color={(isSelected) ? "#ffc107" : "#e4e5e9"}
                  />
                </label>
              );
            })}
          </div>

    </div>
  )
}
