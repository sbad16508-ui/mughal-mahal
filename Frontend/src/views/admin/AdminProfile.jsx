import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSave, FaUserCircle } from "react-icons/fa"
import "./AdminProfile.css"

const AdminProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contactNumber: "",
    profileImage: ""
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      navigate("/admin/login")
      return
    }

    try {
      const user = JSON.parse(stored)
      const nameParts = (user.firstName || "").trim() || user.fullname || ""
      const [firstName, ...remaining] = nameParts.split(" ")
      const lastName = remaining.join(" ")

      setFormData({
        firstName: user.firstName || firstName || "",
        lastName: user.lastName || lastName || "",
        address: user.address || "",
        contactNumber: user.contactNumber || user.phone || "",
        profileImage: user.profileImage || ""
      })
    } catch (err) {
      console.error(err)
      navigate("/admin/login")
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profileImage: reader.result || "" }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.firstName.trim() && !formData.lastName.trim()) {
      setError("Please enter a first name or last name.")
      return
    }

    try {
      setSaving(true)
      const stored = localStorage.getItem("user")
      const user = stored ? JSON.parse(stored) : {}
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullname: `${formData.firstName} ${formData.lastName}`.trim(),
        address: formData.address,
        contactNumber: formData.contactNumber,
        profileImage: formData.profileImage
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setSuccess("Profile updated successfully.")
    } catch (err) {
      console.error(err)
      setError("Unable to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-header">
        <div>
          <h1>Admin Profile</h1>
          <p>Manage your admin details and profile photo separately from user accounts.</p>
        </div>
        <button className="admin-profile-back" onClick={() => navigate("/admin/dashboard")}>Back</button>
      </div>

      <div className="admin-profile-grid">
        <section className="admin-profile-card admin-profile-summary">
          <div className="admin-avatar-box">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Admin avatar" className="admin-avatar-image" />
            ) : (
              <div className="admin-avatar-fallback">
                <FaUserCircle />
              </div>
            )}
          </div>
          <div>
            <h2>{formData.firstName || "Admin"} {formData.lastName || "User"}</h2>
            <p>{formData.address || "No address set"}</p>
            <p>{formData.contactNumber || "No contact number"}</p>
          </div>
        </section>

        <section className="admin-profile-card admin-profile-form-card">
          <form onSubmit={handleSave} className="admin-profile-form">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
            />

            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
            />

            <label>Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact number"
            />

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />

            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {error && <div className="admin-profile-alert admin-profile-error">{error}</div>}
            {success && <div className="admin-profile-alert admin-profile-success">{success}</div>}

            <button type="submit" className="admin-profile-save-btn" disabled={saving}>
              <FaSave /> {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default AdminProfile
