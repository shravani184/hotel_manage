import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../services/api";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "" });
  const [original, setOriginal] = useState(form);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setForm(data);
      setOriginal(data);
    } catch (error) {
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateUserProfile(form);
      setOriginal(form);
      setMessage("Profile updated!");
    } catch {
      setMessage("Failed to update profile.");
    }
  };

const handleClear = () => {
  setForm({ name: "", email: "", phone: "", role: "" });
  setMessage("");
};


  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8">
      <h2 className="text-xl font-bold mb-6">My Profile</h2>
      {message && <div className="mb-4 text-center text-blue-600">{message}</div>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="font-semibold">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="font-semibold">Role</label>
          <input
            type="text"
            name="role"
            value={form.role || ""}
            readOnly
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 text-gray-600"
          />
        </div>
        <div className="flex gap-4 justify-between pt-4">
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
