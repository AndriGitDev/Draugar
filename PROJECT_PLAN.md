# Draugar - Project Plan
## Privacy-Respecting Family Safety Platform

**Codename:** BigB Service
**Project Name:** Draugar
**Location:** Iceland
**Mission:** Provide family safety and location services with uncompromising privacy protection

---

## 1. Executive Summary

Draugar is a privacy-first family safety and location tracking platform designed to compete with mainstream family tracking services while prioritizing user privacy, data sovereignty, and GDPR compliance. Built and hosted in Iceland, Draugar leverages Iceland's strong privacy laws and GDPR framework to offer families a trustworthy alternative.

### Key Differentiators
- **Privacy by Design**: End-to-end encryption for location data
- **Data Sovereignty**: All data stored in Iceland under strict privacy laws
- **Minimal Data Collection**: Only essential data, automatically deleted
- **Transparent Operations**: Open source client apps, auditable security
- **User Control**: Complete control over data sharing and retention
- **No Surveillance Capitalism**: No selling of user data, ever

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

## 3. Core Features

### 3.1 Phase 1 - MVP (Months 1-4)

**Family Circle Management**
- Create and manage family circles (up to 10 members)
- Invite members via secure token links
- Role-based permissions (admin, adult, child)
- Leave/remove members from circles

**Location Sharing**
- Real-time location sharing within family circle
- End-to-end encrypted location transmission
- Configurable location update frequency (power saving modes)
- Location history (encrypted, auto-deleted after retention period)
- "Ghost mode" - temporarily pause location sharing

**Safety Features**
- Emergency SOS button (alerts all family members)
- Arrival/departure notifications for places
- Battery level monitoring and alerts
- Custom safe zones (geofencing)

**Privacy Controls**
- Granular sharing controls (who sees what)
- Temporary location sharing (time-limited)
- Location blur (reduce precision for privacy)
- Scheduled sharing (e.g., only during school hours)

### 3.2 Phase 2 - Enhanced Features (Months 5-8)

**Communication**
- Encrypted in-app messaging within family circle
- Quick check-in messages ("I'm safe", "Running late")
- Voice messages (encrypted)

**Places**
- Save important places (home, school, work)
- Custom place names and icons
- Place-based automations (auto-notify on arrival)
- Shared family places

**Travel Features**
- Route sharing (for trips)
- ETA calculations and sharing
- Driving safety features (speed alerts - optional)
- International roaming support

**Advanced Safety**
- Crash detection (if device supports)
- Fall detection for elderly members
- Medical information sharing (opt-in)
- Emergency contact integration

### 3.3 Phase 3 - Premium Features (Months 9-12)

**Extended Features**
- Unlimited location history (still encrypted)
- Multiple family circles per user
- Advanced place management (unlimited places)
- Priority customer support
- Family activity reports (privacy-preserving summaries)

**Enterprise/School Edition**
- Organization management tools
- Field trip coordination
- Student safety for schools
- Compliance reporting tools

---

## 4. Technical Architecture

### 4.1 Technology Stack

**Mobile Applications**
- **iOS**: Swift/SwiftUI, native development
- **Android**: Kotlin, Jetpack Compose
- **Approach**: Native apps for best performance and battery life
- **Open Source**: Published on GitHub under GPL-3.0

**Backend Services**
- **Language**: Rust (performance, safety, reliability)
- **Framework**: Axum (async web framework)
- **Database**: PostgreSQL (with PostGIS for location data)
- **Cache**: Redis (for real-time location updates)
- **Search**: Typesense (privacy-respecting search)
- **Queue**: RabbitMQ (for async processing)

**Infrastructure**
- **Hosting**: Iceland data centers (e.g., Advania, Verne Global)
- **CDN**: Self-hosted or privacy-respecting CDN
- **Maps**: OpenStreetMap + self-hosted tile server
- **Monitoring**: Self-hosted (Prometheus + Grafana)

**Security**
- **Encryption**:
  - Data in transit: TLS 1.3
  - Data at rest: AES-256
  - End-to-end: Signal Protocol adaptation for location data
- **Authentication**: OAuth2 + WebAuthn support
- **Key Management**: Per-family encryption keys, hardware security modules (HSM)

### 4.2 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Mobile Clients                       │
│              (iOS, Android - Open Source)                │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Location    │  │  Encryption  │  │  Local DB    │  │
│  │  Services    │  │  Engine      │  │  (Encrypted) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS/TLS 1.3 + E2EE
                      ▼
┌─────────────────────────────────────────────────────────┐
│              API Gateway (Iceland)                       │
│         Rate Limiting, Auth, Request Routing             │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Location   │ │   Family    │ │   Places    │
│  Service    │ │   Service   │ │   Service   │
│  (Rust)     │ │   (Rust)    │ │   (Rust)    │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       └───────────────┼───────────────┘
                       ▼
         ┌─────────────────────────┐
         │   PostgreSQL + PostGIS  │
         │   (Encrypted at Rest)   │
         └─────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Redis Cache    │         │  RabbitMQ       │
│  (Real-time     │         │  (Background    │
│   Location)     │         │   Jobs)         │
└─────────────────┘         └─────────────────┘
```

### 4.3 Data Flow

1. **Location Update Flow**
   ```
   Device → Encrypt with Family Key → API Gateway → Location Service
   → Redis (real-time) → PostgreSQL (history) → Distribute to Family Members
   ```

2. **Privacy Guarantees**
   - Server receives encrypted location blobs
   - Family members decrypt with shared family key
   - Server cannot read location data
   - Automatic deletion after retention period

### 4.4 Scalability Considerations

- **Horizontal Scaling**: Stateless services, load balancing
- **Database**: Read replicas, partitioning by family_id
- **Caching**: Redis cluster for high-frequency location updates
- **CDN**: Static assets and map tiles
- **Auto-scaling**: Kubernetes for orchestration

---

## 5. Iceland Advantages

### 5.1 Legal and Privacy Framework

- **Strong Privacy Laws**: Iceland has robust data protection laws
- **GDPR Compliance**: EU-level privacy protection
- **No Mass Surveillance**: No mandatory data retention laws
- **Data Sovereignty**: Protection from foreign government overreach
- **Stable Democracy**: Strong rule of law

### 5.2 Infrastructure Benefits

- **Renewable Energy**: 100% renewable electricity (geothermal + hydro)
- **Cool Climate**: Natural cooling for data centers (cost savings)
- **Strategic Location**: Good connectivity to Europe and North America
- **Reliable Infrastructure**: Modern telecom and internet infrastructure

### 5.3 Business Environment

- **Tech-Friendly**: Growing tech ecosystem in Reykjavik
- **English Proficiency**: Easy to recruit international talent
- **EU/EEA Access**: Access to European markets
- **Startup Support**: Government incentives for tech startups

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Months 1-4)
**Objective**: Launch MVP with core features

**Month 1-2: Backend Development**
- [ ] Set up Iceland infrastructure (servers, databases)
- [ ] Implement authentication system
- [ ] Build core API services (Location, Family, Places)
- [ ] Implement end-to-end encryption system
- [ ] Set up monitoring and logging

**Month 2-3: Mobile Apps**
- [ ] iOS app development (location tracking, family management)
- [ ] Android app development (parallel with iOS)
- [ ] Implement E2E encryption in mobile apps
- [ ] Background location tracking optimization
- [ ] UI/UX design and implementation

**Month 3-4: Testing & Launch**
- [ ] Security audit (external firm)
- [ ] Beta testing with select families
- [ ] Performance optimization
- [ ] App store submissions
- [ ] Public launch

**Deliverables:**
- Functional iOS and Android apps
- Backend services deployed in Iceland
- Privacy policy and terms of service
- Basic documentation

### Phase 2: Growth (Months 5-8)
**Objective**: Add communication features and grow user base

**Key Activities:**
- [ ] Implement encrypted messaging
- [ ] Add advanced place features
- [ ] Improve battery optimization
- [ ] Add support for more languages (Icelandic, English, Nordic languages)
- [ ] Marketing campaign targeting privacy-conscious users
- [ ] Community building (forum, support)

**Deliverables:**
- Enhanced feature set
- 10,000+ active users
- Strong user reviews (4.5+ stars)
- Community engagement

### Phase 3: Scale (Months 9-12)
**Objective**: Premium features and market expansion

**Key Activities:**
- [ ] Launch premium subscription tier
- [ ] Develop enterprise/school edition
- [ ] Expand to more markets (Nordic countries, Germany, EU)
- [ ] Additional security certifications (ISO 27001)
- [ ] Partnerships (privacy organizations, schools)

**Deliverables:**
- Profitable business model
- 50,000+ active users
- Enterprise customers
- Market recognition

---

## 7. Compliance and Legal

### 7.1 GDPR Compliance

- [ ] Data Protection Impact Assessment (DPIA)
- [ ] Appoint Data Protection Officer (DPO)
- [ ] Implement GDPR-required features:
  - Right to access
  - Right to erasure ("right to be forgotten")
  - Right to data portability
  - Right to rectification
  - Privacy by design and default

### 7.2 Terms of Service

- Clear, plain-language privacy policy
- No hidden data collection
- Explicit consent for any data processing
- Easy opt-out mechanisms

### 7.3 Child Safety Compliance

- Age verification mechanisms
- Parental consent for minors
- COPPA compliance (for US market)
- Special protections for children's data

### 7.4 Legal Structure

- Incorporate in Iceland (Einkahlutafélag - EHF)
- Register with Icelandic Data Protection Authority
- Terms of service reviewed by privacy lawyer
- Regular legal compliance audits

---

## 8. Monetization Strategy

### 8.1 Freemium Model

**Free Tier**
- Up to 5 family members
- 30-day location history
- Basic places (up to 10)
- Core safety features
- Community support

**Premium Tier** (~$5-7/month or $50-60/year)
- Unlimited family members
- Unlimited location history
- Unlimited places
- Advanced safety features
- Priority support
- Multiple family circles

**Enterprise/School Tier** (Custom pricing)
- Organization management
- Admin dashboards
- Compliance reporting
- SLA guarantees
- Dedicated support

### 8.2 Revenue Projections

**Conservative Estimates:**
- Year 1: 10,000 users, 5% conversion → $30,000 ARR
- Year 2: 50,000 users, 8% conversion → $240,000 ARR
- Year 3: 150,000 users, 10% conversion → $900,000 ARR

### 8.3 Cost Structure

**Fixed Costs (Monthly):**
- Infrastructure (Iceland hosting): $2,000-5,000
- Team salaries (initially 3-5 people): $20,000-40,000
- Legal/compliance: $1,000-2,000
- Marketing: $5,000-10,000

**Variable Costs:**
- Server costs scale with users (~$0.50-1.00 per active user/year)

### 8.4 Funding Strategy

- **Bootstrap**: Initial development with founder funds
- **Grants**: Apply for Icelandic innovation grants
- **Angel Investment**: Raise $200-500k for scaling
- **Revenue-Focused**: Aim for profitability within 18 months

---

## 9. Marketing and Go-to-Market

### 9.1 Target Audience

**Primary:**
- Privacy-conscious families
- Tech-savvy parents
- European families (GDPR-aware)
- Nordic market (local advantage)

**Secondary:**
- Schools and educational institutions
- Organizations with field workers
- Elderly care providers

### 9.2 Marketing Channels

1. **Content Marketing**
   - Blog about privacy, family safety, digital rights
   - Privacy guides and resources
   - Transparent security reports

2. **Community Building**
   - Privacy advocate partnerships
   - Reddit, HackerNews presence
   - Privacy-focused conferences

3. **PR Strategy**
   - "Iceland-based privacy alternative" angle
   - Tech media outreach (TechCrunch, Ars Technica)
   - Privacy organization endorsements

4. **App Store Optimization**
   - Keywords: privacy, family, location, safety, GDPR
   - High-quality screenshots emphasizing privacy
   - User reviews highlighting privacy features

5. **Referral Program**
   - Free premium months for referrals
   - Family invite bonuses

### 9.3 Brand Positioning

**Key Messages:**
- "Your family's safety, your data's privacy"
- "Built in Iceland, built for privacy"
- "Family safety without surveillance"
- "The ethical alternative"

---

## 10. Competitive Analysis

### 10.1 BigB Service Weaknesses (Our Opportunities)

1. **Privacy Concerns**
   - Known for selling location data
   - Partnerships with data brokers
   - Law enforcement data sharing
   - → **Our Advantage**: True privacy, no data selling

2. **Surveillance Capitalism**
   - Business model based on data extraction
   - → **Our Advantage**: Transparent subscription model

3. **Feature Bloat**
   - Too many features, confusing UX
   - → **Our Advantage**: Focused, clean interface

4. **Trust Issues**
   - Multiple privacy scandals
   - → **Our Advantage**: Iceland-based, transparent operations

5. **Expensive Premium Tiers**
   - Aggressive upselling
   - → **Our Advantage**: Fair, transparent pricing

### 10.2 Our Competitive Advantages

1. **Privacy-First**: Only true E2E encrypted alternative
2. **Location**: Iceland's strong privacy reputation
3. **Transparency**: Open source apps, published audits
4. **Ethics**: No data selling, no surveillance capitalism
5. **Compliance**: GDPR-native design
6. **Community**: Built with and for privacy advocates

---

## 11. Risk Analysis and Mitigation

### 11.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Battery drain issues | High | Medium | Extensive optimization, battery benchmarking |
| Scalability problems | High | Low | Load testing, scalable architecture |
| Security vulnerabilities | Critical | Medium | Regular audits, bug bounty program |
| Data loss | Critical | Low | Regular backups, redundancy |

### 11.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Strong marketing, unique value proposition |
| Competition from BigB | Medium | High | Focus on privacy differentiator |
| Regulatory changes | Medium | Low | Legal monitoring, compliance team |
| Funding shortage | High | Medium | Bootstrap, focus on revenue early |

### 11.3 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Key team member departure | Medium | Low | Documentation, knowledge sharing |
| Infrastructure failure | High | Low | Redundancy, disaster recovery plan |
| Vendor lock-in | Low | Low | Open source stack, avoid proprietary services |

---

## 12. Success Metrics

### 12.1 Key Performance Indicators (KPIs)

**User Metrics:**
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention (30-day, 90-day)
- Churn rate
- Net Promoter Score (NPS)

**Business Metrics:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV/CAC ratio
- Free-to-paid conversion rate

**Technical Metrics:**
- App crash rate (<1%)
- API response time (<200ms)
- Uptime (99.9%+)
- Battery impact (<5% per day)

**Privacy Metrics:**
- Data breach incidents (target: 0)
- Security audit scores
- GDPR compliance score
- User data deletion requests processed

### 12.2 Success Criteria by Phase

**Phase 1 (Month 4):**
- ✓ Apps launched on iOS and Android
- ✓ 1,000+ active users
- ✓ <2% crash rate
- ✓ 4.0+ app store rating
- ✓ Security audit completed

**Phase 2 (Month 8):**
- ✓ 10,000+ active users
- ✓ 5%+ conversion to premium
- ✓ $30,000+ MRR
- ✓ 4.5+ app store rating
- ✓ Featured in privacy publications

**Phase 3 (Month 12):**
- ✓ 50,000+ active users
- ✓ 8%+ conversion to premium
- ✓ $200,000+ ARR
- ✓ Profitability achieved
- ✓ Enterprise customers acquired

---

## 13. Team Structure

### 13.1 Initial Team (Months 1-4)

**Founders/Core Team:**
1. **CEO/Product Lead** - Vision, product, fundraising
2. **CTO/Backend Engineer** - Rust backend, infrastructure
3. **iOS Developer** - Native iOS app development
4. **Android Developer** - Native Android app development
5. **Designer** (Contract) - UI/UX design

### 13.2 Growth Phase (Months 5-12)

**Additional Hires:**
6. **Backend Engineer** - Scale infrastructure
7. **Security Engineer** - Security audits, compliance
8. **Customer Support Lead** - User support, community
9. **Marketing Lead** - Growth, PR, content
10. **Data Protection Officer** - GDPR compliance

### 13.3 Advisory Board

- Privacy law expert (Iceland/EU)
- Security/cryptography expert
- Family safety advocate
- Experienced SaaS founder

---

## 14. Technical Deep Dive

### 14.1 Encryption Architecture

**Key Management:**
```
1. Family Circle Created
   → Generate Family Master Key (FMK) on admin device
   → Encrypt FMK with each member's public key
   → Store encrypted FMK copies on server

2. Location Update
   → Generate ephemeral location data: {lat, lng, timestamp, accuracy}
   → Encrypt with FMK using AES-256-GCM
   → Send encrypted blob to server
   → Server stores encrypted blob (cannot read)

3. Location Retrieval
   → Family member requests location updates
   → Server sends encrypted blobs
   → Client decrypts using FMK
   → Display on map
```

**Key Rotation:**
- Automatic key rotation every 90 days
- Manual rotation when member leaves
- Zero-knowledge re-encryption

### 14.2 Database Schema (Simplified)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    public_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Family circles
CREATE TABLE families (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    admin_user_id UUID REFERENCES users(id),
    encrypted_master_key TEXT NOT NULL, -- Encrypted per-member
    created_at TIMESTAMP DEFAULT NOW()
);

-- Family memberships
CREATE TABLE family_members (
    id UUID PRIMARY KEY,
    family_id UUID REFERENCES families(id),
    user_id UUID REFERENCES users(id),
    role TEXT NOT NULL, -- admin, adult, child
    encrypted_family_key TEXT NOT NULL, -- FMK encrypted with user's public key
    joined_at TIMESTAMP DEFAULT NOW()
);

-- Location updates (encrypted)
CREATE TABLE location_updates (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    family_id UUID REFERENCES families(id),
    encrypted_data BYTEA NOT NULL, -- Encrypted {lat, lng, accuracy, timestamp}
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL -- Auto-delete
);

CREATE INDEX idx_location_family_time ON location_updates(family_id, created_at DESC);
```

### 14.3 API Design

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

## 15. Next Steps

### Immediate Actions (Week 1)

1. **Legal Setup**
   - [ ] Register company in Iceland
   - [ ] Consult with privacy lawyer
   - [ ] Draft initial privacy policy

2. **Infrastructure**
   - [ ] Select Iceland data center provider
   - [ ] Set up development environment
   - [ ] Configure cloud infrastructure

3. **Development**
   - [ ] Set up git repositories
   - [ ] Initialize backend project (Rust)
   - [ ] Initialize iOS project
   - [ ] Initialize Android project

4. **Design**
   - [ ] Create brand identity
   - [ ] Design app wireframes
   - [ ] User flow mapping

5. **Planning**
   - [ ] Finalize technical architecture
   - [ ] Create detailed sprint plans
   - [ ] Set up project management tools

---

## 16. Conclusion

Draugar represents a unique opportunity to build a privacy-respecting alternative in the family safety space. By leveraging Iceland's strong privacy framework, implementing end-to-end encryption, and committing to ethical business practices, Draugar can capture a growing market of privacy-conscious users who are dissatisfied with the surveillance practices of mainstream competitors.

The path forward requires:
- **Technical Excellence**: Build a robust, scalable, secure platform
- **Privacy Commitment**: Never compromise on privacy principles
- **User Focus**: Listen to users, iterate quickly
- **Transparency**: Build trust through openness
- **Execution**: Ship fast, learn fast, improve fast

With the right team, execution, and commitment to our values, Draugar can become the trusted choice for families who want safety without surveillance.

---

**Document Version:** 1.0
**Last Updated:** 2026-01-14
**Status:** Planning Phase
**Next Review:** Upon completion of Phase 1 milestones
