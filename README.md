🚨 ResQ Connect - Disaster Management System

ResQ Connect is a web-based disaster management and response coordination platform designed to bridge the gap between citizens in distress and emergency authorities. It facilitates real-time incident reporting, safe zone mapping, and data-driven decision-making to minimize response times during emergencies.

📸 Project Overview

Disasters require rapid information flow. ResQ Connect provides two distinct portals:

Citizen Portal: For reporting incidents (Fire, Flood, Earthquake), viewing nearby shelters, accessing emergency hotlines, and reading safety guidelines.

Admin Command Center: For authorities to visualize incoming reports, update incident statuses (e.g., "Rescue Sent"), manage safe zones, and view statistical analytics.

✨ Key Features

👤 Citizen Module

Real-time Reporting: Report incidents with specific location and description.

Safe Zone Locator: View a list of nearby shelters, hospitals, and their capacity status (Open/Full).

Emergency SOS: One-click speed dial sidebar for Police (100), Fire (101), and Ambulance (108).

Live Weather Widget: View current temperature and weather conditions (Simulated).

Safety Guidelines: Access context-aware tips for different disaster types.

Volunteer Registration: Option to toggle status as an active volunteer.

🛡️ Admin Module

Live Operations Feed: Auto-refreshing list of incoming disaster reports.

Status Management: Ability to update incidents from "Pending" to "Rescue Sent" or "Resolved".

Visual Analytics: Doughnut charts visualizing the distribution of incident types (using Chart.js).

Shelter Management: Add and manage Safe Zones (Name, City, Capacity, Status).

Real-time Stats: Live counters for active emergencies and resolved cases.

🛠️ Technology Stack

Frontend: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6)

Backend: Core PHP

Database: MySQL

Tools: XAMPP (Apache Server), Visual Studio Code

Libraries:

Chart.js (for Analytics)

FontAwesome (for Icons)

Tailwind CSS CDN (for UI Styling)

🚀 How to Execute the Project

Follow these steps exactly to run the project on your local machine.

Prerequisites

Install XAMPP: Download and install from Apache Friends.

Visual Studio Code: Recommended editor.

Step 1: Deploy Files

Locate your XAMPP installation folder (usually C:\xampp).

Open the htdocs folder inside it.

Create a new folder named DisasterApp.

Copy your project's backend and frontend folders into this new folder.

Path should be: C:\xampp\htdocs\DisasterApp\frontend\...

Step 2: Start the Server

Open XAMPP Control Panel.

Click Start next to Apache.

Click Start next to MySQL.

Step 3: Database Setup

Open your browser and go to: http://localhost/phpmyadmin

Click New on the left sidebar.

Create a database named: disaster_management

Click the SQL tab at the top.

Open the file backend/sql/schema.sql from your project folder.

Copy all the SQL code, paste it into the phpMyAdmin box, and click Go.

Step 4: Run in Browser

Open your web browser (Chrome/Edge).

Enter this URL:

http://localhost/DisasterApp/frontend/index.html


(Note: Do NOT use the "Live Server" extension in VS Code. It will not work with PHP. You must use the localhost URL).

🔑 Login Credentials

The system comes with pre-configured users (passwords are encrypted in the DB):

👮 Admin Portal

Username: admin

Password: password

👤 Citizen Portal

Username: citizen

Password: 12345

(Or register a new account via the "Create Account" link on the login page)

📂 Project Structure

DisasterApp/
├── backend/
│   ├── api/             # API Endpoints (incidents.php, safety_places.php, tips.php)
│   ├── auth/            # Login/Register Logic
│   ├── config/          # Database Connection (db_connect.php)
│   └── sql/             # Database Schema
│
└── frontend/
    ├── css/             # Custom Styles (style.css)
    ├── js/              # Client-side Logic (admin.js, citizen.js, auth.js)
    ├── index.html       # Login Page
    ├── register.html    # Registration Page
    ├── admin_dashboard.html
    └── citizen_dashboard.html


🔮 Future Scope

IoT Integration: Connecting flood sensors for automated alerts.

Offline Mode: Converting to a PWA (Progressive Web App) for use without internet.

Map Integration: Using Leaflet.js to pinpoint incidents on a visual map.

SMS Gateway: Allowing non-smartphone users to report via SMS.

📜 License

This project is developed for educational purposes as a Final Year Project.