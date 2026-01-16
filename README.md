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

**Current Phase:** In active development.
**Progress:** 3 of 6 phases complete. Core backend, authentication, and project foundation are finished.
**Next Up:** Phase 4 - End-to-End Encryption.

Progress: █████████░ 50%

---

## Roadmap

### Phase 1: Foundation
**Status**: ✅ Complete
- [x] Monorepo setup with pnpm and shared TypeScript types
- [x] React Native (Expo) mobile application scaffold
- [x] Node.js (Express) backend scaffold

### Phase 2: Backend Core
**Status**: ✅ Complete
- [x] PostgreSQL schema and connection setup with Drizzle ORM
- [x] Express API structure with robust error handling
- [x] WebSocket server integration with Socket.IO

### Phase 3: Authentication
**Status**: ✅ Complete
- [x] Invite code generation and validation system
- [x] JWT token flow and session management (`jose` library)
- [x] Mobile auth screens and secure token storage (`expo-secure-store`)

### Phase 4: E2E Encryption
**Status**: ⬜ Not Started
- [ ] Crypto library setup and key generation
- [ ] Key exchange protocol between devices
- [ ] Encrypt/decrypt location data flow

### Phase 5: Real-Time Location
**Status**: ⬜ Not Started
- [ ] MapLibre integration with OpenStreetMap
- [ ] Location broadcasting and receiving via WebSocket
- [ ] Background location tracking setup

### Phase 6: Mobile Polish & Deployment
**Status**: ⬜ Not Started
- [ ] Ghost mode (pause sharing)
- [ ] Battery optimization and settings
- [ ] Docker setup and VPS deployment

---

## Technology Stack

### Mobile Apps
✅ **React Native + Expo**
- Single codebase for iOS and Android
- TypeScript for type safety
- MapLibre for privacy-respecting maps
- expo-location for tracking

### Backend
✅ **Node.js + TypeScript + Express**
- Unified language with frontend (TypeScript)
- **Drizzle ORM** for lightweight, type-safe database access
- **Socket.IO** for real-time communication
- PostgreSQL for data storage
- JWT authentication with `jose`
- Zod for validation

### Infrastructure
✅ **Hetzner VPS in Finland**
- Docker deployment for backend services
- Privacy-friendly jurisdiction
- Full control over data and infrastructure

### Maps
✅ **OpenStreetMap + MapLibre**
- No API keys, no tracking, no usage limits
- Self-hostable for maximum privacy
- Perfect alignment with privacy-first values

---

## Architecture

### Current Architecture (Phase 3 Complete)
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

### Target Architecture (Phase 6)
```
┌─────────────────────────────────────┐
│    Mobile Clients (E2E Encrypted)   │
│   - Client-side encryption          │
│   - Background location tracking    │
└──────────────┬──────────────────────┘
               │ HTTPS + WebSocket + E2E
               ▼
┌─────────────────────────────────────┐
│   Backend Server                    │
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

- [Project Plan](PROJECT_PLAN.md) - Comprehensive technical and business plan
- [Privacy Principles](PRIVACY_PRINCIPLES.md) - Privacy commitments and design
- Contributing Guide - Coming soon after open source release
- Security Policy - Coming soon

---

## Technology Choices Explained

### Why React Native over Native?
- Single codebase = 60-70% time savings
- Both iOS and Android from day 1
- Excellent AI coding assistance for TypeScript
- Expo simplifies deployment and OTA updates

### Why Node.js over Rust?
- Same language as frontend (TypeScript)
- Faster development for solo developer
- Excellent AI tool support
- Easy debugging and iteration
- Can optimize later if needed

### Why OpenStreetMap over Google/Mapbox?
- Complete privacy - no API keys or tracking
- No usage limits or costs
- Can self-host tiles on Finland VPS
- Aligns with privacy-first mission
- Community-driven and ethical

### Why Self-Host Eventually?
- Complete data sovereignty
- EU/Finland data protection laws
- Lower long-term costs
- Full control over infrastructure
- Privacy and ethical values

---

## Why This Matters

Family tracking apps are useful, but mainstream options have serious privacy issues:
- Life360 has been caught selling precise location data
- Most apps use surveillance business models
- Closed source means no way to verify privacy claims
- Users have no control over their data

**Draugar is different:**
- Built for privacy from day 1
- Open source for transparency
- No business model based on data exploitation
- Self-hostable for maximum control
- Learning project that respects users

---

## Contributing

This project will be open sourced in Phase 4 (Month 18+). At that point:
- Mobile apps: GPL-3.0
- Backend: Open for self-hosting
- Contribution guidelines will be published
- Community features and bug fixes welcome

For now, you can:
- Star this repo to show support
- Share with privacy-conscious friends
- Provide feedback on privacy principles
- Wait for open source release

---

## Support This Project

**As a User:**
- Sign up for early testing when MVP is ready
- Provide feedback on features and UX
- Tell privacy-conscious friends and family

**As a Developer:**
- Wait for open source release (Month 18+)
- Security researchers welcome after Phase 2
- Documentation contributions appreciated

**As a Supporter:**
- Star the repo
- Share on social media
- Spread the word about privacy alternatives

---

## Learning Goals

This project is also a personal learning journey:
- Modern full-stack TypeScript development
- React Native + Expo mobile development
- End-to-end encryption implementation
- Database design with PostGIS
- DevOps and deployment
- Privacy engineering
- Solo development with AI assistance

---

## Comparison with Alternatives

| Feature | Draugar | Life360 | Find My Friends |
|---------|---------|---------|-----------------|
| Open Source | ✅ Yes | ❌ No | ❌ No |
| End-to-End Encryption | ✅ Yes | ❌ No | ⚠️ Partial |
| Data Selling | ❌ Never | ⚠️ History of it | ❌ No (but Apple) |
| Self-Hostable | ✅ Yes | ❌ No | ❌ No |
| Privacy-First Maps | ✅ OSM | ❌ Google | ❌ Apple |
| Cross-Platform | ✅ Yes | ✅ Yes | ❌ iOS only |
| Cost | Free/Low | Freemium | Free (iOS) |

---

## Contact

- **Developer**: [Your email or GitHub]
- **Issues**: GitHub Issues (when public)
- **Security**: security@draugar.is (when live)
- **General**: hello@draugar.is (when live)

---

## License

Mobile Apps: GPL-3.0 (open source)
Backend: To be determined (will support self-hosting)

---

## Acknowledgments

Inspired by:
- Privacy advocates fighting surveillance capitalism
- Signal Protocol (encryption design)
- OpenStreetMap community (privacy-respecting maps)
- Self-hosting movement (data sovereignty)
- Ethical technology builders

Built with:
- React Native + Expo
- Node.js + TypeScript + Express
- PostgreSQL + PostGIS + Drizzle ORM
- OpenStreetMap
- AI coding assistants (Claude, GitHub Copilot)

---

**"Your family's safety, your data's privacy. Built by one developer who cares."**

*Currently in active development. Phase 4 (E2E Encryption) is next.*
