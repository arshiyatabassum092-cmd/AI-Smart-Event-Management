# 🎓 AI-Powered Smart Event Management System

An intelligent, responsive, full-stack campus event discovery and registration platform built with **React**, **Tailwind CSS**, **Firebase Cloud Firestore**, and **Google Gemini AI**.

Developed as part of the **AI-Driven Software Development Internship**.

---

## 🌟 Key Features

### 1. 🏠 Modern Interactive Home Page
- **Hero Showcase**: High-impact campus headlines, quick action navigation, and live stats counters (Active Events, Registrations, Club Partners).
- **Featured Highlights**: Dynamic grid highlighting the top upcoming campus hackathons, workshops, and cultural fests.
- **Value Proposition**: Clear feature breakdown for both student attendees and faculty club coordinators.

### 2. 🔍 Smart Event Discovery & Filtering
- **Keyword Search**: Instant search across titles, descriptions, venue locations, and topical tags.
- **Category Filter**: Filter events by `Technical`, `Workshop`, `Cultural`, `Sports`, and `Seminar`.
- **Dynamic Sorting**: Sort by upcoming chronological date, popularity (most registrations), or newly added.
- **Visual Occupancy**: Progress bar and real-time "seats left" status badge on every event card.

### 3. 📄 Detailed Event View & Availability Tracking
- Comprehensive breakdown including **Date, Time, Venue, Eligibility Criteria, and Organizing Body**.
- Live seat counter: Automatically updates available seats as registrations occur.
- Social sharing: Instant link copying for WhatsApp and student groups.

### 4. 🎟️ Online Registration & Digital Pass Generator
- Seamless registration form with auto-filled student profile fields.
- **Duplicate Prevention**: Guaranteed single registration per student per event.
- **Instant Digital Pass**: Confirmed ticket card displaying Ticket ID, student details, and entrance verification QR code.
- **Confetti Celebration**: Interactive feedback upon successful ticket issuance.

### 5. 🧑‍💼 Organiser Command Center (Dashboard)
- **KPI Metrics**: Real-time summary cards for Total Events Hosted, Total Registrations, and Venue Occupancy Rate.
- **Event CRUD Operations**: Create new events, edit event details, or delete completed events.
- **1-Click Demo Data Seeder**: Pre-load realistic campus events (Hackathon, React Workshop, Cultural Fest, Badminton Championship) with one click for viva presentations.

### 6. 👥 Participant Management & Attendance Roster
- Complete attendee roster for every event.
- Filter and search registered students by Name, Email, Department, or Ticket ID.
- **Export to CSV**: Download student registration lists in one click for faculty attendance.

### 7. 🤖 Gemini-Powered AI Campus Concierge
- Floating chatbot widget accessible across all pages.
- **Live Context Grounding**: The AI reads active events from Firestore in real time to provide factual, hallucination-free answers.
- **Personalized Recommendations**: Suggests matching events based on student interests, major/branch, or schedule.
- Quick prompt chips for fast student queries.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 (Vite), React Router DOM v6 |
| **Styling** | Tailwind CSS v3, Lucide React Icons |
| **Database** | Firebase Cloud Firestore |
| **Authentication** | Firebase Authentication (Email/Password & Google OAuth) |
| **AI Assistant** | Google Gemini API (`@google/generative-ai`) |
| **Celebration FX** | Canvas Confetti |
| **Deployment** | Vercel & GitHub CI/CD |

---

## 📁 Project Structure

```text
AI-Smart-Event-Management/
├── public/
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   └── ChatWidget.jsx           # Gemini AI Chatbot interface
│   │   ├── common/
│   │   │   ├── Navbar.jsx               # Navigation bar with role switcher
│   │   │   └── Footer.jsx               # Footer with internship credits
│   │   └── events/
│   │       ├── EventCard.jsx            # Event card with occupancy progress
│   │       ├── EventFilter.jsx          # Search and category filters
│   │       ├── EventFormModal.jsx       # Organiser Add/Edit event modal
│   │       └── RegistrationModal.jsx    # Registration form & digital ticket pass
│   ├── context/
│   │   ├── AuthContext.jsx              # Role-based auth (Student vs Organiser)
│   │   └── NotificationContext.jsx      # Toast alert system
│   ├── pages/
│   │   ├── HomePage.jsx                 # Landing page & highlights
│   │   ├── EventsPage.jsx               # Event directory & search
│   │   ├── EventDetailPage.jsx          # Event information & booking
│   │   ├── MyRegistrationsPage.jsx      # Student digital pass wallet
│   │   ├── DashboardPage.jsx            # Organiser management console
│   │   ├── EventParticipantsPage.jsx    # Attendee roster & CSV export
│   │   ├── LoginPage.jsx                # Login/Signup & 1-click demo access
│   │   └── NotFoundPage.jsx             # 404 handler
│   ├── services/
│   │   ├── firebase.js                  # Firebase initialization & fallback
│   │   ├── eventService.js              # Firestore event CRUD operations
│   │   ├── registrationService.js       # Ticket booking & CSV export
│   │   ├── geminiService.js             # Gemini AI prompt & context grounding
│   │   └── seedService.js               # Preset campus sample data
│   ├── App.jsx                          # Main routing & layout
│   ├── main.jsx                         # React DOM entry point
│   └── index.css                        # Tailwind directives & custom scrollbars
├── .env.example                         # Environment variables template
├── .gitignore                           # Git security exclusion rules
├── firestore.rules                      # Cloud Firestore security rules
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Step-by-Step Getting Started Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Git** installed on your computer

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/AI-Smart-Event-Management.git
cd AI-Smart-Event-Management

# Install npm packages
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note for Local Demonstrations:** If you haven't created your Firebase or Gemini keys yet, the application automatically runs in **Offline Demo Mode** with pre-seeded campus events so you can test and present the full UI immediately!

### 4. How to Obtain Your Free API Keys

#### A. Google Gemini API Key (100% Free):
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google Account.
3. Click **"Get API key"** -> **"Create API key in new project"**.
4. Copy the key and paste it as `VITE_GEMINI_API_KEY` in `.env.local`.

#### B. Firebase Project & Firestore:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it `campus-event-management`.
3. In the sidebar, select **Authentication** -> **Get Started** -> Enable **Email/Password** and **Google**.
4. In the sidebar, select **Firestore Database** -> **Create Database** -> Choose **Start in test mode** (or paste the rules from `firestore.rules`).
5. Go to **Project Settings** (gear icon) -> **General** -> scroll down to **Your apps** -> click the **Web icon (`</>`)** -> Register app.
6. Copy the configuration credentials into your `.env.local`.

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 6. Build for Production
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` folder.

---

## 🌐 Deployment to Vercel

1. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI-Powered Smart Event Management System"
   git branch -M main
   git remote add origin https://github.com/your-username/AI-Smart-Event-Management.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add each variable from your `.env.local` (`VITE_FIREBASE_API_KEY`, `VITE_GEMINI_API_KEY`, etc.).
5. Click **Deploy**. Vercel will build and assign you a live HTTPS domain!

---

## 🎯 Internship Presentation & Demonstration Checklist

When presenting this project to your mentor or internship viva committee:
1. **Role Switcher in Header**: Use the top-right toggle pill to easily flip between **Student** view and **Organiser** view without having to log in and out.
2. **Event Registration Flow**:
   - Navigate to **Explore Events**, choose a workshop, and click **View Details & Register**.
   - Show how seat capacity decreases in real time.
   - Complete the registration to trigger the celebratory confetti and display the **Digital Pass with QR Code**.
   - Visit **My Passes** to verify the digital ticket is saved.
3. **Organiser Management**:
   - Switch to **Organiser** mode and click **Organiser Dashboard**.
   - Demonstrate the metric cards (Total Events, Registrations, Occupancy %).
   - Create a new event or click **Participants** on an event to show the roster and click **Export CSV**.
4. **AI Assistant Demo**:
   - Click the floating **Ask AI Assistant** widget at the bottom right.
   - Ask: *"What hackathons are happening on campus?"* or *"Recommend a workshop for a beginner in web development"*.
   - Point out how the AI grounds its answers directly from the active events list.

---

## 📄 License
This project is open-source under the MIT License — designed for educational, internship, and campus community purposes.
