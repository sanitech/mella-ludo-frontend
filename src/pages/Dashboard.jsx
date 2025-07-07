import React, { useState, useEffect } from "react";
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Gamepad2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { admin, isAuthenticated, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState({
    server: "Checking...",
    database: "Checking..."
  });

  useEffect(() => {
    if (isAuthenticated && token) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const loadDashboardData = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const dashboardStats = await dashboardService.getDashboardStats();
      setStats(dashboardStats);
      
      try {
        const status = await dashboardService.getSystemStatus();
        setSystemStatus(status);
      } catch (statusError) {
        setSystemStatus({
          server: "Offline",
          database: "Disconnected"
        });
      }
      
    } catch (error) {
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount);
  };

  const statCards = stats ? [
    {
      title: "Total Users",
      value: stats.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      description: "Registered users"
    },
    {
      title: "Total Balance",
      value: formatCurrency(stats.totalBalance || 0),
      icon: DollarSign,
      color: "bg-green-500",
      change: "+8.5%",
      description: "Platform balance"
    },
    {
      title: "Transactions",
      value: stats.totalTransactions?.toLocaleString() || "0",
      icon: CreditCard,
      color: "bg-purple-500",
      change: "+15%",
      description: "Game transactions"
    },
    {
      title: "Top-ups",
      value: stats.totalTopups?.toLocaleString() || "0",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+23%",
      description: "Admin top-ups"
    },
    {
      title: "Finance Requests",
      value: stats.totalFinanceRequests?.toLocaleString() || "0",
      icon: Activity,
      color: "bg-indigo-500",
      change: "+5%",
      description: "Deposits & withdrawals"
    },
    {
      title: "Active Bans",
      value: (stats.activeBans || 0).toString(),
      icon: AlertTriangle,
      color: "bg-red-500",
      change: "-2",
      description: "Banned users"
    }
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mella Ludo Dashboard</h1>
            <p className="text-gray-600">Please log in to access the dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mella Ludo Dashboard</h1>
            <p className="text-gray-600">Welcome back, {admin?.username}!</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Dashboard Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadDashboardData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mella Ludo Dashboard</h1>
            <p className="text-gray-600">Welcome back, {admin?.username}!</p>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Dashboard Status
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Admin Status:</p>
              <p className="text-sm text-gray-600">
                {admin ? `Logged in as: ${admin.username}` : "Not logged in"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">System Status:</p>
              <p className="text-sm text-gray-600">
                Server: {systemStatus.server} | Database: {systemStatus.database}
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Load Dashboard Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mella Ludo Dashboard</h1>
          <p className="text-gray-600">Welcome back, {admin?.username}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-sm text-green-600 font-medium">{card.change}</span>
                <span className="text-sm text-gray-500 ml-2">{card.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              systemStatus.server === "Online" ? "bg-green-500" : "bg-red-500"
            }`}></div>
            <span className="text-sm text-gray-600">Server: {systemStatus.server}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              systemStatus.database === "Connected" ? "bg-green-500" : "bg-red-500"
            }`}></div>
            <span className="text-sm text-gray-600">Database: {systemStatus.database}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
