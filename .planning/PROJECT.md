# Draugar

## What This Is

A privacy-first family location sharing app — an ethical alternative to Life360. React Native mobile app with Node.js/TypeScript backend, self-hosted on a Finland VPS. Built for one family with maximum privacy: end-to-end encryption, minimal data collection, and full user data ownership.

## Core Value

Smooth real-time location tracking that actually works — privacy is table stakes, but the app must feel responsive and reliable for family to adopt it.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Real-time location sharing on a map (WebSocket-based)
- [ ] Single family group where everyone sees everyone
- [ ] Invite code authentication (admin creates codes, family joins with code)
- [ ] End-to-end encryption (server cannot read location data)
- [ ] OpenStreetMap/MapLibre for privacy-respecting maps
- [ ] Background location tracking (battery optimized)
- [ ] Ghost mode (pause sharing temporarily)

### Out of Scope

- Driving safety features (crash detection, speed alerts) — not core to location sharing
- Social features (chat, check-ins, reactions) — keep it focused on location
- Premium tiers/monetization — personal family project, not a business
- Multiple circles/groups — single family is simpler and sufficient
- Email/password auth — invite codes are simpler and more controlled
- Web dashboard — mobile-first, maybe later
- Self-hosting documentation — just need it to work for one instance

## Context

**Motivation:** Life360 and similar apps sell location data and have poor privacy practices. This is a personal project to replace them for one family.

**Existing work:** Comprehensive planning docs exist (README.md, PROJECT_PLAN.md, PRIVACY_PRINCIPLES.md) but no code yet. The planning was more ambitious — this PROJECT.md reflects a focused v1.

**Infrastructure:** Hetzner VPS in Finland already running Docker with Jellyseer. Backend will be another Docker container alongside existing services.

**Scale:** 2-10 users (one family). No need to over-engineer for scale.

**Success metric:** Family using it daily, replacing Life360.

## Constraints

- **Tech stack**: React Native (Expo) + Node.js/TypeScript + PostgreSQL — unified TypeScript ecosystem
- **Hosting**: Docker on existing Hetzner Finland VPS — privacy-friendly jurisdiction, existing infrastructure
- **Maps**: OpenStreetMap/MapLibre only — no Google Maps, no tracking
- **Privacy**: E2E encryption required — zero-knowledge architecture, server cannot read locations
- **Solo dev**: Claude builds, user validates — no team coordination overhead

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single group model | Simpler than multi-circle, family is one unit | — Pending |
| Invite code auth | More controlled than email signup, simpler to implement | — Pending |
| Node.js over Go/Rust | Same language as frontend, faster iteration | — Pending |
| Skip web dashboard | Mobile-first, reduce scope | — Pending |
| Docker deployment | Fits existing VPS setup with Jellyseer | — Pending |

---
*Last updated: 2026-01-14 after initialization*
