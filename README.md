# EcoPulse (Eco Vibes AI Play)

EcoPulse is a comprehensive full-stack application designed to raise environmental awareness in Kenya. It combines AI-powered chat assistance, real-time environmental data scraping, policy tracking, and community engagement features to empower users to take action for the planet.

## 🚀 Features

- **AI Assistant (EcoPulse):** A friendly AI chatbot (powered by Meta Llama 3 via OpenRouter) that answers questions about environmental issues, land grabbing cases (e.g., Oloolua Forest), climate change, and conservation.
- **Environmental Radar:** Real-time tracking of environmental news and alerts, powered by automated web scrapers.
- **Eco Exposed:** A section dedicated to exposing environmental violations and tracking ongoing cases.
- **Community Hub:** Connect with other eco-conscious individuals, join events, and participate in challenges.
- **Impact Tracker:** Track your personal environmental impact and contributions.
- **Video Creator:** Tools to create and share environmental awareness videos.
- **Policy Tracker:** Stay updated on the latest environmental policies and regulations.

## 🛠 Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn-ui](https://ui.shadcn.com/)
- **State Management:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing:** [React Router](https://reactrouter.com/)
- **Authentication:** [Supabase](https://supabase.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **AI Integration:** [OpenRouter API](https://openrouter.ai/) (Meta Llama 3)
- **Web Scraping:** [Puppeteer](https://pptr.dev/) & [Cheerio](https://cheerio.js.org/)
- **Scheduling:** [node-cron](https://github.com/node-cron/node-cron)
- **PDF Parsing:** [pdf-parse](https://gitlab.com/autokent/pdf-parse)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js) or [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eco-vibes-ai-play
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecopulse  # Or your MongoDB Atlas connection string
OPENROUTER_API_KEY=your_openrouter_api_key
```

Start the backend server:

```bash
npm run dev
# or
npm start
```

The server should be running at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api  # URL of your backend API
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should be accessible at `http://localhost:8080` (or the port shown in your terminal).

## 📂 Project Structure

```
eco-vibes-ai-play/
├── backend/                 # Express.js Backend
│   ├── models/              # Mongoose models (Chat, etc.)
│   ├── routes/              # API routes (chat, scrape, policies, videos)
│   ├── utils/               # Utility functions (scraper, openrouter)
│   ├── uploads/             # Static file uploads
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages (Dashboard, Events, etc.)
│   │   ├── integrations/    # Supabase client setup
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md                # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
