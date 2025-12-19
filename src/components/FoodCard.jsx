import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

const FoodCard = ({ food = {}, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const status = food.status || "available";

  const statusColor = {
    available: "text-green-600",
    claimed: "text-yellow-600",
    collected: "text-gray-500",
    expired: "text-red-600",
  };

  const color = statusColor[status] || "text-gray-500";

  const formatToIST = (iso) => {
    if (!iso) return "";

    const date = new Date(iso);

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl shadow-[#515739] text-sm max-w-90 max-md:m-auto">
      <img className="rounded-md max-h-60 w-full object-cover" src={food.food_image?.[0]?.url ||
        "https://via.placeholder.com/400x300?text=Food+Image"} alt={food.food_name || "Food image"} />
      <h3 className="text-gray-900 text-2xl font-semibold ml-1 mt-2">{food.food_name || "Unnamed Food"}</h3>
      <p className="text-gray-500 mt-1.5 ml-1 text-sm">{food.description || "No description"}</p>
      <div className="space-y-2.5 pl-1 pt-2">
        <p><b>Quantity :</b> {food.quantity || "Not specified"}</p>
        <p>
          <b>Expiry :</b>{" "}
          {food.expiry_time
            ? formatToIST(food.expiry_time)
            : "Not specified"}
        </p>
        <p>
          <b>Status :</b>{" "}
          <span className={color}>
            {food.status.charAt(0).toUpperCase() + food.status.slice(1)}
          </span>
        </p>
      </div>
      <div className="flex gap-3 mt-3">
        <button disabled={food.status !== "available"}
          onClick={() => { onEdit(food), scrollTo(0, 0) }}
          className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 ml-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Pencil size={16} /> Edit
        </button>

        <button disabled={food.status !== "available"}
          onClick={() => { setShowDeleteModal(true) }}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white rounded-lg py-2 hover:bg-red-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} /> Delete
        </button>

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => onDelete(food._id)}
        />
      </div>
    </div>
  );
};

export default FoodCard;
