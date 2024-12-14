import React, { useState, useEffect, useRef } from "react";

const API_URL = "https://randomuser.me/api/";

interface User {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number;
  };
  email: string;
  login: {
    username: string;
  };
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  id: {
    name: string;
    value: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

const InfiniteScroll: React.FC = () => {
  const page = 1;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const pageRef = useRef<number>(1);
  const loadingRef = useRef<boolean>(false);

  const fetchUsers = async (pageNumber: number) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?page=${pageNumber}&results=5`);
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, ...data.results]);
      pageRef.current += 1;
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  // Initialize first fetch on component mount
  useEffect(() => {
    fetchUsers(page);
  }, []);

  useEffect(() => {
    const debouncedScroll = () => {
      if (
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight * 0.8 &&
        !loadingRef.current
      ) {
        // Fetch next page only if the scroll is at 80% of the page
        fetchUsers(pageRef.current);
      }
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, []);

  return (
    <div className="container">
      <h1>Random Users</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index} className="user-card">
            <div className="user-header">
              <img src={user.picture.large} alt={user.name.first} />
              <div>
                <h3>
                  {user.name.first} {user.name.last}
                </h3>
                <p>
                  <strong>Gender:</strong> {user.gender}
                </p>
                <p>
                  <strong>Age:</strong> {user.dob.age}
                </p>
                <p>
                  <strong>Location:</strong> {user.location.city},{" "}
                  {user.location.country}
                </p>
              </div>
            </div>
            <div className="user-details">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Username:</strong> {user.login.username}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Cell:</strong> {user.cell}
              </p>
              <p>
                <strong>Address:</strong> {user.location.street.number}{" "}
                {user.location.street.name}, {user.location.state}{" "}
                {user.location.postcode}
              </p>
              <p>
                <strong>ID:</strong> {user.id.name} - {user.id.value}
              </p>
              <p>
                <strong>Registered:</strong>{" "}
                {new Date(user.registered.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Nationality:</strong> {user.nat}
              </p>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default InfiniteScroll;
