import React from "react";

function Card1({ title, subtext, img, status, disabled, is_error }) {
  return (
    <div
      className={
        disabled
          ? "rounded-3xl  w-full bg-[#c6cce9]  items-center p-4 mb-3"
          : "rounded-3xl  w-full bg-[#7a92fb]   items-center p-4 mb-3"
      }
    >
      <div className="flex justify-between w-full">
        <div className="text-left pt-4">
          <p className="text-white font-semibold text-lg">{title} </p>
          {subtext && (
            <p className="text-white font-thin text-sm ">{subtext}</p>
          )}
        </div>

        <div className="pt-2">
          <p className="text-white font-thin text-sm ">{status}</p>
          <img src={img} alt="" />
        </div>
      </div>

      {is_error && (
        <p className="text-red-500 font-semibold  text-xs">
          Administrative forms not needed yet
        </p>
      )}
    </div>
  );
}

export default Card1;
