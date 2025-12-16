import { claimFood, collectFood } from '../api/food';
import { X } from 'lucide-react';
import React from 'react'

const MapFoodModal = ({ food, onClose, refresh }) => {
    const handleClaim = async () => {
        await claimFood(food._id);
        refresh();
        onClose();
    };

    const handleCollect = async () => {
        await collectFood(food._id);
        refresh();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-lg p-4 relative">
                <X
                    className="cursor-pointer"
                    onClick={onClose}
                />

                <img
                    src={food.food_image?.[0]?.url}
                    className="w-full h-48 object-cover rounded"
                />

                <h2 className="text-xl font-semibold mt-3">
                    {food.food_name}
                </h2>

                <p className="text-sm text-gray-600">
                    {food.description}
                </p>

                <div className="mt-3 text-sm">
                    <p><strong>Quantity:</strong> {food.quantity}</p>
                    <p><strong>Status:</strong> {food.status}</p>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        disabled={food.status !== "available"}
                        onClick={handleClaim}
                        className="flex-1 bg-[#7da30be6] disabled:bg-gray-300 text-white py-2 rounded"
                    >
                        Claim
                    </button>

                    {/* <button
                        disabled={food.status !== "claimed"}
                        onClick={handleCollect}
                        className="flex-1 bg-green-600 disabled:bg-gray-300 text-white py-2 rounded"
                    >
                        Collect
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default MapFoodModal
