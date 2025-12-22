# Note-Taking Web App

This is a full-stack solution to the [Note-taking web app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/note-taking-web-app-773r7bUfOG). This application allows users to create, manage, and organize notes with a secure authentication system.

![Design Preview](./preview.jpg)

## Table of Contents

- [Overview](#overview)
  - [The Challenge](#the-challenge)
  - [Features](#features)
- [My Process](#my-process)
  - [Built With](#built-with)
  - [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Author](#author)

## Overview

### The Challenge

The goal of this project was to build a fully functional Note-taking application where users can:

- **Create, Read, Update, and Delete (CRUD)** notes.
- **Archive** and **Unarchive** notes to keep the workspace clean.
- **Search** for notes by title, content, or tags.
- **Filter** notes by tags or status (Archived/Active).
- **Securely Authenticate**:
    - Sign up and Login with Email/Password.
    - **Google Authentication** for one-click access.
    - **Password Reset** flow via email verification.
- **Customize Interface**: Select color themes and font preferences.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile devices.

### Features

- **Full-Stack Architecture**: React frontend connected to a Node.js/Express backend.
- **Database**: PostgreSQL database managed with Prisma ORM.
- **Authentication**: Secure JWT-based auth and Google OAuth integration using `@react-oauth/google` and `google-auth-library`.
- **Protected Routes**: Client-side routing with `react-router-dom` ensuring only authenticated users access the dashboard.
- **Email Services**: Integrated `nodemailer` for handling forgot/reset password functionality.

## My Process

### Built With

#### Frontend
- **[React](https://reactjs.org/)** (Vite) - Component-based UI library.
- **[React Router v6/v7](https://reactrouter.com/)** - For seamless client-side navigation.
- **[Axios](https://axios-http.com/)** - For handling HTTP requests.
- **Context API** - For global state management (AuthContext).
- **CSS3 / Styled Components** - For custom responsive styling.

#### Backend
- **[Node.js](https://nodejs.org/)** & **[Express](https://expressjs.com/)** - Server-side runtime and framework.
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database.
- **[Prisma](https://www.prisma.io/)** - Next-generation Node.js and TypeScript ORM.
- **[JSON Web Token (JWT)](https://jwt.io/)** - For secure stateless authentication.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)** - For password hashing.
- **[Nodemailer](https://nodemailer.com/)** - For sending transactional emails.

### Project Structure

```bash
note-taking-web-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/            # API service calls
│   │   ├── component/      # UI Components (Pages, Shared)
│   │   ├── context/        # React Context (Auth)
│   │   └── App.jsx         # Main App Component
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & Validation middleware
│   │   ├── routes/         # API Route definitions
│   │   └── server.js       # Server entry point
│   ├── prisma/             # Database schema
│   └── package.json
└── README.md
```

## Getting Started

Follow these instructions to get a copy of the project running on your local machine.

### Prerequisites

- **Node.js** (v14+ recommended)
- **PostgreSQL** installed and running locally or a cloud instance (e.g., Supabase, Neon).
- **NPM** or **Yarn**.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/note-taking-web-app.git
    cd note-taking-web-app
    ```

2.  **Install Server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Environment Variables

You need to set up environment variables for both Client and Server.

**1. Server (`server/.env`):**
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/your_db_name?schema=public"
JWT_SECRET="your_super_secret_key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
EMAIL_USER="your_email@example.com"
EMAIL_PASS="your_email_app_password"
CLIENT_URL="http://localhost:5173"
```

**2. Client (`client/.env`):**
Create a `.env` file in the `client` directory:
```env
VITE_API_URL="http://localhost:5000"
VITE_GOOGLE_CLIENT_ID="your_google_client_id"
```

### Running the App

1.  **Start the Backend Server:**
    ```bash
    cd server
    npm run dev
    # Runs on http://localhost:5000
    ```

2.  **Start the Frontend:**
    ```bash
    cd client
    npm run dev
    # Runs on http://localhost:5173
    ```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## Author

- Frontend Mentor - [@ylmzhnf](https://www.frontendmentor.io/profile/ylmzhnf)
- GitHub - [@ylmzhnf](https://github.com/ylmzhnf)

---
**Note**: This project is for personal learning and demonstration purposes.
