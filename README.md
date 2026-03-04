# HealthMeet

A full-stack healthcare application combining appointment scheduling, medical records management, and AI-powered health consultations.

## Project Overview

HealthMeet is a comprehensive healthcare platform that enables users to:
- Schedule medical appointments with healthcare providers
- Upload and manage medical records securely
- Access AI-powered health consultations
- Process payments for services
- Communicate via WhatsApp integration

## Tech Stack

### Client
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Linting**: ESLint

### Server
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose 9)
- **Authentication**: JWT, bcryptjs
- **Payment**: Razorpay Integration
- **CORS**: Enabled for cross-origin requests

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance
- Environment variables configured

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HealthMeet
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   - Create a `.env` file in the `server` directory with required configuration
   - Create a `.env` file in the `client` directory with API endpoints

## Running the Application

### Development Mode

**Start Server**
```bash
cd server
npm run dev
```

**Start Client** (in another terminal)
```bash
cd client
npm run dev
```

### Production Build

**Build Client**
```bash
cd client
npm run build
```

## Project Structure

```
HealthMeet/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── services/    # API service calls
│   │   ├── routes/      # Route definitions
│   │   ├── context/     # React context (Auth)
│   │   └── hooks/       # Custom React hooks
│   └── package.json
├── server/              # Express backend application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   ├── services/    # Business logic
│   │   └── config/      # Configuration files
│   └── package.json
└── README.md            # This file
```

## Key Features

- **Authentication**: Secure user registration and login with JWT
- **Appointment Management**: Schedule and manage appointments
- **Medical Records**: Upload and organize health documents
- **AI Consultations**: Get health recommendations from AI
- **Payment Processing**: Razorpay integration for secure payments
- **WhatsApp Integration**: Communication with users via WhatsApp
- **Rate Limiting**: Protection against abuse

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### AI Services
- `POST /api/ai/consult` - Get AI health consultation

### Payments
- `POST /api/payments/create` - Create payment order
- `POST /api/payments/verify` - Verify payment

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
WHATSAPP_API_KEY=<your-whatsapp-api-key>
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000
```

## Scripts

### Server
- `npm start` - Start server in production
- `npm run dev` - Start server in development mode

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues and feature requests, please create an issue in the repository.
