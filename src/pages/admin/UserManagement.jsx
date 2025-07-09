import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  UserPlus,
  RefreshCw,
  Filter,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { userService } from "../../services/userService";
import { banService } from "../../services/banService";
import { useAuth } from "../../context/AuthContext";
import {
  BAN_TYPES,
  BAN_TYPE_LABELS,
  BAN_TYPE_DESCRIPTIONS,
  DURATION_OPTIONS,
} from "../../constants/banTypes";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: "",
    firstname: "",
    chatId: "",
    phoneNumber: "",
    invitedBy: "",
  });

  // New state for ban/unban and reset balance modals
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showResetBalanceModal, setShowResetBalanceModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [banType, setBanType] = useState(BAN_TYPES.PERMANENT);
  const [banDuration, setBanDuration] = useState(0);
  const [banEvidence, setBanEvidence] = useState("");
  const [banNotes, setBanNotes] = useState("");
  const [resetBalanceReason, setResetBalanceReason] = useState("");

  const navigate = useNavigate();

  // Load users on component mount and when filters change
  useEffect(() => {
    loadUsers();
  }, [currentPage, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pagination.limit,
      };

      if (searchTerm) {
        params.username = searchTerm;
      }

      const response = await userService.getUsers(params);
      setUsers(response.data || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update existing user
        const updateData = {};
        if (userForm.firstname) updateData.firstname = userForm.firstname;
        if (userForm.phoneNumber) updateData.phoneNumber = userForm.phoneNumber;

        await userService.updateUser(editingUser._id, updateData);
        toast.success("User updated successfully!");
      } else {
        // Create new user
        await userService.createUser(userForm);
        toast.success("User created successfully!");
      }

      resetForm();
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      firstname: user.firstname || "",
      chatId: user.chatId,
      phoneNumber: user.phoneNumber,
      invitedBy: user.invitedBy || "",
    });
    setShowUserForm(true);
  };

  const handleBanUserWithReason = async () => {
    if (!selectedUser || !admin?.username) return;

    try {
      await banService.banUser(
        selectedUser._id,
        admin.username,
        banReason,
        banType,
        banDuration,
        banEvidence,
        banNotes
      );
      toast.success(`User ${selectedUser.username} banned successfully!`);
      setShowBanModal(false);
      setBanReason("");
      setBanType(BAN_TYPES.PERMANENT);
      setBanDuration(0);
      setBanEvidence("");
      setBanNotes("");
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnbanUser = async () => {
    if (!selectedUser || !admin?.username) return;

    try {
      await banService.unbanUser(
        selectedUser._id,
        admin.username,
        "User unbanned by admin"
      );
      toast.success(`User ${selectedUser.username} unbanned successfully!`);
      setShowUnbanModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetBalance = async () => {
    if (!selectedUser || !admin?.username) return;

    try {
      await userService.resetUserBalance(
        selectedUser._id,
        admin.username,
        resetBalanceReason
      );
      toast.success(`Balance reset successfully for ${selectedUser.username}!`);
      setShowResetBalanceModal(false);
      setResetBalanceReason("");
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const openUnbanModal = (user) => {
    setSelectedUser(user);
    setShowUnbanModal(true);
  };

  const openResetBalanceModal = (user) => {
    setSelectedUser(user);
    setShowResetBalanceModal(true);
  };

  const handleDeleteUser = async (userId, username) => {
    try {
      await userService.deleteUser(userId);
      toast.success("User deleted successfully!");
      setShowDeleteConfirmModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openDeleteConfirmModal = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirmModal(true);
  };

  const resetForm = () => {
    setUserForm({
      username: "",
      firstname: "",
      chatId: "",
      phoneNumber: "",
      invitedBy: "",
    });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.chatId.includes(searchTerm) ||
      user.phoneNumber.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.banned) ||
      (statusFilter === "banned" && user.banned);

    return matchesSearch && matchesStatus;
  });

  const formatDuration = (duration) => {
    if (duration === 0) return "Permanent";
    if (duration < 24) return `${duration} hour(s)`;
    if (duration < 168) return `${Math.floor(duration / 24)} day(s)`;
    return `${Math.floor(duration / 168)} week(s)`;
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage platform users and their accounts
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadUsers}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowUserForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by username, name, chat ID, or phone..."
                className="w-56 px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <select
            className="input-field w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="banned">Banned Users</option>
          </select>
          <button
            onClick={handleSearch}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* User Registration/Edit Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={userForm.username}
                  onChange={(e) =>
                    setUserForm({ ...userForm, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={userForm.firstname}
                  onChange={(e) =>
                    setUserForm({ ...userForm, firstname: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chat ID *
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={userForm.chatId}
                  onChange={(e) =>
                    setUserForm({ ...userForm, chatId: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={userForm.phoneNumber}
                  onChange={(e) =>
                    setUserForm({ ...userForm, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invited By (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={userForm.invitedBy}
                  onChange={(e) =>
                    setUserForm({ ...userForm, invitedBy: e.target.value })
                  }
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  {editingUser ? "Update User" : "Add User"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Ban User</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to ban{" "}
              <strong>{selectedUser.username}</strong>? This will prevent them
              from accessing the platform.
            </p>

            <div className="space-y-4">
              {/* Ban Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ban Type *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={banType}
                  onChange={(e) => setBanType(e.target.value)}
                >
                  {Object.entries(BAN_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {BAN_TYPE_DESCRIPTIONS[banType]}
                </p>
              </div>

              {/* Duration (for temporary bans) */}
              {banType === BAN_TYPES.TEMPORARY && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Quick Preset
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                        value={banDuration}
                        onChange={(e) =>
                          setBanDuration(parseInt(e.target.value) || 0)
                        }
                      >
                        {DURATION_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Custom Hours
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                        placeholder="Enter custom duration in hours"
                        value={banDuration}
                        onChange={(e) =>
                          setBanDuration(parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Duration: {formatDuration(banDuration)}
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Ban *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  rows={3}
                  placeholder="Enter reason for banning this user..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  required
                />
              </div>

              {/* Evidence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  rows={2}
                  placeholder="Enter evidence or proof of violation..."
                  value={banEvidence}
                  onChange={(e) => setBanEvidence(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  rows={2}
                  placeholder="Enter any additional notes or comments..."
                  value={banNotes}
                  onChange={(e) => setBanNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleBanUserWithReason}
                disabled={
                  !banReason.trim() ||
                  (banType === BAN_TYPES.TEMPORARY && banDuration <= 0)
                }
                className="btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ban User
              </button>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                  setBanType(BAN_TYPES.PERMANENT);
                  setBanDuration(0);
                  setBanEvidence("");
                  setBanNotes("");
                  setSelectedUser(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unban User Modal */}
      {showUnbanModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Unban User</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to unban{" "}
              <strong>{selectedUser.username}</strong>? This will restore their
              access to the platform.
            </p>
            <div className="flex space-x-3">
              <button onClick={handleUnbanUser} className="btn-primary flex-1">
                Unban User
              </button>
              <button
                onClick={() => {
                  setShowUnbanModal(false);
                  setSelectedUser(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Balance Modal */}
      {showResetBalanceModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <DollarSign className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Reset Balance
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reset the balance for{" "}
              <strong>{selectedUser.username}</strong>? Current balance:{" "}
              <strong>ETB {selectedUser.balance.toFixed(2)}</strong>
            </p>
            <p className="text-sm text-red-600 mb-4">
              This action will set the user's balance to ETB 0.00 and cannot be
              undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Reset (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                rows={3}
                placeholder="Enter reason for resetting balance..."
                value={resetBalanceReason}
                onChange={(e) => setResetBalanceReason(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleResetBalance}
                className="btn-danger flex-1"
              >
                Reset Balance
              </button>
              <button
                onClick={() => {
                  setShowResetBalanceModal(false);
                  setResetBalanceReason("");
                  setSelectedUser(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.firstname?.charAt(0) ||
                            user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstname} {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          Invites: {user.inviteCount}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.chatId}</div>
                    <div className="text-sm text-gray-500">
                      {user.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ETB {user.balance.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Bonus: ETB {user.bonus.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.banned
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.banned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/users/profile?username=${encodeURIComponent(
                              user.username
                            )}&chatId=${encodeURIComponent(
                              user.chatId
                            )}&phoneNumber=${encodeURIComponent(
                              user.phoneNumber
                            )}`
                          )
                        }
                        className="text-gray-600 hover:text-gray-900"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          user.banned
                            ? openUnbanModal(user)
                            : openBanModal(user)
                        }
                        className={
                          user.banned
                            ? "text-green-600 hover:text-green-900"
                            : "text-yellow-600 hover:text-yellow-900"
                        }
                        title={user.banned ? "Unban User" : "Ban User"}
                      >
                        {user.banned ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openResetBalanceModal(user)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Reset Balance"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirmModal(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="btn-secondary px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-8">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Get started by adding a new user."}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>{selectedUser.username}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  handleDeleteUser(selectedUser._id, selectedUser.username)
                }
                className="btn-danger flex-1"
              >
                Delete User
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setSelectedUser(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
