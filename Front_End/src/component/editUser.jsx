import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function EditUser() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "" });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        let userToken = null;
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key.trim().toLowerCase() === "token") {
                userToken = decodeURIComponent(value);
            }
        }

        if (!userToken) {
            alert("Authentication required. Please log in.");
            navigate("/");
            return;
        }
        const userIdFromToken = 8;

        const fetchData = async () => {
            try {
                const response = await fetch("https://reqres.in/api/users?page=2");
                const data = await response.json();
                const userList = data.data || [];
                setUsers(userList);
                const loggedInUser = userList.find(user => user.id === userIdFromToken);
                if (!loggedInUser) {
                    alert("Your account is not found on this page.");
                    return;
                }
                setCurrentUser(loggedInUser);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
    }, [navigate]);

    const handleEdit = (user) => {
        if (currentUser?.id !== user.id) {
            alert("You can only edit your own details.");
            return;
        }
        setEditUser(user.id);
        setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`https://reqres.in/api/users/${editUser}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update user.");

            setUsers(users.map(user => (user.id === editUser ? { ...user, ...formData } : user)));
            setEditUser(null);
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    const handleDelete = async (id) => {
        if (currentUser?.id !== id) {
            alert("You can only delete your own details.");
            return;
        }

        try {
            const response = await fetch(`https://reqres.in/api/users/${id}`, { method: "DELETE" });

            if (!response.ok) throw new Error("Failed to delete user.");

            setUsers(users.filter(user => user.id !== id));
            alert("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">User List</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-full">
                {users.length === 0 ? (
                    <p className="text-center text-sm font-medium text-gray-500">No users available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div key={user.id} className="bg-white rounded-md shadow-sm outline outline-1 outline-gray-300 p-6 flex flex-col items-center">
                                <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="w-24 h-24 rounded-full mb-4 outline outline-1 outline-gray-300" />
                                <h3 className="text-base font-semibold text-gray-900">{user.first_name} {user.last_name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{user.email}</p>

                                {currentUser?.id === user.id && (
                                    <div className="mt-4 flex space-x-3">
                                        <button onClick={() => handleEdit(user)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Edit</button>
                                        <button onClick={() => handleDelete(user.id)} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500">Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {editUser && (
                <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl sm:max-w-sm w-full p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Edit User</h3>
                        <div className="mt-4 space-y-4">
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300" />
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300" />
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button onClick={handleUpdate} className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">Update</button>
                                <button onClick={() => setEditUser(null)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
