import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ✅ global refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ user state
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // 🔁 trigger dashboard refresh
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 🔐 update user
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // 🚪 logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AppContext.Provider
      value={{
        refreshKey,
        triggerRefresh,
        user,
        updateUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};