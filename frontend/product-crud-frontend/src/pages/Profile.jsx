import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/auth/me");

        console.log("PROFILE SUCCESS:", response.data);

        setUser(response.data.data);
      } catch (error) {
        console.log("PROFILE ERROR:", error.response?.data);

        alert(JSON.stringify(error.response?.data || "Failed to get profile"));
      }
    };

    getProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

        {user ? (
          <div className="space-y-3">
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
