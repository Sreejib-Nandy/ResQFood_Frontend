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
          await collectFood(food._id);
      };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl shadow-[#515739] text-sm max-w-90 max-md:m-auto">
      <img className="rounded-md max-h-60 w-full object-cover" src={food.food_image?.[0]?.url ||
        "https://via.placeholder.com/400x300?text=Food+Image"} alt={food.food_name || "Food image"} />
      <h3 className="text-gray-900 text-2xl font-semibold ml-2 mt-2">{food.food_name || "Unnamed Food"}</h3>
      <p className="text-gray-500 mt-1.5 ml-2 text-sm md:text-base">{food.description || "No description"}</p>
      <div className="space-y-2 pl-1.5 pt-2">
        <p><b>Quantity :</b> {food.quantity || "Not specified"}</p>
        <p>
          <b>Expiry :</b>{" "}
          {food.expiry_time
            ? new Date(food.expiry_time).toLocaleDateString()
            : "Not specified"}
        </p>
        <p>
          <b>Status :</b>{" "}
          <span className={color}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </p>
        <button
          disabled={food.status !== "claimed"}
          onClick={handleCollect}
          className="flex-1 bg-green-600 disabled:bg-gray-300 text-white py-2 rounded"
        >
          Collect
        </button>
      </div>
    </div>
  );
};

export default ClaimedCard;
