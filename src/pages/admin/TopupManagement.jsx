import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  DollarSign,
  User,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { topupService } from "../../services/topupService";
import toast from "react-hot-toast";




const TopupManagement = () => {
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTopupForm, setShowTopupForm] = useState(false);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [topupForm, setTopupForm] = useState({
    phoneNumber: "",
    username: "",
    amount: "",
    reason: "",
    gameId: "",
  });

  // Load topups on component mount
  useEffect(() => {
    loadTopups();
  }, []);

  const loadTopups = async () => {
    try {
      const response = await topupService.getTopups();
      setTopups(response.data || []);
    } catch (error) {
      console.error("Error loading topups:", error);
      toast.error("Failed to load topups");
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!topupForm.phoneNumber && !topupForm.username) {
      toast.error("Please enter phone number or username to check eligibility");
      return;
    }

    setCheckingEligibility(true);
    try {
      const data = await topupService.checkEligibility(
        topupForm.phoneNumber || undefined,
        topupForm.username || undefined
      );
      setEligibilityData(data);

      if (data.canReceiveTopup) {
        toast.success("User is eligible for topup");
      } else {
        toast.error("User is not eligible for topup (24-hour limit)");
      }
    } catch (error) {
      console.error("Eligibility check error:", error);
      if (error.message === "User not found") {
        toast.error("User not found. Please check the phone number or username and try again.");
      } else {
        toast.error(error.message);
      }
      setEligibilityData(null);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleTopupSubmit = async (e) => {
    e.preventDefault();

    if (!eligibilityData?.canReceiveTopup) {
      toast.error(
        "User is not eligible for topup. Please check eligibility first."
      );
      return;
    }

    try {
      const topupData = {
        phoneNumber: topupForm.phoneNumber || undefined,
        username: topupForm.username || undefined,
        amount: parseFloat(topupForm.amount),
        reason: topupForm.reason,
        gameId: topupForm.gameId || undefined,
      };

      await topupService.createTopup(topupData);

      toast.success("Topup completed successfully!");
      setTopupForm({
        phoneNumber: "",
        username: "",
        amount: "",
        reason: "",
        gameId: "",
      });
      setShowTopupForm(false);
      setEligibilityData(null);
      loadTopups(); // Reload the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredTopups = topups.filter(
    (topup) =>
      topup.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      topup.phoneNumber?.includes(searchTerm) ||
      topup.gameId?.includes(searchTerm)
  );

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Top-up Management
          </h1>
          <p className="text-gray-600">
            Manage user balance top-ups (24-hour limit per user)
          </p>
        </div>
        <button
          onClick={() => setShowTopupForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Top-up</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username, phone number, or game ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Top-up Form Modal */}
      {showTopupForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Top-up
            </h3>

            {/* Eligibility Check Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Check Eligibility
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                    value={topupForm.phoneNumber}
                    onChange={(e) =>
                      setTopupForm({
                        ...topupForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                    value={topupForm.username}
                    onChange={(e) =>
                      setTopupForm({ ...topupForm, username: e.target.value })
                    }
                    placeholder="Enter username"
                  />
                </div>
                <button
                  type="button"
                  onClick={checkEligibility}
                  disabled={checkingEligibility}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  {checkingEligibility ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <span>
                    {checkingEligibility ? "Checking..." : "Check Eligibility"}
                  </span>
                </button>
              </div>

              {/* Eligibility Result */}
              {eligibilityData && (
                <div
                  className={`mt-3 p-3 rounded-lg ${
                    eligibilityData.canReceiveTopup
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {eligibilityData.canReceiveTopup ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        eligibilityData.canReceiveTopup
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {eligibilityData.canReceiveTopup
                        ? "Eligible for topup"
                        : "Not eligible for topup"}
                    </span>
                  </div>
                  {eligibilityData.user && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>User: {eligibilityData.user.username}</p>
                      <p>
                        Current Balance: ETB{" "}
                        {eligibilityData.user.currentBalance}
                      </p>
                    </div>
                  )}
                  {!eligibilityData.canReceiveTopup &&
                    eligibilityData.nextTopupAllowed && (
                      <div className="mt-2 text-sm text-red-600">
                        <p>
                          Next topup allowed:{" "}
                          {new Date(
                            eligibilityData.nextTopupAllowed
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>

            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={topupForm.amount}
                  onChange={(e) =>
                    setTopupForm({ ...topupForm, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason *
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  rows={3}
                  value={topupForm.reason}
                  onChange={(e) =>
                    setTopupForm({ ...topupForm, reason: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Game ID (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={topupForm.gameId}
                  onChange={(e) =>
                    setTopupForm({ ...topupForm, gameId: e.target.value })
                  }
                  placeholder="Enter game ID"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={!eligibilityData?.canReceiveTopup}
                >
                  Add Top-up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTopupForm(false);
                    setEligibilityData(null);
                    setTopupForm({
                      phoneNumber: "",
                      username: "",
                      amount: "",
                      reason: "",
                      gameId: "",
                    });
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

      {/* Top-ups Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTopups.map((topup) => (
                <tr key={topup._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {topup.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {topup.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        ETB {topup.amount.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{topup.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {topup.gameId && <div>Game: {topup.gameId}</div>}
                      {!topup.gameId && (
                        <div className="text-gray-400">-</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{topup.adminId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {new Date(topup.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTopups.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No top-ups found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new top-up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopupManagement;
