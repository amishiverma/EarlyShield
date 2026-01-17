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

🛡️ EarlyShield Campus

EarlyShield is an AI-powered campus intelligence and early risk management platform designed to help institutions detect and address issues before they escalate into major disruptions.

🚀 Problem Statement

Educational institutions rely on enterprise systems that respond after problems occur.
Small signals such as connectivity issues, facility problems, or operational delays are often ignored or scattered, leading to delayed action and preventable disruptions.

💡 Solution Overview

EarlyShield works as a pre-enterprise early warning layer.
It collects lightweight signals from students and staff, analyzes patterns using Google Gemini AI, and converts noise into actionable, explainable risk intelligence for administrators.

Tagline: Prevention before disruption.

🧠 Key Features

Lightweight signal reporting for students and staff

AI-driven risk detection using Google Gemini

Signal clustering into high-confidence cases

Institution health dashboard with trends

Interactive risk map with location-aware insights

Explainable AI summaries for admins

Role-based views (Student, Admin, Management)

SAP-ready escalation (mocked)

Persistent AI assistant for decision support

👥 User Roles

Student / Staff – Report issues quickly without friction

Admin – Monitor risks, review cases, take action

Management – View high-level health scores and trends (read-only)

🧩 Process Flow

Student or staff submits a signal

Data stored securely in Firebase

Gemini AI analyzes patterns and frequency

Related signals are clustered into cases

Admin reviews AI insights

Validated cases can be escalated to enterprise systems

🧪 Google Technologies Used

Google Gemini (3 Pro, 3 Flash, 2.5 Flash)

Google GenAI SDK

Google AI Studio

Google Maps & Maps Grounding

Firebase Firestore

Firebase Admin SDK

Material Design 3

Google Fonts & Material Symbols

🏗️ Tech Stack

Frontend

React 18 (TypeScript)

Tailwind CSS

Material Design 3

Backend

Firebase Firestore

Firebase Admin SDK

AI

Google Gemini models via GenAI SDK

📁 Project Structure
/src
 ├── components
 ├── pages
 ├── services
 ├── context
 ├── types
 └── assets

🛠️ Setup & Run (Optional)
npm install
npm run dev


Note: API keys are stored securely using environment variables and are not committed.

🎥 Demo

Demo Video: (add link)

PPT: (add link)

Hackathon Submission: Hyphen ’26

👨‍👩‍👧‍👦 Team Contributions

AI & Product Design: Concept, AI workflows, Gemini integration logic, UX flow, documentation

Backend & Deployment: Firebase integration, API setup, backend logic, deployment

🔮 Future Scope

Multi-institution federation

Predictive risk forecasting

Deeper SAP workflow automation

Mobile-first reporting

Cost-impact analytics

📜 License

This project is developed as part of a hackathon and is intended for educational and demonstration purposes.
