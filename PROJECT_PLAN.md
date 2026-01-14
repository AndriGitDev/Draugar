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
- **Learn Modern Tech Stack**: Rust backend, native mobile development, encryption
- **Privacy by Design**: End-to-end encryption for location data
- **Open Source**: Fully transparent, community-auditable code
- **Self-Hostable**: Users can run their own instance if desired
- **Iterative Development**: Ship early, iterate based on real usage
- **Sustainable Scope**: Build what one person can actually maintain

---

## 2. Privacy-First Design Principles

### 2.1 Core Privacy Commitments

1. **Zero-Knowledge Architecture**
   - Location data encrypted on device before transmission
   - Server cannot read location data without user keys
   - Family encryption keys managed by family admin

2. **Data Minimization**
   - Collect only essential data for service functionality
   - No tracking of app usage beyond essential analytics
   - No advertising identifiers or third-party trackers
   - Automatic data deletion after configurable retention period (default: 30 days)

3. **User Sovereignty**
   - Users own their data completely
   - Easy data export in standard formats (JSON, KML)
   - One-click data deletion
   - No lock-in mechanisms

4. **Transparency**
   - Open source mobile applications
   - Published security audits
   - Clear privacy policy in plain language
   - Real-time data access logs for users

5. **Minimal Third-Party Dependencies**
   - Self-hosted infrastructure in Iceland
   - Use of privacy-respecting services only (e.g., OpenStreetMap instead of Google Maps)
   - No analytics services that track users

---

## 3. Feature Roadmap (Solo Development)

### 3.1 Phase 1 - Core MVP (Months 1-6)
**Goal:** Prove the concept works, use with your own family

**Essential Features Only:**
- User authentication (email/password)
- Create ONE family circle
- Invite members via link
- Share location within family (basic encryption)
- View family members on map
- Manual location updates (button press)
- Basic web dashboard

**Technical Focus:**
- Get backend working (Rust + PostgreSQL)
- Basic iOS OR Android app (pick one)
- Simple REST API
- Basic authentication/authorization
- Deploy to cloud (Render/Fly.io/Railway)

**Scope Cuts:**
- ✗ No real-time updates yet (polling is fine)
- ✗ No background location (manual only)
- ✗ No E2E encryption yet (HTTPS only)
- ✗ No geofencing
- ✗ No messaging
- ✗ No role-based permissions

**Success Criteria:**
- You and 2-3 family members can use it daily
- Works reliably for basic location sharing
- Code is clean enough to build on

### 3.2 Phase 2 - Privacy & Polish (Months 7-12)
**Goal:** Add the privacy features that make this worthwhile

**Core Privacy Features:**
- End-to-end encryption (Signal Protocol)
- Background location tracking (battery optimized)
- Location history with auto-delete
- Ghost mode (pause sharing)
- Better UI/UX

**Technical Focus:**
- Implement E2E encryption properly
- Background location services
- WebSocket for real-time updates
- Battery optimization research
- Security audit (if budget allows)

**Nice to Have:**
- Basic geofencing (2-3 places)
- SOS button
- Battery level sharing

### 3.3 Phase 3 - Enhancement (Months 13-18)
**Goal:** Make it genuinely useful and maintainable

**Feature Additions:**
- Second platform (iOS or Android)
- Encrypted messaging
- Advanced geofencing
- Place management
- Data export/import
- Self-hosting documentation

**Polish:**
- Better onboarding
- Improved privacy controls
- Performance optimization
- Comprehensive testing
- Documentation

### 3.4 Phase 4 - Community (Months 18+)
**Goal:** Open source release and community building

**Activities:**
- Open source all code
- Write comprehensive docs
- Create deployment guides
- Accept community contributions
- Maybe add features people request

---

## 4. Technical Architecture

### 4.1 Technology Stack (Solo Development Focused)

**Mobile Applications - Cross-Platform Approach**

⚠️ **CRITICAL DECISION: Native vs Cross-Platform**

**Option A: React Native (RECOMMENDED for solo dev)**
- Single codebase for iOS + Android
- JavaScript/TypeScript (easier with AI coding)
- Expo for faster development and deployment
- Good battery life with proper optimization
- Mature ecosystem for location tracking
- AI tools are excellent with React/TypeScript
- **Time savings: 60-70% vs dual native**

**Option B: Flutter**
- Single codebase for iOS + Android
- Dart language (less common, harder AI assistance)
- Excellent performance
- Good for complex UIs
- Strong location plugin support
- **Time savings: 60-70% vs dual native**

**Option C: Native Apps (Most Work)**
- **iOS**: Swift/SwiftUI
- **Android**: Kotlin, Jetpack Compose
- Best performance and platform integration
- 2x development time, but AI can help
- Better battery optimization potential
- **Approach**: Build iOS first, port to Android in Phase 3

**RECOMMENDATION: Start with React Native + Expo**
- Fastest path to both platforms
- AI coding assistance is excellent for React
- Can always build native features later via bridges
- Test with real users sooner

**Open Source**: Published on GitHub under GPL-3.0

**Backend Services - Simplified Stack**

**Phase 1 - MVP (Simple & Fast)**
- **Language**: Rust with Axum (or start with Node.js/Express if more comfortable)
- **Database**: PostgreSQL with PostGIS extension (managed service: Neon, Supabase)
- **Auth**: JWT tokens, simple email/password
- **Deployment**: Single container on Fly.io, Render, or Railway
- **Maps**: Mapbox or Google Maps API (free tier, switch later)
- **NO CACHE**: Direct database queries are fine for MVP
- **NO QUEUE**: Synchronous processing initially
- **NO MICROSERVICES**: Monolith is perfect for solo dev

**Phase 2 - Scale (Add as needed)**
- **Cache**: Redis (when you have 100+ active users)
- **Real-time**: WebSocket support in same server
- **Queue**: Optional - PostgreSQL can queue jobs via pg_cron
- **Maps**: Migrate to OpenStreetMap + Leaflet

**Phase 3 - Production (If it grows)**
- **Monitoring**: Grafana Cloud (free tier) or self-hosted
- **Queue**: Add RabbitMQ or use PostgreSQL LISTEN/NOTIFY
- **CDN**: Cloudflare (privacy mode)

**Infrastructure - Cloud First, Self-Host Later**
- **Hosting**: Fly.io, Render, Railway, or DigitalOcean App Platform
  - Start in US/EU regions (Iceland VPS can come later)
  - Cost: $5-20/month initially
- **Database**: Managed PostgreSQL (Neon.tech, Supabase, or provider's managed DB)
- **Storage**: S3-compatible storage (Cloudflare R2, Backblaze B2)
- **Maps**:
  - MVP: Mapbox GL JS (free tier: 50k loads/month)
  - Production: Self-hosted OpenStreetMap tiles (when needed)
- **Monitoring**:
  - MVP: Provider's built-in monitoring
  - Later: Grafana Cloud free tier or Better Stack

**Security - Pragmatic Approach**
- **Encryption**:
  - Phase 1: HTTPS only (TLS 1.3) - server sees location data
  - Phase 2: End-to-end encryption (Signal Protocol or simpler AES-256-GCM)
  - Data at rest: Database-level encryption (managed by hosting provider)
- **Authentication**:
  - Phase 1: JWT tokens with bcrypt password hashing
  - Phase 2: Add 2FA (TOTP)
  - Phase 3: WebAuthn/passkeys if needed
- **Key Management**:
  - Phase 1: Server-side encryption keys (not zero-knowledge yet)
  - Phase 2: Client-side key generation, server stores encrypted blobs
  - No HSM initially (use environment variables, later Vault)

### 4.2 System Architecture (Solo Dev - Simplified)

**Phase 1 - MVP (Monolithic):**
```
┌─────────────────────────────────────┐
│    Mobile Clients (React Native)    │
│         iOS & Android               │
│   - Location tracking               │
│   - Map display (Mapbox)            │
│   - Local storage                   │
└──────────────┬──────────────────────┘
               │ HTTPS/TLS 1.3
               ▼
┌─────────────────────────────────────┐
│   Single Backend Server (Rust/Node) │
│   - REST API                        │
│   - JWT Authentication              │
│   - Location storage                │
│   - Family management               │
│   - All logic in one app            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  PostgreSQL + PostGIS (Managed)     │
│  - Users, families, locations       │
│  - One database, simple queries     │
└─────────────────────────────────────┘
```

**Phase 2 - Real-time Updates:**
```
┌─────────────────────────────────────┐
│    Mobile Clients (React Native)    │
│   - WebSocket connection            │
│   - Background location tracking    │
└──────────────┬──────────────────────┘
               │ HTTPS + WebSocket
               ▼
┌─────────────────────────────────────┐
│   Backend Server                    │
│   - REST API                        │
│   - WebSocket server (same process) │
│   - E2E encryption handling         │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Redis       │
│  (Primary)   │  │  (WS state)  │
└──────────────┘  └──────────────┘
```

**Phase 3 - Scale (If needed):**
```
┌─────────────────────────────────────┐
│           Mobile Clients            │
└──────────────┬──────────────────────┘
               │ HTTPS + WSS
               ▼
┌─────────────────────────────────────┐
│   Load Balancer (Fly.io/Cloudflare) │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│  Backend #1  │  │  Backend #2  │
│  (Stateless) │  │  (Stateless) │
└──────┬───────┘  └───────┬───────┘
       └──────────┬────────┘
                  ▼
         ┌────────────────┐
         │  PostgreSQL    │
         │  (with Redis)  │
         └────────────────┘
```

**Key Principles:**
- Start simple, scale only when needed
- Monolith is perfectly fine for 1000s of users
- Avoid premature optimization
- Cloud-managed services reduce ops burden

### 4.3 Data Flow (Simplified)

**Phase 1 - MVP (Server can see locations):**
```
1. User opens app
2. App requests location permission
3. User presses "Update Location" button
4. App sends {lat, lng, timestamp} via HTTPS POST
5. Server validates JWT, stores in PostgreSQL
6. Family members poll API for updates (every 30s)
7. Display on map
```

**Phase 2 - E2E Encrypted:**
```
1. App encrypts location with family key: AES-256-GCM
2. Sends encrypted blob to server
3. Server stores encrypted blob (can't read it)
4. Family members fetch encrypted blobs
5. Decrypt client-side with shared family key
6. Display on map
```

**Phase 3 - Real-time:**
```
1. App maintains WebSocket connection
2. Location update → encrypt → send via WebSocket
3. Server pushes to family members' WebSockets immediately
4. Instant updates, no polling
```

### 4.4 Database Schema (Simplified for MVP)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Families
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE, -- Simple invite via code
    created_at TIMESTAMP DEFAULT NOW()
);

-- Family members
CREATE TABLE family_members (
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT false,
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (family_id, user_id)
);

-- Locations (encrypted in Phase 2)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    -- Phase 1: Store plain
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    -- Phase 2: Encrypted blob instead
    -- encrypted_data BYTEA,
    accuracy FLOAT,
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locations_user ON locations(user_id, recorded_at DESC);

-- Auto-delete old locations (Phase 2)
-- Use pg_cron or a daily cleanup job
```

---

## 5. Implementation Roadmap (Solo Developer)

### Month 1-2: Backend Foundation
**Goal**: Get a working API deployed

- [ ] **Week 1-2: Setup & Learning**
  - Choose: Rust (Axum) or Node.js (Express) - be honest about your comfort level
  - Set up project structure with AI coding assistant
  - Create git repo, README, basic docs
  - Sign up for Fly.io or Render (free tier initially)
  - Set up managed PostgreSQL (Neon.tech free tier: 0.5GB)

- [ ] **Week 3-4: Core API**
  - User registration & login (email/password, JWT)
  - Password hashing (bcrypt)
  - Family creation and invite codes
  - Location POST endpoint (store lat/lng)
  - Location GET endpoint (retrieve family locations)
  - Basic error handling and validation

- [ ] **Week 5-6: Polish & Deploy**
  - Write API tests (basic integration tests)
  - Add request rate limiting
  - Deploy to Fly.io/Render
  - Set up CI/CD (GitHub Actions)
  - Test with Postman/cURL

**Success**: Working REST API deployed to cloud that you can hit with cURL

### Month 3-4: Mobile App MVP
**Goal**: One working mobile app (iOS OR Android)

- [ ] **Week 7-8: React Native Setup**
  - Initialize Expo project
  - Set up navigation (React Navigation)
  - Design basic screens: Login, Map, Profile
  - Install dependencies: react-native-maps, expo-location
  - Test on emulator/physical device

- [ ] **Week 9-10: Core Features**
  - Login/Register screens (connect to API)
  - Request location permission
  - Manual "Update Location" button
  - Send location to API
  - Display family members on map (using Mapbox/Google Maps)
  - Basic error handling

- [ ] **Week 11-12: Testing & Beta**
  - Test on real devices (iOS or Android)
  - Add loading states and error messages
  - Simple onboarding flow
  - TestFlight (iOS) or Internal Testing (Android)
  - Get 2-3 family members to test

**Success**: You and 2-3 people can share locations using the app

### Month 5-6: Polish & Stability
**Goal**: Make it reliable enough for daily use

- [ ] **Week 13-14: Bug Fixes**
  - Fix bugs found during family testing
  - Improve UI/UX based on feedback
  - Add location history view
  - Better map markers and styling

- [ ] **Week 15-16: Core Features**
  - Auto-refresh locations (polling every 30s)
  - Battery level sharing (if easy)
  - Profile pictures (optional)
  - Push notifications for join requests

- [ ] **Week 17-18: DevOps**
  - Set up logging (Sentry for errors)
  - Database backups (automated)
  - Monitoring (UptimeRobot or provider's)
  - Write deployment docs
  - Cost optimization review

**Success**: App works reliably, family uses it daily

### Month 7-12: Privacy Features (Phase 2)
**Goal**: Add the encryption that makes this worthwhile

- [ ] **Encryption Research (2-3 weeks)**
  - Learn Signal Protocol or AES-256-GCM
  - Design key management system
  - Consider using library: libsignal or Web Crypto API
  - Write encryption/decryption tests

- [ ] **Backend E2E Encryption (3-4 weeks)**
  - Update API to handle encrypted blobs
  - Family key generation and distribution
  - Encrypted location storage
  - Key rotation planning

- [ ] **Mobile E2E Encryption (4-5 weeks)**
  - Client-side encryption before send
  - Key storage (secure keychain/keystore)
  - Decrypt on retrieval
  - Handle edge cases (offline, key loss)

- [ ] **Background Location (3-4 weeks)**
  - Research iOS/Android background location
  - Implement background tracking
  - Battery optimization testing
  - Geofencing (if time allows)

- [ ] **Real-time Updates (2-3 weeks)**
  - Add WebSocket server
  - WebSocket client in app
  - Real-time location push
  - Handle reconnection

**Success**: E2E encrypted, background tracking works, battery drain acceptable

### Month 13-18: Enhancement (Phase 3)
**Goal**: Second platform + polish

- [ ] **Second Platform (8-10 weeks)**
  - If React Native: Already done!
  - If native: Build iOS or Android version
  - Feature parity with first platform
  - Cross-platform testing

- [ ] **Additional Features**
  - Geofencing & place management
  - Simple in-app messaging
  - Ghost mode (pause sharing)
  - Data export/delete

- [ ] **Open Source Prep**
  - Clean up code
  - Write comprehensive README
  - Add LICENSE (GPL-3.0)
  - Deployment guides
  - Security documentation

**Success**: Both platforms working, ready for open source release

---

## 6. Development Workflow & AI Coding Tips

### 6.1 AI Coding Assistance Strategy

**Best Practices:**
- **Start Simple**: Get basic features working before complexity
- **Iterate Quickly**: AI is great for rapid prototyping
- **Ask for Explanations**: Don't just copy code, understand it
- **Use Specific Prompts**: "Create a JWT authentication middleware in Rust using Axum" not "make auth"
- **Test Everything**: AI-generated code needs testing
- **Review Security**: Never trust AI for crypto/security without review

**Recommended AI Tools:**
- **GitHub Copilot**: Inline code completion (best for Rust, JS, TypeScript)
- **Claude/GPT-4**: Architecture discussions, debugging, code review
- **Cursor IDE**: AI-native editor for full file generation
- **v0.dev**: UI component generation (React/Tailwind)

**Workflow Example:**
```
1. Design feature with AI (architecture, API design)
2. Generate boilerplate code (AI)
3. Implement core logic (you + AI pair programming)
4. Write tests (AI can generate test cases)
5. Debug and refine (AI helps with errors)
6. Code review (ask AI to review your code)
```

### 6.2 Project Structure

**Backend (Rust + Axum):**
```
backend/
├── src/
│   ├── main.rs              # Server entry point
│   ├── routes/
│   │   ├── auth.rs          # Login, register
│   │   ├── locations.rs     # Location CRUD
│   │   └── families.rs      # Family management
│   ├── models/              # Database models
│   ├── middleware/          # Auth, rate limiting
│   ├── db.rs                # Database connection
│   └── crypto.rs            # Encryption (Phase 2)
├── migrations/              # SQL migrations
├── tests/                   # Integration tests
└── Cargo.toml
```

**Frontend (React Native + Expo):**
```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── MapScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── Map.tsx
│   │   └── LocationButton.tsx
│   ├── api/
│   │   └── client.ts        # API calls
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── utils/
│       └── location.ts      # Location helpers
├── app.json                 # Expo config
└── package.json
```

### 6.3 Development Environment

**Required Tools:**
- **Git**: Version control
- **Docker** (optional): For local PostgreSQL
- **Postman/Insomnia**: API testing
- **Expo CLI**: Mobile development
- **Android Studio/Xcode**: Mobile testing (optional, use Expo Go initially)

**Rust Backend:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Create project
cargo new draugar-backend
cd draugar-backend
cargo add axum tokio sqlx bcrypt jsonwebtoken
```

**React Native Mobile:**
```bash
# Install Node.js & npm first
npx create-expo-app draugar-mobile
cd draugar-mobile
npx expo install expo-location react-native-maps
npm install @react-navigation/native @react-navigation/stack
```

### 6.4 Deployment Checklist

**Backend Deployment (Fly.io Example):**
- [ ] Create Dockerfile
- [ ] Set environment variables (DATABASE_URL, JWT_SECRET)
- [ ] Deploy: `flyctl launch`
- [ ] Set up PostgreSQL: `flyctl postgres create`
- [ ] Run migrations
- [ ] Test API endpoints

**Mobile Deployment:**
- [ ] iOS: TestFlight for beta testing
- [ ] Android: Google Play Internal Testing
- [ ] Update API endpoints to production URL
- [ ] Test on real devices
- [ ] Prepare app store listings

### 6.5 Privacy & Legal (Minimal for Personal Project)

**What You Need:**
- [ ] **Privacy Policy**: Use a template (GDPR-compliant)
  - Generators: iubenda, TermsFeed (basic free tiers)
  - Key points: what data you collect, how you store it, how to delete
- [ ] **Terms of Service**: Basic template
- [ ] **Data Export**: Implement user data export API endpoint
- [ ] **Data Deletion**: Implement account deletion endpoint
- [ ] **Consent**: Clear checkboxes during signup

**What You DON'T Need (Personal Project):**
- ✗ Lawyers (use templates initially)
- ✗ Data Protection Officer
- ✗ Business registration (until you monetize)
- ✗ Insurance
- ✗ Formal compliance audits

**⚠️ If You Go Public or Monetize:**
- Consult a lawyer for proper Privacy Policy and ToS
- GDPR compliance if targeting EU users
- COPPA compliance if allowing children under 13
- Consider basic liability protection

---

## 7. DevOps & Operations (Solo Developer)

### 7.1 Hosting & Costs (Free → Paid)

**Phase 1 - Free Tier ($0-5/month):**
- **Fly.io/Render Free**: $0 (with limits)
  - PostgreSQL: Neon.tech free tier (0.5GB, 10GB transfer)
  - Hosting: Fly.io free tier or Render free web service
  - Maps: Mapbox free tier (50k loads/month)
  - Total: $0-5/month for MVP

**Phase 2 - Growing ($20-50/month):**
- **Fly.io/Render**: $10-20/month (small instance)
- **Database**: Neon Scale plan or provider's managed DB ($10-20/month)
- **Maps**: Mapbox pay-as-you-go or switch to OSM
- **Monitoring**: Sentry free tier, Better Stack ($10/mo)
- Total: ~$20-50/month for 100-500 users

**Phase 3 - Production ($100-300/month):**
- **Fly.io/Render**: $50-100/month (scaled instances)
- **Database**: Managed PostgreSQL ($30-80/month)
- **Redis**: Upstash or managed Redis ($10-20/month)
- **Monitoring & Logs**: Grafana Cloud or paid tier ($20-50/month)
- **Backups**: $10-20/month
- Total: ~$100-300/month for 1000-5000 users

### 7.2 Monitoring & Logging

**Phase 1 - Keep It Simple:**
- Use provider's built-in monitoring (Fly.io, Render dashboards)
- Sentry for error tracking (free tier: 5k errors/month)
- UptimeRobot for basic uptime monitoring (free)
- No complex logging initially

**Phase 2 - Add Observability:**
- Better Stack or Grafana Cloud (free tiers available)
- Application logs centralized
- Database query performance monitoring
- API response time tracking

**Phase 3 - Full Observability:**
- Prometheus + Grafana (self-hosted or cloud)
- Distributed tracing (if needed)
- Custom dashboards
- Alerting via email/Slack

### 7.3 Backup & Disaster Recovery

**Critical for Personal Project:**
- [ ] **Database Backups**:
  - Automated daily backups (provider managed)
  - Test restore procedure monthly
  - Keep 7-30 days of backups
- [ ] **Code Backups**:
  - Git repos on GitHub (already backed up)
  - Tag releases for easy rollback
- [ ] **Disaster Recovery Plan**:
  - Document how to restore from backup
  - Keep secrets backed up securely (1Password, Bitwarden)
  - Test full system restore once per quarter

### 7.4 CI/CD Pipeline

**GitHub Actions (Free for Public Repos):**

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: cargo test
      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only
```

**Benefits:**
- Automated testing on every push
- Automatic deployment on main branch
- No manual deployment steps
- Roll back by reverting commit

---

## 8. Technical Risks (Solo Developer)

### 8.1 Major Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| **Burnout** | Critical | Set realistic goals, take breaks, don't work weekends |
| **Scope Creep** | High | Stick to MVP, ruthlessly cut features |
| **Battery Drain** | High | Test early and often on real devices, use profiling tools |
| **Security Vulnerability** | Critical | Use AI to review security code, post to r/netsec for audit |
| **Key Management Bug** | Critical | Implement key recovery, extensive testing, simple design |
| **Data Loss** | High | Automated backups, test restore monthly |
| **Platform Rejection** | Medium | Follow App Store/Play Store guidelines strictly |
| **Encryption Complexity** | High | Start without E2E, add in Phase 2 after learning |

### 8.2 Common Solo Developer Pitfalls

**Avoid These:**
- ✗ Building features nobody uses
- ✗ Premature optimization
- ✗ Not shipping for months
- ✗ Over-engineering (microservices, complex arch)
- ✗ Ignoring security until "later"
- ✗ No backups/disaster recovery
- ✗ Not testing on real devices
- ✗ Feature creep ("just one more thing...")

**Do These:**
- ✓ Ship MVP in 3-6 months max
- ✓ Get real users ASAP (friends, family)
- ✓ Iterate based on feedback
- ✓ Keep architecture simple
- ✓ Automate deployments early
- ✓ Document as you go
- ✓ Take breaks to avoid burnout

---

## 9. Personal Success Metrics

### 9.1 What "Success" Looks Like (Personal Project)

**Phase 1 (Month 6):**
- ✓ Working app that you and family use daily
- ✓ No major bugs for 2+ weeks
- ✓ < 5 crashes/month
- ✓ Battery drain < 10%/day
- ✓ Learned Rust OR solidified React Native skills

**Phase 2 (Month 12):**
- ✓ E2E encryption working correctly
- ✓ 10-20 people using it (friends, family, early testers)
- ✓ Background location tracking reliable
- ✓ Clean, maintainable codebase
- ✓ Solid DevOps practices

**Phase 3 (Month 18):**
- ✓ Both iOS and Android working
- ✓ 50-100 users (if public)
- ✓ Positive reviews from early users
- ✓ Code ready to open source
- ✓ Portfolio piece you're proud of

**Personal Goals:**
- Learn new technologies (Rust, encryption, mobile dev)
- Build something ethically valuable
- Create a portfolio project
- Potentially help others care about privacy
- Have fun coding!

### 9.2 Key Metrics to Track

**Technical Health:**
- API response time (keep < 500ms)
- App crash rate (< 1%)
- Database query performance
- Deployment frequency (aim for weekly updates)

**User Experience:**
- Battery impact (< 10% per day)
- App load time (< 3 seconds)
- Location update reliability
- User-reported bugs (track in GitHub Issues)

**Learning Goals:**
- New skills acquired
- Code quality improvements
- System design decisions made
- Problems solved

---

## 10. Technical Deep Dive (Phase 2 - Encryption)

### 10.1 Encryption Architecture (Implement in Phase 2)

**⚠️ Note: Start WITHOUT encryption in Phase 1. Add this in Phase 2 after MVP works.**

**Simplified E2E Encryption Approach:**
```
1. Family Circle Created
   → Admin generates Family Master Key (FMK) - AES-256 key
   → Store FMK in device secure storage (Keychain/Keystore)
   → Share FMK with family members via QR code or secure link

2. Location Update (Encrypted)
   → JSON: {lat: 64.1466, lng: -21.9426, timestamp: "2026-01-14T12:00:00Z"}
   → Encrypt with FMK using AES-256-GCM
   → Send encrypted blob to server
   → Server stores blob (cannot decrypt, no key)

3. Location Retrieval
   → Family member fetches encrypted blobs
   → Decrypt locally using FMK
   → Display on map
```

**Key Management Strategy (Simple):**
- **Phase 2a**: Single family key, shared via QR code
  - Good enough for family use
  - Easy to implement
  - If member leaves, generate new key and re-encrypt

- **Phase 2b** (Later): Per-user key encryption
  - Each user has keypair
  - FMK encrypted with each user's public key
  - More complex but better security

**Libraries to Use:**
- **JavaScript/TypeScript**: Web Crypto API (built-in browser/React Native)
- **Rust**: `aes-gcm` crate, `ring` for crypto primitives
- Start simple, don't implement Signal Protocol unless necessary

### 10.2 API Design (MVP)

**REST API Endpoints:**

```
Authentication:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

Families:
GET    /api/v1/families
POST   /api/v1/families
GET    /api/v1/families/:id
PUT    /api/v1/families/:id
DELETE /api/v1/families/:id
POST   /api/v1/families/:id/invite
POST   /api/v1/families/:id/join
DELETE /api/v1/families/:id/members/:user_id

Locations:
POST   /api/v1/locations (submit encrypted location)
GET    /api/v1/locations/family/:id (get family locations)
GET    /api/v1/locations/user/:id (get specific user location)
GET    /api/v1/locations/history/:user_id (get location history)

Places:
GET    /api/v1/places/family/:id
POST   /api/v1/places
PUT    /api/v1/places/:id
DELETE /api/v1/places/:id

Privacy:
GET    /api/v1/user/data (export all data)
DELETE /api/v1/user/data (delete all data)
GET    /api/v1/user/access-log (view data access log)
```

**WebSocket for Real-Time:**
```
wss://api.draugar.is/v1/realtime
- Subscribe to family location updates
- Receive SOS alerts
- Delivery receipts
```

---

## 11. Getting Started (Week 1 Actions)

### Day 1-2: Setup Development Environment

- [ ] **Install Tools**:
  - Install Rust (if using Rust) OR Node.js LTS
  - Install Git
  - Install VS Code or Cursor IDE
  - Install Docker Desktop (optional, for local PostgreSQL)
  - Set up GitHub Copilot or similar AI tool

- [ ] **Create Repositories**:
  ```bash
  # Backend
  mkdir draugar-backend && cd draugar-backend
  cargo init  # or: npm init -y
  git init && git remote add origin <your-repo>

  # Mobile
  npx create-expo-app draugar-mobile
  cd draugar-mobile
  git init && git remote add origin <your-repo>
  ```

- [ ] **Sign Up for Services**:
  - GitHub account (free)
  - Fly.io or Render account (free tier)
  - Neon.tech or Supabase (free PostgreSQL)
  - Mapbox account (free tier)

### Day 3-4: Backend Hello World

- [ ] **Create Simple API**:
  - Set up basic Rust/Axum or Node/Express server
  - Add one endpoint: `GET /health` → `{"status": "ok"}`
  - Deploy to Fly.io or Render
  - Verify it works with curl

- [ ] **Database Setup**:
  - Create Neon/Supabase PostgreSQL database
  - Run first migration (users table)
  - Test connection from backend

### Day 5-7: Mobile Hello World

- [ ] **Create Basic App**:
  - Initialize React Native + Expo project
  - Add one screen with "Hello World"
  - Run on iOS simulator or Android emulator (or Expo Go on phone)
  - Add button that calls your backend `/health` endpoint
  - Display result

**Success Criteria for Week 1:**
- ✓ Backend deployed and responding
- ✓ Database connected
- ✓ Mobile app running on device
- ✓ Mobile app can call backend API
- ✓ Git repos set up with first commits

### Week 2+: Follow Phase 1 Roadmap

Continue with the implementation roadmap in Section 5.

---

## 12. Conclusion

Draugar is an ambitious personal project to build a privacy-first family tracking app. As a solo developer using AI coding tools, you have a real shot at building something meaningful.

### Keys to Success:

1. **Start Simple**: MVP first, encryption later. Get something working in 3-6 months.
2. **Use AI Effectively**: AI tools can 10x your productivity, but you still need to understand the code.
3. **Ship Early**: Get family using it ASAP. Real feedback > theoretical perfection.
4. **Keep It Sustainable**: This is a marathon, not a sprint. Take breaks, avoid burnout.
5. **Learn as You Go**: Use this as a learning project. It's okay to make mistakes.

### Why This Matters:

Family tracking apps like Life360 have privacy issues. By building a transparent, open-source alternative, you're contributing to a more privacy-respecting internet. Even if only your family uses it, you've created something valuable.

### What's Next:

1. Follow the Week 1 checklist above
2. Join Reddit communities (r/rust, r/reactnative, r/privacy)
3. Document your journey (blog, Twitter, GitHub)
4. Ask for help when stuck (AI, Stack Overflow, Discord)
5. Have fun building!

---

## Document Information

**Version:** 2.0 (Solo Developer Edition)
**Last Updated:** 2026-01-14
**Project Type:** Personal/Open Source
**Estimated Timeline:** 6-18 months for full MVP + privacy features
**Next Steps:** Complete Week 1 setup checklist

---

**"Your family's safety, your data's privacy. Built by one developer who cares."**
