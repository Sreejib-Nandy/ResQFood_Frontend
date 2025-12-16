import React, { useEffect, useState } from "react";
import { claimedFoodPosts } from "../api/food";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import ClaimedCard from "../components/ClaimedCard";
import socket from "../socket/socket";

const NgoDashboard = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const res = await claimedFoodPosts();
      setFoods(res.data.data || []);
    } catch (error) {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!socket) return;

  const handleFoodExpired = ({ ids }) => {
    if (!ids?.length) return;

    setFoods((prev) =>
      prev.map((food) =>
        ids.includes(food._id)
          ? { ...food, status: "expired" }
          : food
      )
    );
  };

  const handleFoodCollected = ({ foodId }) => {
    setFoods((prev) =>
      prev.map((food) =>
        food._id === foodId
          ? { ...food, status: "collected" }
          : food
      )
    );

    toast.success("Food collected successfully");
  };

  socket.on("food_expired", handleFoodExpired);
  socket.on("food_collected_owner", handleFoodCollected);

  return () => {
    socket.off("food_expired", handleFoodExpired);
    socket.off("food_collected_owner", handleFoodCollected);
  };
}, [socket]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    fetchFoods();
  }, [user?.id]);

  if (loading) return <Spinner />;

  return (
    <>
      <div className="pt-24 px-6 pb-10 md:px-20">
        <div className="flex justify-between items-center mb-6">
          {foods.length !== 0 && <h1 className="text-2xl font-semibold">Your Claimed & Collected Food Posts</h1>}
        </div>

        {foods.length === 0 ? (
          <div className="h-[70vh] flex items-center justify-center text-4xl max-md:text-2xl">
          <p className="text-blue-950/80 font-semibold">No food posts claimed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <ClaimedCard
                key={food._id}
                food={food}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};


export default NgoDashboard;

