# Student Fee Payment System

**▶️ LIVE DEMO VIDEO:** [Click here to watch the project demonstration](YOUR_VIDEO_LINK_HERE)

## Overview
A full-stack student fee management and mock online payment system built for college fee management.

## Features

**Student:**
- Secure login
- Student dashboard
- Fee details & breakdown
- Mock online payment
- Payment validation
- Payment history
- Receipt generation
- Profile management
- Notifications

**Admin:**
- Admin login
- Dashboard
- Student management
- Fee management
- Payment management
- Reports & Charts
- Notifications

## Technology Stack

**Frontend:**
- React, Vite, JavaScript
- React Router, Fetch API
- Lucide React, Recharts

**Backend:**
- Node.js, Express.js
- JWT, bcrypt, REST API

**Database:**
- MongoDB, Mongoose

## Project Structure
The project is divided into two main folders:
- \`client/\`: Contains the Vite + React frontend application.
- \`server/\`: Contains the Node.js + Express backend application.

## Installation
1. Clone the repository
2. Install frontend dependencies:
   \`\`\`bash
   cd client
   npm install
   \`\`\`
3. Install backend dependencies:
   \`\`\`bash
   cd server
   npm install
   \`\`\`

## Environment Variables
Create \`.env\` files based on the \`.env.example\` provided. 
* \`server/.env\` requires \`MONGO_URI\` and \`JWT_SECRET\`.
* \`client/.env\` requires \`VITE_API_URL\`.
Do not commit your real `.env` files.

## Database Setup
Ensure you have MongoDB installed and running locally on port 27017, or use a MongoDB Atlas cluster URI in your \`server/.env\` file.

## Seed
To populate the database with demo accounts and test data:
\`\`\`bash
cd server
npm run seed
\`\`\`

## Running the Project
Start the backend server:
\`\`\`bash
cd server
npm start
\`\`\`

Start the frontend application:
\`\`\`bash
cd client
npm run dev
\`\`\`

## Demo Credentials

**Student:**
- Student ID: \`23CSE001\`
- Password: \`Student@123\`

**Admin:**
- Email: \`admin@college.edu\`
- Password: \`Admin@123\`

## Important
**This project uses a mock/demo payment environment.**
No real money is transferred. This is not connected to a real payment gateway.

## Deployment
- **Frontend**: Deploy the \`client\` folder to services like Vercel or Netlify.
- **Backend**: Deploy the \`server\` folder to services like Render or Heroku.
- **Database**: Use MongoDB Atlas for a robust, production-ready cloud database. Ensure your environment variables are set correctly in your hosting provider's dashboard.
