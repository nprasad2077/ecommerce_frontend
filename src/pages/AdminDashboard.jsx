import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Trash2,
  Edit,
  CheckCircle,
  X,
  PlusCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import Toast from "../components/Toast";
import PageWrapper from "../components/PageWrapper";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/");
      setUsers(res.data);
      setFilteredUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again later.");
      setLoading(false);
    }
  };

  const handleConfirmDelete = (id) => {
    setConfirmDelete(id);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/delete/${id}/`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setToastMessage("User deleted successfully");
      setToastType("success");
      setShowToast(true);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setToastMessage("Failed to delete user. Please try again.");
      setToastType("error");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">
                User Management
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                onClick={fetchUsers}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw size={18} />
              </button>

              <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <PlusCircle size={18} className="mr-1" />
                Add User
              </button>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">No users found</h2>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "No users match your search criteria."
                  : "There are no users in the system."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-center">Admin</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-gray-600">{user._id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.isAdmin ? (
                          <CheckCircle
                            size={18}
                            className="text-green-500 inline"
                          />
                        ) : (
                          <X size={18} className="text-red-500 inline" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-700 p-1"
                            aria-label="Edit user"
                          >
                            <Edit size={18} />
                          </button>
                          {confirmDelete === user._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="text-red-600 hover:text-red-700 p-1 font-medium text-xs"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={handleCancelDelete}
                                className="text-gray-600 hover:text-gray-700 p-1 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleConfirmDelete(user._id)}
                              className="text-red-600 hover:text-red-700 p-1"
                              aria-label="Delete user"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total users: {filteredUsers.length}{" "}
              {searchTerm && `(filtered from ${users.length})`}
            </div>

            <button className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
              <Download size={16} className="mr-1" />
              Export
            </button>
          </div>
        </div>

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </PageWrapper>
  );
}
