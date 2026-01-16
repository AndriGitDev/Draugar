# Draugar

**Privacy-First Family Safety Platform (Solo Development)**

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Privacy First](https://img.shields.io/badge/Privacy-First-green.svg)](PRIVACY_PRINCIPLES.md)
[![Open Source](https://img.shields.io/badge/Open-Source-orange.svg)](https://github.com/draugar)

---

## Overview

Draugar (Old Norse for "ghosts") is a privacy-first family safety and location tracking platform built as a solo development project. It's an ethical alternative to surveillance-based family tracking apps like Life360, designed from the ground up with privacy by design principles.

**Mission:** Family safety without surveillance capitalism.

**Promise:** Your family's safety. Your data's privacy. No compromises.

---

## Why Draugar?

### The Problem
Popular family tracking apps like Life360 have serious privacy issues:
- Sell location data to data brokers
- Track users for advertising
- Server can see all unencrypted location data
- Complex privacy policies hiding data sharing
- Closed source - no way to verify claims

### The Solution: Draugar
- **End-to-End Encryption**: Location data encrypted on your device before transmission
- **Zero-Knowledge Architecture**: Server cannot read your location data
- **No Data Selling**: Never. Ever. Legally binding commitment.
- **Open Source**: Mobile apps published on GitHub for full transparency
- **Self-Hostable**: Run your own instance if desired
- **Privacy-Respecting Maps**: OpenStreetMap instead of Google Maps

---

## Project Status

This project is currently in active development. The core functionality is being built, with a focus on privacy and security.

---

## Technology Stack

### Mobile Apps
*   **React Native + Expo**: For building cross-platform mobile apps from a single codebase.
*   **TypeScript**: For type safety.
*   **MapLibre**: For privacy-respecting maps.

### Backend
*   **Node.js + TypeScript + Express**: For a fast and modern backend.
*   **Drizzle ORM**: For lightweight, type-safe database access.
*   **Socket.IO**: For real-time communication.
*   **PostgreSQL**: For data storage.

---

## High-Level Architecture

Draugar uses a standard client-server architecture. The mobile app (client) communicates with the backend server via HTTPS and WebSockets. All location data is end-to-end encrypted, meaning the server cannot access the raw location data.

---

## Development Setup

This project is a `pnpm` monorepo.

### Prerequisites
- Node.js 20+ LTS
- pnpm (e.g., `npm install -g pnpm`)
- Git
- Docker (for local PostgreSQL)

### Monorepo Setup
```bash
# Clone the repository
git clone <repo-url>
cd draugar

# Install all dependencies for all packages
pnpm install

# Set up environment variables
# (copy .env.example to .env in packages/backend)
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your DATABASE_URL, JWT_SECRET

# Run database migrations
pnpm --filter backend db:push

# Run development servers
# This will start the backend and mobile dev servers concurrently
pnpm dev
```

---

## Privacy Principles

Draugar is built on privacy-first principles:

1. **Zero-Knowledge Architecture** - Server cannot read your data
2. **Data Minimization** - Collect only what's essential
3. **User Sovereignty** - You own and control your data
4. **Transparency** - Open source mobile apps
5. **No Surveillance Capitalism** - Never sell data
6. **Privacy by Default** - Most protective settings enabled
7. **OpenStreetMap** - Privacy-respecting maps from day 1

Read our full [Privacy Principles](PRIVACY_PRINCIPLES.md) for details.

---

## Documentation

- [Privacy Principles](PRIVACY_PRINCIPLES.md) - Privacy commitments and design
- Contributing Guide - Coming soon
- Security Policy - Coming soon

---

## Contributing

This project is open source and contributions are welcome. Please see the upcoming `CONTRIBUTING.md` for more details.

---

## License

This project is licensed under the GPL-3.0 license.

---

**"Your family's safety, your data's privacy."**
