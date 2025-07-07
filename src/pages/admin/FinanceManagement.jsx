import React, { useEffect, useState } from "react";
import { financeService } from "../../services/financeService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Check,
  X,
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  Filter,
  Eye,
  Search,
  Calendar,
  CreditCard,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Info,
  Shield,
  Zap,
} from "lucide-react";

const FinanceManagement = () => {
  const { admin } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await financeService.getFinanceRequests({
        page,
        limit: 20,
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        search: searchTerm || undefined,
      });
      setRecords(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [page, statusFilter, typeFilter]);

  const handleAction = async (id, status) => {
    setProcessingAction(id);
    try {
      await financeService.updateRequestStatus(
        id,
        status,
        admin?.username || ""
      );
      toast.success(`Request ${status.toLowerCase()} successfully!`);
      fetchRecords();
      setSelectedRecord(null);
      setShowDetails(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setProcessingAction(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING_APPROVAL: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: Clock,
      },
      APPROVED: { 
        bg: "bg-green-100", 
        text: "text-green-800", 
        border: "border-green-200",
        icon: Check 
      },
      REJECTED: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        border: "border-red-200",
        icon: X 
      },
      COMPLETED: { 
        bg: "bg-blue-100", 
        text: "text-blue-800", 
        border: "border-blue-200",
        icon: Check 
      },
      DECLINED: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        border: "border-red-200",
        icon: X 
      },
      FAILED: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        border: "border-red-200",
        icon: AlertCircle 
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING_APPROVAL;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === "deposit" ? (
      <TrendingUp className="w-5 h-5 text-green-600" />
    ) : (
      <TrendingDown className="w-5 h-5 text-red-600" />
    );
  };

  const getTypeBadge = (type) => {
    const isDeposit = type === "deposit";
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isDeposit 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
    }).format(amount);
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

  const handleSearch = () => {
    setPage(1);
    fetchRecords();
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearchTerm("");
    setPage(1);
  };

  const stats = {
    total: records.length,
    pending: records.filter((r) => r.status === "PENDING_APPROVAL").length,
    approved: records.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED").length,
    rejected: records.filter((r) => r.status === "REJECTED" || r.status === "DECLINED").length,
    totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
            Finance Management
          </h1>
          <p className="text-gray-600 mt-1">
            Review and process deposit/withdrawal requests with real-time updates
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchRecords}
            className="btn-primary flex items-center space-x-2"
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Requests</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Approved</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
            <Check className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rejected</p>
              <p className="text-2xl font-bold">{stats.rejected}</p>
            </div>
            <X className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Amount</p>
              <p className="text-lg font-bold">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <Shield className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username or transaction ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <select
            className="input-field w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="DECLINED">Declined</option>
            <option value="FAILED">Failed</option>
          </select>

          <select
            className="input-field w-40"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button 
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mb-3" />
                      <span className="text-gray-500 font-medium">Loading finance requests...</span>
                      <span className="text-sm text-gray-400 mt-1">Please wait while we fetch the latest data</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-center">
                      <DollarSign className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No finance requests found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {statusFilter !== "all" || typeFilter !== "all" || searchTerm
                          ? "Try adjusting your filters or search terms."
                          : "There are currently no finance requests to review."}
                      </p>
                      {(statusFilter !== "all" || typeFilter !== "all" || searchTerm) && (
                        <button
                          onClick={clearFilters}
                          className="btn-secondary"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.transactionId}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedRecord(record);
                      setShowDetails(true);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {record.username || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="font-mono text-xs">{record.chatId}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(record.type)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          ID: {record.transactionId}
                        </div>
                        {record.paymentMethod && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {record.paymentMethod}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(record.amount)}
                      </div>
                      {record.balanceAfter && (
                        <div className="text-xs text-gray-500">
                          Balance: {formatCurrency(record.balanceAfter)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(record.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {record.status === "PENDING_APPROVAL" && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(record.transactionId, "APPROVED");
                              }}
                              disabled={processingAction === record.transactionId}
                              className="btn-success btn-sm flex items-center space-x-1"
                              title="Approve Request"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(record.transactionId, "REJECTED");
                              }}
                              disabled={processingAction === record.transactionId}
                              className="btn-danger btn-sm flex items-center space-x-1"
                              title="Reject Request"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                            setShowDetails(true);
                          }}
                          className="btn-secondary btn-sm flex items-center space-x-1"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {page} of {totalPages} • {records.length} records
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedRecord(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  User Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Username</label>
                    <p className="text-sm font-medium">{selectedRecord.username || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Chat ID</label>
                    <p className="text-sm font-mono">{selectedRecord.chatId}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Transaction Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Transaction ID</label>
                    <p className="text-sm font-mono">{selectedRecord.transactionId}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Type</label>
                    <div className="mt-1">{getTypeBadge(selectedRecord.type)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Amount</label>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedRecord.amount)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                  </div>
                  {selectedRecord.paymentMethod && (
                    <div>
                      <label className="text-xs text-gray-500">Payment Method</label>
                      <p className="text-sm">{selectedRecord.paymentMethod}</p>
                    </div>
                  )}
                  {selectedRecord.accountNumber && (
                    <div>
                      <label className="text-xs text-gray-500">Account Number</label>
                      <p className="text-sm font-mono">{selectedRecord.accountNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timestamps
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Created At</label>
                    <p className="text-sm">{formatDate(selectedRecord.createdAt)}</p>
                  </div>
                  {selectedRecord.updatedAt && selectedRecord.updatedAt !== selectedRecord.createdAt && (
                    <div>
                      <label className="text-xs text-gray-500">Updated At</label>
                      <p className="text-sm">{formatDate(selectedRecord.updatedAt)}</p>
                    </div>
                  )}
                  {selectedRecord.approvedByUsername && (
                    <div>
                      <label className="text-xs text-gray-500">Approved By</label>
                      <p className="text-sm">{selectedRecord.approvedByUsername}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedRecord.status === "PENDING_APPROVAL" && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleAction(selectedRecord.transactionId, "REJECTED");
                    }}
                    disabled={processingAction === selectedRecord.transactionId}
                    className="btn-danger flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Request</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAction(selectedRecord.transactionId, "APPROVED");
                    }}
                    disabled={processingAction === selectedRecord.transactionId}
                    className="btn-success flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
