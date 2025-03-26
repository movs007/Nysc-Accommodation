import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const CommentForm = ({ propertyId, onCommentSubmit }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate input fields
        if (!comment || !rating) return;
    
        setLoading(true);
        setError(null);
    
        try {
          const response = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              propertyId,
              text: comment,
              rating,
              userId: currentUser._id, 
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to submit comment');
          }
    
          // Reset form fields
          setComment('');
          setRating(0);
          setHoverRating(0);
          onCommentSubmit();
        } catch (error) {
          setError(error.message || 'Failed to submit comment');
        } finally {
          setLoading(false);
        }
      };

  const handleRatingChange = (value) => {
    setRating(value);
  };


  const handleHoverRatingChange = (value) => {
    setHoverRating(value);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <h1 className='font-bold text-xl'>Comments & Review</h1>
        {error && <p>{error}</p>}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className='w-full border p-3 rounded-lg'
        placeholder="Write your comment here..."
      />
      <div className='flex '>
        {[...Array(5)].map((_, index) => {
           const ratingValue = index + 1;
          const isSelected = ratingValue <= rating;
          const isHovered = ratingValue <= hoverRating;
          return (
            <label key={index}>
              <input
                type="radio"
                style={{display:'none'}}
                name="rating"
                value={ratingValue}
                onClick={() => handleRatingChange(ratingValue)}
              />
              <FaStar
                size={20}
                className="star"
                color={(isSelected || isHovered) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => handleHoverRatingChange(ratingValue)}
                onMouseLeave={() => handleHoverRatingChange(rating)}
                
                style={{
                    // marginRight: 10,
                    cursor: "pointer"
                  }}
              />
            </label>
          );
        })}
      </div>
      {/* <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        min="1"
        max="5"
        placeholder="Rating (1-5)"
      /> */}
      <button
        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
        type="submit"
        disabled={loading}>
        Submit
        </button>
    </form>
  );
};

export default CommentForm;
