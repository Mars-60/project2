# 🚀 Gitzy — AI Powered GitHub Repository Analyzer

> Understand any public GitHub repository in **minutes instead of hours**.

Gitzy is a full-stack web application that fetches, analyzes, and explains GitHub repositories using AI.  
Instead of manually exploring dozens of files, you can paste a repository link and instantly get a **structured overview, file tree, and AI chat to understand the codebase.**

---

## 🧠 Skills & Technologies Demonstrated

**Frontend**
- ReactJS
- Tailwind CSS
- Component-based architecture
- Responsive UI & workspace layout
- API integration & state management

**Backend**
- Node.js + Express.js
- REST API design
- Modular backend architecture
- Async workflows & error handling

**Database**
- MongoDB (sessions & workspace data)

**Authentication & Security**
- JWT Authentication (secure sessions)
- Google OAuth 2.0 login
- GitHub OAuth 2.0 login
- Protected routes & session handling

**APIs & AI Integration**
- GitHub REST API → repository & file fetching  
- Groq API → AI summaries & repo chat

**Core Concepts**
- Full-stack architecture
- Real-world API integration
- AI powered developer tooling
- Scalable backend design
- Authentication & authorization
- Performance optimization (caching – in progress)

---

## 🌐 Live Project

👉 **Live App:** https://gitzy-app-one.vercel.app/

---

## ✨ What Problem Does Gitzy Solve?

Understanding a new GitHub repository is time-consuming:
- Dozens or hundreds of files to read
- Unknown architecture
- Missing or outdated documentation

Gitzy helps developers:
- Explore repos faster  
- Decide whether to contribute  
- Understand projects without cloning them

---

## 🔥 Key Features

### 🔗 1. Connect Any Public Repository
Simply paste a GitHub repository link and Gitzy will:
- Fetch repository metadata
- Analyze its structure
- Prepare it for AI exploration

---

### 🌲 2. Interactive Repository File Tree
Gitzy automatically generates a **visual file explorer**:
- Browse folders and files
- Navigate large repositories easily
- Understand project structure quickly

---

### 🤖 3. AI Repository Summary
Gitzy generates a **high-level overview** of the repository:
- Purpose of the project
- Main technologies used
- Overall architecture
- How the project works

This saves hours of manual reading.

---

### 💬 4. Chat With the Repository
The most powerful feature.

You can ask questions like:
- "What does this project do?"
- "Explain the backend architecture"
- "How is authentication implemented?"
- "Which files should I read first?"

Gitzy uses AI to analyze repository files and provide **context-aware answers.**

---

### ⚡ 5. Faster Repo Exploration Workflow
Gitzy eliminates the need to:
- Clone repositories
- Install dependencies
- Configure IDEs

Perfect for:
- Students learning from open source
- Developers exploring new tech stacks
- Recruiters reviewing projects
- Contributors evaluating repos

---

### 🔐 6. Secure Authentication System
Gitzy includes a complete modern authentication flow.

Users can sign in using:
- Email & Password (JWT authentication)
- Google OAuth
- GitHub OAuth

Features:
- Secure token-based sessions
- Protected workspaces
- Personalized repository history
- Seamless login experience

---

## 🏗️ How It Works (Architecture)

1. User authenticates via JWT / Google / GitHub OAuth  
2. User submits GitHub repository link  
3. Backend fetches repository data using GitHub API  
4. File structure & contents are processed  
5. AI generates summaries and answers via Groq API  
6. Session & workspace data stored in MongoDB  
7. Frontend workspace displays personalized results  

---

## 🧪 Project Status

🚀 **Live and actively being improved**

Currently working on:
- Workspace UI refinements
- Performance optimizations & caching
- More AI-powered insights
- Better chat context handling

---

## 👨‍💻 Author

**Adnan Raza**

If you found this project useful, consider giving it a ⭐
