# SmartDesk AI – Backend

SmartDesk AI is an intelligent customer support ticket management system powered by AI.
This backend handles authentication, ticket creation, AI classification, and automated support replies.

The system is designed to simulate a real-world SaaS support platform and demonstrate full-stack architecture, secure authentication, and AI automation.

---

##  Live Demo

Frontend: https://smartdeskclient.netlify.app
Backend API: https://smartdeskserver.onrender.com

---

##  Features

* Secure JWT Authentication (Access + Refresh Tokens)
* AI-based ticket classification
* Automated AI customer support replies
* Ticket management (Create, Read, Update, Delete)
* Search and filtering
* Pagination for scalability
* Token refresh and session handling
* Cloudflare AI integration
* Production-ready REST API
* Deployed on Render

---

##  AI Capabilities

The system integrates Cloudflare AI to automate customer support workflows:

* Classifies support tickets into:

  * Category
  * Priority
  * Sentiment
* Generates automated, real-time support replies
* Reduces manual support workload
* Improves response speed and consistency

---

##  Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cloudflare AI
* Axios

---

##  Project Structure

```
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── ticketController.js
│   └── aiController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   └── Ticket.js
│
├── routes/
│   ├── authRoutes.js
│   ├── ticketRoutes.js
│   └── aiRoutes.js
│
└── server.js
```

---

##  Installation

Clone the repository:

```
git clone <your-backend-repo-url>
cd backend
```

Install dependencies:

```
npm install
```

---

##  Environment Variables

Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

---

##  Running the Server

```
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

##  API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
```

### Tickets

```
POST   /api/tickets
GET    /api/tickets
PUT    /api/tickets/:id/message
PUT    /api/tickets/:id/close
DELETE /api/tickets/:id
```

### AI

```
POST /api/ai/reply
```

---

##  Sample Ticket Flow

1. User creates a support ticket
2. AI automatically classifies the ticket
3. AI generates the first response
4. Conversation continues in chat format
5. Ticket is resolved and closed

---

##  Deployment

The backend is deployed using:

* Render (Node.js server)
* MongoDB Atlas (Database)

---

##  Future Improvements

* Role-based access (Admin / Agent)
* Email notifications
* Analytics dashboard
* Multi-agent support
* Real-time chat (WebSockets)

---

##  Why this project?

This project demonstrates:

* Full-stack system design
* Secure authentication with refresh tokens
* AI integration in real-world workflows
* Scalable REST API design
* SaaS product architecture thinking

---

##  Contact

Feel free to connect for collaboration or feedback.
