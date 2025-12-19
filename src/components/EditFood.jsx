import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateFood } from "../api/food";
import toast from "react-hot-toast";

const EditFood = ({ open, onClose, food, onUpdated }) => {
    const [form, setForm] = useState({
        food_name: "",
        quantity: "",
        description: "",
        expiry_time: "",
        address: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const utcToInputValue = (iso) => {
        if (!iso) return "";

        const date = new Date(iso); // UTC → Date object
        const local = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
        );

        return local.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (!food) return;

        setForm({
            food_name: food.food_name || "",
            quantity: food.quantity || "",
            description: food.description || "",
            expiry_time: food.expiry_time
                ? utcToInputValue(food.expiry_time)
                : "",
            address: food.address || "",
        });

        setPreview(food.food_image?.[0]?.url || null);
        setImage(null);
    }, [food]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    if (!open || !food) return null;

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const fd = new FormData();
            fd.append("food_name", form.food_name);
            fd.append("quantity", form.quantity);
            fd.append("description", form.description);
            if (form.expiry_time) {
                const expiryISO = new Date(form.expiry_time).toISOString();
                fd.append("expiry_time", expiryISO);
            }

            if (form.address) fd.append("address", form.address);

            // only send image if user changed it
            if (image) {
                fd.append("food_image", image);
            }

            await updateFood(food._id, fd);
            toast.success("Food post updated successfully");
            onUpdated?.();
            onClose();
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <form
                onSubmit={submit}
                className="bg-white w-full max-w-lg rounded-xl px-6 py-5 space-y-2 max-md:w-[92vw] my-3"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Edit Food Post</h2>
                    <X className="cursor-pointer" onClick={onClose} />
                </div>

                {preview && (
                    <img
                        src={preview}
                        alt="preview"
                        className="h-60 w-full object-cover rounded-lg"
                    />
                )}
                <input type="file" name="food_image" accept="image/*" onChange={handleImage} className='w-full p-3.5 border-2 rounded-lg border-[#9fc235] border-dashed' />

                <input
                    placeholder="Food Name"
                    value={form.food_name}
                    onChange={(e) =>
                        setForm({ ...form, food_name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={(e) =>
                        setForm({ ...form, quantity: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    type="datetime-local"
                    value={form.expiry_time}
                    onChange={(e) =>
                        setForm({ ...form, expiry_time: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    placeholder="Pickup Address"
                    value={form.address}
                    onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    disabled={loading}
                    className="w-full bg-[#8bb01c] text-white py-2 rounded-lg disabled:opacity-60 cursor-pointer"
                >
                    {loading ? "Updating..." : "Update Food"}
                </button>
            </form>
        </div>
    );
};

export default EditFood;
