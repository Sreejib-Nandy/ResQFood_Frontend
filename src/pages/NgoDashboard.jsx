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

// Socket listeners = REFETCH ONLY
useEffect(() => {
  if (!user?.id) return;

  const refetch = () => {
    console.log("NGO refetch triggered by socket");
    fetchFoods();
  };

  socket.on("food_claimed_ngo", refetch);
  socket.on("food_collected_ngo", refetch);
  socket.on("food_expired", refetch);
  socket.on("food_unavailable", refetch);

  console.log("NGO socket listeners attached");

  return () => {
    socket.off("food_claimed_ngo", refetch);
    socket.off("food_collected_ngo", refetch);
    socket.off("food_expired", refetch);
    socket.off("food_unavailable", refetch);
    console.log("NGO socket listeners removed");
  };
}, []);

useEffect(() => {
  const toastClaimed = ({ ngoId, foodName }) => {
    if (ngoId === user?._id) {
      toast.success(`You claimed "${foodName}" successfully`);
    }
  };

  const toastCollected = ({ ngoId, foodName }) => {
    if (ngoId === user?._id) {
      toast.success(`You collected "${foodName}" successfully`);
    }
  };

  socket.on("food_claimed_ngo", toastClaimed);
  socket.on("food_collected_ngo", toastCollected);

  return () => {
    socket.off("food_claimed_ngo", toastClaimed);
    socket.off("food_collected_ngo", toastCollected);
  };
}, []);

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
            <ClaimedCard key={food._id} food={food} refresh={fetchFoods}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;

