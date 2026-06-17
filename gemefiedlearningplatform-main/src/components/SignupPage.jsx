import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "student",
    school: "",
    subject: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number is invalid";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (formData.role === "teacher" && !formData.subject) newErrors.subject = "Subject is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setIsLoading(true);
      setSubmitError("");
      const result = await onSignup({
        email: formData.email,
        password: formData.password,
        name: formData.username,
        phone_number: formData.phone_number,
        address: formData.address,
        role: formData.role,
        school: formData.school,
        ...formData.role === "teacher" && { subject: formData.subject }
      });
      if (result.success) {
        navigate("/dashboard");
      } else {
        setSubmitError(result.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSubmitError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Your SkillSprout Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of students and teachers in our interactive learning community
          </p>
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md animate-bounce">{submitError}</div>
          )}
        </div>
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.username ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="John Doe"
                  />
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.email ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.phone_number ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="+1 555-555-5555"
                  />
                  {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700">School Name</label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Springfield High"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className={`mt-1 block w-full border ${errors.address ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="123 Main Street, City, Country"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.password ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">I am a *</label>
                  <div className="mt-2 space-x-6 flex">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={formData.role === "student"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Student</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="teacher"
                        checked={formData.role === "teacher"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Teacher</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === "admin"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Administrator</span>
                    </label>
                  </div>
                </div>
                {formData.role === "teacher" && (
                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.subject ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select Subject</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="biology">Biology</option>
                      <option value="computer-science">Computer Science</option>
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-95 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
