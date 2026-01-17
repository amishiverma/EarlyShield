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

**EarlyShield** is an AI-powered campus intelligence and early risk management platform designed to help institutions detect and address issues *before* they escalate into major disruptions.

**Tagline:** Prevention before disruption.

---

## 🚀 Problem Statement

Educational institutions rely on enterprise systems that respond only after problems occur.  
Small signals such as connectivity issues, facility problems, or operational delays are often ignored or scattered across informal channels, leading to delayed action and avoidable disruptions.

---

## 💡 Solution Overview

EarlyShield works as a **pre-enterprise early warning layer**.  
It collects lightweight signals from students and staff, analyzes patterns using **Google Gemini AI**, and converts noise into **actionable, explainable risk intelligence** for administrators.

---

## 🧠 Key Features

- Lightweight signal reporting for students and staff  
- AI-driven early risk detection using Google Gemini  
- Signal clustering into high-confidence cases  
- Institution health dashboard with trends  
- Interactive risk map with location-aware insights  
- Explainable AI summaries for administrators  
- Role-based interfaces (Student, Admin, Management)  
- SAP-ready escalation workflow (mocked)  
- Persistent AI assistant for decision support  

---

## 👥 User Roles

- **Student / Staff** – Report issues quickly without friction  
- **Admin** – Monitor risks, analyze cases, take action  
- **Management** – View high-level health scores and trends (read-only)

---

## 🔄 Process Flow

1. Student or staff submits a signal  
2. Data is stored securely in Firebase Firestore  
3. Gemini AI analyzes signal frequency and patterns  
4. Related signals are clustered into cases  
5. Admin reviews AI insights and risk trends  
6. Validated cases can be escalated to enterprise systems (SAP)

---

## 🧪 Google Technologies Used

- Google Gemini (3 Pro Preview, 3 Flash Preview, 2.5 Flash)  
- Google GenAI SDK (`@google/genai`)  
- Google AI Studio  
- Google Maps & Google Maps Grounding  
- Firebase Firestore  
- Firebase Admin SDK  
- Material Design 3  
- Google Fonts & Material Symbols  

---

## 🏗️ Tech Stack

### Frontend
- React 18 (TypeScript)
- Tailwind CSS
- Material Design 3

### Backend
- Firebase Firestore
- Firebase Admin SDK

### AI
- Google Gemini models via GenAI SDK

---

## 👨‍👩‍👧‍👦 Team Contributions

AI & Product Design: Concept, AI workflows, Gemini integration logic, UX flow, documentation

Backend & Deployment: Firebase integration, API setup, backend logic, deployment

## 🔮 Future Scope

Multi-institution federation

Predictive risk forecasting

Deeper SAP workflow automation

Mobile-first reporting

Cost-impact analytics

## 📜 License

This project was developed as part of a hackathon and is intended for educational and demonstration purposes.


---

