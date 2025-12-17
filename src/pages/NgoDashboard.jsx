import React, { useEffect, useState } from "react";
import { claimedFoodPosts } from "../api/food";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import ClaimedCard from "../components/ClaimedCard";
import socket from "../socket/socket";

const NgoDashboard = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch claimed foods
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

  useEffect(() => {
    fetchFoods();
  }, [user?.id]);

  // Socket listeners
  useEffect(() => {
    if (!user?.id || !socket.connected) return;

    const handleFoodExpired = ({ ids }) => {
      if (!ids?.length) return;
      setFoods((prev) =>
        prev.map((food) =>
          ids.includes(food._id) ? { ...food, status: "expired" } : food
        )
      );
    };

    const handleFoodUnavailable = ({ foodId }) => {
      setFoods((prev) => prev.filter((food) => food._id !== foodId));
    };

    socket.on("food_expired", handleFoodExpired);
    socket.on("food_unavailable", handleFoodUnavailable);

    return () => {
      socket.off("food_expired", handleFoodExpired);
      socket.off("food_unavailable", handleFoodUnavailable);
    };
  }, [user?.id]);

  if (loading) return <Spinner />;

  return (
    <div className="pt-24 px-6 pb-10 md:px-20">
      {foods.length !== 0 && (
        <h1 className="text-2xl font-semibold mb-6">
          Your Claimed & Collected Food Posts
        </h1>
      )}

      {foods.length === 0 ? (
        <div className="h-[70vh] flex items-center justify-center max-md:text-2xl text-4xl">
          No food posts claimed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <ClaimedCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;
