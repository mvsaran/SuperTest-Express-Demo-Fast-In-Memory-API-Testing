# 🚀 SuperTest Express Demo — Fast, In-Memory API Testing


![Node >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Author](https://img.shields.io/badge/Author-Saran%20Kumar-blueviolet)
![SuperTest](https://img.shields.io/badge/API%20Testing-SuperTest-blue)
![Mocha](https://img.shields.io/badge/Test%20Runner-Mocha-yellow)

---

## ✨ What is this project?

A **tiny Express API** tested using **SuperTest + Mocha + Chai** — completely **in-memory**, meaning:

⚡ **No server is started**  
⚡ **No port is required**  
⚡ **Tests run extremely fast & stable**  
⚡ **Ideal for CI pipelines**

This makes backend testing **super lightweight, super fast, and super reliable**.

---

# ⚡ Quick Setup

```bash
npm ci
cp .env.example .env
npm test
```

Run dev server manually:

```bash
npm run dev
# or
npm start
```

---

# 🧱 Architecture — Visual & Simple

### 🧩 How SuperTest connects with Express internally (No Server Needed)

Below is the project architecture diagram (visual) and a screenshot of the project folder structure.

**Architecture Diagram (SVG)**  

![Architecture diagram](./assets/architecture.svg)

**Project Structure Screenshot**  

<details>
<summary>Click to expand the screenshot of the project structure</summary>

![Project Structure Screenshot](./assets/project-structure.png)

</details>

```
 ┌─────────────────────────────────────────────────────────┐
 │                     SuperTest (Tests)                   │
 │     request(app) → directly calls Express handlers      │
 └───────────────▲───────────────────────────────▲────────┘
                 │                               │
                 │ in-memory calls               │ no HTTP
                 │                               │
       ┌─────────┴───────────────────────────────┴─────────┐
       │                     Express App                     │
       │               app.js (no listen())                  │
       │                                                     │
       │  Routes → Controllers → Auth Middleware → Store     │
       └───────────▲──────────────▲────────────▲────────────┘
                   │              │            │
             users.js       usersController.js   auth.js
```

---

# 🆚 SuperTest vs Normal API Testing

## 🤖 SuperTest API Testing (used here)

| Feature | Description |
|--------|-------------|
| 🚫 No Server Needed | Tests directly call `request(app)` |
| ⚡ Super Fast | No HTTP/network overhead |
| 🧪 Perfect for Integration Tests | Middleware, routing, controllers |
| 🔁 Stable in CI | No port conflicts / flaky networking |
| 💻 In-memory execution | Same process as test runner |

## 🌐 Normal API Testing (Cypress, Postman, Axios, curl)

| Feature | Description |
|--------|-------------|
| 🟢 Requires a Running Server | Must listen on `http://localhost:3000` |
| 🐢 Slower | Real HTTP calls |
| 🌍 Realistic Network Behavior | Great for end-to-end testing |
| 🔌 Needed for UI automation | Cypress / Postman collections |

---

# 🎯 When Should You Use Which?

### ✔ Use **SuperTest** when:
- You want **fast**, **in-memory**, **code-level** API tests  
- You are testing **routes**, **controllers**, **middleware**, **auth**, **validation**  
- You want **stable CI pipelines**  
- You do **not** want to deal with ports or server startup

### ✔ Use **Normal / Network API Tests** when:
- Testing a **deployed environment** (QA / UAT / Prod)  
- Testing **CORS**, **TLS**, **load balancers**, **reverse proxies**  
- Testing **frontend → backend API calls**  
- Doing **end-to-end (E2E)** with UI + API  

---

# 🏗 Project Architecture Diagram (High-Level)

```
┌──────────────┐       ┌─────────────────────┐
│ Developer PC │       │   GitHub Actions    │
└──────┬───────┘       └────────┬────────────┘
       │                        │
       │ Run tests locally      │ CI runs on PR
       ▼                        ▼
┌────────────────────────┐   ┌─────────────────────────┐
│ SuperTest (Mocha)      │   │ Cypress (optional E2E)  │
│ - In-memory API tests  │   │ - Runs on real server   │
│ - No HTTP network      │   │ - UI + HTTP flows       │
└─────────┬──────────────┘   └──────────┬──────────────┘
          │                               │
          ▼                               ▼
   Express App (app.js)                Test Server
   Routes / Controllers                (npm start)
   Auth / In-memory Store
```

---

# 🗂 Folder Structure

```
/
├─ package.json
├─ .env.example
├─ README.md
├─ server.js
├─ app.js
├─ routes/
│  └─ users.js
├─ controllers/
│  └─ usersController.js
├─ lib/
│  └─ auth.js
├─ test/
│  └─ users.test.js
└─ .github/workflows/ci.yml
```

---

# 🧪 What Tests Cover

✔ GET `/` — health check  
✔ POST `/api/register` — create user  
✔ POST `/api/login` — login & return token  
✔ GET `/api/users` — protected route  
✔ GET `/api/users/:id` — valid + invalid id tests  
✔ Manual token signing test  
✔ Full auth + routing + controller flow  
✔ Fully isolated using in-memory store  

---

# 🧠 Key Idea Behind SuperTest

SuperTest directly calls:

```js
request(app)
```

Meaning:  
- No network  
- No ports  
- No server startup  
- No flakiness  

---

# 🔧 Commands

```bash
npm ci
cp .env.example .env
npm test
npm run dev
```

---

# 👨‍💻 Author

**👤 Saran Kumar**  
💼 SDET | Automation Engineer 
🌐 Passionate about designing clean, fast, scalable test frameworks

---
