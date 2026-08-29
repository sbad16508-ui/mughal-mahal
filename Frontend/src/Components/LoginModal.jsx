import { useEffect, useState } from "react";
import bookingApi from "../bookingApi";
import "./LoginModal.css";

function LoginModal({ show, onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const normalizeBookingUserProfile = (user) => ({
    ...user,
    profileImage: typeof user?.profileImage === "string" ? user.profileImage : null,
  });

  const saveBookingUserProfile = (user) => {
    const normalized = normalizeBookingUserProfile(user);
    if (normalized?.username) {
      localStorage.setItem("bookingUser", normalized.username);
      localStorage.setItem("bookingUserProfile", JSON.stringify(normalized));
      window.dispatchEvent(new CustomEvent("bookingUserProfileChanged", { detail: normalized }));
    }
  };

  const isPasswordStrong = (value) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
    return pattern.test(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && !isPasswordStrong(value)) {
      setPasswordError("Use uppercase, lowercase, number, and special char like . or @.");
    } else {
      setPasswordError("");
    }
  };

  const resetForm = () => {
    setMode("login");
    setUsername("");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCity("");
    setAddress("");
    setPhone("");
    setProfileImage(null);
    setOtp("");
    setError("");
    setSuccess("");
    setPasswordError("");
    setPendingEmail("");
  };

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username/email and password.");
      return;
    }

    try {
      const response = await bookingApi.post("/booking/login", { username: username.trim(), email: username.trim(), password });
      const userProfile = response.data.user;
      saveBookingUserProfile(userProfile);
      onLogin(userProfile);
      setSuccess(response.data.message || "Login successful.");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !username.trim() || !password.trim() || !city.trim() || !address.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isPasswordStrong(password)) {
      setError("Password must include uppercase, lowercase, number and special character.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("email", email.trim());
      formData.append("username", username.trim());
      formData.append("password", password);
      formData.append("city", city.trim());
      formData.append("address", address.trim());
      formData.append("phone", phone.trim());
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await bookingApi.post("/booking/register-init", formData);

      setPendingEmail(email.trim());
      setMode("verify");
      setSuccess(`OTP sent to ${email.trim()}. Please enter it within 10 minutes.`);
      setOtp("");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!pendingEmail || !otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    try {
      const response = await bookingApi.post("/booking/verify-otp", { email: pendingEmail, otp: otp.trim() });
      const userProfile = response.data.user || {
        firstName,
        lastName,
        email: pendingEmail,
        username: username.trim(),
        city,
        address,
        phone,
        profileImage: profileImage ? response.data.profileImage : undefined
      };
      saveBookingUserProfile(userProfile);
      onLogin(userProfile);
      setSuccess("Your email is verified and you are logged in.");
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setProfileImage(file || null);
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImagePreview(null);
    }
  };

  if (!show) return null;

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal">
        <button className="login-modal-close" type="button" onClick={onClose}>
          ×
        </button>

        <div className="login-modal-header">
          <h3>
            {mode === "login"
              ? "Login to book"
              : mode === "register"
              ? "Register for booking"
              : "Verify your OTP"}
          </h3>
          <p>
            {mode === "login"
              ? "Enter your username and password to continue."
              : mode === "register"
              ? "Create an account so you can book and manage your stay."
              : "Enter the OTP sent to your email to complete registration."}
          </p>
        </div>

        {mode === "login" && (
          <form className="login-modal-form" onSubmit={handleLoginSubmit}>
            <label className="login-modal-label" htmlFor="booking-username">Username or Email</label>
            <input
              id="booking-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or Email"
            />

            <label className="login-modal-label" htmlFor="booking-password">Password</label>
            <input
              id="booking-password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
            {passwordError && <div className="login-modal-password-note">{passwordError}</div>}

            {error && <div className="login-modal-error">{error}</div>}
            {success && <div className="login-modal-success">{success}</div>}

            <div className="login-modal-actions">
              <button type="submit" className="login-modal-submit">
                Login
              </button>
            </div>

            <div className="login-modal-switch">
              <span>New here?</span>
              <button
                type="button"
                className="login-modal-link"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                }}
              >
                Register now
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form className="login-modal-form" onSubmit={handleRegisterSubmit}>
            <div className="login-modal-grid">
              <div>
                <label htmlFor="register-firstname">First Name</label>
                <input
                  id="register-firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="register-lastname">Last Name</label>
                <input
                  id="register-lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <label htmlFor="register-city">City</label>
            <input
              id="register-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />

            <label htmlFor="register-address">Address</label>
            <input
              id="register-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />

            <label htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
            />

            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />

            <label className="login-modal-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
            {passwordError && <div className="login-modal-password-note">{passwordError}</div>}

            <label htmlFor="register-profile-image">Profile Image</label>
            <input
              id="register-profile-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {profileImagePreview && (
              <div className="login-modal-image-preview">
                <img src={profileImagePreview} alt="Selected profile preview" />
              </div>
            )}

            {error && <div className="login-modal-error">{error}</div>}
            {success && <div className="login-modal-success">{success}</div>}

            <div className="login-modal-actions">
              <button type="submit" className="login-modal-submit">
                Send OTP
              </button>
            </div>

            <div className="login-modal-switch">
              <span>Already registered?</span>
              <button
                type="button"
                className="login-modal-link"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
              >
                Login instead
              </button>
            </div>
          </form>
        )}

        {mode === "verify" && (
          <form className="login-modal-form" onSubmit={handleVerifyOtp}>
            <label htmlFor="verify-otp">OTP Code</label>
            <input
              id="verify-otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />

            {error && <div className="login-modal-error">{error}</div>}
            {success && <div className="login-modal-success">{success}</div>}

            <div className="login-modal-actions">
              <button type="submit" className="login-modal-submit">
                Verify OTP
              </button>
            </div>

            <div className="login-modal-switch">
              <span>Sent to</span>
              <strong>{pendingEmail || email}</strong>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
