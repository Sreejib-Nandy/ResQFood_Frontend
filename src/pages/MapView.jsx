import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";
import MapFoodModal from "../components/MapFoodModal";
import { getNearbyFoods } from "../api/food";
import api from "../api/axios";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = () => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef(new Map());
  const ngoMarkerRef = useRef(null);
  const ngoLocationRef = useRef(null);

  const [radius, setRadius] = useState(5);
  const [selectedFood, setSelectedFood] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const RADIUS_SOURCE_ID = "ngo-radius";

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [88.4345, 22.5726],
      zoom: 12,
    });

    map.current.on("load", async () => {
      const res = await api.get("/users/me");
      const [lng, lat] = res.data.location.coordinates;
      ngoLocationRef.current = { lng, lat };

      map.current.flyTo({
        center: [lng, lat],
        zoom: getZoomFromRadius(radius),
        speed: 0.8,
        curve: 1.5,
        easing: (t) => t,
        essential: true,
      });

      drawRadiusCircle(lng, lat, radius);

      ngoMarkerRef.current = new mapboxgl.Marker({ color: "#2563eb" })
        .setLngLat([lng, lat])
        .addTo(map.current);

    });
  }, []);

  useEffect(() => {
    if (!ngoLocationRef.current) return;
    const { lng, lat } = ngoLocationRef.current;
    drawRadiusCircle(lng, lat, radius);
  }, [radius]);

  const createMarkerEl = () => {
    const el = document.createElement("div");
    el.className =
      "w-4 h-4 rounded-full bg-[#66cb03] pulse-marker cursor-pointer";
    return el;
  };

  const addOrUpdateMarker = (food) => {
    if (food.status !== "available") {
      removeMarker(food._id);
      return;
    }

    if (markersRef.current.has(food._id)) {
      markersRef.current.get(food._id).setLngLat(food.location.coordinates);
      return;
    }

    const el = createMarkerEl();
    el.onclick = () => {
      map.current.flyTo({
        center: food.location.coordinates,
        zoom: Math.max(14, getZoomFromRadius(radius)),
        speed: 0.7,
        curve: 1.6,
        easing: (t) => t,
        essential: true,
      });
      setSelectedFood(food);
    };

    const marker = new mapboxgl.Marker(el)
      .setLngLat(food.location.coordinates)
      .addTo(map.current);

    markersRef.current.set(food._id, marker);
  };

  const removeMarker = (foodId) => {
    const marker = markersRef.current.get(foodId);
    if (!marker) return;
    marker.remove();
    markersRef.current.delete(foodId);
  };

  const drawRadiusCircle = (lng, lat, km) => {
    if (!map.current) return;

    const center = turf.point([lng, lat]);
    const circle = turf.circle(center, km, { units: "kilometers" });

    if (map.current.getLayer(RADIUS_SOURCE_ID)) {
      map.current.removeLayer(RADIUS_SOURCE_ID);
    }
    if (map.current.getSource(RADIUS_SOURCE_ID)) {
      map.current.removeSource(RADIUS_SOURCE_ID);
    }

    map.current.addSource(RADIUS_SOURCE_ID, {
      type: "geojson",
      data: circle,
    });

    map.current.addLayer({
      id: RADIUS_SOURCE_ID,
      type: "fill",
      source: RADIUS_SOURCE_ID,
      paint: {
        "fill-color": "#60a5fa",
        "fill-opacity": 0.15,
      },
    });
  };

  const getZoomFromRadius = (km) => {
    if (km <= 2) return 15;
    if (km <= 5) return 14;
    if (km <= 10) return 13;
    if (km <= 20) return 12;
    return 11;
  };

  const fetchFoods = async () => {
    try {
      const data = await getNearbyFoods(radius);
      if (!data.success) return;

      setNoResults(data.foods.length === 0);

      const serverIds = new Set(data.foods.map((f) => f._id));
      data.foods.forEach(addOrUpdateMarker);

      markersRef.current.forEach((_, id) => {
        if (!serverIds.has(id)) removeMarker(id);
      });

      if (data.foods.length > 0 && ngoLocationRef.current) {
        const { lng, lat } = ngoLocationRef.current;

        map.current.flyTo({
          center: [lng, lat],
          zoom: getZoomFromRadius(radius),
          speed: 0.6,
          curve: 1.4,
          easing: (t) => t,
          essential: true,
        });
      }
    } catch (err) {
      console.error("Fetch nearby foods error:", err);
    }
  };

  useEffect(() => {
    const onNewFood = (food) => addOrUpdateMarker(food);
    const onPostUpdated = (food) => addOrUpdateMarker(food);
    const onPostDeleted = ({ foodId }) => removeMarker(foodId);
    const onFoodUnavailable = ({ foodId }) => removeMarker(foodId);
    const onFoodExpired = ({ ids }) => {
      if (!ids?.length) return;
      ids.forEach(removeMarker);
    };

    socket.on("new_food_post", onNewFood);
    socket.on("post_updated", onPostUpdated);
    socket.on("post_deleted", onPostDeleted);
    socket.on("food_unavailable", onFoodUnavailable);
    socket.on("food_expired", onFoodExpired);

    return () => {
      socket.off("new_food_post", onNewFood);
      socket.off("post_updated", onPostUpdated);
      socket.off("post_deleted", onPostDeleted);
      socket.off("food_unavailable", onFoodUnavailable);
      socket.off("food_expired", onFoodExpired);
    };
  }, []);


  return (
    <>
      <div className="absolute z-10 top-20 right-5 bg-white p-4 rounded-lg shadow-lg flex gap-3">
        <label className="text-sm font-medium flex items-center">Search Radius (km)</label>
        <input
          type="number"
          min={1}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />
        <button
          onClick={fetchFoods}
          className="bg-[#b9de4a] text-white px-3 py-1 rounded cursor-pointer"
        >
          Search
        </button>
      </div>

      <div className="relative w-full h-screen">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {noResults && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded shadow mx-1">
          No available food posts within <span className="text-red-500"><b>{radius} km</b></span>
        </div>
      )}

      {selectedFood && (
        <MapFoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          refresh={fetchFoods}
        />
      )}
    </>
  );
};

export default MapView;
