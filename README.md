# Draugar

**Privacy-Respecting Family Safety Platform**

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Built in Iceland](https://img.shields.io/badge/Built%20in-Iceland-blue.svg)](https://www.iceland.is/)
[![Privacy First](https://img.shields.io/badge/Privacy-First-green.svg)](PRIVACY_PRINCIPLES.md)

---

## Overview

Draugar (Old Norse for "ghosts") is a privacy-first family safety and location tracking platform built in Iceland. We provide families with the peace of mind that comes from staying connected, without the surveillance and data exploitation common in mainstream alternatives.

**Our Mission:** Family safety without surveillance capitalism.

**Our Promise:** Your family's safety. Your data's privacy. No compromises.

---

## Why Draugar?

### Privacy by Design
- **End-to-End Encryption**: Location data encrypted on your device before transmission
- **Zero-Knowledge Architecture**: Our servers cannot read your location data
- **No Data Selling**: We will never sell, rent, or trade your data
- **Iceland-Based**: Strong privacy laws and GDPR compliance
- **Open Source**: Mobile apps published on GitHub for community audits

### User Control
- **Ghost Mode**: Temporarily pause location sharing
- **Granular Permissions**: Control exactly what each family member can see
- **Automatic Deletion**: Location history auto-deleted after your chosen period
- **Easy Export**: Download all your data in standard formats anytime
- **One-Click Deletion**: Complete account and data erasure

### Family Safety
- **Real-Time Location Sharing**: Know where family members are
- **Emergency SOS**: One-touch emergency alerts to all family members
- **Geofencing**: Notifications when family arrives/leaves important places
- **Battery Monitoring**: Low battery alerts for family members
- **Encrypted Messaging**: Communicate securely within your family circle

---

## Key Features

### Core Features (Free)
- Family circles up to 5 members
- Real-time location sharing (end-to-end encrypted)
- 30-day location history
- Emergency SOS alerts
- Safe zones and geofencing (up to 10 places)
- Battery level monitoring
- Encrypted in-app messaging
- Ghost mode (privacy breaks)

### Premium Features
- Unlimited family members
- Unlimited location history (still encrypted)
- Unlimited places
- Multiple family circles
- Advanced safety features
- Priority customer support

---

## Technology Stack

### Mobile Apps
- **iOS**: Swift/SwiftUI, native development
- **Android**: Kotlin, Jetpack Compose
- **License**: GPL-3.0 (open source)

### Backend
- **Language**: Rust (for performance and security)
- **Framework**: Axum (async web framework)
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis (real-time updates)
- **Queue**: RabbitMQ (background jobs)

### Infrastructure
- **Hosting**: Iceland data centers
- **Maps**: OpenStreetMap (privacy-respecting)
- **Encryption**: AES-256, Signal Protocol adaptation
- **Compliance**: GDPR, COPPA, Iceland Data Protection Act

---

## Architecture

```
┌─────────────────────────────────────┐
│      Mobile Clients (E2E Crypto)    │
│         iOS & Android Apps          │
└────────────┬────────────────────────┘
             │ TLS 1.3 + E2E Encryption
             ▼
┌─────────────────────────────────────┐
│        API Gateway (Iceland)        │
│   Auth, Rate Limiting, Routing      │
└────────────┬────────────────────────┘
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│Location │ │ Family  │ │ Places  │
│Service  │ │ Service │ │ Service │
│ (Rust)  │ │ (Rust)  │ │ (Rust)  │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 ▼
     ┌───────────────────────┐
     │ PostgreSQL + PostGIS  │
     │  (Encrypted at Rest)  │
     └───────────────────────┘
```

**Key Security Feature:** Server stores only encrypted blobs and cannot read location data.

---

## Privacy Principles

Draugar is built on ten core privacy principles:

1. **Zero-Knowledge Architecture** - Server cannot read your data
2. **Data Minimization** - Collect only what's necessary
3. **User Sovereignty** - You own and control your data
4. **Transparency** - Open source, public audits
5. **Consent and Control** - Explicit, granular permissions
6. **Security by Design** - Encryption at every layer
7. **No Surveillance Capitalism** - No data selling, ever
8. **Privacy by Default** - Most private settings enabled
9. **Accountability** - Regular audits, DPO, public reports
10. **Ethical Data Use** - Data only used for stated purposes

Read our full [Privacy Principles](PRIVACY_PRINCIPLES.md) for details.

---

## Project Status

**Current Phase:** Planning & Architecture
**Target Launch:** Q2 2026 (4 months)

### Roadmap

**Phase 1: Foundation (Months 1-4)**
- Backend infrastructure setup in Iceland
- iOS and Android app development
- End-to-end encryption implementation
- Security audit and beta testing
- Public launch

**Phase 2: Growth (Months 5-8)**
- Enhanced communication features
- Advanced place management
- Multi-language support (Icelandic, English, Nordic languages)
- Marketing to privacy-conscious users
- Community building

**Phase 3: Scale (Months 9-12)**
- Premium subscription launch
- Enterprise/school edition
- Market expansion (Nordic countries, Germany, EU)
- Security certifications (ISO 27001)
- Strategic partnerships

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed roadmap.

---

## Documentation

- [Project Plan](PROJECT_PLAN.md) - Comprehensive project planning and roadmap
- [Privacy Principles](PRIVACY_PRINCIPLES.md) - Our commitment to privacy by design
- [Contributing Guide](CONTRIBUTING.md) - How to contribute (coming soon)
- [Security Policy](SECURITY.md) - Responsible disclosure (coming soon)

---

## Why Iceland?

### Legal Framework
- Strong privacy laws and GDPR compliance
- No mass surveillance or mandatory data retention
- Protection from foreign government overreach
- Stable democracy with strong rule of law

### Infrastructure
- 100% renewable energy (geothermal + hydro)
- Natural cooling for data centers
- Modern, reliable infrastructure
- Strategic location between Europe and North America

### Business Environment
- Growing tech ecosystem
- Government support for startups
- EU/EEA market access
- English proficiency for international team

---

## Getting Started

### For Users
Draugar is currently in development. Sign up for early access:
- Website: [https://draugar.is](https://draugar.is) (coming soon)
- Email: hello@draugar.is

### For Developers
We'll be open-sourcing our mobile apps. Stay tuned for:
- iOS app repository
- Android app repository
- Contributing guidelines
- Development setup instructions

### For Investors
Interested in supporting privacy-respecting technology?
- Email: invest@draugar.is
- See our [Project Plan](PROJECT_PLAN.md) for business details

---

## Team

We're building a team of privacy-focused engineers, designers, and advocates. Interested in joining?
- Email: careers@draugar.is
- Location: Remote-friendly, Iceland-based

---

## Community

- **GitHub**: [github.com/draugar](https://github.com/draugar) (coming soon)
- **Discord**: Community server (coming soon)
- **Twitter**: [@draugar](https://twitter.com/draugar) (coming soon)
- **Email**: hello@draugar.is

---

## Legal

- **Company**: Draugar EHF (Iceland)
- **Data Protection Officer**: privacy@draugar.is
- **Security Issues**: security@draugar.is
- **License**: GPL-3.0 (mobile apps)

---

## FAQ

**Q: How is Draugar different from other family tracking apps?**
A: End-to-end encryption means we cannot read your location data. We're based in Iceland under strong privacy laws. We never sell data. Our apps will be open source.

**Q: What does "zero-knowledge" mean?**
A: Our servers store encrypted location data but don't have the keys to decrypt it. Only your family members can see your location.

**Q: Can governments request my data?**
A: Due to our zero-knowledge architecture, we cannot provide unencrypted location data—we don't have it. We're under Iceland's jurisdiction and will fight overreach.

**Q: Why Iceland?**
A: Strong privacy laws, no mass surveillance, GDPR compliance, 100% renewable energy, and a stable legal environment.

**Q: Is Draugar open source?**
A: Our mobile apps will be open source (GPL-3.0) for security audits. Backend will be source-available for enterprise customers.

**Q: How do you make money?**
A: Premium subscriptions ($5-7/month) and enterprise licenses. We never sell user data.

**Q: When will Draugar launch?**
A: We're targeting Q2 2026 for public launch. Sign up for early access at hello@draugar.is.

---

## Support This Project

Interested in privacy-respecting technology? Here's how you can help:

- **Star this repo** to show support
- **Share** with privacy-conscious friends and family
- **Contribute** code, designs, or documentation (coming soon)
- **Provide feedback** on our privacy principles
- **Invest** in building ethical alternatives

---

## Acknowledgments

Inspired by the privacy advocates, security researchers, and ethical technologists who fight for user rights.

Built with respect for:
- The Signal Protocol (for encryption inspiration)
- OpenStreetMap community (privacy-respecting maps)
- Rust community (secure systems programming)
- GDPR architects (strong privacy framework)
- Iceland's commitment to privacy and democracy

---

## Contact

- **General**: hello@draugar.is
- **Privacy**: privacy@draugar.is
- **Security**: security@draugar.is
- **Press**: press@draugar.is
- **Careers**: careers@draugar.is

---

**Built in Iceland 🇮🇸 | Privacy by Design | Family Safety Without Surveillance**

*"Your family's safety, your data's privacy."*