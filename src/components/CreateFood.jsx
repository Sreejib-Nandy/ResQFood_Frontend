import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createFood } from "../api/food";
import toast from "react-hot-toast";

const CreateFood = ({ open, onClose, onCreated }) => {
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

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!open) return null;

  const resetForm = () => {
    setForm({
      food_name: "",
      quantity: "",
      description: "",
      expiry_time: "",
      address: "",
    });
    setImage(null);
    setPreview(null);
    setLoading(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.food_name || !form.quantity || !form.expiry_time) {
      return toast.error("Fields are missing");
    }

    if (!image) {
      return toast.error("Food image is required");
    }

    const fd = new FormData();
    fd.append("food_name", form.food_name);
    fd.append("quantity", form.quantity);
    fd.append("description", form.description);
    const local = new Date(form.expiry_time);
    const utcDate = new Date(
      local.getTime() - local.getTimezoneOffset() * 60000
    );
    fd.append("expiry_time", utcDate.toISOString());
    if (form.address) fd.append("address", form.address);

    fd.append("food_image", image);

    try {
      setLoading(true);
      await createFood(fd);
      toast.success("Food post created successfully");
      onCreated?.();
      resetForm();
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-lg rounded-xl px-6 py-5 space-y-2 max-md:w-[92vw]"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Food Post</h2>
          <X
            className="cursor-pointer"
            onClick={() => {
              resetForm();
              onClose();
            }}
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="h-58 w-full object-cover rounded-lg"
          />
        )}
        <input type="file" name="food_image" accept="image/*" onChange={handleImage} className='w-full p-3.5 border-2 rounded-lg border-[#9fc235] border-dashed' />

        <input
          placeholder="Food Name *"
          value={form.food_name}
          onChange={(e) =>
            setForm({ ...form, food_name: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <input
          placeholder="Quantity *"
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
          placeholder="Pickup Address (optional)"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <button
          disabled={loading}
          className="w-full bg-[#9fc235] text-white py-2 rounded-lg disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Creating..." : "Create Food"}
        </button>
      </form>
    </div>
  );
};

export default CreateFood;
