<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1a87bc0tmmTBmf7dxQ7g9QaXC5jiuki3z

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 🛡️ EarlyShield Campus

> **AI-Powered Campus Intelligence & Risk Management Platform**

EarlyShield is a modern, real-time web application designed to bridge the gap between campus communities and safety operations. It utilizes **Google Gemini models** to analyze crowdsourced risk signals, cluster incidents, and provide geospatial intelligence, allowing administrators to preemptively address safety and facility issues.

---

## 🚀 Key Features

### 🧠 AI-Driven Intelligence
- **Maps Grounding (Gemini 2.5 Flash):** Scans specific campus locations on the map and cross-references them with Google Maps data to generate real-time risk assessments and safety protocols.
- **Root Cause Analysis (Gemini 3 Flash):** Automatically analyzes clusters of incoming reports (e.g., "WiFi down," "Router blinking") to identify the underlying technical or physical cause.
- **Conversational Assistant (Gemini 3 Pro):** An embedded chatbot that assists users with safety queries and platform navigation.

### 📊 Dynamic Operations Dashboard
- **Real-Time Signals:** Live feed of incoming reports from students and staff.
- **Health Scores:** Auto-calculated campus safety scores based on active critical incidents.
- **Role-Based Views:**
  - **Admin:** Full operational control, heatmap analysis, and case management.
  - **Student:** Simplified reporting portal and gamified contribution stats.
  - **Management:** High-level executive overview and cost-saving metrics.

### 🗺️ Interactive Risk Map
- **Geospatial Visualization:** Built with **Leaflet**, featuring custom pulse markers for critical zones.
- **Zone Analysis:** Clickable campus zones (e.g., Labs, Dorms) with detailed status reports.
- **Hotspot Tracking:** Visual indicators for high-density signal areas.

### 📝 Reporting & Case Management
- **Smart Wizard:** 3-step reporting flow for students to categorize and geolocate issues.
- **Kanban/Case View:** Detailed dive into specific incidents with timeline tracking.
- **Integration Bridge:** Mock setup for exporting data to enterprise systems like SAP Solution Manager.

### 🔐 Authentication & Security
- **Firebase Auth:** Secure Google Sign-In integration.
- **Guest/Demo Mode:** Full functionality simulator for testing without credentials.
- **Firestore Real-time DB:** Instant updates across all connected clients.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (TypeScript)
- **Styling:** Tailwind CSS (Dark Mode supported)
- **Maps:** Leaflet & React-Leaflet
- **Charts:** Recharts

### Backend & Services
- **Auth & Database:** Google Firebase (Authentication & Cloud Firestore)
- **AI Models:** Google GenAI SDK (`@google/genai`)
- **Hosting:** Client-side SPA (can be hosted on Vercel, Netlify, or Firebase Hosting)

---

## 🏗️ Architecture

The application follows a **Serverless Thick-Client** architecture:

1.  **Client:** The React app manages state (`AppContext`) and UI logic.
2.  **AI Layer:** The client communicates directly with Google's GenAI API for text and multimodal analysis.
3.  **Data Layer:** Firebase Firestore pushes real-time updates to the dashboard via listeners.

| Component | Model / Service | Purpose |
| :--- | :--- | :--- |
| **ChatBot** | `gemini-3-pro-preview` | General assistance and safety advice. |
| **Map Intel** | `gemini-2.5-flash` | Geo-grounding and location-specific safety data. |
| **Case Analysis** | `gemini-3-flash-preview` | Aggregating raw signals into actionable insights. |
| **Database** | Firebase Firestore | Storing signals, users, and notifications. |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with the **Gemini API** enabled.
- A Firebase Project.

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/earlyshield-campus.git
cd earlyshield-campus
