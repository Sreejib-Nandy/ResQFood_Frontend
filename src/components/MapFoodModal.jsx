import { claimFood } from "../api/food";
import { X } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

const MapFoodModal = ({ food, onClose, refresh }) => {
  const handleClaim = async () => {
    await claimFood(food._id);
    toast.success(`"${food.food_name} is claimed successfully"`);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center px-3">
      <div className="
        bg-white
        w-full max-w-md
        rounded-xl
        shadow-xl
        overflow-hidden
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b p-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Food Details
          </h2>
          <X
            className="cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={onClose}
          />
        </div>

        {/* Image */}
        <div className="w-full h-48 sm:h-52 overflow-hidden">
          <img
            src={
              food.food_image?.[0]?.url ||
              "https://via.placeholder.com/400x300?text=Food+Image"
            }
            alt={food.food_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {food.food_name}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            {food.description || "No description available"}
          </p>

          <div className="text-sm space-y-1">
            <p>
              <strong>Quantity:</strong>{" "}
              <span className="ml-1">{food.quantity}</span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="ml-1 capitalize">{food.status}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 border-t flex gap-3">
          <button
            disabled={food.status !== "available"}
            onClick={handleClaim}
            className="
              flex-1
              bg-[#7da30be6]
              disabled:bg-gray-300
              text-white
              py-2.5
              rounded-lg
              font-medium
              transition
              cursor-pointer
            "
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapFoodModal;
