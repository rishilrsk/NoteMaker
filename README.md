# NoteMaker 📝 - MERN Stack Note-Taking App

A clean, modern, and secure web application for creating, organizing, and accessing your notes from anywhere. Built with the MERN stack (MongoDB, Express, React, Node.js) and deployed using free-tier services.
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

---

## Key Features

* **User Authentication:** Secure signup and login using JWT.
* **Rich Text Notes:** Create and format notes using the Tiptap editor (Bold, Italic, Underline, Lists, Headings, etc.).
* **Organization:** Tag notes with automatically assigned colors and pin important notes.
* **Dynamic Search:** Instantly filter notes by title, content, or tag.
* **Responsive UI:** Clean light theme built with React Bootstrap, works on all devices.

---

## Tech Stack

* **Frontend:** React (Vite), React Router, React Bootstrap, Axios, Tiptap
* **Backend:** Node.js, Express, Mongoose
* **Database:** MongoDB Atlas (M0 Free Tier)
* **Authentication:** JWT, bcryptjs
* **Deployment:** Netlify (Frontend), Render (Backend)

---

## Local Development Setup

### Prerequisites

* Node.js (v18+) & npm
* Git
* MongoDB Atlas Account & Connection String

### Steps

1.  **Clone:**
    ```bash
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```
2.  **Install Dependencies:**
    ```bash
    # Install backend dependencies
    cd server
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```
3.  **Configure Backend:**
    * Create a `.env` file in the `server` directory.
    * Add the following variables:
        ```env
        MONGO_URI=[YOUR_MONGO_URI]
        JWT_SECRET=[YOUR_JWT_SECRET]
        CLIENT_URL=http://localhost:5174 # (Or the port Vite uses)
        PORT=5000
        ```
4.  **Run:**
    * From the **root** project directory (`your-repository-name`), start both servers:
        ```bash
        npm run dev
        ```
    * The app should open at `http://localhost:517x`.

---

## Deployment Notes

* **Frontend (Netlify):** Deploys from the `client` directory (`Base directory: client`, `Build command: npm run build`, `Publish directory: dist`). Requires a `netlify.toml` or `_redirects` file for routing.
* **Backend (Render):** Deploys from the `server` directory (`Root Directory: server`, `Build command: npm install`, `Start command: npm start`). Requires `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (set to the live Netlify URL) as environment variables.
* **Connection:** The `baseURL` in `client/src/services/api.js` must point to the live Render backend URL.

