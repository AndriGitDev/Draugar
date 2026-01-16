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

**Status:** Personal learning project → Open source release → Community-driven platform

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

## Key Features

### Phase 1 - MVP (Completed)
- [x] User authentication (email/password)
- [x] Create family circles (invite via link)
- [x] Manual location sharing (button press)
- [x] View family on map (OpenStreetMap)
- [x] Basic web dashboard
- [x] HTTPS encryption (TLS 1.3)

### Phase 2 - Privacy & Polish (Completed)
- [x] End-to-end encryption (AES-256-GCM)
- [x] Background location tracking (battery optimized)
- [x] Real-time updates (WebSocket)
- [x] Ghost mode (pause sharing)
- [x] Location history with auto-delete
- [x] Battery level sharing
- [x] Basic geofencing (2-3 places)
- [x] SOS button

### Phase 3 - Enhancement (Completed)
- [x] Encrypted messaging within family
- [x] Advanced geofencing
- [x] Place management (home, work, school)
- [x] Data export/import (JSON, KML)
- [x] Self-hosting documentation
- [x] Battery optimization
- [x] Offline mode support

### Phase 4 - Community (Months 18+)
- [ ] Open source all code
- [ ] Comprehensive documentation
- [ ] Community contributions
- [ ] Feature requests from users

---

## Technology Stack

### Mobile Apps
✅ **React Native + Expo**
- Single codebase for iOS and Android
- TypeScript for type safety
- OpenStreetMap tiles (react-native-maps)
- expo-location for tracking
- Deploys to both platforms simultaneously

**Why React Native:**
- Fastest path to both iOS and Android
- Excellent AI coding assistance (TypeScript)
- Mature ecosystem for location tracking
- Can add native features later if needed

### Backend
✅ **Node.js + TypeScript + Express**
- Unified language with frontend (TypeScript)
- Prisma ORM (type-safe database access)
- PostgreSQL with PostGIS (location data)
- JWT authentication with bcrypt
- Zod for validation

**Why Node.js:**
- Same language as mobile (easy context switching)
- Excellent AI coding tools (Copilot, Claude)
- Fast development for solo developer
- Easy to debug and iterate

### Infrastructure

**Phase 1-2: Render + Neon**
- Render Web Service (free tier → $7/month)
- Neon.tech PostgreSQL (free tier → $19/month)
- Quick deployment and iteration
- Low cost for MVP

**Phase 3: Self-Hosted in Finland**
- Docker VPS in Finland (€10-20/month)
- Complete control and data sovereignty
- Self-hosted OSM tile server
- Caddy/Nginx reverse proxy with HTTPS

### Maps
✅ **OpenStreetMap**
- Phase 1: Free public OSM tile servers
- Phase 2+: Self-hosted tile server on Finland VPS
- No API keys, no usage limits
- Complete privacy from day 1
- Perfect alignment with privacy-first values

---

## Architecture

### Phase 1 - MVP (Monolithic)
```
┌─────────────────────────────────────┐
│    Mobile Clients (React Native)    │
│         iOS & Android               │
│   - OpenStreetMap display           │
│   - Manual location updates         │
└──────────────┬──────────────────────┘
               │ HTTPS/TLS 1.3
               ▼
┌─────────────────────────────────────┐
│   Node.js Backend (Express)         │
│   - REST API                        │
│   - JWT Authentication              │
│   - Location storage                │
│   - Family management               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  PostgreSQL + PostGIS (Neon)        │
│  - Users, families, locations       │
└─────────────────────────────────────┘
```

### Phase 2 - E2E Encrypted
```
┌─────────────────────────────────────┐
│    Mobile Clients                   │
│   - Client-side encryption          │
│   - WebSocket real-time             │
│   - Background tracking             │
└──────────────┬──────────────────────┘
               │ HTTPS + WebSocket + E2E
               ▼
┌─────────────────────────────────────┐
│   Backend Server                    │
│   - Stores encrypted blobs only     │
│   - Cannot read location data       │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Redis       │
│  (Primary)   │  │  (Cache)     │
└──────────────┘  └──────────────┘
```

### Phase 3 - Self-Hosted
```
┌─────────────────────────────────────┐
│         Finland Docker VPS          │
│  ┌──────────────────────────────┐   │
│  │  Caddy (HTTPS Proxy)         │   │
│  └────────┬─────────────────────┘   │
│           │                          │
│  ┌────────┴─────────────────────┐   │
│  │  Backend + PostgreSQL +       │   │
│  │  Redis + OSM Tile Server      │   │
│  │  (Docker Compose)             │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Key Privacy Feature:** Server stores only encrypted location data and cannot read it.

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

## Project Status

**Current Phase:** Community
**Developer:** One person with AI coding assistance
**Target:** Open source release and community contributions
**Timeline:** 18+ months

### Development Approach

This is a **personal learning project** that will become open source:

**Solo Development Strategy:**
- Using AI coding assistants (Claude, Copilot)
- Iterative development (ship early, iterate often)
- Start simple, add complexity gradually
- Focus on learning modern development practices
- Build something genuinely useful

**Why Solo?**
- Complete control over privacy decisions
- Learning opportunity (Rust alternative considered, chose TypeScript)
- Sustainable scope for one developer
- Can maintain long-term

### Roadmap

**Phase 1: MVP (Months 1-6)**
- Backend API with authentication
- React Native mobile app (iOS + Android)
- Manual location sharing
- Basic map display with OpenStreetMap
- Family circle management
- Deploy to Render + Neon

**Phase 2: Privacy Features (Months 7-12)**
- End-to-end encryption implementation
- Background location tracking
- Real-time updates (WebSocket)
- Ghost mode and privacy controls
- Battery optimization

**Phase 3: Enhancement (Months 13-18)**
- Advanced features (messaging, geofencing)
- Self-hosting documentation
- Migrate to Finland VPS
- Polish and accessibility
- Open source preparation

**Phase 4: Community (Months 18+)**
- Full open source release
- Community contributions
- Self-hosting guides
- Documentation

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed technical roadmap.

---

## Development Setup

### Prerequisites
- Node.js 20+ LTS
- Git
- Docker (optional, for local PostgreSQL)
- Expo CLI for mobile development

### Backend Setup
```bash
# Clone repo
git clone https://github.com/yourusername/draugar-backend
cd draugar-backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET

# Initialize Prisma
npx prisma migrate dev

# Run development server
npm run dev
```

### Mobile App Setup
```bash
# Clone repo
git clone https://github.com/yourusername/draugar-mobile
cd draugar-mobile

# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android

# Or use Expo Go
npm start
```

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
- Can add native modules later if needed
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
- PostgreSQL + PostGIS + Prisma
- OpenStreetMap
- AI coding assistants (Claude, GitHub Copilot)

---

**"Your family's safety, your data's privacy. Built by one developer who cares."**

*Currently in active development. MVP target: 6 months. Open source release: 18 months.*
