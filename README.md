# DevConnect

A professional platform for developers to showcase portfolios, collaborate on projects, and build their professional network.

## Overview

DevConnect is a MERN stack application that helps developers create professional profiles, showcase their work, and connect with peers in the industry.

## Features

- **Developer Profiles:** Create customizable profiles with skills, work history, and education
- **Project Showcase:** Display your projects with media, GitHub integration, and tech stack details
- **Networking:** Connect with other developers, message in real-time, and form collaboration groups
- **Content Sharing:** Publish articles and share knowledge through an integrated blog system
- **Analytics Dashboard:** Track profile views, project impressions, and engagement metrics

## Tech Stack

- **Frontend:** React, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT with refresh tokens
- **Real-time Features:** Socket.io

## Getting Started
### Installation

1. Clone the repository
```bash
git clone https://github.com/owaisahmadshah/devconnect.git
cd devconnect
```

2. Install dependencies
```bash
# Root, frontend, and backend
pnpm install
```

or you can do it separately for each.
```bash
# frontend
cd frontend && pnpm install
# backend
cd ../backend && pnpm install
```

3. Set up environment variables
```bash
# Create .env files in both frontend and backend directories
# See .env.example files for required variables
```

4. Start development servers
```bash
# Backend
cd backend && pnpm run dev

# Frontend (in a separate terminal)
cd frontend && pnpm start
```

## Project Structure

The project follows a modular architecture with separate frontend and backend codebases:

- `frontend/` - React application with component-based structure
- `backend/` - Express API with MVC pattern
- `shared/` - Common utilities and types
