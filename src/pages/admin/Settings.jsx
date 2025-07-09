import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Database,
  Bell,
  Monitor,
  Smartphone,
  CheckCircle,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { settingsService } from "../../services/settingsService";
import toast from "react-hot-toast";

const Settings = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);
  const [logoutOthersLoading, setLogoutOthersLoading] = useState(false);

  const [platformName, setPlatformName] = useState("Gaming Platform");
  const [platformVersion, setPlatformVersion] = useState("1.0.0");
  const [generalLoading, setGeneralLoading] = useState(false);

  const settingsTabs = [
    {
      id: "general",
      name: "General Settings",
      icon: SettingsIcon,
      description: "Basic platform settings",
      accessible: true,
    },
    {
      id: "security",
      name: "Security Settings",
      icon: Shield,
      description: "Security settings",
      accessible: true,
    },
  ];

  const handleTabClick = (tabId) => {
    const tab = settingsTabs.find((t) => t.id === tabId);
    if (tab && tab.accessible) {
      setActiveTab(tabId);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await settingsService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmNewPassword
      );
      toast.success("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const data = await settingsService.listSessions();
      setSessions(data);
    } catch (err) {
      toast.error("Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setLogoutAllLoading(true);
    try {
      await settingsService.logoutAllSessions();
      toast.success("Logged out from all devices. Please log in again.");
      setSessions([]);
      setShowSessions(false);
      // Optionally, redirect to login
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("Failed to logout from all devices");
    } finally {
      setLogoutAllLoading(false);
    }
  };

  const handleLogoutOthers = async () => {
    setLogoutOthersLoading(true);
    try {
      await settingsService.logoutOtherSessions();
      toast.success("Logged out from other sessions.");
      fetchSessions();
    } catch (err) {
      toast.error("Failed to logout from other sessions");
    } finally {
      setLogoutOthersLoading(false);
    }
  };

  const getCurrentSessionId = () => {
    // Try to find the current session by matching the current token in localStorage
    const token = localStorage.getItem("token");
    // The backend does not return the token for security, so we can't match directly.
    // As a workaround, highlight the most recent session as current.
    return sessions.length > 0 ? sessions[0]._id : null;
  };

  const parseDevice = (userAgent = "") => {
    if (/mobile/i.test(userAgent)) return { icon: <Smartphone className="inline w-4 h-4 mr-1 text-blue-500" />, label: "Mobile" };
    if (/windows|macintosh|linux/i.test(userAgent)) return { icon: <Monitor className="inline w-4 h-4 mr-1 text-purple-500" />, label: "Desktop" };
    return { icon: <Monitor className="inline w-4 h-4 mr-1 text-gray-400" />, label: "Unknown" };
  };

  const handleGeneralSave = async (e) => {
    e.preventDefault();
    setGeneralLoading(true);
    try {
      await settingsService.updateSetting("platformName", platformName);
      await settingsService.updateSetting("platformVersion", platformVersion);
      toast.success("General settings updated!");
    } catch (err) {
      toast.error("Failed to update general settings");
    } finally {
      setGeneralLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <form className="bg-white p-6 rounded-lg shadow" onSubmit={handleGeneralSave}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Platform Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Platform Name
            </label>
            <input
              type="text"
              value={platformName}
              onChange={e => setPlatformName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Platform Version
            </label>
            <input
              type="text"
              value={platformVersion}
              onChange={e => setPlatformVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-60"
          disabled={generalLoading}
        >
          {generalLoading ? "Saving..." : "Save Changes"}
            </button>
      </form>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Password Settings
        </h3>
        <form className="space-y-4" onSubmit={submitPasswordChange}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-60"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-500" />
          Manage your active login sessions
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Active Sessions
              </label>
              <p className="text-sm text-gray-500">
                View and manage all devices where you are logged in
              </p>
            </div>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => {
                setShowSessions((v) => !v);
                if (!showSessions) fetchSessions();
              }}
              title={showSessions ? "Hide sessions" : "Show active sessions"}
            >
              {showSessions ? "Hide Sessions" : "View Sessions"}
            </button>
          </div>
          {showSessions && (
            <div className="bg-gray-50 rounded p-4 mt-2">
              {sessionsLoading ? (
                <div className="text-gray-500">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-gray-500">No active sessions found.</div>
              ) : (
                <table className="min-w-full text-sm border rounded overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left font-semibold text-gray-700 px-3 py-2">Device</th>
                      <th className="text-left font-semibold text-gray-700 px-3 py-2">IP</th>
                      <th className="text-left font-semibold text-gray-700 px-3 py-2">Issued</th>
                      <th className="text-left font-semibold text-gray-700 px-3 py-2">Expires</th>
                      <th className="text-left font-semibold text-gray-700 px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, idx) => {
                      const device = parseDevice(s.userAgent);
                      const isCurrent = idx === 0; // Most recent session is current
                      return (
                        <tr
                          key={s._id}
                          className={
                            "hover:bg-blue-50 transition " +
                            (isCurrent ? "bg-blue-50" : "")
                          }
                        >
                          <td className="py-2 px-3 flex items-center">
                            {device.icon}
                            <span className="mr-2">{device.label}</span>
                            <span className="text-xs text-gray-500">{s.userAgent?.split(" ")[0]}</span>
                          </td>
                          <td className="py-2 px-3">{s.ip}</td>
                          <td className="py-2 px-3">{new Date(s.issuedAt).toLocaleString()}</td>
                          <td className="py-2 px-3">{new Date(s.expiresAt).toLocaleString()}</td>
                          <td className="py-2 px-3">
                            {isCurrent ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                                <CheckCircle className="w-3 h-3 mr-1" /> This device
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium">
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600 disabled:opacity-60"
                  onClick={handleLogoutOthers}
                  disabled={logoutOthersLoading || sessions.length <= 1}
                  title="Logout from all other devices except this one"
                >
                  {logoutOthersLoading ? "Logging out..." : "Logout Other Sessions"}
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-60"
                  onClick={handleLogoutAll}
                  disabled={logoutAllLoading}
                  title="Logout from all devices (including this one)"
                >
                  {logoutAllLoading ? "Logging out..." : "Logout All Sessions"}
          </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "security":
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                disabled={!tab.accessible}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-900"
                    : tab.accessible
                    ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="flex items-center">
                    {tab.name}
                    {!tab.accessible && (
                      <Shield className="ml-2 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {tab.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
