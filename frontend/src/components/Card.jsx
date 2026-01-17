import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, category, price, id, reviews }) => {
  const navigate = useNavigate();

  const calculateAverageRating = (reviews = []) => {
    if (!reviews.length) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md capitalize">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h2 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>

        {/* Meta */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <span className="text-lg font-extrabold text-slate-900">
            ₹{price}
          </span>

          {/* Rating */}
          <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
            <FaStar className="text-yellow-400" />
            {avgRating}
            <span className="text-gray-400 font-medium">
              ({reviews?.length || 0})
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
