import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  User,
  Calendar,
  Ban,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { banService } from "../../services/banService";
import { useAuth } from "../../context/AuthContext";
import {
  BAN_TYPES,
  BAN_TYPE_LABELS,
  BAN_TYPE_DESCRIPTIONS,
  BAN_TYPE_COLORS,
  BAN_STATUS,
  BAN_STATUS_LABELS,
  BAN_STATUS_COLORS,
  BAN_SEVERITY,
  BAN_SEVERITY_LABELS,
  DURATION_OPTIONS,
  BAN_DURATION_PRESETS,
} from "../../constants/banTypes";
import toast from "react-hot-toast";


const BanManagement= () => {
  const { admin } = useAuth();
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [banTypeFilter, setBanTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBan, setSelectedBan] = useState(null);
  const [showBanDetails, setShowBanDetails] = useState(false);

  // Load bans on component mount and when filters change
  useEffect(() => {
    loadBans();
  }, [currentPage, statusFilter, banTypeFilter]);

  const loadBans = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pagination.limit,
      };

      if (searchTerm) {
        params.username = searchTerm;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (banTypeFilter !== "all") {
        params.banType = banTypeFilter;
      }

      const response = await banService.getBans(params);
      setBans(response.data || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadBans();
  };

  const handleFilterReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setBanTypeFilter("all");
    setCurrentPage(1);
    loadBans();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration) => {
    if (duration === 0) return "Permanent";
    if (duration < 24) return `${duration} hour(s)`;
    if (duration < 168) return `${Math.floor(duration / 24)} day(s)`;
    return `${Math.floor(duration / 168)} week(s)`;
  };

  const getBanTypeIcon = (banType) => {
    switch (banType) {
      case BAN_TYPES.PERMANENT:
        return <Ban className="h-4 w-4" />;
      case BAN_TYPES.TEMPORARY:
        return <Clock className="h-4 w-4" />;
      case BAN_TYPES.WARNING:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Ban className="h-4 w-4" />;
    }
  };

  const handleViewBanDetails = (ban) => {
    setSelectedBan(ban);
    setShowBanDetails(true);
  };

  const handleUnbanUser = async (banId, username) => {
    if (!admin?.username) return;

    try {
      await banService.unbanUser(
        banId,
        admin.username,
        "Manually removed by admin"
      );
      toast.success(`User ${username} unbanned successfully!`);
      loadBans();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getBanStatistics = () => {
    const totalBans = bans.length;
    const activeBans = bans.filter(
      (ban) => ban.status === BAN_STATUS.ACTIVE
    ).length;
    const expiredBans = bans.filter(
      (ban) => ban.status === BAN_STATUS.EXPIRED
    ).length;
    const removedBans = bans.filter(
      (ban) => ban.status === BAN_STATUS.MANUALLY_REMOVED
    ).length;

    return { totalBans, activeBans, expiredBans, removedBans };
  };

  const stats = getBanStatistics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ban Management</h1>
          <p className="text-gray-600">Manage user bans and restrictions</p>
        </div>
        <button
          onClick={loadBans}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Ban className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalBans}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Bans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeBans}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Expired Bans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.expiredBans}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Removed Bans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.removedBans}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by username..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn-primary px-6">
              Search
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <button onClick={handleFilterReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ban Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(BAN_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ban Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  value={banTypeFilter}
                  onChange={(e) =>
                    setBanTypeFilter(e.target.value)
                  }
                >
                  <option value="all">All Types</option>
                  {Object.entries(BAN_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bans Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ban Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banned By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bans.map((ban) => (
                <tr key={ban._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {ban.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ban.chatId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getBanTypeIcon(ban.banType)}
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          BAN_TYPE_COLORS[ban.banType]
                        }`}
                      >
                        {BAN_TYPE_LABELS[ban.banType]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(ban.duration)}
                    {ban.expiresAt && (
                      <div className="text-xs text-gray-500">
                        Expires: {formatDate(ban.expiresAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        BAN_STATUS_COLORS[ban.status]
                      }`}
                    >
                      {BAN_STATUS_LABELS[ban.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ban.bannedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ban.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewBanDetails(ban)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {ban.status === BAN_STATUS.ACTIVE && (
                        <button
                          onClick={() => handleUnbanUser(ban._id, ban.username)}
                          className="text-green-600 hover:text-green-900"
                          title="Unban User"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {bans.length === 0 && !loading && (
          <div className="text-center py-8">
            <Ban className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bans found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all" || banTypeFilter !== "all"
                ? "Try adjusting your search or filters."
                : "No ban records exist yet."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Ban Details Modal */}
      {showBanDetails && selectedBan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Ban Details</h3>
              <button
                onClick={() => setShowBanDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Username
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBan.username}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Chat ID
                  </label>
                  <p className="text-sm text-gray-900">{selectedBan.chatId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Ban Type
                  </label>
                  <div className="flex items-center mt-1">
                    {getBanTypeIcon(selectedBan.banType)}
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        BAN_TYPE_COLORS[selectedBan.banType]
                      }`}
                    >
                      {BAN_TYPE_LABELS[selectedBan.banType]}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      BAN_STATUS_COLORS[selectedBan.status]
                    }`}
                  >
                    {BAN_STATUS_LABELS[selectedBan.status]}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Duration
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDuration(selectedBan.duration)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Banned By
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBan.bannedBy}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created At
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedBan.createdAt)}
                  </p>
                </div>
                {selectedBan.expiresAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Expires At
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedBan.expiresAt)}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Reason
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedBan.reason}
                </p>
              </div>

              {selectedBan.evidence && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Evidence
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedBan.evidence}
                  </p>
                </div>
              )}

              {selectedBan.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedBan.notes}
                  </p>
                </div>
              )}

              {selectedBan.unbannedBy && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Unban Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Unbanned By
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedBan.unbannedBy}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Unbanned At
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedBan.unbannedAt &&
                          formatDate(selectedBan.unbannedAt)}
                      </p>
                    </div>
                    {selectedBan.unbanReason && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">
                          Unban Reason
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedBan.unbanReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              {selectedBan.status === BAN_STATUS.ACTIVE && (
                <button
                  onClick={() => {
                    handleUnbanUser(selectedBan._id, selectedBan.username);
                    setShowBanDetails(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Unban User
                </button>
              )}
              <button
                onClick={() => setShowBanDetails(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanManagement;
