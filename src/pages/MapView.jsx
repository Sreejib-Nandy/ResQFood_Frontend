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

            // center map on NGO
            map.current.flyTo({
                center: [lng, lat],
                zoom: 13,
                speed: 1.2,
                curve: 1.4,
                essential: true,
            });
            drawRadiusCircle(lng, lat, radius);

            // add NGO marker
            ngoMarkerRef.current = new mapboxgl.Marker({
                color: "#2563eb",
            })
                .setLngLat([lng, lat])
                .addTo(map.current);

            fetchFoods();
        });
    }, []);

    useEffect(() => {
        if (!ngoLocationRef.current) return;

        const { lng, lat } = ngoLocationRef.current;
        drawRadiusCircle(lng, lat, radius);
    }, [radius]);

    useEffect(() => {
        if (!map.current) return;

        const resizeMap = () => {
            map.current.resize();
        };

        window.addEventListener("resize", resizeMap);

        // force resize after first paint
        setTimeout(resizeMap, 0);

        return () => window.removeEventListener("resize", resizeMap);
    }, []);

    const createMarkerEl = () => {
        const el = document.createElement("div");
        el.className =
            "w-4 h-4 rounded-full bg-green-600 pulse-marker cursor-pointer";
        return el;
    };

    const addOrUpdateMarker = (food) => {
        if (food.status !== "available") {
            removeMarker(food._id);
            return;
        }

        if (markersRef.current.has(food._id)) {
            markersRef.current
                .get(food._id)
                .setLngLat(food.location.coordinates);
            return;
        }

        const el = createMarkerEl();
        el.onclick = () => {
            map.current.flyTo({
                center: food.location.coordinates,
                zoom: 15,
                speed: 1,
                curve: 1.4,
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

    const RADIUS_SOURCE_ID = "ngo-radius";

    const drawRadiusCircle = (lng, lat, km) => {
        if (!map.current) return;

        const center = turf.point([lng, lat]);
        const circle = turf.circle(center, km, { units: "kilometers" });

        if (map.current.getSource(RADIUS_SOURCE_ID)) {
            map.current.getSource(RADIUS_SOURCE_ID).setData(circle);
        } else {
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
        }
    };

    const fetchFoods = async () => {
        try {
            const data = await getNearbyFoods(radius);

            if (!data.success) return;

            if (data.foods.length === 0) {
                setNoResults(true);
            } else {
                setNoResults(false);
            }

            const serverIds = new Set(data.foods.map((f) => f._id));

            // add or update markers
            data.foods.forEach(addOrUpdateMarker);

            // remove stale markers
            markersRef.current.forEach((_, id) => {
                if (!serverIds.has(id)) {
                    removeMarker(id);
                }
            });

            if (data.foods.length > 0) {
                const bounds = new mapboxgl.LngLatBounds();
                data.foods.forEach(f =>
                    bounds.extend(f.location.coordinates)
                );
                map.current.fitBounds(bounds, { padding: 80 });
            }
            if (ngoLocationRef.current) {
                const { lng, lat } = ngoLocationRef.current;

                map.current.flyTo({
                    center: [lng, lat],
                    zoom: 12,
                    speed: 0.9,
                    curve: 1.2,
                    essential: true,
                });
            }

        } catch (err) {
            console.error("Fetch nearby foods error:", err);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const onNewFood = (food) => {
            if (food.status === "available") {
                addOrUpdateMarker(food);
            }
        };

        const onPostUpdated = (food) => {
            addOrUpdateMarker(food);
            // addOrUpdateMarker already removes if status !== available
        };

        const onPostDeleted = (foodId) => {
            removeMarker(foodId);
        };

        const onFoodUnavailable = ({ foodId }) => {
            removeMarker(foodId);
        };

        socket.on("new_food_post", onNewFood);
        socket.on("post_updated", onPostUpdated);
        socket.on("post_deleted", onPostDeleted);
        socket.on("food_unavailable", onFoodUnavailable);

        return () => {
            socket.off("new_food_post", onNewFood);
            socket.off("post_updated", onPostUpdated);
            socket.off("post_deleted", onPostDeleted);
            socket.off("food_unavailable", onFoodUnavailable);
        };
    }, []);


    return (
        <>
            <div className="absolute z-10 top-20 right-12 bg-white p-4 rounded-lg shadow-lg shadow-[#515739] flex items-center justify-between gap-3">
                <label className="text-sm text-center font-medium">Search Radius(km)</label>

                <div className="flex gap-2 mt-2">
                    <input
                        type="number"
                        min={1}
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        className="border px-2 py-1 rounded w-20"
                    />
                    <button
                        onClick={fetchFoods}
                        className="bg-[#b9de4a] text-white px-3 py-1 rounded cursor-pointer"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="relative w-full h-screen">
                <div ref={mapRef} className="w-full h-full" />
            </div>

            {noResults && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2
               bg-white px-4 py-2 rounded shadow text z-10 max-md:w-[80vw]"
                >
                    No available food posts within <span className="text-[#ec0d0d]">{radius} km</span> of your location
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
