import React, { useEffect, useState } from "react";
import { claimedFoodPosts } from "../api/food";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import ClaimedCard from "../components/ClaimedCard";
import socket from "../socket/socket";
import toast from "react-hot-toast";

const NgoDashboard = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch claimed foods by this NGO
  const fetchFoods = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await claimedFoodPosts();
      setFoods(res.data.data || []);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + user change
  useEffect(() => {
    fetchFoods();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    // Handler for food claimed
    const handleFoodClaimed = ({ ngoId, foodName }) => {
      console.log("NGO received: food_claimed_ngo", { ngoId, foodName });
      
      // Check if this event is for current user
      if (ngoId === user.id) {
        toast.success(`You claimed "${foodName}" successfully`);
        fetchFoods(); // Refresh list
      }
    };

    // Handler for food collected
    const handleFoodCollected = ({ ngoId, foodName }) => {
      console.log("NGO received: food_collected_ngo", { ngoId, foodName });
      
      // Check if this event is for current user
      if (ngoId === user.id) {
        toast.success(`You collected "${foodName}" successfully`);
        fetchFoods();
      }
    };

    // Handler for food expired
    const handleFoodExpired = (data) => {
      console.log("NGO received: food_expired", data);
      fetchFoods(); 
    };

    // Handler for food unavailable (claimed by someone else)
    const handleFoodUnavailable = (data) => {
      console.log("NGO received: food_unavailable", data);
      fetchFoods(); 
    };

    // Attach listeners
    socket.on("food_claimed_ngo", handleFoodClaimed);
    socket.on("food_collected_ngo", handleFoodCollected);
    socket.on("food_expired", handleFoodExpired);
    socket.on("food_unavailable", handleFoodUnavailable);

    console.log("NGO socket listeners attached");

    // Cleanup
    return () => {
      socket.off("food_claimed_ngo", handleFoodClaimed);
      socket.off("food_collected_ngo", handleFoodCollected);
      socket.off("food_expired", handleFoodExpired);
      socket.off("food_unavailable", handleFoodUnavailable);
      console.log("NGO socket listeners removed");
    };
  }, [user?.id]); // Include user so handlers always have current user

  if (loading) return <Spinner />;

  return (
    <div className="pt-24 px-6 pb-10 md:px-20">
      {foods.length !== 0 && (
        <h1 className="text-2xl font-semibold mb-6">
          Your Claimed & Collected Food Posts
        </h1>
      )}

      {foods.length === 0 ? (
        <div className="h-[70vh] flex items-center justify-center max-md:text-2xl text-4xl text-[#211d1d] font-semibold">
          No food posts claimed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <ClaimedCard key={food._id} food={food} refresh={fetchFoods} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;

