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
- **No Data Selling**: We sell storage and convenience, not your data.
- **Open Source**: Mobile apps published on GitHub for full transparency
- **Self-Hostable**: Run your own instance if desired
- **Privacy-Respecting Maps**: OpenStreetMap instead of Google Maps

---

## Project Status

This project is currently in active development. The core functionality (Real-Time Location) is built and verified. Next steps involve refining the mobile experience and implementing the premium feature set.

---

## Sustainability & Business Model

Draugar is sustainable because it charges for **service and storage**, not by selling user data. Our business model is transparent:

### Sovereign Basic (Free)
*The core safety features every family deserves.*
* **Real-Time Tracking:** Unlimited live location sharing.
* **Encryption:** Full End-to-End Zero-Knowledge encryption.
* **Safe Zones:** 1 Zone (e.g., Home) with entry/exit alerts.
* **Ghost Mode:** Manual toggle to pause sharing instantly.
* **Map:** Privacy-respecting OpenStreetMap tiles.

### Sovereign Plus (Premium)
*Convenience features for families who want more history and automation.*
* **Location History:** 30 Days or Unlimited encrypted history.
* **Unlimited Safe Zones:** Alerts for School, Work, Gym, etc.
* **Priority Support:** Direct access to support for peace of mind.
* *(Future)* **Automated Ghost Mode:** Schedule privacy breaks automatically.

*Note: Since Draugar is Open Source (GPL-3.0), advanced users can always self-host the full platform for free. The subscription pays for the convenience of our managed, secure infrastructure.*

---

## Technology Stack

### Mobile Apps
* **React Native + Expo**: For building cross-platform mobile apps from a single codebase.
* **TypeScript**: For type safety.
* **MapLibre**: For privacy-respecting maps (OpenFreeMap tiles).
* **Expo SecureStore**: For hardware-backed encryption key storage.

### Backend
* **Node.js + TypeScript + Express**: For a fast and modern backend.
* **Drizzle ORM**: For lightweight, type-safe database access.
* **Socket.IO**: For real-time, encrypted location broadcasting.
* **PostgreSQL**: For data storage.

---

## High-Level Architecture

Draugar uses a standard client-server architecture with a **Zero-Knowledge** twist:
1.  **Key Generation:** Devices generate keys locally.
2.  **Encryption:** Location data is encrypted on the device using the group key (XChaCha20-Poly1305).
3.  **Relay:** The server receives opaque blobs and relays them to other family members via WebSockets.
4.  **Storage:** The server stores encrypted history (for Premium users) but cannot decrypt it.

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
