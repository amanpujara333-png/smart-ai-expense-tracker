# Smart AI Expense Tracker

Smart AI Expense Tracker is a full-stack application that helps users track expenses, visualize spending patterns, and get AI-driven insights and recommendations. The project combines a Spring Boot backend with a modern React + Vite frontend.

Features
- User authentication with JWT
- CRUD for transactions with categories and timestamps
- Modern React dashboard with responsive UI
- Analytics and category-wise spending summaries
- AI-assisted insights (placeholder for future models)

Tech stack
- Backend: Java, Spring Boot, Spring Data JPA, H2/MySQL
- Frontend: React, Vite, Tailwind (UI)
- Security: Spring Security + JWT

Quick Links
- API: /api/* (see src/main/java/com/example/Expense/Tracker/controller)

Getting started
1. Copy `.env.example` to `.env` and update secrets.
2. Run backend: `./mvnw spring-boot:run` or `./run.sh` (make executable)
3. Run frontend (optional for development):
	- cd modern-expense-tracker-ui
	- npm install
	- npm run dev

Folder structure
- modern-expense-tracker-ui/: React frontend
- src/main/java/: Spring Boot backend
- src/main/resources/: application config & static assets

Contributing
Feel free to open issues or create PRs. For security, never commit secrets — use `.env` and the provided `.env.example`.

License
MIT

Screenshot placeholders
- /docs/screenshots/ (add images here)

For full setup and API usage examples, see the `docs/` folder.
