import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Users,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Shield,
  ShieldCheck,
  ShieldX,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import {
  parseApiError,
  getFieldError,
  isValidationError,
  isConflictError,
  isFieldConflictError,
} from "../../utils/errorHandler";
import FormField from "../../components/common/FormField";
import ErrorTest from "../../components/dev/ErrorTest";
import toast from "react-hot-toast";





const AdminManagement = () => {
  const { admin, token } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const clearFormErrors = () => {
    setFormErrors({});
  };

  const loadAdmins = async () => {
    setLoading(true);
    try {
      console.log("Loading admins...");
      const response = await adminService.getAllAdmins();
      console.log("Admins loaded:", response);
      setAdmins(response.admins || []);
      toast.success(`Loaded ${response.admins?.length || 0} admin accounts`);
    } catch (error) {
      console.error("Error loading admins:", error);
      const parsedError = parseApiError(error);
      toast.error(parsedError.message);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    clearFormErrors();

    // Basic client-side validation
    const errors = {};

    if (!adminForm.username.trim()) {
      errors.username = "Username is required";
    } else if (adminForm.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(adminForm.username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!adminForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!adminForm.password) {
      errors.password = "Password is required";
    } else if (adminForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
        adminForm.password
      )
    ) {
      errors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the validation errors");
      return;
    }

    setCreating(true);
    try {
      console.log("Creating admin:", adminForm);
      const response = await adminService.createAdmin(adminForm);
      console.log("Admin created:", response);
      toast.success("Admin created successfully!");
      setShowCreateForm(false);
      resetForm();
      loadAdmins();
    } catch (error) {
      console.error("=== ERROR DEBUGGING ===");
      console.error("Raw error:", error);
      console.error("Error response:", error.response);
      console.error(
        "Error response data:",
        JSON.stringify(error.response?.data, null, 2)
      );
      console.error("Error response status:", error.response?.status);

      const parsedError = parseApiError(error);
      console.error("Parsed error:", parsedError);
      console.error("Parsed error message:", parsedError.message);
      console.error("Parsed error status:", parsedError.status);
      console.error("Parsed error errors:", parsedError.errors);
      console.error("Parsed error errors length:", parsedError.errors?.length);

      console.error("Is validation error:", isValidationError(parsedError));
      console.error("Is conflict error:", isConflictError(parsedError));
      console.error(
        "Is field conflict error:",
        isFieldConflictError(parsedError)
      );
      console.error("=== END ERROR DEBUGGING ===");

      if (isValidationError(parsedError) || isFieldConflictError(parsedError)) {
        // Handle validation errors and field conflicts
        const newErrors = {};
        console.error("Processing validation/conflict errors...");
        parsedError.errors?.forEach((err) => {
          console.error(
            "Processing error field:",
            err.field,
            "message:",
            err.message
          );
          if (err.field === "username") {
            newErrors.username = err.message;
            console.error("Set username error:", err.message);
          }
          if (err.field === "email") {
            newErrors.email = err.message;
            console.error("Set email error:", err.message);
          }
          if (err.field === "password") {
            newErrors.password = err.message;
            console.error("Set password error:", err.message);
          }
          if (err.field === "role") {
            newErrors.role = err.message;
            console.error("Set role error:", err.message);
          }
        });
        console.error("Final form errors to set:", newErrors);
        setFormErrors(newErrors);
        toast.error("Please fix the validation errors");
      } else if (isConflictError(parsedError)) {
        // Handle general conflict errors (fallback)
        console.error("General conflict error:", parsedError.message);
        toast.error(parsedError.message);
      } else {
        // Handle other errors
        console.error("Other error, showing toast:", parsedError.message);
        toast.error(parsedError.message);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminForm({
      username: admin.username,
      email: admin.email,
      password: "",
      role: admin.role === "super_admin" ? "admin" : admin.role,
    });
    setShowCreateForm(true);
    clearFormErrors();
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    clearFormErrors();

    if (!editingAdmin) return;

    // Basic client-side validation
    const errors = {};

    if (!adminForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (adminForm.password && adminForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      adminForm.password &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
        adminForm.password
      )
    ) {
      errors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the validation errors");
      return;
    }

    setCreating(true);
    try {
      const updateData = {
        email: adminForm.email,
        role: adminForm.role,
      };

      if (adminForm.password) {
        updateData.password = adminForm.password;
      }

      console.log("Updating admin:", editingAdmin._id, updateData);
      const response = await adminService.updateAdmin(
        editingAdmin._id,
        updateData
      );
      console.log("Admin updated:", response);
      toast.success("Admin updated successfully!");
      setShowCreateForm(false);
      setEditingAdmin(null);
      resetForm();
      loadAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
      const parsedError = parseApiError(error);

      if (isValidationError(parsedError)) {
        // Handle validation errors
        const newErrors = {};
        parsedError.errors?.forEach((err) => {
          if (err.field === "email") newErrors.email = err.message;
          if (err.field === "password") newErrors.password = err.message;
          if (err.field === "role") newErrors.role = err.message;
        });
        setFormErrors(newErrors);
        toast.error("Please fix the validation errors");
      } else {
        // Handle other errors
        toast.error(parsedError.message);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleToggleAdminStatus = async (
    adminId,
    isActive
  ) => {
    try {
      if (isActive) {
        await adminService.activateAdmin(adminId);
        toast.success("Admin activated successfully!");
      } else {
        await adminService.deactivateAdmin(adminId);
        toast.success("Admin deactivated successfully!");
      }
      loadAdmins();
    } catch (error) {
      const parsedError = parseApiError(error);
      toast.error(parsedError.message);
    }
  };

  const handleDeleteAdmin = async (adminId, username) => {
    if (
      window.confirm(
        `Are you sure you want to delete admin "${username}"? This action cannot be undone.`
      )
    ) {
      try {
        await adminService.deleteAdmin(adminId);
        toast.success("Admin deleted successfully!");
        loadAdmins();
      } catch (error) {
        const parsedError = parseApiError(error);
        toast.error(parsedError.message);
      }
    }
  };

  const resetForm = () => {
    setAdminForm({
      username: "",
      email: "",
      password: "",
      role: "admin",
    });
    setEditingAdmin(null);
    clearFormErrors();
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || admin.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && admin.isActive) ||
      (statusFilter === "inactive" && !admin.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case "super_admin":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case "moderator":
        return <ShieldX className="h-4 w-4 text-yellow-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "moderator":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && admins.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Admin
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
                placeholder="Search admins by username or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="input-field w-32"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
          <select
            className="input-field w-32"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Create/Edit Admin Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingAdmin ? "Edit Admin" : "Create New Admin"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin}
              className="space-y-4"
            >
              <FormField
                label="Username"
                name="username"
                type="text"
                required={!editingAdmin}
                disabled={!!editingAdmin}
                value={adminForm.username}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, username: e.target.value })
                }
                error={formErrors.username}
                placeholder="Enter username"
                helpText={
                  !editingAdmin
                    ? "3-30 characters, letters/numbers/underscores only"
                    : undefined
                }
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                required
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                error={formErrors.email}
                placeholder="Enter email address"
              />

              <FormField
                label="Password"
                name="password"
                type="password"
                required={!editingAdmin}
                minLength={8}
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                error={formErrors.password}
                placeholder={
                  editingAdmin
                    ? "Leave blank to keep current"
                    : "Enter password"
                }
                helpText={
                  !editingAdmin
                    ? "Must contain uppercase, lowercase, number, and special character"
                    : undefined
                }
              />

              <FormField
                label="Role"
                name="role"
                type="select"
                required
                value={adminForm.role}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    role: e.target.value,
                  })
                }
                error={formErrors.role}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "moderator", label: "Moderator" },
                ]}
              />

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {creating ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {editingAdmin ? "Updating..." : "Creating..."}
                      </span>
                    </div>
                  ) : editingAdmin ? (
                    "Update Admin"
                  ) : (
                    "Create Admin"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
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

      {/* Admins Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {admin.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {admin.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {admin.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(admin.role)}
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                          admin.role
                        )}`}
                      >
                        {admin.role.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.createdBy?.username || "System"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Admin"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleAdminStatus(admin._id, !admin.isActive)
                        }
                        className={
                          admin.isActive
                            ? "text-yellow-600 hover:text-yellow-900"
                            : "text-green-600 hover:text-green-900"
                        }
                        title={admin.isActive ? "Deactivate" : "Activate"}
                      >
                        {admin.isActive ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                      {admin._id !== admin?._id &&
                        admin.role !== "super_admin" && (
                          <button
                            onClick={() =>
                              handleDeleteAdmin(admin._id, admin.username)
                            }
                            className="text-red-600 hover:text-red-900"
                            title="Delete Admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAdmins.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No admins found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating a new admin."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Contact your system administrator if you need access to this panel.
        </p>
      </div>
    </div>
  );
};

export default AdminManagement;
