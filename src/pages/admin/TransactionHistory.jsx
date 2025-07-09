import React, { useEffect, useState } from "react";
import { transactionService } from "../../services/transactionService";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
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
  TrendingDown as TrendingDownIcon,
  Target,
  Award,
  AlertTriangle,
  Grid3X3,
  List,
  Gamepad2,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  Plus,
  RotateCcw,
  Users,
} from "lucide-react";

const TransactionHistory = () => {
  const { admin } = useAuth();
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
  const [viewMode, setViewMode] = useState("card"); // table or card
  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState("all");
  
  // Game transaction form states
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    user_id: "",
    username: "",
    transaction_type: "credit",
    amount: "",
    game: "Ludo",
    round_id: "",
    reason: ""
  });
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchingUser, setSearchingUser] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.user) params.username = filters.user;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (search) params.search = search;
      if (filters.dateRange !== "all") params.dateRange = filters.dateRange;
      
      // Fetch game transactions instead of finance records
      const res = await transactionService.getGameTransactions(params);
      setRecords(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    setStatsLoading(true);
    try {
      const stats = await transactionService.getTransactionStatistics(periodFilter);
      setStatistics(stats);
    } catch (e) {
      toast.error("Failed to load statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchStatistics();
    // eslint-disable-next-line
  }, [page, filters, periodFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        border: 'border-yellow-200',
        icon: Clock 
      },
      completed: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        border: 'border-green-200',
        icon: Check 
      },
      failed: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        border: 'border-red-200',
        icon: AlertCircle 
      },
      // Keep finance statuses for backward compatibility
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
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };



  const getTypeBadge = (type) => {
    const typeConfig = {
      credit: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: TrendingUp
      },
      debit: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: TrendingDown
      },
      rollback: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        icon: RotateCcw
      }
    };
    
    const config = typeConfig[type] || typeConfig.credit;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3 h-3 mr-1" />
        <span className="capitalize">{type}</span>
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

  const getPeriodLabel = (period) => {
    switch (period) {
      case "today": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "quarter": return "This Quarter";
      case "year": return "This Year";
      default: return "All Time";
    }
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

  // User search function
  const searchUsers = async (query) => {
    if (!query || query.length < 3) {
      setUserSearchResults([]);
      return;
    }
    
    setSearchingUser(true);
    try {
      const response = await userService.getUsers({ 
        search: query, 
        limit: 10 
      });
      setUserSearchResults(response.data?.users || []);
    } catch (error) {
      toast.error("Failed to search users");
      setUserSearchResults([]);
    } finally {
      setSearchingUser(false);
    }
  };

  // Handle user selection
  const selectUser = (user) => {
    setTransactionForm(prev => ({
      ...prev,
      user_id: user.chatId,
      username: user.username
    }));
    setUserSearchResults([]);
  };

  // Handle transaction form submission
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionForm.user_id || !transactionForm.username || !transactionForm.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const transactionData = {
        user_id: transactionForm.user_id,
        username: transactionForm.username,
        transaction_type: transactionForm.transaction_type,
        amount: parseFloat(transactionForm.amount),
        game: transactionForm.game,
        round_id: transactionForm.round_id || `manual-${Date.now()}`,
        reason: transactionForm.reason || "Manual transaction by admin"
      };

      await transactionService.createTransaction(transactionData);
      
      toast.success(`${transactionForm.transaction_type} transaction created successfully`);
      
      // Reset form
      setTransactionForm({
        user_id: "",
        username: "",
        transaction_type: "credit",
        amount: "",
        game: "Ludo",
        round_id: "",
        reason: ""
      });
      setShowTransactionForm(false);
      
      // Refresh records
      fetchRecords();
      fetchStatistics();
    } catch (error) {
      toast.error(error.message || "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle rollback transaction
  const handleRollback = async (transaction) => {
    if (!confirm(`Are you sure you want to rollback this ${transaction.transaction_type} transaction?`)) {
      return;
    }

    try {
      await transactionService.rollbackTransaction(transaction.transaction_id, {
        adminUsername: admin?.username,
        reason: "Manual rollback by admin"
      });
      
      toast.success("Transaction rolled back successfully");
      fetchRecords();
      fetchStatistics();
    } catch (error) {
      toast.error(error.message || "Failed to rollback transaction");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Gamepad2 className="w-8 h-8 text-purple-600 mr-3" />
            Game Transactions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage game debit and credit operations
          </p>
        </div>
        {/* Removed New Transaction button */}
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Create Game Transaction</h3>
          <button
                  onClick={() => setShowTransactionForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
          >
                  <X className="w-6 h-6" />
          </button>
              </div>
            </div>
            
            <form onSubmit={handleTransactionSubmit} className="p-6 space-y-6">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search User *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by username..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    value={transactionForm.username}
                    onChange={(e) => {
                      setTransactionForm(prev => ({ ...prev, username: e.target.value }));
                      searchUsers(e.target.value);
                    }}
                    onFocus={() => searchUsers(transactionForm.username)}
                  />
                  {searchingUser && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* User search results */}
                {userSearchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                    {userSearchResults.map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => selectUser(user)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-gray-500">Balance: {formatCurrency(user.balance)}</div>
                        </div>
                        <Users className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type *
                </label>
                <select
                  value={transactionForm.transaction_type}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, transaction_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                >
                  <option value="credit">Credit (Add Money)</option>
                  <option value="debit">Debit (Remove Money)</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (ETB) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter amount..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              {/* Game */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game
                </label>
                <input
                  type="text"
                  placeholder="Game name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  value={transactionForm.game}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, game: e.target.value }))}
                />
              </div>

              {/* Round ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round ID
                </label>
                <input
                  type="text"
                  placeholder="Round ID (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  value={transactionForm.round_id}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, round_id: e.target.value }))}
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  placeholder="Transaction reason (optional)"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  value={transactionForm.reason}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTransactionForm(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
          className="btn-primary flex items-center space-x-2"
                  disabled={submitting || !transactionForm.user_id || !transactionForm.amount}
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{submitting ? "Creating..." : "Create Transaction"}</span>
        </button>
      </div>
            </form>
            </div>
        </div>
      )}

      {/* Period Filter */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Statistics Period:</span>
          </div>
          <select
            className="input-field w-44"
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Comprehensive Statistics */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : statistics ? (
        <>
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.overview.totalTransactions}</p>
                  <p className="text-xs text-gray-800">{getPeriodLabel(periodFilter)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Finance Records</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.overview.totalFinanceRecords}</p>
                  <p className="text-xs text-gray-800">{getPeriodLabel(periodFilter)}</p>
                </div>
                <CreditCard className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(statistics.overview.totalAmount)}</p>
                  <p className="text-xs text-gray-800">All transactions</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Avg Transaction</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(statistics.overview.avgTransactionAmount)}</p>
                  <p className="text-xs text-gray-800">Per transaction</p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Transaction Type Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-green-500 to-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Credit Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.transactions.credit.count}</p>
                  <p className="text-xs text-gray-800">{formatCurrency(statistics.transactions.credit.amount)}</p>
                </div>
                <TrendingUpIcon2 className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="card bg-gradient-to-br from-red-500 to-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Debit Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.transactions.debit.count}</p>
                  <p className="text-xs text-gray-800">{formatCurrency(statistics.transactions.debit.amount)}</p>
                </div>
                <TrendingDownIcon2 className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div className="card bg-gradient-to-br from-orange-500 to-orange-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Rollback Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.transactions.rollback.count}</p>
                  <p className="text-xs text-gray-800">System corrections</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <div className="card bg-gradient-to-br from-cyan-500 to-cyan-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-semibold">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.transactions.successRate}%</p>
                  <p className="text-xs text-gray-800">Transaction success</p>
                </div>
                <Award className="w-8 h-8 text-cyan-400" />
        </div>
            </div>
          </div>



          {/* Top Games */}
          {statistics.activity.topGames && statistics.activity.topGames.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Top Games
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {statistics.activity.topGames.map((game, index) => (
                  <div key={game._id} className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{game.count}</div>
                    <div className="text-sm text-gray-600">{game._id || "Unknown Game"}</div>
                    <div className="text-xs text-gray-400">{formatCurrency(game.totalAmount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}


        </>
      ) : null}

      {/* Game Profits Section */}
      {statistics?.gameProfits && statistics.gameProfits.length > 0 && (
        <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Gamepad2 className="w-5 h-5 mr-2 text-purple-500" />
            Game Profits
              </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistics.gameProfits
              .sort((a, b) => b.profit - a.profit)
              .map((game) => {
                // Emoji/icon for each game
                const gameIcons = {
                  Ludo: "🎲",
                  Bingo: "📍",
                  Chess: "♟️",
                  Carrom: "🪃",
                  default: "🎮"
                };
                const icon = gameIcons[game.game] || gameIcons.default;
                // Breakdown bar calculation
                const total = game.debit + game.credit + game.rollback || 1;
                const debitPct = (game.debit / total) * 100;
                const creditPct = (game.credit / total) * 100;
                const rollbackPct = (game.rollback / total) * 100;
                return (
                  <div
                    key={game.game}
                    className="rounded-xl p-5 shadow bg-gradient-to-br from-white to-gray-50 border border-gray-100 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="text-4xl mb-2">{icon}</div>
                    <div className="text-lg font-bold text-gray-900 mb-1">{game.game}</div>
                    <div className={`text-2xl font-extrabold mb-2 ${game.profit > 0 ? 'text-green-600' : game.profit < 0 ? 'text-red-600' : 'text-gray-500'}`}>{game.profit > 0 ? '+' : ''}{formatCurrency(game.profit)}</div>
                    {/* Breakdown bar */}
                    <div className="w-full h-3 rounded-full bg-gray-200 flex overflow-hidden mb-2">
                      <div style={{ width: `${debitPct}%` }} className="bg-blue-400 h-full" title={`Debit: ${formatCurrency(game.debit)}`}></div>
                      <div style={{ width: `${creditPct}%` }} className="bg-gray-400 h-full" title={`Credit: ${formatCurrency(game.credit)}`}></div>
                      <div style={{ width: `${rollbackPct}%` }} className="bg-orange-400 h-full" title={`Rollback: ${formatCurrency(game.rollback)}`}></div>
                  </div>
                    <div className="flex justify-between w-full text-xs text-gray-500 mt-1">
                      <span>Debit: <span className="font-semibold text-blue-700">{formatCurrency(game.debit)}</span></span>
                      <span>Credit: <span className="font-semibold text-gray-700">{formatCurrency(game.credit)}</span></span>
                      <span>Rollback: <span className="font-semibold text-orange-700">{formatCurrency(game.rollback)}</span></span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
          )}

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
                className="w-56 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
              />
            </div>
          </div>

          <select
            className="input-field w-44"
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="rollback">Rollback</option>
          </select>

          <select
            className="input-field w-44"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            className="input-field w-44"
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
          <span className="text-sm font-medium text-gray-700">View Mode:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === "table"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === "card"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Card View</span>
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {records.length} {records.length === 1 ? 'transaction' : 'transactions'} found
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
                    Game Info
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
                      key={record.transaction_id || record._id}
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
                              <span className="font-mono text-xs">{record.user_id}</span>
                            </div>
                            {record.user && (
                              <div className="text-xs text-gray-400">
                                Balance: {formatCurrency(record.user.balance)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getTypeBadge(record.transaction_type)}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            ID: {record.transaction_id}
                          </div>
                          {record.rollback && (
                            <div className="text-xs text-orange-600 flex items-center">
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Rolled Back
                            </div>
                          )}
                      </div>
                    </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(record.amount)}
                      </div>
                          <div className="text-xs text-gray-500">
                          {record.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(record.amount)}
                      </div>
                    </td>
                      <td className="px-6 py-4">
                      {getStatusBadge(record.status)}
                    </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {record.game || "Ludo"}
                        </div>
                        {record.round_id && (
                          <div className="text-xs text-gray-500 font-mono">
                            Round: {record.round_id}
                          </div>
                        )}
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
                        <div className="flex items-center space-x-2">
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
                key={record.transaction_id || record._id}
                className="card hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500"
                onClick={() => {
                  setSelectedRecord(record);
                  setShowDetails(true);
                }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {record.username || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">{record.user_id}</p>
                      {record.user && (
                        <p className="text-xs text-gray-400">Balance: {formatCurrency(record.user.balance)}</p>
                      )}
                    </div>
                  </div>
                  {getTypeBadge(record.transaction_type)}
                </div>

                {/* Card Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(record.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge(record.status)}
                  </div>

                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Game:</span>
                    <span className="text-sm text-gray-900">
                      {record.game || "Ludo"}
                    </span>
                  </div>

                  {record.round_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Round ID:</span>
                      <span className="text-sm text-gray-900 font-mono">
                        {record.round_id}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(record.createdAt)}
                    </span>
                  </div>

                  {record.rollback && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-xs text-orange-600 flex items-center">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Rolled Back
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecord(record);
                      setShowDetails(true);
                    }}
                      className="btn-secondary btn-sm flex items-center space-x-1 flex-1 justify-center"
                  >
                    <Eye className="w-3 h-3" />
                      <span>Details</span>
                  </button>
                  </div>
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
                    <label className="text-xs text-gray-500">User ID</label>
                    <p className="text-sm font-mono">{selectedRecord.user_id}</p>
                  </div>
                  {selectedRecord.user && (
                    <div>
                      <label className="text-xs text-gray-500">Current Balance</label>
                      <p className="text-sm font-medium">{formatCurrency(selectedRecord.user.balance)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Game Transaction Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Transaction ID</label>
                    <p className="text-sm font-mono">{selectedRecord.transaction_id}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Type</label>
                    <div className="mt-1">{getTypeBadge(selectedRecord.transaction_type)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Amount</label>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedRecord.amount)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                  </div>
                    <div>
                    <label className="text-xs text-gray-500">Game</label>
                    <p className="text-sm font-medium">{selectedRecord.game || "Ludo"}</p>
                  </div>
                  {selectedRecord.round_id && (
                    <div>
                      <label className="text-xs text-gray-500">Round ID</label>
                      <p className="text-sm font-mono">{selectedRecord.round_id}</p>
                    </div>
                  )}
                  {selectedRecord.rollback && (
                    <div>
                      <label className="text-xs text-gray-500">Rollback Status</label>
                      <p className="text-sm text-orange-600 flex items-center">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Transaction Rolled Back
                      </p>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
