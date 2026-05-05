
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { profileStyles } from "../styles/dummyStyles";
import { useApp } from "../context/AppContext";
import API from "../api/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user || {});
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  // =========================
  // INPUT HANDLERS
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // SAVE PROFILE
  // =========================
const handleSave = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser?._id) {
      alert("User not found. Please login again.");
      return;
    }

    const res = await API.put("/user/update", {
      userId: storedUser._id, // 🔥 CRITICAL FIX
      name: tempUser.name,
    });

    const updatedUser = res.data.user || res.data;

    // ✅ update context
    updateUser(updatedUser);

    // ✅ update localStorage (VERY IMPORTANT)
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // ✅ update UI immediately
    setTempUser(updatedUser);

    setEditMode(false);

  } catch (err) {
    console.error("Profile update error:", err);
  }
};

  // =========================
  // PASSWORD VALIDATION
  // =========================
  const validatePassword = () => {
    const err = {};

    if (!passwordData.current) err.current = "Required";
    if (!passwordData.new || passwordData.new.length < 6)
      err.new = "Min 6 characters";
    if (passwordData.new !== passwordData.confirm)
      err.confirm = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // =========================
  // UPDATE PASSWORD
  // =========================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      await API.put("/user/change-password", passwordData);

      setShowPasswordModal(false);
      setPasswordData({ current: "", new: "", confirm: "" });

    } catch (err) {
      console.error("Password update error:", err);
    }
  };

  // =========================
  // TOGGLE PASSWORD VISIBILITY
  // =========================
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // =========================
  // LOGOUT (use context)
  // =========================
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${profileStyles.container} relative`}>
      <div className={profileStyles.mainContainer}>

        {/* HEADER */}
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>👤</div>

          <h2 className={profileStyles.userName}>
            {tempUser.name || "User"}
          </h2>

          <p className={profileStyles.userEmail}>
            {tempUser.email || "No email"}
          </p>
        </div>

        {/* CONTENT */}
        <div className={profileStyles.content}>
          <div className={profileStyles.card}>

            {/* NAME */}
            <label className={profileStyles.label}>Name</label>
            <input
              name="name"
              value={tempUser.name || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              className={profileStyles.input}
            />

            {/* EMAIL */}
            <label className={profileStyles.label}>Email</label>
            <input
              value={tempUser.email || ""}
              disabled
              className={profileStyles.input}
            />

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">
              {editMode ? (
                <>
                 <button
                   onClick={handleSave}
                   className={profileStyles.buttonPrimary}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className={profileStyles.buttonSecondary}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className={profileStyles.buttonPrimary}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* ACTIONS */}
           {/* ACTIONS */}
<div className="mt-6 flex items-center justify-between">

  {/* LEFT SIDE */}
  <button
    onClick={() => setShowPasswordModal(true)}
    className="text-teal-600 font-medium"
  >
    Change Password
  </button>

  {/* RIGHT SIDE */}
  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition"
  >
    Logout
  </button>

</div>

          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="glass p-6 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                Change Password
              </h2>

              <button onClick={() => setShowPasswordModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              {["current", "new", "confirm"].map((field) => (
                <div key={field}>
                  <label className="text-sm text-gray-600 block mb-1 capitalize">
                    {field === "new"
                      ? "New Password"
                      : field === "confirm"
                      ? "Confirm Password"
                      : "Current Password"}
                  </label>

                  <div className="flex items-center border rounded-lg bg-white dark:bg-gray-800">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      className="flex-1 p-2 outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => togglePassword(field)}
                      className="px-3"
                    >
                      {showPassword[field] ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              <button className="w-full mt-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-2 rounded-xl">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

