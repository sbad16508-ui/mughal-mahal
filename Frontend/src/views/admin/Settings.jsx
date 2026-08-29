import React, { useState } from "react"
import { 
  FaGlobe, FaSlidersH, FaUsers, FaShieldAlt, 
  FaRegBell, FaCreditCard, FaSave, FaLock, FaUserPlus, FaSearch, FaCamera 
} from "react-icons/fa"
import "./Settings.css"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General")
  const [autoConfirm, setAutoConfirm] = useState(false)
  const [onlinePayments, setOnlinePayments] = useState(true)
  const [requireDeposit, setRequireDeposit] = useState(true)

  const [notifications, setNotifications] = useState({
    newBookings: true,
    paymentReceived: true,
    lowInventory: true,
    guestCheckIn: false,
    enablePush: true,
    urgentAlerts: true,
    enableSMS: false,
    emergencyOnly: true
  })

  const [enable2FA, setEnable2FA] = useState(false)
  const [autoLogout, setAutoLogout] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const usersList = [
    { id: "USR-001", name: "Admin\nUser", email: "admin@hotel.com", role: "Administrator", active: "Just\nnow", status: "Active" },
    { id: "USR-002", name: "Sarah\nManager", email: "sarah@hotel.com", role: "Manager", active: "2\nhours\nago", status: "Active" },
    { id: "USR-003", name: "John\nReception", email: "john@hotel.com", role: "Receptionist", active: "5\nmins\nago", status: "Active" },
    { id: "USR-004", name: "Mike\nKitchen", email: "mike@hotel.com", role: "Kitchen Staff", active: "2\ndays\nago", status: "Inactive" },
  ]

  const rolesPermission = [
    { name: "Administrator", desc: "Click to edit permissions" },
    { name: "Manager", desc: "Click to edit permissions" },
    { name: "Receptionist", desc: "Click to edit permissions" },
    { name: "Kitchen Staff", desc: "Click to edit permissions" }
  ]

  const subMenus = [
    { id: "General", label: "General", icon: <FaSlidersH /> },
    { id: "Notifications", label: "Notifications", icon: <FaRegBell /> },
    { id: "Security", label: "Security", icon: <FaShieldAlt /> },
    { id: "UserManagement", label: "User Management", icon: <FaUsers /> },
    { id: "PaymentSettings", label: "Payment Settings", icon: <FaCreditCard /> },
    { id: "LanguageRegion", label: "Language & Region", icon: <FaGlobe /> },
    { id: "Profile", label: "My Profile", icon: <FaUsers /> }
  ]

  return (
    <div className="st-settings-container">
      <div className="st-view-header">
        <h1 className="st-main-title">{activeTab === "Profile" ? "My Profile" : "Settings"}</h1>
        <p className="st-sub-title">
          {activeTab === "Profile" ? "Manage your profile information" : "Manage your hotel system settings"}
        </p>
      </div>

      <div className="st-settings-grid-layout">
      
        <div className="st-menu-sidebar-card">
          {subMenus.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`st-tab-btn ${activeTab === tab.id ? "st-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="st-tab-icon">{tab.icon}</span>
              <span className="st-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="st-forms-main-wrapper">
          
          {activeTab === "General" && (
            <>
              <div className="st-form-content-card">
                <h3 className="st-card-heading">General Settings</h3>
                <div className="st-input-stack">
                  <div className="st-input-group">
                    <input type="text" defaultValue="Grand Luxury Hotel" placeholder="Hotel Name" />
                  </div>
                  <div className="st-input-group">
                    <input type="email" defaultValue="contact@grandluxury.com" placeholder="Contact Email" />
                  </div>
                  <div className="st-input-group">
                    <input type="text" defaultValue="+1 (555) 123-4567" placeholder="Contact Phone" />
                  </div>
                  <div className="st-input-group">
                    <input type="text" defaultValue="123 Luxury Ave, New York, NY 10001" placeholder="Address" />
                  </div>
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Timezone" />
                  </div>
                </div>
              </div>

              <div className="st-form-content-card">
                <h3 className="st-card-heading">Booking Settings</h3>
                <div className="st-toggles-list">
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta">
                      <h4>Auto-confirm bookings</h4>
                      <p>Automatically confirm bookings without manual approval</p>
                    </div>
                    <label className="st-switch">
                      <input type="checkbox" checked={autoConfirm} onChange={() => setAutoConfirm(!autoConfirm)} />
                      <span className="st-slider"></span>
                    </label>
                  </div>
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta">
                      <h4>Allow online payments</h4>
                      <p>Enable guests to pay online during booking</p>
                    </div>
                    <label className="st-switch">
                      <input type="checkbox" checked={onlinePayments} onChange={() => setOnlinePayments(!onlinePayments)} />
                      <span className="st-slider"></span>
                    </label>
                  </div>
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta">
                      <h4>Require deposit</h4>
                      <p>Require a deposit for all bookings</p>
                    </div>
                    <label className="st-switch">
                      <input type="checkbox" checked={requireDeposit} onChange={() => setRequireDeposit(!requireDeposit)} />
                      <span className="st-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="st-input-stack" style={{ marginTop: "24px" }}>
                  <div className="st-input-group">
                    <input type="number" defaultValue="50" placeholder="Deposit Percentage" />
                  </div>
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Cancellation Policy" />
                  </div>
                </div>
              </div>
            </>
          )}
           {activeTab === "Notifications" && (
            <div className="st-form-content-card">
              <h3 className="st-card-heading-large">Notification Settings</h3>
              <p className="st-card-sub-description">Manage how you receive notifications</p>
              
              <div className="st-section-divider">
                <h4 className="st-section-inner-title">Email Notifications</h4>
                <div className="st-toggles-list">
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>New Bookings</h4><p>Get notified when new bookings are made</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.newBookings} onChange={() => setNotifications({...notifications, newBookings: !notifications.newBookings})} /><span className="st-slider"></span></label>
                  </div>
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>Payment Received</h4><p>Notification for successful payments</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.paymentReceived} onChange={() => setNotifications({...notifications, paymentReceived: !notifications.paymentReceived})} /><span className="st-slider"></span></label>
                  </div>
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>Low Inventory</h4><p>Alert when inventory items are low</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.lowInventory} onChange={() => setNotifications({...notifications, lowInventory: !notifications.lowInventory})} /><span className="st-slider"></span></label>
                  </div>
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>Guest Check-in</h4><p>Notification when guests check in</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.guestCheckIn} onChange={() => setNotifications({...notifications, guestCheckIn: !notifications.guestCheckIn})} /><span className="st-slider"></span></label>
                  </div>
                </div>
              </div>

              <div className="st-section-divider">
                <h4 className="st-section-inner-title">Push Notifications</h4>
                <div className="st-toggles-list">
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>Enable Push Notifications</h4><p>Receive notifications on your device</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.enablePush} onChange={() => setNotifications({...notifications, enablePush: !notifications.enablePush})} /><span className="st-slider"></span></label>
                  </div>
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>Urgent Alerts</h4><p>Critical alerts and urgent matters</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.urgentAlerts} onChange={() => setNotifications({...notifications, urgentAlerts: !notifications.urgentAlerts})} /><span className="st-slider"></span></label>
                  </div>
                </div>
              </div>

              <div className="st-section-divider" style={{ border: "none", paddingBottom: "0" }}>
                <h4 className="st-section-inner-title">SMS Notifications</h4>
                <div className="st-toggles-list">
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>Enable SMS</h4><p>Receive text message notifications</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.enableSMS} onChange={() => setNotifications({...notifications, enableSMS: !notifications.enableSMS})} /><span className="st-slider"></span></label>
                  </div>
                  <div className="st-toggle-row">
                    <div className="st-toggle-meta"><h4>Emergency Alerts Only</h4><p>Only receive critical SMS alerts</p></div>
                    <label className="st-switch"><input type="checkbox" checked={notifications.emergencyOnly} onChange={() => setNotifications({...notifications, emergencyOnly: !notifications.emergencyOnly})} /><span className="st-slider"></span></label>
                  </div>
                </div>
              </div>
            </div>
          )}
           {activeTab === "Security" && (
            <>
              <div className="st-form-content-card">
                <h3 className="st-card-heading">Change Password</h3>
                <div className="st-input-stack">
                  <div className="st-input-group">
                    <input type="password" placeholder="Current Password" />
                  </div>
                  <div className="st-input-group">
                    <input type="password" placeholder="New Password" />
                  </div>
                  <div className="st-input-group">
                    <input type="password" placeholder="Confirm New Password" />
                  </div>
                  <button type="button" className="st-yellow-action-btn">
                    <FaLock style={{ fontSize: "12px", marginRight: "6px" }} /> Update Password
                  </button>
                </div>
              </div>

              <div className="st-form-content-card">
                <h3 className="st-card-heading">Two-Factor Authentication</h3>
                <div className="st-toggle-row">
                  <div className="st-toggle-meta">
                    <h4>Enable 2FA</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className="st-switch">
                    <input type="checkbox" checked={enable2FA} onChange={() => setEnable2FA(!enable2FA)} />
                    <span className="st-slider"></span>
                  </label>
                </div>
                <p className="st-explanatory-text">
                  Two-factor authentication adds an additional layer of security by requiring a code from your phone in addition to your password.
                </p>
                <button type="button" className="st-white-outline-btn">Setup 2FA</button>
              </div>

              <div className="st-form-content-card">
                <h3 className="st-card-heading">Login Activity</h3>
                <div className="st-logs-stack">
                  <div className="st-log-item">
                    <div>
                      <h4>Current Session</h4>
                      <p>New York, US • Chrome</p>
                    </div>
                    <span className="st-badge-success">Active</span>
                  </div>
                  <div className="st-log-item">
                    <div>
                      <h4>Last Login</h4>
                      <p>Apr 2, 2026 • Los Angeles, US</p>
                    </div>
                    <span className="st-timestamp-label">2 days ago</span>
                  </div>
                </div>
              </div>

              <div className="st-form-content-card">
                <h3 className="st-card-heading">Session Management</h3>
                <div className="st-toggle-row">
                  <div className="st-toggle-meta">
                    <h4>Auto Logout</h4>
                    <p>Automatically log out after inactivity</p>
                  </div>
                  <label className="st-switch">
                    <input type="checkbox" checked={autoLogout} onChange={() => setAutoLogout(!autoLogout)} />
                    <span className="st-slider"></span>
                  </label>
                </div>
                <div className="st-input-group" style={{ marginTop: "16px" }}>
                  <input type="number" defaultValue="30" placeholder="Session Timeout (minutes)" />
                </div>
              </div>
            </>
          )}

          {activeTab === "UserManagement" && (
            <>
              <div className="st-form-content-card" style={{ padding: "24px 0 0 0" }}>
                <div className="st-table-header-flex" style={{ padding: "0 24px" }}>
                  <div>
                    <h3 className="st-card-heading-large">User Management</h3>
                    <p className="st-card-sub-description">Manage users and permissions</p>
                  </div>
                  <button type="button" className="st-yellow-action-btn-with-icon">
                    <FaUserPlus /> Add User
                  </button>
                </div>

                <div className="st-search-wrapper-container" style={{ padding: "0 24px" }}>
                  <div className="st-search-inner-input">
                    <FaSearch className="st-search-magnifier" />
                    <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>

                <div className="st-table-overflow-holder">
                  <table className="st-custom-ui-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Last Active</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((user, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: "600" }}>{user.id}</td>
                          <td style={{ whiteSpace: "pre-line" }}>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`st-badge-role ${user.role.toLowerCase().replace(" ", "")}`}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ color: "#64748b", whiteSpace: "pre-line" }}>{user.active}</td>
                          <td>
                            <span className={`st-badge-status ${user.status.toLowerCase()}`}>{user.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="st-form-content-card">
                <h3 className="st-card-heading" style={{ marginBottom: "20px" }}>Roles & Permissions</h3>
                <div className="st-roles-grid-layout">
                  {rolesPermission.map((role, idx) => (
                    <div className="st-role-static-box" key={idx}>
                      <h4>{role.name}</h4>
                      <p>{role.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          
          {activeTab === "LanguageRegion" && (
            <>
              <div className="st-form-content-card">
                <h3 className="st-card-heading">Language</h3>
                <div className="st-input-stack">
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Display Language" />
                  </div>
                </div>
              </div>

              <div className="st-form-content-card">
                <h3 className="st-card-heading">Regional Settings</h3>
                <div className="st-input-stack">
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Timezone" />
                  </div>
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Date Format" />
                  </div>
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Time Format" />
                  </div>
                </div>
              </div>

              <div className="st-form-content-card">
                <h3 className="st-card-heading">Currency</h3>
                <div className="st-input-stack">
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Default Currency" />
                  </div>
                  <div className="st-input-group">
                    <input type="text" className="st-input-white-border" placeholder="Number Format" />
                  </div>
                </div>
              </div>
            </>
          )}

        
          {activeTab === "Profile" && (
            <div className="st-profile-view-wrapper">
            
              <div className="st-profile-left-card">
                <div className="st-avatar-container">
                  <div className="st-avatar-circle">AU</div>
                  <button type="button" className="st-avatar-upload-badge">
                    <FaCamera />
                  </button>
                </div>
                <h2 className="st-profile-name">Admin User</h2>
                <p className="st-profile-role">Administrator</p>
                <div className="st-member-since-box">
                  <span>Member since</span>
                  <strong>Jan 1, 2025</strong>
                </div>
                
                <div className="st-profile-footer-meta">
                  <p>📧 admin@aurum.com</p>
                  <p>📞 +1 234 567 8900</p>
                  <p>📍 San Francisco, CA</p>
                </div>
              </div>

              <div className="st-profile-right-stack">
                
                <div className="st-form-content-card">
                  <h3 className="st-card-heading-with-icon">👤 Personal Information</h3>
                  
                  <div className="st-form-two-columns-row">
                    <div className="st-input-group">
                      <input type="text" defaultValue="Admin" placeholder="First Name" />
                    </div>
                    <div className="st-input-group">
                      <input type="text" defaultValue="User" placeholder="Last Name" />
                    </div>
                  </div>

                  <div className="st-form-two-columns-row" style={{ marginTop: "20px" }}>
                    <div className="st-input-group">
                      <input type="email" defaultValue="admin@aurum.com" placeholder="Email Address" />
                    </div>
                    <div className="st-input-group">
                      <input type="text" defaultValue="+1 234 567 8900" placeholder="Phone Number" />
                    </div>
                  </div>
                  <div className="st-input-group" style={{ marginTop: "20px" }}>
                    <input type="text" defaultValue="123 Gold Street, San Francisco, CA 94102" placeholder="Address" />
                  </div>

                  <div className="st-profile-inline-save-holder">
                    <button type="button" className="st-yellow-action-btn">
                      <FaSave style={{ marginRight: "6px" }} /> Save Changes
                    </button>
                  </div>
                </div>
                <div className="st-form-content-card">
                  <h3 className="st-card-heading-with-icon">🔒 Change Password</h3>
                  <div className="st-input-stack">
                    <div className="st-input-group">
                      <input type="password" placeholder="Current Password" />
                    </div>
                    <div className="st-input-group">
                      <input type="password" placeholder="New Password" />
                    </div>
                    <div className="st-input-group">
                      <input type="password" placeholder="Confirm New Password" />
                    </div>
                    <div className="st-profile-inline-save-holder">
                      <button type="button" className="st-yellow-action-btn">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab !== "Profile" && (
            <div className="st-bottom-global-action-bar">
              <button type="button" className="st-btn-save-changes-fixed">
                <FaSave /> Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Settings