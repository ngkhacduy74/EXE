import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/user/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details");
      }
    };

    fetchUser();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading…</p>;

  return (
    <div>

      <h1>Details for {user.fullname}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* etc. */}
    </div>
  );
}


