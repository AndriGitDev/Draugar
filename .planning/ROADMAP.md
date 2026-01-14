# Roadmap: Draugar

## Overview

From zero to a working family location sharing app. Start with foundation and backend infrastructure, add authentication and encryption layers, then build out real-time location features. End with mobile polish and deployment to Finland VPS.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Project setup, monorepo structure, dev environment
- [ ] **Phase 2: Backend Core** - API server, PostgreSQL, WebSocket infrastructure
- [ ] **Phase 3: Authentication** - Invite codes, JWT tokens, session management
- [ ] **Phase 4: E2E Encryption** - Crypto implementation, key exchange, zero-knowledge architecture
- [ ] **Phase 5: Real-Time Location** - Location sharing, map display, WebSocket sync
- [ ] **Phase 6: Mobile Polish & Deployment** - Background tracking, ghost mode, Docker deployment

## Phase Details

### Phase 1: Foundation
**Goal**: Working development environment with React Native + Node.js monorepo
**Depends on**: Nothing (first phase)
**Research**: Unlikely (established patterns)
**Plans**: TBD

Plans:
- [ ] 01-01: Monorepo setup with shared TypeScript types
- [ ] 01-02: React Native Expo project scaffold
- [ ] 01-03: Node.js backend scaffold with Express

### Phase 2: Backend Core
**Goal**: API server with PostgreSQL and WebSocket ready for features
**Depends on**: Phase 1
**Research**: Unlikely (standard Node/Express/WebSocket patterns)
**Plans**: TBD

Plans:
- [ ] 02-01: PostgreSQL schema and connection setup
- [ ] 02-02: Express API structure with error handling
- [ ] 02-03: WebSocket server integration

### Phase 3: Authentication
**Goal**: Users can join via invite code and maintain sessions
**Depends on**: Phase 2
**Research**: Unlikely (invite codes simpler than OAuth)
**Plans**: TBD

Plans:
- [ ] 03-01: Invite code generation and validation
- [ ] 03-02: JWT token flow and session management
- [ ] 03-03: Mobile auth screens and token storage

### Phase 4: E2E Encryption
**Goal**: Zero-knowledge architecture where server cannot read location data
**Depends on**: Phase 3
**Research**: Likely (cryptographic architecture)
**Research topics**: Signal Protocol basics, libsodium/tweetnacl for JS, key exchange patterns for family group
**Plans**: TBD

Plans:
- [ ] 04-01: Crypto library setup and key generation
- [ ] 04-02: Key exchange protocol between devices
- [ ] 04-03: Encrypt/decrypt location data flow

### Phase 5: Real-Time Location
**Goal**: Family members see each other on map in real-time
**Depends on**: Phase 4
**Research**: Likely (React Native background location)
**Research topics**: expo-location background modes, MapLibre React Native integration, battery optimization strategies
**Plans**: TBD

Plans:
- [ ] 05-01: MapLibre integration with OpenStreetMap
- [ ] 05-02: Location broadcasting and receiving via WebSocket
- [ ] 05-03: Background location tracking setup

### Phase 6: Mobile Polish & Deployment
**Goal**: Production-ready app deployed to Finland VPS
**Depends on**: Phase 5
**Research**: Unlikely (Docker patterns exist)
**Plans**: TBD

Plans:
- [ ] 06-01: Ghost mode (pause sharing)
- [ ] 06-02: Battery optimization and settings
- [ ] 06-03: Docker setup and VPS deployment

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Not started | - |
| 2. Backend Core | 0/3 | Not started | - |
| 3. Authentication | 0/3 | Not started | - |
| 4. E2E Encryption | 0/3 | Not started | - |
| 5. Real-Time Location | 0/3 | Not started | - |
| 6. Mobile Polish & Deployment | 0/3 | Not started | - |
