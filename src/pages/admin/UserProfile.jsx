import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  DollarSign,
  Calendar,
  Users,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  BarChart3,
  Ban,
  CheckCircle,
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

const UserProfile= () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ban/unban modal states
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetBalanceModal, setShowResetBalanceModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banType, setBanType] = useState(BAN_TYPES.PERMANENT);
  const [banDuration, setBanDuration] = useState(0);
  const [banEvidence, setBanEvidence] = useState("");
  const [banNotes, setBanNotes] = useState("");
  const [resetBalanceReason, setResetBalanceReason] = useState("");

  // Edit user form state
  const [editForm, setEditForm] = useState({
    firstname: "",
    phoneNumber: "",
  });

  const [banHistory, setBanHistory] = useState([]);
  const [activeBan, setActiveBan] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, [location.search]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams(location.search);
      const username = searchParams.get("username");
      const chatId = searchParams.get("chatId");
      const phoneNumber = searchParams.get("phoneNumber");
      let userIdToUse = userId;
      if (!userIdToUse && (username || chatId || phoneNumber)) {
        const user = await userService.getUserProfile({
          username: username || undefined,
          chatId: chatId || undefined,
          phoneNumber: phoneNumber || undefined,
        });
        userIdToUse = user?.user?._id;
      }
      if (userIdToUse) {
        const userData = await userService.getUserById(userIdToUse);
        const fullProfile = await userService.getUserProfile({
          username: userData.username,
        });
        setProfileData(fullProfile);
        // Fetch ban history
        const banRes = await banService.getUserBanHistory(userIdToUse);
        setBanHistory(banRes.banHistory || []);
        setActiveBan(banRes.activeBan || null);
        return;
      }
      // Otherwise use query parameters
      if (!username && !chatId && !phoneNumber) {
        setError("No user identifier provided");
        return;
      }
      const params = {};
      if (username) params.username = username;
      if (chatId) params.chatId = chatId;
      if (phoneNumber) params.phoneNumber = phoneNumber;
      const fullProfile = await userService.getUserProfile(params);
      setProfileData(fullProfile);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUserWithReason = async () => {
    if (!profileData || !admin?.username) return;

    try {
      await banService.banUser(
        profileData.user._id,
        admin.username,
        banReason,
        banType,
        banDuration,
        banEvidence,
        banNotes
      );
      toast.success(`User ${profileData.user.username} banned successfully!`);
      setShowBanModal(false);
      setBanReason("");
      setBanType(BAN_TYPES.PERMANENT);
      setBanDuration(0);
      setBanEvidence("");
      setBanNotes("");
      loadUserProfile();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnbanUser = async () => {
    if (!profileData || !admin?.username) return;

    try {
      await banService.unbanUser(
        profileData.user._id,
        admin.username,
        "User unbanned by admin"
      );
      toast.success(`User ${profileData.user.username} unbanned successfully!`);
      setShowUnbanModal(false);
      loadUserProfile();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openBanModal = () => {
    setShowBanModal(true);
  };

  const openUnbanModal = () => {
    setShowUnbanModal(true);
  };

  const openEditModal = () => {
    if (profileData) {
      setEditForm({
        firstname: profileData.user.firstname || "",
        phoneNumber: profileData.user.phoneNumber,
      });
      setShowEditModal(true);
    }
  };

  const openResetBalanceModal = () => {
    setShowResetBalanceModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!profileData) return;

    try {
      await userService.updateUser(profileData.user._id, editForm);
      toast.success("User updated successfully!");
      setShowEditModal(false);
      loadUserProfile();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetBalance = async () => {
    if (!profileData || !admin?.username) return;

    try {
      await userService.resetUserBalance(
        profileData.user._id,
        admin.username,
        resetBalanceReason
      );
      toast.success("User balance reset successfully!");
      setShowResetBalanceModal(false);
      setResetBalanceReason("");
      loadUserProfile();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigateToTransactionsWithUser = () => {
    if (!profileData?.user) {
      toast.error("User data not available");
      return;
    }
    navigate(
      `/transactions?username=${encodeURIComponent(profileData.user.username)}`
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount);
  };

  const formatDuration = (duration) => {
    if (duration === 0) return "Permanent";
    if (duration < 24) return `${duration} hour(s)`;
    if (duration < 168) return `${Math.floor(duration / 24)} day(s)`;
    return `${Math.floor(duration / 168)} week(s)`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Error loading user
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {error || "User not found"}
        </p>
        <button onClick={() => navigate("/users")} className="mt-4 btn-primary">
          Back to Users
        </button>
      </div>
    );
  }

  const { user, statistics, recentActivity } = profileData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/users")}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Users</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">
              Detailed information about {user.firstname || user.username}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={user.banned ? openUnbanModal : openBanModal}
            className={`px-4 py-2 rounded-lg font-medium ${
              user.banned
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {user.banned ? "Unban User" : "Ban User"}
          </button>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>
              <p className="text-sm text-gray-500">User details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Username
              </label>
              <p className="text-sm text-gray-900 font-medium">
                {user.username}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                First Name
              </label>
              <p className="text-sm text-gray-900">
                {user.firstname || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.banned
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.banned ? "Banned" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Contact Information
              </h3>
              <p className="text-sm text-gray-500">Contact details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Chat ID
              </label>
              <p className="text-sm text-gray-900 font-mono">{user.chatId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <p className="text-sm text-gray-900">{user.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Financial Information
              </h3>
              <p className="text-sm text-gray-500">Balance & bonuses</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Current Balance
              </label>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(user.balance)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Bonus Balance
              </label>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(user.bonus)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Total Balance
              </label>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(user.balance + user.bonus)}
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Account Information
              </h3>
              <p className="text-sm text-gray-500">Account details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Member Since
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(user.registrationDate)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(user.lastUpdated)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                User ID
              </label>
              <p className="text-sm text-gray-900 font-mono">{user._id}</p>
            </div>
          </div>
        </div>

        {/* Referral Information */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Referral Information
              </h3>
              <p className="text-sm text-gray-500">Referral details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Invited By
              </label>
              <p className="text-sm text-gray-900">
                {user.invitedBy || "No referrer"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Total Invites
              </label>
              <p className="text-lg font-bold text-indigo-600">
                {user.inviteCount}
              </p>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Account Status
              </h3>
              <p className="text-sm text-gray-500">Account security</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Account Status
              </label>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.banned
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.banned ? "Banned" : "Active"}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(user.lastUpdated)}
              </p>
            </div>
          </div>
        </div>

        {/* Ban History Card - Show all bans */}
        {banHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Ban History
                </h3>
                <p className="text-sm text-gray-500">
                  All ban records for this user
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {banHistory.map((ban, idx) => (
                <div
                  key={ban._id || idx}
                  className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="flex flex-wrap gap-2 items-center">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full "
                      style={{
                        background:
                          ban.status === "ACTIVE" ? "#fee2e2" : "#e0e7ff",
                        color: ban.status === "ACTIVE" ? "#b91c1c" : "#3730a3",
                      }}
                    >
                      {ban.status}
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {ban.banType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {ban.createdAt && formatDate(ban.createdAt)}
                    </span>
                    {ban.expiresAt && (
                      <span className="text-xs text-gray-500">
                        Expires: {formatDate(ban.expiresAt)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm mt-1">
                    <strong>Banned By:</strong> {ban.bannedBy} <br />
                    <strong>Reason:</strong> {ban.reason} <br />
                    {ban.evidence && (
                      <>
                        <strong>Evidence:</strong> {ban.evidence} <br />
                      </>
                    )}
                    {ban.notes && (
                      <>
                        <strong>Notes:</strong> {ban.notes} <br />
                      </>
                    )}
                    {ban.unbannedBy && (
                      <>
                        <strong>Unbanned By:</strong> {ban.unbannedBy} <br />
                      </>
                    )}
                    {ban.unbanReason && (
                      <>
                        <strong>Unban Reason:</strong> {ban.unbanReason} <br />
                      </>
                    )}
                    {ban.unbannedAt && (
                      <>
                        <strong>Unbanned At:</strong>{" "}
                        {formatDate(ban.unbannedAt)} <br />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalTransactions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Topups</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalTopups}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Deposits
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statistics.totalDeposits)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Withdrawals
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statistics.totalWithdrawals)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Financial Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Topup Amount:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(statistics.totalTopupAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Game Debits:</span>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(statistics.totalGameDebits)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Game Credits:</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(statistics.totalGameCredits)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-900">
                Net Game Winnings:
              </span>
              <span
                className={`text-sm font-bold ${
                  statistics.netGameWinnings >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(statistics.netGameWinnings)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-2">
            {recentActivity.transactions
              .slice(0, 5)
              .map((transaction, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.transaction_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      transaction.transaction_type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transaction_type === "credit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            {recentActivity.transactions.length === 0 && (
              <p className="text-sm text-gray-500">No recent transactions</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Topups
          </h3>
          <div className="space-y-2">
            {recentActivity.topups.slice(0, 5).map((topup, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {topup.reason || "Topup"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(topup.createdAt)}
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  +{formatCurrency(topup.amount)}
                </span>
              </div>
            ))}
            {recentActivity.topups.length === 0 && (
              <p className="text-sm text-gray-500">No recent topups</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={openEditModal}
            className="btn-secondary flex items-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span>Edit User</span>
          </button>
          <button
            onClick={user.banned ? openUnbanModal : openBanModal}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
              user.banned
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {user.banned ? (
              <Shield className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span>{user.banned ? "Unban User" : "Ban User"}</span>
          </button>
          <button
            onClick={navigateToTransactionsWithUser}
            className="btn-secondary flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>View All Transactions</span>
          </button>
          <button
            onClick={openResetBalanceModal}
            className="btn-secondary flex items-center space-x-2"
          >
            <DollarSign className="h-4 w-4" />
            <span>Reset Balance</span>
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit User: {user.username}
            </h3>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={editForm.firstname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstname: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Balance Modal */}
      {showResetBalanceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Reset User Balance
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This will reset the balance for <strong>{user.username}</strong>{" "}
              to ETB 0.00. This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                rows={3}
                value={resetBalanceReason}
                onChange={(e) => setResetBalanceReason(e.target.value)}
                placeholder="Enter reason for resetting balance..."
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
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Ban User</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBanUserWithReason();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ban Reason *
                </label>
                <textarea
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for banning user..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ban Type
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={banType}
                  onChange={(e) => setBanType(e.target.value)}
                >
                  {Object.entries(BAN_TYPE_LABELS).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {BAN_TYPE_DESCRIPTIONS[banType]}
                </p>
              </div>
              {banType !== BAN_TYPES.PERMANENT && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                    value={banDuration}
                    onChange={(e) => setBanDuration(Number(e.target.value))}
                  >
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  rows={2}
                  value={banEvidence}
                  onChange={(e) => setBanEvidence(e.target.value)}
                  placeholder="Provide evidence or screenshots..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  rows={2}
                  value={banNotes}
                  onChange={(e) => setBanNotes(e.target.value)}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-danger flex-1">
                  Ban User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBanModal(false);
                    setBanReason("");
                    setBanType(BAN_TYPES.PERMANENT);
                    setBanDuration(0);
                    setBanEvidence("");
                    setBanNotes("");
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unban Modal */}
      {showUnbanModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Unban User</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to unban <strong>{user.username}</strong>?
              This will restore their access to the platform.
            </p>
            <div className="flex space-x-3">
              <button onClick={handleUnbanUser} className="btn-primary flex-1">
                Unban User
              </button>
              <button
                onClick={() => setShowUnbanModal(false)}
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

export default UserProfile;
