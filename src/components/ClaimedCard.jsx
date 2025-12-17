import toast from "react-hot-toast";
import { collectFood } from "../api/food";

const ClaimedCard = ({ food = {} }) => {
  const status = food.status || "available";

  const statusColor = {
    available: "text-green-600",
    claimed: "text-yellow-600",
    collected: "text-gray-500",
    expired: "text-red-600",
  };

  const color = statusColor[status] || "text-gray-500";

  const handleCollect = async () => {
    try {
      const res = await collectFood(food._id);
      toast.success("Thank you, food is collected");
    } catch (error) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="
      bg-white rounded-xl shadow-xl shadow-[#515739]
      flex flex-col
      overflow-hidden
      w-full
      max-w-sm
      mx-auto
    ">
      {/* Image */}
      <div className="w-full h-48 sm:h-52 md:h-56 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            food.food_image?.[0]?.url ||
            "https://via.placeholder.com/400x300?text=Food+Image"
          }
          alt={food.food_name || "Food image"}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <h3 className="text-gray-900 text-xl sm:text-2xl font-semibold">
          {food.food_name || "Unnamed Food"}
        </h3>

        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          {food.description || "No description"}
        </p>

        {/* Meta Info */}
        <div className="space-y-1.5 text-sm sm:text-base">
          <p>
            <b>Quantity :</b>{" "}
            <span className="ml-1">{food.quantity || "Not specified"}</span>
          </p>

          <p>
            <b>Expiry :</b>{" "}
            <span className="ml-1">
              {food.expiry_time
                ? new Date(food.expiry_time).toLocaleDateString()
                : "Not specified"}
            </span>
          </p>

          <p>
            <b>Status :</b>{" "}
            <span className={`ml-1 font-medium ${color}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </p>
        </div>

        {/* Action */}
        <button
          disabled={food.status !== "claimed"}
          onClick={handleCollect}
          className="
            mt-3
            w-full
            bg-green-600
            disabled:bg-gray-300
            text-white
            py-2.5
            rounded-lg
            font-medium
            transition
            cursor-pointer
          "
        >
          Collect
        </button>
      </div>
    </div>
  );
};

export default ClaimedCard;
