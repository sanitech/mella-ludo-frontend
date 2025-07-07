import React, { useEffect, useState } from "react";
import { transactionService } from "../../services/transactionService";
import toast from "react-hot-toast";
import { 
  RefreshCw, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Check, 
  X, 
  User,
  DollarSign,
  Calendar,
  BarChart3,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CreditCard,
  Shield,
  Zap,
  Download,
  Info,
  MoreHorizontal,
  Activity,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from "lucide-react";

const TransactionHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({ 
    user: "", 
    type: "", 
    status: "",
    dateRange: "all"
  });
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // table or card

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.user) params.username = filters.user;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (search) params.search = search;
      if (filters.dateRange !== "all") params.dateRange = filters.dateRange;
      
      const res = await transactionService.getAllFinanceRecords(params);
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
  }, [page, filters]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        border: 'border-yellow-200',
        icon: Clock 
      },
      APPROVED: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        border: 'border-green-200',
        icon: Check 
      },
      REJECTED: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        border: 'border-red-200',
        icon: X 
      },
      COMPLETED: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        border: 'border-blue-200',
        icon: Check 
      },
      DECLINED: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        border: 'border-red-200',
        icon: X 
      },
      FAILED: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        border: 'border-red-200',
        icon: AlertCircle 
      }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'deposit' ? (
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

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const stats = {
    total: records.length,
    deposits: records.filter(r => r.type === 'deposit').length,
    withdrawals: records.filter(r => r.type === 'withdrawal').length,
    totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
    pending: records.filter(r => r.status === 'PENDING').length,
    completed: records.filter(r => r.status === 'COMPLETED' || r.status === 'APPROVED').length,
    rejected: records.filter(r => r.status === 'REJECTED' || r.status === 'DECLINED').length,
  };

  const handleFilter = () => {
    setPage(1);
    fetchRecords();
  };

  const clearFilters = () => {
    setFilters({ user: '', type: '', status: '', dateRange: 'all' });
    setSearch('');
    setPage(1);
  };

  const exportData = () => {
    // Implementation for exporting transaction data
    toast.success("Export functionality coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            Transaction History
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive view of all financial transactions and records
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportData}
            className="btn-secondary flex items-center space-x-2"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={fetchRecords}
            className="btn-primary flex items-center space-x-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Transactions <span className='opacity-60'>(This page)</span></p>
              <p className="text-2xl font-bold">{stats.total ?? 0}</p>
            </div>
            <BarChart3 className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Deposits <span className='opacity-60'>(This page)</span></p>
              <p className="text-2xl font-bold">{stats.deposits ?? 0}</p>
            </div>
            <TrendingUpIcon className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Withdrawals <span className='opacity-60'>(This page)</span></p>
              <p className="text-2xl font-bold">{stats.withdrawals ?? 0}</p>
            </div>
            <TrendingDownIcon className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Amount <span className='opacity-60'>(This page)</span></p>
              <p className="text-lg font-bold">{formatCurrency(stats.totalAmount ?? 0)}</p>
            </div>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending <span className='opacity-60'>(This page)</span></p>
              <p className="text-xl font-bold">{stats.pending ?? 0}</p>
            </div>
            <Clock className="w-6 h-6 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completed <span className='opacity-60'>(This page)</span></p>
              <p className="text-xl font-bold">{stats.completed ?? 0}</p>
            </div>
            <Check className="w-6 h-6 opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rejected <span className='opacity-60'>(This page)</span></p>
              <p className="text-xl font-bold">{stats.rejected ?? 0}</p>
            </div>
            <X className="w-6 h-6 opacity-80" />
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
                placeholder="Search by username, transaction ID, or reason..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Username..."
            className="input-field w-40"
            value={filters.user}
            onChange={e => setFilters(f => ({ ...f, user: e.target.value }))}
          />

          <select
            className="input-field w-40"
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>

          <select
            className="input-field w-40"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="DECLINED">Declined</option>
            <option value="FAILED">Failed</option>
          </select>

          <select
            className="input-field w-40"
            value={filters.dateRange}
            onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value }))}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleFilter} 
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

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "table"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "card"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Card View
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {records.length} transactions found
        </div>
      </div>

      {/* Records Display */}
      {viewMode === "table" ? (
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
                        <span className="text-gray-500 font-medium">Loading transactions...</span>
                        <span className="text-sm text-gray-400 mt-1">Please wait while we fetch the latest data</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-center">
                        <BarChart3 className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No transactions found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {filters.user || filters.type || filters.status || search
                            ? "Try adjusting your filters or search terms."
                            : "There are currently no transactions to display."}
                        </p>
                        {(filters.user || filters.type || filters.status || search) && (
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
                      key={record._id || record.transactionId}
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
                              {record.username || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              {record.chatId}
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
                            ID: {record.transactionId || record._id}
                          </div>
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
                        <div className="text-xs text-gray-500">
                          {getRelativeTime(record.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mb-3" />
              <span className="text-gray-500 font-medium">Loading transactions...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BarChart3 className="mx-auto w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record._id || record.transactionId}
                className="card hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  setSelectedRecord(record);
                  setShowDetails(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900">
                        {record.username || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {record.chatId}
                      </div>
                    </div>
                  </div>
                  {getTypeBadge(record.type)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Amount</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(record.amount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    {getStatusBadge(record.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(record.createdAt)}
                    </span>
                  </div>
                  
                  {record.reason && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-sm text-gray-500">Reason</div>
                      <div className="text-sm text-gray-900 truncate" title={record.reason}>
                        {record.reason}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

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
                    <p className="text-sm font-mono">{selectedRecord.transactionId || selectedRecord._id}</p>
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
                  {selectedRecord.balanceAfter && (
                    <div>
                      <label className="text-xs text-gray-500">Balance After</label>
                      <p className="text-sm font-medium">{formatCurrency(selectedRecord.balanceAfter)}</p>
                    </div>
                  )}
                  {selectedRecord.paymentMethod && (
                    <div>
                      <label className="text-xs text-gray-500">Payment Method</label>
                      <p className="text-sm">{selectedRecord.paymentMethod}</p>
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

              {/* Reason */}
              {selectedRecord.reason && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Reason
                  </h4>
                  <p className="text-sm text-gray-900">{selectedRecord.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
