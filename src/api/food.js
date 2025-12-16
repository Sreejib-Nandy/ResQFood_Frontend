import api from "./axios";

// get food posts by a restaurant
export const getFoodPosts = (restaurantId) => {
  return api.get(`/food/restaurant/${restaurantId}`);
};

// create food post (restaurant)
export const createFood = (formData) => {
  return api.post("/food/createfood", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// update food post (restaurant owner)
export const updateFood = (foodId, formData) => {
  return api.put(`/food/food/${foodId}`, formData);
};

// delete food post (restaurant owner)
export const deleteFood = (foodId) => {
  return api.delete(`/food/food/${foodId}`);
};

export const claimedFoodPosts = () => {
  return api.get("/food/claimed");
}

export const getNearbyFoods = async (radius_km = 5) => {
  const res = await api.get(`/food/nearby?radius_km=${radius_km}`);
  return res.data
};

export const claimFood = (id) =>
  api.patch(`/food/${id}/claim`);

export const collectFood = (id) =>
  api.patch(`/food/${id}/collected`);

