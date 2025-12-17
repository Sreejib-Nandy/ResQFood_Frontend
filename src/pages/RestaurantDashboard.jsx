import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import CreateFood from "../components/CreateFood";
import FoodCard from "../components/FoodCard";
import { getFoodPosts, deleteFood } from "../api/food";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import EditFood from "../components/EditFood";
import socket from "../socket/socket";

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editFood, setEditFood] = useState(null);

  // Fetch foods
  const fetchFoods = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await getFoodPosts(user._id);
      setFoods(res.data.data || []);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [user?.id]);

  // Socket listeners
  useEffect(() => {
    if (!user?.id || !socket.connected) return;

    const handleFoodClaimed = ({ foodId }) => {
      let claimedFoodName = "";

      setFoods((prev) =>
        prev.map((food) => {
          if (food._id === foodId) {
            claimedFoodName = food.food_name;
            return { ...food, status: "claimed" };
          }
          return food;
        })
      );

      if (claimedFoodName) {
        toast.success(`Your "${claimedFoodName}" was claimed`);
      }
    };

    const handleFoodCollected = ({ foodId }) => {
      setFoods((prev) =>
        prev.map((food) =>
          food._id === foodId ? { ...food, status: "collected" } : food
        )
      );
      toast.success("Food collected successfully");
    };

    const handleFoodExpired = ({ ids }) => {
      if (!ids?.length) return;
      setFoods((prev) =>
        prev.map((food) =>
          ids.includes(food._id) ? { ...food, status: "expired" } : food
        )
      );
    };

    socket.on("food_claimed_owner", handleFoodClaimed);
    socket.on("food_collected_owner", handleFoodCollected);
    socket.on("food_expired", handleFoodExpired);

    return () => {
      socket.off("food_claimed_owner", handleFoodClaimed);
      socket.off("food_collected_owner", handleFoodCollected);
      socket.off("food_expired", handleFoodExpired);
    };
  }, [user?.id]);

  const handleDelete = async (id) => {
    try {
      await deleteFood(id);
      toast.success("Food post deleted successfully");
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="pt-24 px-6 pb-10 md:px-20">
      <div className="flex justify-between items-center mb-6">
        {foods.length !== 0 && (
          <h1 className="text-2xl font-semibold">Your Food Posts</h1>
        )}
        <button
          onClick={() => setShowCreate(true)}
          className="px-6 flex items-center gap-1 text-sm py-3 rounded-full bg-[#d5f083]"
        >
          <Plus size={18} /> Create
        </button>
      </div>

      {foods.length === 0 ? (
        <div className="h-[70vh] flex items-center justify-center text-2xl">
          No food posts created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onDelete={handleDelete}
              onEdit={(food) => setEditFood(food)}
            />
          ))}
        </div>
      )}

      <CreateFood
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchFoods}
      />

      <EditFood
        open={!!editFood}
        food={editFood}
        onClose={() => setEditFood(null)}
        onUpdated={fetchFoods}
      />
    </div>
  );
};

export default RestaurantDashboard;
