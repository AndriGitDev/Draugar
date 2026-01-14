# Draugar - Technical Decisions Summary

**Date:** 2026-01-14
**Status:** All core technical decisions finalized
**Purpose:** Record of all major technical decisions made during planning phase

---

## Decision Log

### 1. ✅ Mobile Platform: React Native + Expo

**Decision:** Use React Native with Expo for cross-platform mobile development

**Alternatives Considered:**
- Native Swift/SwiftUI (iOS) + Kotlin/Jetpack Compose (Android)
- Flutter

**Rationale:**
- Single codebase for both iOS and Android (60-70% time savings)
- TypeScript ecosystem with excellent AI coding assistance
- Expo simplifies deployment, OTA updates, and native features
- Mature location tracking libraries
- Can add native modules later via custom dev clients
- Faster path to shipping on both platforms simultaneously

**Impact:**
- Phase 1 delivers both iOS and Android (no "Phase 3 second platform")
- Accelerated timeline by ~6 months
- Unified TypeScript across full stack

---

### 2. ✅ Backend Language: Node.js + TypeScript

**Decision:** Use Node.js with TypeScript and Express for backend

**Alternatives Considered:**
- Rust + Axum (originally preferred)
- Go

**Rationale:**
- Same language as mobile frontend (TypeScript)
- Excellent AI coding assistance (Claude, Copilot excel at TypeScript)
- Faster development for solo developer
- Easier debugging and rapid iteration
- Massive ecosystem and library support
- Can optimize or rewrite critical parts in Rust later if needed
- Cognitive load management for solo dev

**Impact:**
- Faster MVP development (3-4 months vs 5-6 months)
- Unified language across entire stack
- More AI-friendly codebase

---

### 3. ✅ Database ORM: Prisma

**Decision:** Use Prisma ORM for PostgreSQL access

**Alternatives Considered:**
- Raw SQL with pg library

**Rationale:**
- Fully type-safe database queries
- Auto-generated TypeScript types from schema
- Clean migration system (`prisma migrate dev`)
- Excellent IDE autocomplete
- AI tools generate Prisma code very well
- Can drop down to raw SQL for PostGIS spatial queries when needed
- Better developer experience for solo developer

**Impact:**
- Type safety catches bugs at compile time
- Faster development with less boilerplate
- Easier for AI assistants to generate correct code

---

### 4. ✅ Hosting Platform: Render + Neon (Phase 1-2)

**Decision:** Use Render for backend hosting and Neon for PostgreSQL

**Alternatives Considered:**
- Fly.io
- Railway

**Rationale:**
- Render: Easiest onboarding with web-based UI
- Auto-deploy from GitHub (no CLI required)
- Free tier perfect for MVP and family testing
- Neon: Serverless PostgreSQL with PostGIS support
- Free tier: 0.5GB storage, 10GB transfer/month
- Easy migration to Finland VPS in Phase 3 (Docker container portability)

**Migration Plan:**
- Phase 1-2: Render + Neon (fast iteration, free/cheap)
- Phase 3: Self-host on Finland Docker VPS (complete control)
- Migrate when: 50+ users, costs exceed VPS (~€10-20/month), or want EU data sovereignty

**Impact:**
- $0 cost for initial development
- Simple deployment workflow
- Clear path to self-hosting

---

### 5. ✅ Maps Provider: OpenStreetMap

**Decision:** Use OpenStreetMap from day 1 (no Google/Mapbox)

**Alternatives Considered:**
- Google Maps (easiest, works with Expo Go)
- Mapbox (privacy-friendly, good free tier)

**Rationale:**
- Complete privacy - no API keys or tracking
- No usage limits or costs
- Aligns perfectly with privacy-first mission
- Can self-host tiles on Finland VPS later
- Community-driven and ethical
- No vendor lock-in

**Implementation:**
- Phase 1: Use free public OSM tile servers (tile.openstreetmap.org)
- Phase 2+: Self-host OSM tile server on Finland Docker VPS
- Use react-native-maps with OSM tiles or react-native-webview with Leaflet.js

**Impact:**
- Privacy from day 1
- No API costs ever
- Perfect alignment with project values
- Slight setup complexity (worth it for privacy)

---

## Technology Stack Summary

### Mobile
- **Framework:** React Native + Expo (managed workflow)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State:** React Context API (or Zustand in Phase 2+)
- **Maps:** react-native-maps + OpenStreetMap tiles
- **Location:** expo-location
- **Storage:** expo-secure-store (for encryption keys)

### Backend
- **Language:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with PostGIS extension
- **ORM:** Prisma
- **Auth:** JWT tokens + bcrypt
- **Validation:** Zod
- **Deployment:** Render (Phase 1-2) → Finland VPS (Phase 3)

### Infrastructure
- **Phase 1-2 Hosting:** Render Web Service (free → $7/month)
- **Phase 1-2 Database:** Neon.tech PostgreSQL (free → $19/month)
- **Phase 3 Hosting:** Finland Docker VPS (€10-20/month)
- **Maps:** OpenStreetMap (free public tiles → self-hosted)
- **Monitoring:** Render dashboard → Sentry → Grafana (self-hosted)

---

## Cost Projections

### Phase 1 - MVP (Months 1-6)
- **Render:** $0 (free tier with cold starts)
- **Neon:** $0 (free tier: 0.5GB)
- **Maps:** $0 (public OSM tiles)
- **Total:** $0/month

### Phase 2 - Active Development (Months 7-12)
- **Render:** $7/month (always-on instance)
- **Neon:** $0-19/month (depending on usage)
- **Maps:** $0 (still public OSM or start self-hosting)
- **Sentry:** $0 (free tier: 5k errors/month)
- **Total:** $7-26/month

### Phase 3 - Self-Hosted (Months 13+)
- **Finland VPS:** €10-20/month (Hetzner, DigitalOcean, etc.)
- **Includes:** Backend + PostgreSQL + Redis + OSM tiles
- **Backups:** €5-10/month (external storage)
- **Total:** €15-30/month (~$16-32/month)

---

## Timeline Impact

### Original Plan (if using Rust + Native apps)
- Months 1-6: Backend in Rust
- Months 7-12: iOS app in Swift
- Months 13-18: Android app in Kotlin
- Total to both platforms: 18 months

### Revised Plan (TypeScript + React Native)
- Months 1-6: Backend + Both Mobile Apps (MVP)
- Months 7-12: Privacy features (E2E encryption)
- Months 13-18: Advanced features + self-hosting
- Total to both platforms: 6 months
- **Time saved: 12 months**

---

## Migration Paths

### From Render to Finland VPS (Phase 3)

**When to migrate:**
- 50+ active daily users
- Monthly costs > VPS cost (~€15/month)
- Want complete EU data sovereignty
- Need better performance for OSM tiles

**Migration steps:**
1. Set up Finland VPS with Docker Compose
2. Configure: Backend + PostgreSQL + Redis + OSM tile server
3. Set up Caddy/Nginx reverse proxy with HTTPS
4. Migrate database (pg_dump/pg_restore)
5. Update DNS to point to VPS
6. Set up automated backups
7. Configure monitoring (Grafana + Prometheus)

**Timeline:** 1-2 weeks for migration

---

## Alternative Paths Considered (Not Chosen)

### Path A: Full Native Apps
- **Why not:** 2x development time, harder for solo dev
- **When revisit:** If React Native performance is insufficient (unlikely)

### Path B: Rust Backend
- **Why not:** Slower development, steeper learning curve for solo dev
- **When revisit:** If Node.js performance becomes bottleneck (Phase 3+)

### Path C: Google Maps
- **Why not:** Privacy concerns, conflicts with project values
- **When revisit:** Never (OpenStreetMap is non-negotiable)

### Path D: Fly.io Hosting
- **Why not:** More CLI-focused, slightly harder onboarding
- **When revisit:** If Render has issues or for global edge deployment

---

## Key Success Factors

1. **Unified TypeScript Stack**
   - Single language across mobile + backend
   - Better AI assistance
   - Faster context switching

2. **OpenStreetMap from Day 1**
   - Privacy-first from the start
   - No migration needed later
   - Aligns with core values

3. **Cloud → Self-Host Path**
   - Start fast with managed services
   - Migrate to VPS when ready
   - Docker makes migration easy

4. **React Native for Both Platforms**
   - Ship to iOS + Android in 6 months
   - No delayed second platform
   - Single codebase to maintain

---

## Next Steps

1. Set up development environment
2. Initialize backend (Node.js + TypeScript + Prisma)
3. Initialize mobile app (React Native + Expo)
4. Sign up for Render and Neon accounts
5. Follow Week 1 checklist in PROJECT_PLAN.md

---

## Decision Authority

**Primary Decision Maker:** Solo developer
**Input Sources:** AI coding assistants (Claude, Copilot), online communities
**Review Process:** Personal evaluation, prototype testing, community feedback
**Change Process:** Decisions can be revised based on learnings during development

---

## Document Version

**Version:** 1.0
**Last Updated:** 2026-01-14
**Status:** Finalized for Phase 1 development
**Next Review:** After Month 6 (MVP completion)

---

**All major technical decisions are now locked in. Ready to start development! 🚀**
