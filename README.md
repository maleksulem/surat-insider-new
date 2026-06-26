# Surat Insider • Production Release Manual

This directory contains the complete, self-contained, and production-ready source code for **Surat Insider**—a high-end, bespoke curation platform for wedding shopping, luxury textile curation, diamond- district intelligence, and culinary historical guides of Surat and South Gujarat.

---

## 🚀 Production Quick Start

To launch and run Surat Insider locally or in a self-hosted cloud environment:

### Prerequisites
- Node.js **v20.x or higher**
- npm **v10.x or higher**

### 1. Installation
Install all required production and development dependencies:
```bash
npm install
```

### 2. Environment Setup
Configure the environment file by copying the template:
```bash
cp .env.example .env
```
Open `.env` and configure your credentials:
```env
GEMINI_API_KEY="AI_STUDIO_OR_GEMINI_API_KEY"
APP_URL="https://yourdomain.com"

# SMTP Mail Server (Mandatory for Admin 2FA OTP handshakes)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=587
SMTP_USER="your_smtp_username"
SMTP_PASS="your_smtp_password"

# Super Admin Login Setup
ADMIN_EMAIL="admin@suratinsider.com"
ADMIN_MASTER_PASSWORD="your_secure_password"
```

### 3. Local Development
Boot both the backend Express router and the hot-swapping Vite development asset server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live app.

### 4. Build & Production Deployment
Compile and package the frontend React client bundle and Express backend server into a single production bundle:
```bash
npm run build
npm start
```

---

## 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` configured for maximum performance and minimum container size:

1. **Build Container:**
   ```bash
   docker build -t surat-insider .
   ```

2. **Run Container:**
   ```bash
   docker run -d -p 3000:3000 \
     -e GEMINI_API_KEY="your_api_key" \
     -e ADMIN_EMAIL="admin@suratinsider.com" \
     -e ADMIN_MASTER_PASSWORD="your_secure_password" \
     -e SMTP_HOST="smtp.mailgun.org" \
     -e SMTP_PORT=587 \
     -e SMTP_USER="your_user" \
     -e SMTP_PASS="your_pass" \
     --name surat-insider-live \
     surat-insider
   ```

---

## 🔒 Administrative Security Portal & 2FA Setup
To access the secure **Surat Insider Admin CMS Suite**:
1. Navigate to the obfuscated URL: `/insiderbyharundaryaye5313`
2. Authenticate with your `ADMIN_EMAIL` and `ADMIN_MASTER_PASSWORD`.
3. Receive a secure 6-digit One-Time Passcode (OTP) in your admin inbox (powered by the configured SMTP server).
4. Enter the passcode to secure your administrative session token (valid for 30 minutes of inactivity).
