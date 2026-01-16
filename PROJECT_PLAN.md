# Draugar - Technical Project Plan
## Privacy-Respecting Family Safety Platform (Solo Development)

**Project Name:** Draugar
**Project Type:** Personal/Open Source
**Developer:** Solo developer with AI coding assistance
**Mission:** Build a privacy-first family safety platform as a learning project and ethical alternative
**Primary Inspiration:** Life360 alternative without surveillance

---

## 1. Project Overview

Draugar is a personal project to build a privacy-first family safety and location tracking platform. This is a solo development effort using AI coding tools, focused on learning modern development practices while building something genuinely useful.

### Core Goals
- **Learn Modern Tech Stack**: Full-stack TypeScript, React Native, Node.js, and end-to-end encryption.
- **Privacy by Design**: End-to-end encryption for all location data.
- **Open Source**: Fully transparent, community-auditable code.
- **Self-Hostable**: Users can run their own instance for full data sovereignty.
- **Iterative Development**: Follow a phased-based roadmap, shipping core features first.
- **Sustainable Scope**: Build what one person can realistically maintain.

---

## 2. Privacy-First Design Principles

### 2.1 Core Privacy Commitments

1. **Zero-Knowledge Architecture**
   - Location data encrypted on device before transmission.
   - Server cannot read location data.

2. **Data Minimization**
   - Collect only essential data for service functionality.
   - No advertising identifiers or third-party trackers.

3. **User Sovereignty**
   - Users own their data completely.
   - Easy data export and deletion.

4. **Transparency**
   - Mobile applications will be open source.
   - Clear privacy policy in plain language.

5. **Minimal Third-Party Dependencies**
   - Self-hosted infrastructure on a Finland VPS.
   - Use of privacy-respecting services only (e.g., OpenStreetMap instead of Google Maps).

---

## 3. Feature Roadmap

**Project Status:** 3 of 6 phases complete.

### Phase 1: Foundation (✅ Complete)
- **Goal**: Working development environment with React Native + Node.js monorepo.
- **Key Deliverables**:
    - [x] Monorepo setup with pnpm and shared TypeScript types.
    - [x] React Native (Expo) mobile application scaffold.
    - [x] Node.js (Express) backend scaffold.

### Phase 2: Backend Core (✅ Complete)
- **Goal**: API server with PostgreSQL and WebSocket ready for features.
- **Key Deliverables**:
    - [x] PostgreSQL schema and connection setup with Drizzle ORM.
    - [x] Express API structure with robust error handling.
    - [x] WebSocket server integration with Socket.IO.

### Phase 3: Authentication (✅ Complete)
- **Goal**: Users can join via invite code and maintain sessions.
- **Key Deliverables**:
    - [x] Invite code generation and validation system.
    - [x] JWT token flow and session management (`jose` library).
    - [x] Mobile auth screens and secure token storage (`expo-secure-store`).

### Phase 4: E2E Encryption (⬜ Not Started)
- **Goal**: Zero-knowledge architecture where the server cannot read location data.
- **Key Tasks**:
    - [ ] Research and select a cryptography library (e.g., `tweetnacl`).
    - [ ] Implement key generation and a secure key exchange protocol.
    - [ ] Build the encrypt/decrypt data flow for location sharing.

### Phase 5: Real-Time Location (⬜ Not Started)
- **Goal**: Family members see each other on a map in real-time.
- **Key Tasks**:
    - [ ] Integrate MapLibre with OpenStreetMap for map display.
    - [ ] Broadcast and receive location data via WebSockets.
    - [ ] Implement background location tracking on mobile, optimizing for battery.

### Phase 6: Mobile Polish & Deployment (⬜ Not Started)
- **Goal**: Production-ready app deployed to a Finland VPS.
- **Key Tasks**:
    - [ ] Implement "Ghost Mode" to temporarily pause location sharing.
    - [ ] Finalize battery optimization and add user settings.
    - [ ] Create a Docker setup for deployment and document the process.

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Component      | Technology                                    | Rationale                                           |
|----------------|-----------------------------------------------|-----------------------------------------------------|
| **Monorepo**   | `pnpm` workspaces                             | Efficiently manages shared code and dependencies.   |
| **Mobile**     | React Native + Expo, TypeScript               | Single codebase for iOS & Android, fast iteration.  |
| **Backend**    | Node.js + Express, TypeScript                 | Unified language with frontend, strong ecosystem.   |
| **Database**   | PostgreSQL                                    | Robust, reliable, and powerful for geospatial data. |
| **ORM**        | Drizzle ORM                                   | Lightweight, pure TypeScript, no code generation.   |
| **Real-time**  | Socket.IO                                     | Resilient WebSockets for mobile clients.            |
| **Auth**       | JWT (`jose` library)                          | Modern, secure, and standard for stateless auth.    |
| **Maps**       | OpenStreetMap + MapLibre                      | Privacy-first, open source, and self-hostable.      |
| **Hosting**    | Docker on Hetzner VPS (Finland)               | Full data control in a privacy-friendly jurisdiction.|

### 4.2 System Architecture

**Current Architecture (Phase 3 Complete):**
```
┌─────────────────────────────────────┐
│    Mobile Clients (React Native)    │
│    - Expo, TypeScript               │
│    - Auth screens, Secure Storage   │
└──────────────┬──────────────────────┘
               │ HTTPS + WebSocket
               ▼
┌─────────────────────────────────────┐
│ Node.js Backend (Express/Socket.IO) │
│   - REST API for auth (JWT)         │
│   - WebSocket for real-time         │
│   - Invite code logic               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      PostgreSQL (Drizzle ORM)       │
│      - Users, families, invites     │
└─────────────────────────────────────┘
```

**Target Architecture (End of Phase 6):**
```
┌─────────────────────────────────────┐
│    Mobile Clients (E2E Encrypted)   │
│   - Client-side encryption          │
│   - Background location tracking    │
│   - MapLibre for map display        │
└──────────────┬──────────────────────┘
               │ HTTPS + WebSocket + E2E
               ▼
┌─────────────────────────────────────┐
│   Backend Server (Dockerized)       │
│   - Stores encrypted blobs only     │
│   - Cannot read location data       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      PostgreSQL (Finland VPS)       │
│      - Stores encrypted data        │
└─────────────────────────────────────┘
```

### 4.3 Database Schema (Current)

The schema is defined using Drizzle ORM in `packages/backend/src/db/schema.ts`.

- **`users`**: Stores user profile information.
- **`families`**: Represents a family group.
- **`userFamilies`**: A join table linking users and families.
- **`invites`**: Stores single-use invite codes for joining a family.

*Note: The `locations` table will be added in a future phase and will store encrypted data.*

---

## 5. Development & Deployment

### 5.1 Project Structure

The project is a pnpm monorepo with three main packages:

- `packages/backend`: The Node.js API server.
- `packages/mobile`: The React Native (Expo) mobile application.
- `packages/shared`: Shared TypeScript types and validation schemas used by both backend and mobile.

### 5.2 Development Environment

**Prerequisites:**
- Node.js 20+ LTS
- `pnpm` (e.g., `npm install -g pnpm`)
- Git
- Docker (for running a local PostgreSQL instance)

**Setup Instructions:**
```bash
# Clone the repository
git clone <repo-url>
cd draugar

# Install all dependencies for all packages
pnpm install

# Set up environment variables
# (copy .env.example to .env in packages/backend)
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your DATABASE_URL, JWT_SECRET, etc.

# Start the local PostgreSQL database via Docker
pnpm --filter backend db:start

# Run database migrations
pnpm --filter backend db:push

# Run development servers
# This will start the backend and mobile dev servers concurrently
pnpm dev
```

### 5.3 Deployment

The backend will be containerized using Docker and deployed to a Hetzner VPS located in Finland. This approach provides full control over the server environment and data, aligning with the project's privacy-first principles. A `Dockerfile` and deployment scripts will be created in Phase 6.

---

## 6. Risks & Mitigations

| Risk                      | Impact   | Mitigation Strategy                                                               |
|---------------------------|----------|-----------------------------------------------------------------------------------|
| **Encryption Complexity** | High     | Follow established cryptographic patterns (e.g., Signal protocol). Rely on a well-vetted library. |
| **Battery Drain**         | High     | Research and implement platform-specific best practices for background location tracking early in Phase 5. |
| **Scope Creep**           | Medium   | Adhere strictly to the phased roadmap. Defer non-essential features.              |
| **Burnout**               | Critical | Maintain a sustainable pace as a solo developer. Set realistic goals for each phase. |

---

## 7. Document Information

**Version:** 3.0 (In-Development)
**Last Updated:** 2026-01-17
**Project Status:** 50% complete.
**Next Steps:** Begin work on Phase 4 - E2E Encryption.
