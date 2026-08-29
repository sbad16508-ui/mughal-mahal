import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookingApi from "../bookingApi";
import Navbar from "../Components/home/Navbar";
import Footer from "../Components/home/Footer";
import "./ProfilePage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const UPLOAD_BASE_URL = `${API_BASE_URL.replace(/\/api$/, "")}/uploads/profile`;
const getImageUrl = (profileImage) => (profileImage ? `${UPLOAD_BASE_URL}/${profileImage}` : null);

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    const loadProfile = () => {
      const stored = localStorage.getItem("bookingUserProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setFormData({ ...parsed, profileImage: parsed.profileImage || null });
        setImagePreview(getImageUrl(parsed.profileImage));
        setLoading(false);
        return true;
      }
      return false;
    };

    const profileLoaded = loadProfile();
    if (profileLoaded) return;

    const username = localStorage.getItem("bookingUser");
    if (!username) {
      setLoading(false);
      return;
    }

    bookingApi
      .get(`/booking/user/profile/${encodeURIComponent(username)}`)
      .then((response) => {
        const user = response.data.user;
        setProfile(user);
        setFormData(user);
        setImagePreview(user.profileImage ? `${UPLOAD_BASE_URL}/${user.profileImage}` : null);
      })
      .catch(() => {
        setError("Unable to load profile information. Please login again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleProfileChange = (event) => {
      if (!event.detail) {
        navigate("/");
        return;
      }

      const parsed = event.detail;
      setProfile(parsed);
      setFormData({ ...parsed, profileImage: parsed.profileImage || null });
      setImagePreview(getImageUrl(parsed.profileImage));
      setLoading(false);
    };

    const handleStorageChange = (event) => {
      if (event.key === "bookingUserProfile") {
        if (!event.newValue) {
          navigate("/");
          return;
        }

        const parsed = JSON.parse(event.newValue);
        setProfile(parsed);
        setFormData({ ...parsed, profileImage: parsed.profileImage || null });
        setImagePreview(getImageUrl(parsed.profileImage));
        setLoading(false);
      }
    };

    window.addEventListener("bookingUserProfileChanged", handleProfileChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("bookingUserProfileChanged", handleProfileChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  useEffect(() => {
    // fetch list of uploaded profile images from backend
    const fetchUploads = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/uploads/profile-list`)
        const data = await res.json()
        if (Array.isArray(data.files)) {
          setAvailableImages(data.files)
        }
      } catch (err) {
        // ignore
      }
    }
    fetchUploads()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setFormData((prev) => ({ ...prev, profileImage: file }));
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      setImagePreview(url);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!profile) {
      setError("No profile loaded.");
      return;
    }

    try {
      setSaving(true);
      const body = new FormData();
      body.append("currentUsername", profile.username);
      body.append("firstName", formData.firstName || "");
      body.append("lastName", formData.lastName || "");
      body.append("email", formData.email || "");
      body.append("username", formData.username || "");
      body.append("city", formData.city || "");
      body.append("address", formData.address || "");
      body.append("phone", formData.phone || "");
      if (formData.profileImage instanceof File) {
        body.append("profileImage", formData.profileImage);
      }

      const response = await bookingApi.put("/booking/user/update-profile", body);

      const updatedUser = response.data.user;
      const normalizedUser = {
        ...updatedUser,
        profileImage: updatedUser.profileImage || null,
      };

      localStorage.setItem("bookingUserProfile", JSON.stringify(normalizedUser));
      localStorage.setItem("bookingUser", normalizedUser.username);
      window.dispatchEvent(new CustomEvent("bookingUserProfileChanged", { detail: normalizedUser }));
      setProfile(normalizedUser);
      setFormData({
        ...normalizedUser,
        profileImage: normalizedUser.profileImage || null,
      });
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
      setImagePreview(getImageUrl(normalizedUser.profileImage));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  }, [objectUrl]);

  const bookingHistory = profile
    ? JSON.parse(localStorage.getItem(`bookingOrders_${profile.username}`) || "[]")
    : [];

  if (loading) {
    return <div className="profile-page-loading">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="profile-page-empty">
          <h2>Please login to view your profile.</h2>
          <button className="btn btn-dark mt-4" onClick={() => navigate("/")}>Go Home</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-page-container">
        <div className="profile-page-header">
          <div className="profile-page-avatar-card">
            <div className="profile-avatar-wrapper">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="profile-avatar-image" />
              ) : (
                <span className="profile-avatar-fallback">{profile.firstName?.[0] || "U"}</span>
              )}
            </div>
            {availableImages.length > 0 && (
              <div className="profile-uploads-gallery" style={{marginTop:12, display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap'}}>
                {availableImages.map((f) => (
                  <img key={f} src={`${UPLOAD_BASE_URL}/${f}`} alt={f} style={{width:48,height:48,objectFit:'cover',borderRadius:8,border:'1px solid #eee'}} />
                ))}
              </div>
            )}
            <h2>{profile.firstName} {profile.lastName}</h2>
            <p>{profile.email}</p>
            <p className="profile-role">Booking account</p>
          </div>

          <div className="profile-booking-summary">
            <div className="profile-summary-card">
              <span>Bookings</span>
              <strong>{bookingHistory.length}</strong>
            </div>
            <div className="profile-summary-card">
              <span>Username</span>
              <strong>{profile.username}</strong>
            </div>
            <div className="profile-summary-card">
              <span>Phone</span>
              <strong>{profile.phone || "-"}</strong>
            </div>
          </div>
        </div>

        <div className="profile-page-grid">
          <div className="profile-form-card">
            <h3>Account details</h3>
            <form onSubmit={handleSaveProfile} className="profile-form">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName || ""} onChange={handleChange} />

              <label>Last Name</label>
              <input name="lastName" value={formData.lastName || ""} onChange={handleChange} />

              <label>Email</label>
              <input name="email" type="email" value={formData.email || ""} onChange={handleChange} />

              <label>Username</label>
              <input name="username" value={formData.username || ""} onChange={handleChange} />

              <label>City</label>
              <input name="city" value={formData.city || ""} onChange={handleChange} />

              <label>Address</label>
              <input name="address" value={formData.address || ""} onChange={handleChange} />

              <label>Phone</label>
              <input name="phone" value={formData.phone || ""} onChange={handleChange} />

              <label>Profile Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />

              {error && <div className="profile-alert profile-alert-error">{error}</div>}
              {success && <div className="profile-alert profile-alert-success">{success}</div>}

              <button type="submit" className="btn btn-dark profile-save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>

          <div className="profile-history-card">
            <h3>Booking history</h3>
            {bookingHistory.length === 0 ? (
              <p>No saved bookings yet. Book now to see them here.</p>
            ) : (
              <div className="profile-history-list">
                {bookingHistory.map((booking) => (
                  <div key={booking.id} className="profile-history-row">
                    <div>
                      <strong>{booking.roomType}</strong>
                      <p>{booking.checkIn} → {booking.checkOut}</p>
                    </div>
                    <div>
                      <span>{booking.adults} adults</span>
                      <p>{booking.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;
