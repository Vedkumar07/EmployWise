import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let useToken = null;
        const cookies = document.cookie.split("; ");
        
        for (let cookie of cookies) {
          const [key, value] = cookie.split("=");
          if (key.trim().toLowerCase() === "token") {
            useToken = decodeURIComponent(value);
          }
        }

        if (!useToken) {
          alert("Authentication required. Please log in.");
          navigate("/");
          return;
        }

        const response = await fetch("https://reqres.in/api/users?page=2", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            alert("Your session has expired. Please log in again.");
            navigate("/auth");
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setUsers(data.data);
          setFilteredUsers(data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterOption !== "all") {
      result = result.filter(user => {
        if (filterOption === "firstname-asc") {
          return result.sort((a, b) => a.first_name.localeCompare(b.first_name));
        }
        if (filterOption === "firstname-desc") {
          return result.sort((a, b) => b.first_name.localeCompare(a.first_name));
        }
        return result;
      });
    }

    setFilteredUsers(result);
  }, [searchTerm, filterOption, users]);

  return (
    <div className="container mx-auto p-4 relative">
      <h2 className="text-2xl font-bold mb-6 text-center">User Listing</h2>

      <div className="mb-4 flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-3 py-2 border rounded-md"
        />

        <select 
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="ml-4 px-3 py-2 border rounded-md"
        >
          <option value="all">Sort by</option>
          <option value="firstname-asc">First Name (A-Z)</option>
          <option value="firstname-desc">First Name (Z-A)</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">
          {searchTerm ? "No users match your search" : "No users available"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col items-center">
              <img 
                src={user.avatar} 
                alt={`${user.first_name} ${user.last_name}`} 
                className="w-24 h-24 rounded-full mb-3" 
              />
              <h3 className="font-bold text-lg">{user.first_name} {user.last_name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      )}

      <button 
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-500 transition"
        onClick={() => navigate("/edit")} 
      >
        Edit
      </button>
    </div>
  );
}

export default Users;