import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const CommentList = ({ propertyId, reloadComments }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/comment/get/${propertyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        console.log(data)
        setComments(data);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to fetch comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [propertyId, reloadComments]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {comments.length > 0 ? (
        <div>
          {comments.map((comment) => (
          <div className='mb-4 p-4 border border-gray-300 rounded-lg' key={comment.id}>
              <div className='flex'>
              <img className='w-8 rounded-full' src={comment.userId.avatar} alt="User" />
            <p className='font-bold ml-2' >{comment.userId.username}</p>
              </div>
            <p className='ml-10 '>{comment.text}</p>
            <div className='flex ml-10'>
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                const isSelected = ratingValue <= comment.rating;
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
        ))}
        </div>
      ) :(
        <div className='pt-10 text-2xl font-semibold text-gray-400'>NO COMMENT</div>
       )}
    </div>
  );
};

export default CommentList;
