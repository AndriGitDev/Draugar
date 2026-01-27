# Draugar

**Privacy-First Family Location Sharing App**

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Privacy First](https://img.shields.io/badge/Privacy-First-green.svg)](PRIVACY_PRINCIPLES.md)

---

## Overview

Draugar (Old Norse for "ghosts") is a privacy-first family location sharing app — an ethical alternative to Life360. Built for families with maximum privacy: end-to-end encryption, minimal data collection, and full user data ownership.

**Mission:** Family safety without surveillance capitalism.

**Core Value:** Smooth real-time location tracking that actually works — privacy is table stakes, but the app must feel responsive and reliable for family to adopt it.

---

## Why Draugar?

### The Problem
Popular family tracking apps often have serious privacy issues:
- Selling location data to data brokers
- Tracking users for advertising
- Servers can see unencrypted location data
- Complex privacy policies hiding data sharing
- Closed source - no way to verify claims

### The Solution: Draugar
- **End-to-End Encryption**: Location data encrypted with XChaCha20-Poly1305 on your device before transmission
- **Zero-Knowledge Architecture**: Server cannot read your location data
- **No Data Selling**: This is an open-source project, not a business
- **Open Source**: Full transparency (GPL-3.0 license)
- **Self-Hostable**: Runs on your own infrastructure
- **Privacy-Respecting Maps**: OpenFreeMap/MapLibre instead of Google Maps

---

## Project Status

**v1.0 MVP:** ✅ Complete

The app is fully functional with all core features implemented:
- ✅ Real-time location sharing on a map (WebSocket-based)
- ✅ Single family group where everyone sees everyone
- ✅ Invite code authentication (admin creates codes, family joins)
- ✅ End-to-end encryption (XChaCha20-Poly1305, zero-knowledge)
- ✅ OpenStreetMap/MapLibre for privacy-respecting maps
- ✅ Background location tracking (battery optimized)
- ✅ Ghost mode (pause sharing temporarily)
- ✅ Docker deployment ready

---

## Technology Stack

### Mobile App
- **React Native + Expo**: Cross-platform iOS/Android app
- **TypeScript**: Type safety across the codebase
- **MapLibre**: Privacy-respecting maps with OpenFreeMap tiles
- **expo-location**: Background location tracking
- **Expo SecureStore**: Hardware-backed encryption key storage
- **libsodium-wrappers**: XChaCha20-Poly1305 encryption

### Backend
- **Node.js + TypeScript + Express**: REST API server
- **Drizzle ORM**: Lightweight, type-safe PostgreSQL access
- **Socket.IO**: Real-time WebSocket for location broadcasts
- **PostgreSQL**: Data storage
- **libsodium-wrappers**: Encryption key management
- **jose**: JWT token generation/validation

### Infrastructure
- **Docker**: Container deployment
- **Self-Hostable**: Can be deployed to any Docker-capable infrastructure

---

## Architecture

Draugar uses a **zero-knowledge architecture** where the server relays encrypted data without being able to read it:

1. **Key Generation:** Group encryption key generated on first user's device, distributed via encrypted key exchange
2. **Encryption:** Location data encrypted on device using XChaCha20-Poly1305 before transmission
3. **Relay:** Server receives opaque encrypted blobs and broadcasts them via WebSocket to all authenticated users
4. **Decryption:** Each family member's device decrypts location data locally using the shared group key

The server never has access to plaintext location data — true end-to-end encryption.

---

## Development Setup

This project is a `pnpm` monorepo with packages for mobile and backend.

### Prerequisites
- Node.js 20+ LTS
- pnpm (`npm install -g pnpm`)
- Git
- Docker (for local PostgreSQL)

### Quick Start
```bash
# Clone the repository
git clone <repo-url>
cd draugar

# Install all dependencies for all packages
pnpm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your DATABASE_URL, JWT_SECRET, etc.

# Run database migrations
pnpm --filter backend db:push

# Start development servers (backend + mobile)
pnpm dev
```

### Package Structure
```
draugar/
├── packages/
│   ├── shared/          # Shared TypeScript types and constants
│   ├── backend/         # Node.js/Express API server
│   └── mobile/          # React Native/Expo mobile app
```

---

## Key Features

### Implemented (v1.0)
- **Real-Time Location Sharing:** WebSocket-based with Socket.IO, updates broadcast instantly
- **End-to-End Encryption:** XChaCha20-Poly1305 with zero-knowledge architecture
- **Invite Code Authentication:** Admin-generated codes with 30-day JWT sessions
- **Privacy-Respecting Maps:** MapLibre with OpenFreeMap tiles (no Google tracking)
- **Background Location Tracking:** Battery-optimized with configurable intervals
- **Ghost Mode:** Pause sharing temporarily with one tap
- **Single Family Group:** Everyone sees everyone, simple and focused

### Future Roadmap
- Multiple circles/groups
- Location history storage
- Safe zones/geofencing alerts
- Driving safety features
- Web dashboard

---

## License

GPL-3.0 - See [LICENSE](LICENSE) for details.

This project is open source to ensure full transparency about privacy and security practices. Feel free to audit the code, run your own instance, or contribute improvements.

---

## Privacy Principles

For detailed privacy principles and architecture, see [PRIVACY_PRINCIPLES.md](PRIVACY_PRINCIPLES.md).

**TL;DR:**
- Server cannot read your location data (E2E encryption)
- No data selling, no advertising, no third-party trackers
- Self-hostable for full data ownership
- Open source for transparency and auditability

---

**Built with privacy, for family.**
