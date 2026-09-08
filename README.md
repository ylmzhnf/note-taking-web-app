# Note-Taking Web App

A full-stack note-taking application based on the [Frontend Mentor note-taking web app challenge](https://www.frontendmentor.io/challenges/note-taking-web-app-773r7bUfOG).

## Live Demo

- Frontend: [note-taking-web-app-five.vercel.app](https://note-taking-web-app-five.vercel.app)
- API health check: [note-taking-web-app-production-9c85.up.railway.app/health](https://note-taking-web-app-production-9c85.up.railway.app/health)

The frontend is deployed on Vercel and the API is deployed on Railway. The demo requires the production environment variables described below. Google sign-in additionally requires the deployed frontend origin to be configured in Google Cloud Console.

## Features

- Create, edit, delete, and archive notes
- Search notes by title, content, or tags
- Filter notes by tag
- Email and Google authentication
- Password reset via email
- Light, dark, and system themes
- Sans-serif, serif, and monospace font options
- Responsive desktop, tablet, and mobile interface
- Protected API with JWT authentication
- PostgreSQL database managed with Prisma
- Rate limiting and request body limits for authentication endpoints

## Technologies

### Frontend

- React 19 and Vite
- React Router
- TipTap editor
- Axios
- Context API
- Responsive CSS

### Backend

- Node.js 20+
- Express 5
- PostgreSQL
- Prisma 7
- JWT and bcrypt
- Google OAuth
- Nodemailer
- express-rate-limit

## Project Structure

```text
note-taking-web-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
├── server/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20 or later
- PostgreSQL database
- npm

## Project Status

- Frontend production build: working
- Backend production server: working
- PostgreSQL connection and Prisma migrations: configured
- Email authentication and note management: implemented
- Google sign-in: implemented; Google OAuth origins must be configured for each domain used
- Responsive layouts and light/dark/system themes: implemented

## Installation

```bash
git clone https://github.com/ylmzhnf/note-taking-web-app.git
cd note-taking-web-app

cd server
npm install

cd ../client
npm install
```

## Environment Variables

Create both `.env` files from the provided examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

For `server/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
JWT_SECRET=long-random-secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-app-password
```

For `client/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

For the deployed frontend, set `VITE_API_URL` to:

```env
VITE_API_URL=https://note-taking-web-app-production-9c85.up.railway.app
```

For the deployed backend, set `CLIENT_URL` to the production frontend origin without a route path:

```env
CLIENT_URL=https://note-taking-web-app-five.vercel.app
```

The backend also accepts project-owned Vercel preview origins. Do not add `/login` or another route to `CLIENT_URL`; the origin is only the scheme and domain.

Do not commit `.env` files or store real secrets in the source code or repository.

## Local Development

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend runs at `http://localhost:5173` by default, and the API runs at `http://localhost:3000`.

## Database Migrations

Apply migrations to a local or production database with:

```bash
cd server
npm run migrate:deploy
```

The production `npm start` command also applies pending migrations before starting the server.

## Build

Build the frontend for production:

```bash
cd client
npm run build
```

Generate the Prisma client:

```bash
cd server
npm run build
```

## Deployment

### Railway or another backend platform

1. Set the backend root directory to `server`.
2. Use `npm run build` as the build command.
3. Use `npm start` as the start command.
4. Add the variables from [`server/.env.example`](./server/.env.example).
5. Use `/health` as the health check path. A healthy deployment returns `{"status":"ok"}`.

### Vercel

1. Set the frontend root directory to `client`.
2. Use `npm run build` as the build command.
3. Set the output directory to `dist`.
4. Set `VITE_API_URL` to the public backend URL.
5. Set the backend `CLIENT_URL` to the deployed Vercel origin.

For Google sign-in, add these origins to the Authorized JavaScript origins list for the same Google OAuth client:

```text
https://note-taking-web-app-five.vercel.app
http://localhost:5173
```

Add the current Vercel preview origin as well when testing a preview deployment. Origins must not include `/login`, `/register`, or any other path.

## Security Notes

- Use a long, unique JWT secret.
- Technical error details are not returned to clients in production.
- Authentication routes are protected with rate limiting.
- JSON request bodies are limited to `1mb`.
- Prisma migrations are applied during production deployment.

## License and Credits

This project is a personal development project based on a Frontend Mentor challenge.

- Frontend Mentor: [@ylmzhnf](https://www.frontendmentor.io/profile/ylmzhnf)
- GitHub: [@ylmzhnf](https://github.com/ylmzhnf)
