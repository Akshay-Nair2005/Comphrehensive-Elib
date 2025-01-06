import React from "react";
import { Link } from "react-router-dom";

const Hbooklisting = ({ hnovel }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-10 px-4 max-md:px-10 max-lg:px-20 max-md:h-full">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-96 bg-black/30 overflow-hidden border border-card rounded-lg transition-transform duration-300 hover:scale-105 group">
        <img
          src={hnovel.hbook_novelimg}
          alt="Book Cover"
          className="w-full h-full object-cover"
        />
        {/* Sliding Popup */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#383838] bg-opacity-70 text-[#E0E0E0] flex flex-col items-center justify-center text-sm sm:text-base md:text-lg transform translate-y-full transition-transform duration-300 ease-in group-hover:translate-y-0 text-center">
          <div className=" w-full text-center text-2xl font-bold text-[#E0E0E0]">
            {hnovel.hbook_name}
          </div>
          <Link
            to={`/hdesc/${hnovel.$id}`}
            className="mt-4 bg-button text-button text-center py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transition"
          >
            Book Description
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hbooklisting;
