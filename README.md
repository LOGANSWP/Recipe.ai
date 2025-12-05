# Recipe.ai

## API Development Guide

This guide provides a concise reference for developers working on the Recipe.ai project, including startup process, API development workflow, and project structure.

---

## 1. Project Startup Workflow

### Step 1: Install Dependencies

Run the following commands in both backend and frontend directories:

```bash
npm install
```

---

### Step 2: Environment & Firebase Setup

1. Download the shared:
   - `.env` file
   - Firebase service account JSON key `cs409-final-project-recipe-ai-firebase-adminsdk-fbsvc-a5105e1fc5.json`
   - [Google drive link](https://drive.google.com/drive/folders/15BsQMzk3y3PEvR-N2KwI08PIVz65wgPA?usp=drive_link)

2. Place them in the following locations:

- Backend:
  - Backend `.env` → `Recipe.ai/backend/`
  - Firebase JSON → `Recipe.ai/backend/src/auth/`

- Frontend:
  - Frontend `.env` → `Recipe.ai/frontend/`

---

### Step 3: Start Development Servers

#### Start Backend:

```bash
cd Recipe.ai/backend
npm run dev
```

#### Start Frontend:

```bash
cd Recipe.ai/frontend
npm run dev
```

Once started, the frontend and backend will be connected in development mode.

---

## 2. API Development Workflow (Example: `getMyUser`)

This section describes how to add a new API using `getMyUser` as a conceptual example.
Example purpose: Fetch the current logged-in user's profile.

### Step 1: Define the MongoDB Schema (if needed)

- Add a new schema file in:
  - `src/models`
- Learn how to create schemas & apply CRUDs using [Mongoose document](https://mongoose.nodejs.cn/docs/models.html)

---

### Step 2: Define the Route

- Add a new route in:
  - `src/routes`
- Add permission control middleware (if needed):
  - use requireAuth(), If the `roles` parameter is not specified, all user types are allowed access by default.
  - Otherwise, the user must be of the specified types.
  - e.g. `authRouter.post("/logout", requireAuth(), postLogout);`
- Ensure:
  - Only authenticated users can access the API.
  - Role-based access control can be enforced if needed.


---

### Step 3: Define Validation Rules (if needed)

- Add validation rules in:
  - `src/celebrate`
- Learn how to validate requests using [Joi document](https://joi.dev/api/?v=17.13.3).
- Add celebrate middleware in your route:
  - e.g. `authRouter.post("/login", postLoginCelebrate, postLogin);`

---

### Step 4: Implement the Controller

***Important: You do not need to use `try ... catch ...` in controller function, since global error handler has been injected***

***Important: For routers that use `requireAuth(...)` middleware, you can directly access current User from the request object (instead of database): `const { user } = req;`***

***Important: For controllers that modify User objects, make sure to update User cache using `setUserCache(...)`***

- Add the corresponding logic to:
  - `src/controllers/userController.js`
- Responsibilities:
  - Read `userId` from authentication middleware.
  - Query user info from MongoDB.
  - Return the full user profile.

---

### Step 5: Frontend API Wrapper

- Add request method in:
  - `src/api/userApi.js`
- Use the centralized Axios instance from:
  - `src/api/index.js`
- This ensures:
  - Automatic token attachment
  - Unified error handling
  - Message-based status feedback (via Ant Design)

---

### Step 6: Frontend Usage

***Important: For front pages that requires login, make sure to wrap your components with ProtectedRoute, e.g. `<ProtectedRoute><Inventory /></ProtectedRoute>`, then only authenticated users can access them***

- Call the API in any page or component, such as:
  - `Profile.jsx`
- The global AuthContext ensures:
  - Login state is synchronized
  - User info is automatically updated after fetching

---

## 3. Project Structure Overview

### Backend (`Recipe.ai/backend`)

- **package.json / package-lock.json**  
  Dependency management and backend scripts.

- **src/**
  - **auth/**  
    Authentication-related configuration and utilities.  
    - `firebase.js`: Firebase Admin SDK initialization.  
    - `userCache.js`: Simple in-memory cache for user data.  
    - `*.json`: Firebase service account key.
  
  - **celebrate/**  
    Joi/Celebrate request validation rules.  
    - `authPattern.js`: Validation rules for authentication.

  - **config.js**  
    Centralized backend configuration (DB, env, etc).

  - **controllers/**  
    Business logic layer.  
    - `authController.js`: Register, login, logout logic.  
    - `inventoryController.js`: Inventory-related logic.  
    - `userController.js`: User-related logic (e.g., profile).

  - **index.js**  
    Backend application entry point.

  - **middleware/**  
    Global middleware.  
    - `requireAuth.js`: Authentication & permission middleware.  
    - `errorHandler.js`: Unified error handling.

  - **models/**  
    MongoDB Mongoose models.  
    - `user.js`: User schema.  
    - `Ingredient.js`: Ingredient schema.  
    - `Kitchenware.js`: Kitchenware schema.

  - **routes/**  
    API route definitions.  
    - `authRoutes.js`: Authentication routes.  
    - `inventoryRoutes.js`: Inventory routes.  
    - `userRoutes.js`: User routes.

---

### Frontend (`Recipe.ai/frontend`)

- **package.json / package-lock.json**  
  Frontend dependencies and scripts.

- **index.html**  
  Main HTML entry.

- **src/**
  - **api/**  
    Axios API wrappers.  
    - `index.js`: Axios instance, interceptors, global error handling.  
    - `authApi.js`: Auth-related requests.  
    - `userApi.js`: User-related requests.

  - **assets/**  
    Static assets and frontend config.  
    - `config.js`: Frontend environment configuration.  
    - Images and static media.

  - **auth/**  
    Authentication state management.  
    - `firebase.js`: Firebase client initialization.  
    - `AuthContent.jsx`: Global auth context provider.  
    - `ProtectedRoute.jsx`: Route guard based on login & role.

  - **components/**  
    Reusable UI components.  
    - `Header.jsx`: Navigation header.  
    - `DetailedCard.jsx`, `InventoryItemCard.jsx`: Core UI cards.

  - **pages/**  
    Application pages.  
    - `auth/`: Login and Register pages.  
    - `Home.jsx`: Homepage.  
    - `Inventory.jsx`: Inventory management.  
    - `Cook.jsx`: Cooking page.  
    - `planning/`: AI planning related pages.  
    - `Profile.jsx`: User profile page.

  - **App.jsx**  
    Main router and layout container.

  - **main.jsx**  
    Application entry point.

  - **index.css / tailwind.config.js / postcss.config.js**  
    Global styles and Tailwind CSS configuration.

- **vite.config.js**  
  Vite build and dev server configuration.

---

## Summary

- The project follows a strict **frontend-backend separation**.
- Firebase handles authentication, MongoDB stores user data.
- Axios handles all frontend API requests with unified interceptors.
- AuthContext + ProtectedRoute enable **global login state tracking and permission control**.
- New APIs follow a pipeline:
  **Route → Validation → Controller → Middleware → Frontend API → Page Usage**
