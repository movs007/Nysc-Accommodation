import React from "react";

const PopUp = ({ children, trigger, setTrigger, size }) => {
  return trigger ? (
    
    <div className="popup">
      <div className={size}>
        <button
          onClick={() => setTrigger(false)}
          className="close-btn font-lg text-xl text-primary-black"
        >
          x
        </button>
        <div className="popup-content">{children}</div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default PopUp;
