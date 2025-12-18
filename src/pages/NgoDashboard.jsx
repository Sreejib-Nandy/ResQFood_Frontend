// import React, { useEffect, useState } from "react";
// import { claimedFoodPosts } from "../api/food";
// import Spinner from "../components/Spinner";
// import { useAuth } from "../context/AuthContext";
// import ClaimedCard from "../components/ClaimedCard";
// import socket from "../socket/socket";

// const NgoDashboard = () => {
//   const { user } = useAuth();
//   const [foods, setFoods] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch claimed foods
//   const fetchFoods = async () => {
//     if (!user?.id) return;
//     try {
//       setLoading(true);
//       const res = await claimedFoodPosts();
//       setFoods(res.data.data || []);
//     } catch {
//       setFoods([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFoods();
//   }, [user?.id]);

//   // Socket listeners
//   useEffect(() => {
//     if (!user?.id) return;

//     const handleFoodExpired = ({ ids }) => {
//       if (!ids?.length) return;
//       setFoods((prev) =>
//         prev.map((food) =>
//           ids.includes(food._id) ? { ...food, status: "expired" } : food
//         )
//       );
//     };

//     const handleFoodCollected = ({ foodId }) => {
//     setFoods(prev =>
//       prev.map(food =>
//         food._id === foodId
//           ? { ...food, status: "collected" }
//           : food
//       )
//     );
//   };

//     const handleFoodUnavailable = ({ foodId }) => {
//       setFoods((prev) => prev.filter((food) => food._id !== foodId));
//     };

//     socket.on("food_expired", handleFoodExpired);
//     socket.on("food_unavailable", handleFoodUnavailable);
//     socket.on("food_collected_ngo", handleFoodCollected);

//     return () => {
//       socket.off("food_expired", handleFoodExpired);
//       socket.off("food_unavailable", handleFoodUnavailable);
//       socket.off("food_collected_ngo", handleFoodCollected);
//     };
//   }, [user?.id,socket]);

//   if (loading) return <Spinner />;

//   return (
//     <div className="pt-24 px-6 pb-10 md:px-20">
//       {foods.length !== 0 && (
//         <h1 className="text-2xl font-semibold mb-6">
//           Your Claimed & Collected Food Posts
//         </h1>
//       )}

//       {foods.length === 0 ? (
//         <div className="h-[70vh] flex items-center justify-center max-md:text-2xl text-4xl text-[#211d1d] font-semibold">
//           No food posts claimed yet.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {foods.map((food) => (
//             <ClaimedCard key={food._id} food={food} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NgoDashboard;

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

  useEffect(() => {
    fetchFoods();
  }, [user?.id]);

  // Socket listeners for NGO (who claimed the food)
  useEffect(() => {
    if (!user?.id || !socket) return;

    const handleFoodClaimed = (data) => {
      console.log("NGO received food_claimed_ngo:", data);
      
      // Refetch to get the newly claimed food with all details
      fetchFoods();
      toast.success("Food claimed successfully!");
    };

    const handleFoodCollected = (data) => {
      console.log("NGO received food_collected_ngo:", data);
      
      const { foodId } = data;
      let collectedFoodName = "";
      
      setFoods((prev) =>
        prev.map((food) => {
          if (food._id === foodId) {
            collectedFoodName = food.food_name;
            return { ...food, status: "collected" }; 
          }
          return food;
        })
      );

      if (collectedFoodName) {
        toast.success(`"${collectedFoodName}" marked as collected!`);
      }
    };

    const handleFoodExpired = (data) => {
      console.log("NGO received food_expired:", data);
      
      const { ids } = data;
      if (!ids?.length) return;
      
      setFoods((prev) =>
        prev.map((food) =>
          ids.includes(food._id) ? { ...food, status: "expired" } : food
        )
      );
    };

    const handleFoodUnavailable = (data) => {
      console.log("NGO received food_unavailable:", data);
      
      const { foodId } = data;
      
      // Remove if another NGO claimed it (shouldn't happen, but safety check)
      setFoods((prev) => prev.filter((food) => food._id !== foodId));
    };

    socket.on("food_claimed_ngo", handleFoodClaimed);
    socket.on("food_collected_ngo", handleFoodCollected);
    socket.on("food_expired", handleFoodExpired);
    socket.on("food_unavailable", handleFoodUnavailable);

    console.log("NGO socket listeners attached");

    return () => {
      socket.off("food_claimed_ngo", handleFoodClaimed);
      socket.off("food_collected_ngo", handleFoodCollected);
      socket.off("food_expired", handleFoodExpired);
      socket.off("food_unavailable", handleFoodUnavailable);
      console.log("NGO socket listeners removed");
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
        <div className="h-[70vh] flex items-center justify-center max-md:text-2xl text-4xl text-[#211d1d] font-semibold">
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

