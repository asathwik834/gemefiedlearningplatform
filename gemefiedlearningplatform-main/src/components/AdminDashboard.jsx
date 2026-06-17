import { useState, useEffect } from "react";
import { Search, UserPlus, Edit2, Trash2, X, AlertCircle, CheckCircle, Shield, Users, Mail, Phone, MapPin } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
    role: "student",
    grade: ""
  });
  
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users from MySQL
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      showFeedback("error", "Failed to retrieve users from MySQL database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = (isEdit = false) => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Full Name is required";
    
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = "Email is invalid";
    }
    
    if (!formData.phone_number.trim()) {
      nextErrors.phone_number = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(formData.phone_number)) {
      nextErrors.phone_number = "Phone number is invalid";
    }
    
    if (!formData.address.trim()) nextErrors.address = "Address is required";
    
    if (!isEdit && !formData.password) {
      nextErrors.password = "Password is required";
    } else if (!isEdit && formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
    
    return nextErrors;
  };

  // CREATE: Add User
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(false);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create user");
      
      showFeedback("success", "✓ User registered successfully in MySQL database!");
      setIsAddModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATE: Edit User
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(true);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update user");
      
      showFeedback("success", "✓ User updated successfully in MySQL database!");
      setIsEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE: Delete User
  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete user");
      
      showFeedback("success", "✓ User deleted successfully from MySQL database!");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
      password: "", // Blank unless updating
      role: user.role,
      grade: user.grade || ""
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      address: "",
      password: "",
      role: "student",
      grade: ""
    });
    setErrors({});
    setSelectedUser(null);
  };

  // Filters and Searching
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.includes(searchQuery);
      
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getStats = () => {
    const total = users.length;
    const students = users.filter(u => u.role === "student").length;
    const teachers = users.filter(u => u.role === "teacher").length;
    const admins = users.filter(u => u.role === "admin").length;
    return { total, students, teachers, admins };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MySQL Registered Users CRUD Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Direct, dynamic connection to MySQL table `users` with real-time operations.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 text-sm self-start md:self-auto"
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </button>
        </div>

        {/* Feedback Messages */}
        {feedback.message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 border animate-fade-in ${
              feedback.type === "success"
                ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-400"
                : "bg-rose-950/50 border-rose-500/30 text-rose-400"
            }`}
          >
            {feedback.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="font-medium text-sm">{feedback.message}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-bold mt-1 text-indigo-400">{stats.total}</h3>
            </div>
            <div className="bg-indigo-950/50 p-3 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Students</p>
              <h3 className="text-3xl font-bold mt-1 text-emerald-400">{stats.students}</h3>
            </div>
            <div className="bg-emerald-950/50 p-3 rounded-lg border border-emerald-500/20 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Teachers</p>
              <h3 className="text-3xl font-bold mt-1 text-purple-400">{stats.teachers}</h3>
            </div>
            <div className="bg-purple-950/50 p-3 rounded-lg border border-purple-500/20 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Admins</p>
              <h3 className="text-3xl font-bold mt-1 text-pink-400">{stats.admins}</h3>
            </div>
            <div className="bg-pink-950/50 p-3 rounded-lg border border-pink-500/20 text-pink-400">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                roleFilter === "all"
                  ? "bg-slate-800 border-indigo-500/40 text-indigo-300"
                  : "border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter("student")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                roleFilter === "student"
                  ? "bg-slate-800 border-emerald-500/40 text-emerald-300"
                  : "border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setRoleFilter("teacher")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                roleFilter === "teacher"
                  ? "bg-slate-800 border-purple-500/40 text-purple-300"
                  : "border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              Teachers
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                roleFilter === "admin"
                  ? "bg-slate-800 border-pink-500/40 text-pink-300"
                  : "border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              Admins
            </button>
          </div>
        </div>

        {/* Database Table Container */}
        <div className="bg-slate-900/20 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Querying registered user tables directly from MySQL...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-20 text-center">
              <Users className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-400">No users found</h4>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
                There are no user records matching your query or search filter in MySQL database.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-800/80">
                    <th className="p-4 pl-6">ID & Reg Date</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-mono text-xs text-indigo-400 select-all max-w-[120px] truncate" title={user.id}>
                          {user.id}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-100">{user.name}</td>
                      <td className="p-4 font-medium text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          {user.phone_number}
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 max-w-[200px] truncate" title={user.address}>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                          <span>{user.address}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-pink-955/35 text-pink-400 border border-pink-500/20"
                              : user.role === "teacher"
                              ? "bg-purple-955/35 text-purple-400 border border-purple-500/20"
                              : "bg-emerald-955/35 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {user.role}
                          {user.grade ? ` (Grade ${user.grade})` : ""}
                        </span>
                      </td>
                      <td className="p-4 text-center pr-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-md hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-1.5 rounded-md hover:bg-slate-800 text-rose-500 hover:text-rose-450 transition-colors"
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
          )}
        </div>
      </div>

      {/* ==========================================================
          ADD USER MODAL (Modal Overlay)
         ========================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative animate-scale-up">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 hover:bg-slate-850 p-1.5 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2 border-b border-slate-850 pb-3">
              <UserPlus className="h-5 w-5" />
              Register New User in MySQL
            </h2>
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.name ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500`}
                    placeholder="Jane Smith"
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.email ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500`}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.phone_number ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500`}
                    placeholder="+1 555-019-2834"
                  />
                  {errors.phone_number && <p className="text-xs text-rose-500 mt-1">{errors.phone_number}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.password ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500`}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full bg-slate-950 border ${errors.address ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500`}
                    placeholder="Apartment, Street Address, City, State, ZIP"
                  />
                  {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {formData.role === "student" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Grade (Level)</label>
                    <input
                      type="number"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 8"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 hover:bg-slate-850 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md active:scale-95 text-sm flex items-center justify-center"
                >
                  {isSubmitting ? "Saving to MySQL..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          EDIT USER MODAL (Modal Overlay)
         ========================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative animate-scale-up">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 hover:bg-slate-850 p-1.5 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2 border-b border-slate-850 pb-3">
              <Edit2 className="h-5 w-5" />
              Edit MySQL User Profile
            </h2>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.name ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500`}
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.email ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500`}
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.phone_number ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500`}
                  />
                  {errors.phone_number && <p className="text-xs text-rose-500 mt-1">{errors.phone_number}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Password (Leave blank to keep old)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    placeholder="New password (optional)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full bg-slate-950 border ${errors.address ? "border-rose-500" : "border-slate-800"} rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500`}
                  />
                  {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {formData.role === "student" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Grade (Level)</label>
                    <input
                      type="number"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 hover:bg-slate-850 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md active:scale-95 text-sm flex items-center justify-center"
                >
                  {isSubmitting ? "Updating MySQL..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          DELETE USER CONFIRMATION MODAL
         ========================================================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-scale-up">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 hover:bg-slate-850 p-1.5 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 text-rose-500 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold">Delete Registered User?</h3>
            </div>
            <p className="text-slate-350 text-sm mb-6">
              Are you sure you want to delete user <strong className="text-slate-100">{selectedUser?.name}</strong> (ID: {selectedUser?.id})? This will permanently remove them from the MySQL database and this action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 border-t border-slate-850 pt-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 hover:bg-slate-850 transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-all active:scale-95 text-sm"
              >
                {isSubmitting ? "Deleting in MySQL..." : "Yes, Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
