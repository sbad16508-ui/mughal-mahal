# Booking OTP Email Setup

To enable registration OTP verification by email, follow these steps:

1. Create a `.env` file in `backend/`:

```
EMAIL_USER=hammadshaukat.pk@gmail.com
EMAIL_PASS=kgwuujcopjkirqzs
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

2. Install backend dependencies:

```
npm install
```

3. Run the backend server:

```
npm start
```

4. The new booking auth routes are:

- `POST /api/booking/register-init` for registration and OTP send
- `POST /api/booking/verify-otp` for email OTP verification
- `POST /api/booking/login` for verified user login

5. Uploads for profile images will be stored in `backend/uploads/profile/`.

> Note: Using Gmail SMTP requires the app password and may need Google account security settings configured.
