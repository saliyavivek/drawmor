# Drawmor - Collaborative Whiteboard Application

![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Package Manager](https://img.shields.io/badge/package%20manager-pnpm%409.0.0-blue)
![Monorepo](https://img.shields.io/badge/monorepo-turbo-purple)
![License](https://img.shields.io/badge/license-ISC-green)

A real-time collaborative whiteboard application that allows multiple users to sketch, draw shapes, and chat simultaneously. Built with a modern monorepo architecture using **TypeScript**, **Next.js**, **Express**, **WebSocket**, and **PostgreSQL**.

## 🌟 Features

### Drawing & Collaboration

- **Real-time Drawing**: Multi-user collaborative sketching with instant synchronization
- **Shape Tools**: Create rectangles, circles, lines, arrows, text, and freehand pencil drawings
- **Persistent Canvas**: All drawing elements are saved to the database and restored when users rejoin
- **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing

### Room Management

- **Create Rooms**: Set up new collaborative whiteboards
- **Join Rooms**: Connect to existing rooms using room slugs
- **Access Control**: Support for public/private rooms with optional password protection
- **Room Discovery**: Search and get suggestions for available rooms

### Real-time Communication

- **Live Chat**: Instant messaging within collaborative rooms
- **User Presence**: See who's currently in the room
- **Connected Users**: Real-time user list management

### Authentication

- **User Accounts**: Create and manage user accounts with secure authentication
- **JWT-based Auth**: Secure token-based authentication for API requests
- **Password Hashing**: Bcrypt for secure password storage

## 📦 Project Structure

This is a **pnpm monorepo** using **Turbo** for task orchestration.

```
drawmor/
├── apps/
│   ├── http/              # Express REST API server
│   │   ├── src/
│   │   │   ├── index.ts              # API entry point
│   │   │   ├── controllers/          # Route handlers
│   │   │   │   ├── user.ts           # User auth controllers
│   │   │   │   ├── canvas.ts         # Canvas/room management
│   │   │   │   └── chat.ts           # Chat management
│   │   │   ├── routes/               # API route definitions
│   │   │   ├── middleware/           # Express middleware (auth)
│   │   │   └── types/                # Express type extensions
│   │   └── package.json
│   │
│   ├── ws/                # WebSocket server for real-time sync
│   │   ├── src/
│   │   │   ├── index.ts              # WebSocket entry point
│   │   │   ├── helpers/              # Event handlers
│   │   │   │   ├── handlers.ts       # WebSocket message handlers
│   │   │   │   └── roomManager.ts    # Room management
│   │   │   ├── http/                 # HTTP integration
│   │   │   ├── types/                # WebSocket type definitions
│   │   │   └── utils/                # Utility functions
│   │   └── package.json
│   │
│   └── web/               # Next.js frontend application
│       ├── app/
│       │   ├── layout.tsx            # Root layout
│       │   ├── page.tsx              # Home page
│       │   ├── canvas/               # Canvas pages
│       │   │   ├── page.tsx          # Main canvas view
│       │   │   ├── create/           # Room creation
│       │   │   └── join/             # Room joining
│       │   ├── signin/               # Sign in page
│       │   ├── signup/               # Sign up page
│       │   ├── store/                # Jotai atoms (state)
│       │   └── fonts/                # Custom fonts
│       ├── components/               # React components
│       │   ├── AuthForm.tsx          # Authentication form
│       │   ├── MainCanvas.tsx        # Canvas drawing area
│       │   ├── SocketCanvas.tsx      # WebSocket integration
│       │   ├── DrawingToolbar.tsx    # Tool selection
│       │   ├── ChatRoom.tsx          # Chat component
│       │   ├── CanvasHeader.tsx      # Canvas header
│       │   ├── InviteDialog.tsx      # Room invite dialog
│       │   ├── LeaveRoomDialog.tsx   # Room leave dialog
│       │   ├── ModeToggle.tsx        # Dark mode toggle
│       │   ├── ProgressBar.tsx       # Loading indicator
│       │   ├── theme-provider.tsx    # Theme context
│       │   └── ui/                   # Shadcn UI components
│       ├── draw/                     # Drawing engine
│       │   ├── draw.ts               # Main drawing initialization
│       │   ├── http/                 # HTTP requests
│       │   ├── utils/
│       │   │   ├── canvas.ts         # Canvas utilities
│       │   │   ├── renderer.ts       # Shape rendering
│       │   │   ├── events.ts         # Mouse/touch events
│       │   │   ├── websocket.ts      # WebSocket communication
│       │   │   ├── selection.ts      # Shape selection
│       │   │   └── shapes.ts         # Shape utilities
│       │   └── draw.ts
│       ├── lib/                      # Utility functions
│       ├── types/                    # TypeScript type definitions
│       └── public/                   # Static assets
│
└── packages/
    ├── common/                       # Shared types & validation
    │   ├── src/
    │   │   ├── types.ts              # Shared TypeScript types
    │   │   ├── schema.ts             # Zod validation schemas
    │   │   └── errors.ts             # Error definitions
    │   └── package.json
    │
    ├── db/                           # Database & ORM
    │   ├── prisma/
    │   │   ├── schema.prisma         # Database schema
    │   │   └── migrations/           # Database migrations
    │   ├── src/
    │   │   └── index.ts              # Prisma client export
    │   └── package.json
    │
    ├── ui/                           # Shared UI components
    │   ├── src/
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   └── code.tsx
    │   └── package.json
    │
    ├── typescript-config/            # Shared TypeScript configs
    │   ├── base.json
    │   ├── nextjs.json
    │   ├── react-library.json
    │   └── package.json
    │
    └── eslint-config/                # Shared ESLint configs
        ├── base.js
        ├── next.js
        ├── react-internal.js
        └── package.json
```

## 🏗️ Architecture

### Tech Stack

**Frontend:**

- **Next.js 15** - React framework with SSR and static generation
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component library
- **Jotai** - Lightweight state management
- **Rough.js** - Sketchy drawing library (hand-drawn aesthetic)
- **Axios** - HTTP client
- **NextAuth** - Authentication
- **Sonner** - Toast notifications

**Backend:**

- **Express.js** - HTTP server framework
- **WebSocket (ws)** - Real-time bidirectional communication
- **Prisma ORM** - Database ORM with type safety
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Next-Auth** - Authentication library integration

**Monorepo & DevOps:**

- **pnpm** - Fast, disk space efficient package manager
- **Turbo** - Build system for monorepos
- **TypeScript** - Type safety across entire project

### Data Models

**User**

- `id` (UUID) - Primary key
- `username` (String, unique) - User's login name
- `password` (String) - Hashed password
- Relations: Multiple rooms, drawing elements, messages

**Room**

- `id` (UUID) - Primary key
- `name` (String) - Room display name
- `adminId` (UUID) - Room creator/admin
- `isPrivate` (Boolean) - Privacy level
- `password` (String, optional) - Room access password
- `createdAt` (DateTime) - Creation timestamp

**DrawingElement**

- `id` (UUID) - Primary key
- `type` (String) - Shape type (rectangle, circle, line, pencil, arrow, text)
- `data` (JSON) - Shape-specific data (coordinates, text, etc.)
- `userId` (UUID) - Creator user
- `roomId` (UUID) - Room reference
- `createdAt` (DateTime) - Creation timestamp

**Chat**

- `id` (UUID) - Primary key
- `text` (String) - Message content
- `senderId` (UUID) - Message author
- `roomId` (UUID) - Room reference
- `createdAt` (DateTime) - Send timestamp

### Supported Shape Types

```typescript
interface Shape {
  id?: string;
  type: "rectangle" | "circle" | "line" | "pencil" | "arrow" | "text";
  // Type-specific properties...
}

- Rectangle: x, y, width, height
- Circle: x, y, radius
- Line: startX, startY, endX, endY
- Pencil: points array
- Arrow: startX, startY, endX, endY
- Text: x, y, text content
```

### Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Frontend (Next.js)                   │
│  - React Components (Canvas, Chat, Toolbar)                 │
│  - Jotai State Management                                   │
│  - Rough.js Drawing Engine                                  │
└────────────┬──────────────────────────────┬─────────────────┘
             │                              │
    HTTP Requests                    WebSocket Connection
      (Auth, Room Mgmt)              (Real-time Sync)
             │                              │
             ▼                              ▼
      ┌─────────────────────────────────────────────┐
      │         Express HTTP Server                 │
      │  - Authentication (JWT, Bcrypt)             │
      │  - User Management                          │
      │  - Canvas/Room CRUD                         │
      │  - Chat History                             │
      │  - Shape Retrieval                          │
      └────────────┬────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
  ┌─────────────┐        ┌─────────────────┐
  │ PostgreSQL  │        │ WebSocket Server│
  │ Database    │        │ (Express + ws)  │
  │             │        │ - Room Manager  │
  │ Users       │        │ - Draw Events   │
  │ Rooms       │        │ - Chat Messages │
  │ Elements    │        │ - User Sync     │
  │ Messages    │        └─────────────────┘
  └─────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.0.0
- **PostgreSQL** 12+ (database)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/saliyavivek/drawmor.git
cd drawmor
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create `.env` files in the root and respective app directories:

**Root `.env`:**

```bash
# HTTP Server
HTTP_PORT=3001
CLIENT_ORIGIN=http://localhost:3000

# WebSocket Server
WS_PORT=8080

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/drawmor

# JWT Secret
JWT_SECRET=your_secret_key_here

# NextAuth (for web app)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. **Initialize the database**

```bash
pnpm run build
pnpm exec prisma migrate dev --name init
```

### Running the Application

**Development mode** (all services with hot reload):

```bash
pnpm dev
```

This will start:

- 🌐 Web frontend: `http://localhost:3000`
- 🔗 HTTP API: `http://localhost:3001`
- 🔌 WebSocket server: `ws://localhost:8080`

**Build for production:**

```bash
pnpm build
```

**Start production services:**

```bash
# Terminal 1: HTTP Server
cd apps/http && pnpm start

# Terminal 2: WebSocket Server
cd apps/ws && pnpm start

# Terminal 3: Next.js Web App
cd apps/web && pnpm start
```

## 🔌 API Endpoints

### Authentication (`/api/user`)

- `POST /api/user/signup` - Register new user
  - Body: `{ username, password }`
  - Returns: User info and JWT token
- `POST /api/user/signin` - Login user
  - Body: `{ username, password }`
  - Returns: User info and JWT token

### Canvas & Rooms (`/api/canvas`)

- `POST /api/canvas` - Create new room
  - Body: `{ name, password?, isPrivate }`
  - Returns: Room ID
- `POST /api/canvas/:slug` - Join room by slug
  - Returns: Room ID
- `GET /api/canvas/shapes/:roomId` - Get all shapes in a room
  - Returns: Array of DrawingElement objects
- `GET /api/canvas/search/suggestions` - Find rooms
  - Returns: List of available rooms

### Chat (`/api/chat`)

- GET/POST endpoints for chat message management

## 🔌 WebSocket Events

The WebSocket server handles real-time collaboration:

**Client → Server:**

- `joinRoom` - User joins a collaborative room
- `drawShape` - New shape is drawn
- `updateShape` - Shape is modified
- `chatMessage` - User sends chat message
- `leaveRoom` - User leaves the room

**Server → Clients (Broadcast):**

- Shape updates synchronized across all connected users in the room
- Chat messages broadcast to all room participants
- User presence updates when users join/leave

## 📝 Development Workflow

### Running Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm check-types
```

### Code Formatting

```bash
pnpm format
```

### Turbo Cache

Turbo automatically caches build outputs. To clear cache:

```bash
pnpm turbo cache clean
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based user authentication
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Configuration**: Restricted origin headers for API requests
- **Middleware Protection**: Auth middleware on protected routes
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Validation**: Zod schemas for runtime data validation

## 🎨 UI Components

The project uses **Shadcn UI** (based on Radix UI) components including:

- Buttons, Cards, Dialogs
- Dropdowns, Tooltips, Tabs
- Input fields, Labels, Checkboxes
- Progress bars, Scroll areas, Separators
- Avatar, Badge, Switch

Custom theme support with light/dark mode toggle.

## 📚 Key Libraries & Dependencies

| Library     | Use Case         | Version      |
| ----------- | ---------------- | ------------ |
| next        | React framework  | ^15.3.0      |
| express     | HTTP server      | ^5.1.0       |
| ws          | WebSocket        | ^8.18.2      |
| prisma      | ORM              | ^6.8.2       |
| zod         | Validation       | (in schemas) |
| jotai       | State management | ^2.12.5      |
| roughjs     | Sketchy drawing  | ^4.6.6       |
| next-auth   | Authentication   | ^4.24.11     |
| tailwindcss | Styling          | ^4.1.8       |
| typescript  | Type safety      | 5.8.2        |

## 🔄 Monorepo Commands

Monorepo is managed with Turbo for parallel task execution:

```bash
# Run build in dependency order
pnpm turbo run build

# Run dev servers concurrently
pnpm turbo run dev

# Run linting across all packages
pnpm turbo run lint

# Run type checking across all packages
pnpm turbo run check-types

# Rebuild with cache clear
pnpm turbo run build --force
```

## 📄 License

ISC

## 🙋 Support

For questions or issues, please create a GitHub issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior

## 🔗 Related Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Turbo Documentation](https://turbo.build/)
- [pnpm Documentation](https://pnpm.io/)

---

**Built with ❤️ using TypeScript, React, and Express.js**
