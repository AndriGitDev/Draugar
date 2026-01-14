# Draugar Privacy Principles
## Our Commitment to Privacy by Design

**Last Updated:** 2026-01-14
**Version:** 1.0

---

## Introduction

At Draugar, privacy is not a feature—it's our foundation. This document outlines the core privacy principles that guide every decision we make, from system architecture to business operations. These principles are non-negotiable and will never be compromised for convenience, profit, or growth.

---

## Core Principles

### 1. Zero-Knowledge Architecture

**Principle:** The server should never have access to unencrypted user data.

**Implementation:**
- All location data is encrypted on the device before transmission
- Family circles use end-to-end encryption with family-specific keys
- Server stores only encrypted blobs and cannot read location information
- Even Draugar employees cannot access user location data

**Technical Details:**
```
User Device                    Draugar Server
    |                               |
    |--- Encrypt with Family Key -->|
    |       (AES-256-GCM)           |
    |                               |--- Store Encrypted Blob
    |                               |    (Cannot Decrypt)
```

**Guarantees:**
- ✓ Server breach does not expose location data
- ✓ Government requests cannot compel data we don't have
- ✓ Employees cannot abuse access to spy on users
- ✓ Third parties have no access to unencrypted data

---

### 2. Data Minimization

**Principle:** Collect only what is absolutely necessary, nothing more.

**What We Collect:**
- ✓ Location coordinates (encrypted)
- ✓ Timestamp of location update (encrypted)
- ✓ Battery level (for safety alerts)
- ✓ Email address (for account recovery)
- ✓ Device type and OS version (for compatibility)

**What We DON'T Collect:**
- ✗ Advertising identifiers (IDFA, AAID)
- ✗ Device fingerprinting data
- ✗ App usage analytics beyond crashes
- ✗ Third-party tracking cookies
- ✗ Social media profiles
- ✗ Contact lists
- ✗ Photos or media
- ✗ Browsing history
- ✗ Other installed apps

**Automatic Deletion:**
- Location history: 30 days (configurable: 7, 14, 30, 90 days, or unlimited for premium)
- Deleted locations are cryptographically erased
- No "soft deletes" or archival systems
- Audit logs: 90 days maximum

---

### 3. User Sovereignty

**Principle:** Users own their data completely and control how it's used.

**Data Rights:**

1. **Right to Access**
   - Export all data in JSON and KML formats
   - Access logs show who viewed your data and when
   - API access to your own data

2. **Right to Delete**
   - One-click account deletion
   - Complete data erasure within 24 hours
   - No "deactivation" tricks—deletion means deletion
   - Cryptographic proof of deletion available

3. **Right to Portability**
   - Standard data formats (JSON, KML, CSV)
   - Import/export functionality
   - No vendor lock-in

4. **Right to Control**
   - Granular sharing permissions
   - Temporary location sharing (time-limited)
   - "Ghost mode" for privacy breaks
   - Per-member visibility controls

**Example Scenarios:**

```
Scenario: Teenager wants to pause location sharing for 2 hours
Solution: Ghost mode - location sharing pauses, resumes automatically

Scenario: Parent wants to share location only during child's commute
Solution: Scheduled sharing - automatic based on time/day

Scenario: User wants to blur exact location for privacy
Solution: Location precision control - share approximate area only
```

---

### 4. Transparency

**Principle:** Open operations, no hidden practices, auditable security.

**Commitments:**

1. **Open Source Client Apps**
   - iOS and Android apps published on GitHub
   - GPL-3.0 license
   - Community audits welcome
   - Security researchers rewarded

2. **Public Security Audits**
   - Annual third-party security audits
   - Results published publicly
   - Vulnerabilities disclosed responsibly
   - Bug bounty program

3. **Plain Language Privacy Policy**
   - No legal jargon
   - Clear explanations
   - Available in multiple languages
   - Changelog for all updates

4. **Data Processing Transparency**
   - Documented data flows
   - Infrastructure location (Iceland) disclosed
   - Third-party services (minimal) listed
   - No hidden data sharing

**Transparency Dashboard:**
- Government data requests (number, outcome)
- Security incidents (if any)
- Data breach reports (required within 72 hours)
- Service uptime and reliability

---

### 5. Consent and Control

**Principle:** Explicit, informed consent for all data processing.

**Consent Requirements:**

1. **Granular Consent**
   - Separate consent for each data type
   - No bundled consent (no "take it or leave it")
   - Easy to revoke consent
   - Clear consequences of withdrawing consent

2. **Informed Consent**
   - Plain language explanations
   - Why we need each permission
   - What happens to the data
   - How long we keep it

3. **Child Protection**
   - Parental consent required for users under 16
   - Age verification mechanisms
   - Special protections for children's data
   - No marketing to children

**Permission System:**
```
Location Permission:
  [✓] Share real-time location
  [✓] Store location history (30 days)
  [ ] Share location with emergency services

Notification Permission:
  [✓] Safety alerts (SOS, geofence)
  [ ] Product updates
  [ ] Feature announcements

Communication Permission:
  [✓] In-app family messaging
  [ ] Email notifications
  [ ] Push notifications for non-safety events
```

---

### 6. Security by Design

**Principle:** Security built into every layer, not bolted on.

**Security Measures:**

1. **Encryption Everywhere**
   - Data in transit: TLS 1.3
   - Data at rest: AES-256
   - End-to-end: Signal Protocol adaptation
   - Key storage: Hardware security modules (HSM)

2. **Authentication**
   - Strong password requirements
   - Optional two-factor authentication (TOTP, WebAuthn)
   - Biometric authentication (device-local only)
   - Session management and timeout

3. **Access Controls**
   - Role-based access control (RBAC)
   - Principle of least privilege
   - Admin actions require re-authentication
   - Audit logs for sensitive operations

4. **Infrastructure Security**
   - Regular security updates
   - Intrusion detection systems
   - DDoS protection
   - Regular penetration testing
   - Incident response plan

**Threat Model:**

| Threat | Protection |
|--------|-----------|
| Server compromise | E2E encryption prevents data exposure |
| Man-in-the-middle | TLS 1.3, certificate pinning |
| Device theft | Local encryption, remote wipe capability |
| Malicious family member | Per-user encryption keys, audit logs |
| Government surveillance | Zero-knowledge architecture, Iceland jurisdiction |
| Employee abuse | Zero-knowledge, access controls, monitoring |

---

### 7. No Surveillance Capitalism

**Principle:** Never monetize user data. Ever.

**Commitments:**

1. **No Data Selling**
   - We will never sell, rent, or trade user data
   - No partnerships with data brokers
   - No "anonymized" data sales
   - No "legitimate interest" loopholes

2. **No Advertising**
   - No ads in the app
   - No advertising network SDKs
   - No behavioral tracking
   - No user profiling

3. **No Hidden Monetization**
   - Transparent subscription pricing
   - No dark patterns
   - No surprise charges
   - Easy cancellation

**Our Business Model:**
```
Revenue = Subscriptions + Enterprise Licenses

NOT:
Revenue = User Data × Data Broker Deals
```

**Legal Safeguards:**
- Company bylaws prohibit data selling
- Data protection commitments in customer contracts
- Public commitment, legally binding
- Regular privacy audits

---

### 8. Privacy by Default

**Principle:** Most privacy-protecting settings enabled by default.

**Default Settings:**

```
Location Sharing:
  ✓ Enabled (within family circle only)
  ✗ Public sharing (always off)
  ✓ Auto-delete after 30 days
  ✓ High location accuracy (for safety)

Privacy Controls:
  ✓ End-to-end encryption (always on)
  ✓ Location history encrypted (cannot be disabled)
  ✗ Third-party data sharing (always off)
  ✓ Activity logs enabled

Notifications:
  ✓ Safety alerts (SOS, geofence)
  ✗ Marketing notifications (off by default)
  ✗ Feature announcements (off by default)

Data Retention:
  ✓ 30-day automatic deletion
  ✗ Indefinite retention (opt-in for premium)
```

**Users Can Adjust:**
- More privacy (e.g., blur location, shorter retention)
- More features (e.g., longer history for premium users)
- Never less privacy than defaults

---

### 9. Accountability

**Principle:** We are accountable to users, regulators, and society.

**Accountability Measures:**

1. **Data Protection Officer (DPO)**
   - Independent DPO appointed
   - Direct contact: privacy@draugar.is
   - Responsible for GDPR compliance
   - Reports to board, not CEO

2. **Privacy Advisory Board**
   - External privacy experts
   - Quarterly reviews
   - Public recommendations
   - Veto power on privacy-impacting changes

3. **Regular Audits**
   - Annual security audits (published)
   - Quarterly privacy compliance reviews
   - Penetration testing
   - Code audits by external firms

4. **Incident Response**
   - 72-hour breach notification (GDPR)
   - Public disclosure of security incidents
   - Post-mortem reports published
   - User notification protocols

**Compliance:**
- GDPR (EU General Data Protection Regulation)
- COPPA (Children's Online Privacy Protection Act)
- Iceland Data Protection Act
- ISO 27001 (planned)
- SOC 2 Type II (planned for enterprise)

---

### 10. Ethical Data Use

**Principle:** Data is only used for the stated purpose, nothing else.

**Permitted Uses:**
1. Providing location sharing to family members
2. Safety alerts and notifications
3. Service improvement (aggregate, anonymized)
4. Security and fraud prevention
5. Legal compliance (only when required)

**Prohibited Uses:**
1. ✗ Selling or sharing data with third parties
2. ✗ Advertising or marketing profiling
3. ✗ Training AI models on user data
4. ✗ Research without explicit consent
5. ✗ Employee access without legitimate need
6. ✗ Government access without warrant
7. ✗ Cross-service tracking
8. ✗ Predictive analytics for commercial gain

**Purpose Limitation:**
- Data collected for safety cannot be used for marketing
- Location data cannot be used for behavior analysis
- No "mission creep" in data usage
- Purpose changes require new consent

---

## Technical Privacy Features

### 1. Location Privacy Controls

**Ghost Mode:**
- Temporarily pause location sharing
- Duration: 1hr, 2hr, 4hr, 8hr, custom
- Family members see "Ghost Mode Active"
- Automatic resume

**Location Blur:**
- Reduce precision for privacy
- Options: exact, street, neighborhood, city
- Useful for adult family members
- Per-member settings

**Scheduled Sharing:**
- Share location only during specific times
- Example: school hours, work commute
- Automatic based on day/time
- Multiple schedules per user

### 2. Secure Communication

**Encrypted Messaging:**
- End-to-end encrypted messages
- Signal Protocol
- No server access to content
- Ephemeral messages (optional)

**Voice Messages:**
- Encrypted voice recordings
- Auto-delete after playback (optional)
- No transcription or analysis

### 3. Privacy Dashboard

**User Dashboard Shows:**
- Who viewed your location (with timestamps)
- Data access logs
- Active sessions and devices
- Family circle permissions
- Data retention settings
- Export/delete options

**Example Access Log:**
```
Jan 14, 10:30 - Mom viewed your location
Jan 14, 09:15 - Dad viewed your location
Jan 13, 18:45 - You exported your data
Jan 13, 14:20 - Mom viewed your location
```

---

## GDPR Compliance Details

### Legal Basis for Processing

1. **Consent** (Article 6(1)(a))
   - Location sharing requires explicit consent
   - Easy to withdraw
   - Granular and specific

2. **Contract** (Article 6(1)(b))
   - Processing necessary to provide service
   - Account management
   - Billing for premium subscriptions

3. **Legal Obligation** (Article 6(1)(c))
   - Tax records
   - Legal compliance
   - Court orders with proper jurisdiction

### Data Subject Rights (GDPR Articles 15-22)

| Right | Implementation | Response Time |
|-------|---------------|---------------|
| Right to Access (Art. 15) | JSON/KML export, dashboard | Instant |
| Right to Rectification (Art. 16) | Edit profile, update info | Instant |
| Right to Erasure (Art. 17) | Account deletion button | 24 hours |
| Right to Data Portability (Art. 20) | Standard format export | Instant |
| Right to Object (Art. 21) | Opt-out mechanisms | Instant |
| Right to Restrict (Art. 18) | Pause processing | Instant |

---

## Privacy vs. Safety Trade-offs

### Balancing Act

Draugar must balance privacy and safety. Our approach:

**Safety Features That Impact Privacy:**
1. **Location Sharing**
   - Impact: Reveals location to family
   - Mitigation: E2E encryption, user controls, ghost mode

2. **Emergency SOS**
   - Impact: Sends precise location
   - Mitigation: Only to family members, explicit action required

3. **Geofence Notifications**
   - Impact: Server knows when you cross boundaries
   - Mitigation: Encrypted geofence coordinates, processed client-side

**Our Philosophy:**
- Privacy is not hiding from family—it's protection from everyone else
- Family safety requires some data sharing—but only within family
- All processing should be minimal, encrypted, and user-controlled

---

## Privacy Promises

We promise to:

1. ✓ Never sell your data
2. ✓ Never share data without consent
3. ✓ Always encrypt location data end-to-end
4. ✓ Delete data according to retention settings
5. ✓ Notify you of any data breaches within 72 hours
6. ✓ Keep your data in Iceland under strong privacy laws
7. ✓ Fight overreach by governments or third parties
8. ✓ Be transparent about our practices
9. ✓ Listen to user privacy concerns
10. ✓ Improve privacy protections continuously

---

## Contact

**Data Protection Officer**
Email: privacy@draugar.is

**Security Issues**
Email: security@draugar.is

**General Privacy Questions**
Email: support@draugar.is

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-14 | Initial privacy principles document |

---

**These principles are binding commitments. They guide our development, our business decisions, and our culture. We will never compromise on privacy—that's the Draugar promise.**
