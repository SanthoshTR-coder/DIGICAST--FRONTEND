# E-Voting System - MERN Stack

A comprehensive e-voting system built with MongoDB, Express.js, React, and Node.js featuring email OTP authentication, role-based access control, and real-time election management.

## Features

### Authentication & Security
- Email-based OTP verification for secure login
- Role-based access control (Admin/Voter)
- JWT token authentication
- Password encryption with bcrypt

### Admin Features
- Create and manage multiple elections
- Set voting periods with start/end dates
- Add candidates with party affiliations
- Real-time election monitoring
- View detailed election results
- Dashboard with election statistics

### Voter Features
- Browse available elections
- Cast votes in active elections
- View voting history
- Access election results
- Responsive dashboard

### Technical Features
- Dark theme UI with modern design
- Responsive design for all devices
- Real-time updates
- Secure API endpoints
- MongoDB database integration
- Vercel deployment ready

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- React Toastify for notifications
- Lucide React for icons

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email OTP
- bcryptjs for password hashing
- CORS enabled

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Gmail account for email OTP

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evoting-system
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/evoting
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

   **Note:** For EMAIL_PASS, use Gmail App Password, not your regular password.

4. **Start the application**
   
   ```bash
   # Start backend server (Terminal 1)
   cd backend
   npm run dev
   
   # Start frontend development server (Terminal 2)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Deployment on Vercel

### Backend Deployment
1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`

### MongoDB Setup
Use MongoDB Atlas for production:
1. Create account at https://cloud.mongodb.com
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in Vercel environment variables

### Gmail App Password Setup
1. Enable 2-factor authentication on Gmail
2. Go to Google Account settings
3. Security > App passwords
4. Generate app password for "Mail"
5. Use this password in `EMAIL_PASS`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/auth/me` - Get current user

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get single election
- `POST /api/elections` - Create election (Admin only)
- `PUT /api/elections/:id` - Update election (Admin only)
- `DELETE /api/elections/:id` - Delete election (Admin only)
- `GET /api/elections/:id/results` - Get election results

### Voting
- `POST /api/votes` - Cast vote
- `GET /api/votes/history` - Get voting history
- `GET /api/votes/check/:electionId` - Check if user voted

## Project Structure

```
evoting-system/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Elections/
│   │   ├── Voting/
│   │   └── UI/
│   ├── contexts/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## Usage

### For Admins
1. Register with role "admin"
2. Verify email with OTP
3. Create elections with candidates
4. Monitor voting progress
5. View detailed results

### For Voters
1. Register with role "voter"
2. Verify email with OTP
3. Browse available elections
4. Cast votes in active elections
5. View voting history and results

## Security Features

- Email OTP verification prevents unauthorized access
- JWT tokens with expiration
- Password hashing with salt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting on sensitive endpoints

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check documentation
- Review API endpoints

---

Built with ❤️ using MERN Stack