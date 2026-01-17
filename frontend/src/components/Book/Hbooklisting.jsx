import React from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaFeatherAlt, FaPenNib } from "react-icons/fa";

const Hbooklisting = ({ hnovel }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-6 px-2">
      <div className="group relative w-full max-w-[280px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
        {/* Book Cover Container */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={hnovel.hbook_novelimg}
            alt={hnovel.hbook_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Genre Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#5E3023] text-xs font-semibold rounded-full shadow-sm">
              {hnovel.hbook_genre?.split(",")[0]?.trim() || "Novel"}
            </span>
          </div>

          {/* Community Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 bg-[#5E3023]/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-sm flex items-center gap-1">
              <FaPenNib className="text-[10px]" />
              Community
            </span>
          </div>

          {/* Hover Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <h3 className="text-white text-center font-serif font-bold text-xl mb-3 line-clamp-2 drop-shadow-lg">
              {hnovel.hbook_name}
            </h3>
            <Link
              to={`/hdesc/${hnovel.$id}`}
              className="flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#5E3023] px-5 py-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-300 font-medium text-sm"
            >
              <FaBookOpen className="text-xs" />
              View Details
            </Link>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-5 bg-gradient-to-b from-white to-gray-50">
          <h3 className="font-serif font-bold text-gray-800 text-base line-clamp-1 group-hover:text-[#5E3023] transition-colors">
            {hnovel.hbook_name}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <FaFeatherAlt className="text-[#5E3023]/50 text-xs" />
            <span className="italic line-clamp-1">{hnovel.hbook_author || "Community Author"}</span>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-[#5E3023]/20 via-[#5E3023] to-[#5E3023]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
      </div>
    </div>
  );
};

export default Hbooklisting;
