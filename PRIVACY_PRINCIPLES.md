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
- Even system administrators cannot access user location data

**Technical Details:**
```
User Device                    Draugar Server
    |                               |
    |--- Encrypt with Family Key -->|
    |       (XChaCha20-Poly1305)    |
    |                               |--- Store Encrypted Blob
    |                               |    (Cannot Decrypt)
```

**Guarantees:**
- ✓ Server breach does not expose location data
- ✓ Government requests cannot compel data we don't have
- ✓ Administrators cannot abuse access to spy on users
- ✓ Third parties have no access to unencrypted data

---

### 2. Data Minimization

**Principle:** Collect only what is absolutely necessary, nothing more.

**What We Collect:**
- ✓ Location coordinates (encrypted)
- ✓ Timestamp of location update (encrypted)
- ✓ Battery level (for safety alerts)
- ✓ Name/Email (for authentication and identification within the group)
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
- Location history: configurable retention (e.g., 30 days)
- Deleted locations are cryptographically erased
- No "soft deletes" or archival systems
- Audit logs: minimal retention required for security

---

### 3. User Sovereignty

**Principle:** Users own their data completely and control how it's used.

**Data Rights:**

1. **Right to Access**
   - Export all data in JSON formats
   - API access to your own data

2. **Right to Delete**
   - One-click account deletion
   - Complete data erasure within 24 hours
   - No "deactivation" tricks—deletion means deletion

3. **Right to Portability**
   - Standard data formats (JSON)
   - Import/export functionality
   - No vendor lock-in

4. **Right to Control**
   - Granular sharing permissions
   - Temporary location sharing (time-limited)
   - "Ghost mode" for privacy breaks
   - Per-member visibility controls

**Example Scenarios:**

```
Scenario: Family member wants to pause location sharing for 2 hours
Solution: Ghost mode - location sharing pauses, resumes automatically

Scenario: Parent wants to share location only during specific hours
Solution: Scheduled sharing - automatic based on time/day (planned)

Scenario: User wants to blur exact location for privacy
Solution: Location precision control - share approximate area only (planned)
```

---

### 4. Transparency

**Principle:** Open operations, no hidden practices, auditable security.

**Commitments:**

1. **Open Source Client Apps**
   - iOS and Android apps published on GitHub
   - GPL-3.0 license
   - Community audits welcome

2. **Public Documentation**
   - Technical architecture disclosed
   - Plain language privacy principles

3. **Plain Language Privacy Policy**
   - No legal jargon
   - Clear explanations
   - Changelog for all updates

4. **Data Processing Transparency**
   - Documented data flows
   - Self-hostable for full infrastructure control
   - No hidden data sharing

**Transparency Dashboard:**
- Service uptime and reliability
- Security incident reports (if any)

---

### 5. Consent and Control

**Principle:** Explicit, informed consent for all data processing.

**Consent Requirements:**

1. **Granular Consent**
   - Separate consent for each data type
   - No bundled consent (no "take it or leave it")
   - Easy to revoke consent

2. **Informed Consent**
   - Plain language explanations
   - Why we need each permission
   - What happens to the data

3. **Family Member Protections**
   - Special considerations for minors in the family
   - Transparent sharing indicators (always know when you are sharing)

**Permission System:**
```
Location Permission:
  [✓] Share real-time location
  [✓] Store location history
  [ ] Share location with emergency services

Notification Permission:
  [✓] Safety alerts (SOS, geofence)
  [ ] System updates
```

---

### 6. Security by Design

**Principle:** Security built into every layer, not bolted on.

**Security Measures:**

1. **Encryption Everywhere**
   - Data in transit: TLS 1.3
   - Data at rest: Provider-level encryption
   - End-to-end: XChaCha20-Poly1305
   - Key storage: Device hardware security (SecureStore/Keychain)

2. **Authentication**
   - Secure invite code system
   - JWT-based session management
   - Biometric authentication (device-local only)

3. **Access Controls**
   - Principle of least privilege
   - Admin actions require valid credentials
   - Audit logs for sensitive operations

4. **Infrastructure Security**
   - Containerized deployment (Docker)
   - Regular security updates

**Threat Model:**

| Threat | Protection |
|--------|-----------|
| Server compromise | E2E encryption prevents data exposure |
| Man-in-the-middle | TLS 1.3 |
| Device theft | Local encryption, hardware key storage |
| Malicious group member | Per-user encryption keys, audit logs |
| Surveillance | Zero-knowledge architecture, self-hosted option |
| Admin abuse | Zero-knowledge, access controls |

---

### 7. No Surveillance Capitalism

**Principle:** Never monetize user data. Ever.

**Commitments:**

1. **No Data Selling**
   - We will never sell, rent, or trade user data
   - No partnerships with data brokers

2. **No Advertising**
   - No ads in the app
   - No advertising network SDKs
   - No behavioral tracking

3. **No Hidden Monetization**
   - Open source and transparent
   - No dark patterns

---

### 8. Privacy by Default

**Principle:** Most privacy-protecting settings enabled by default.

**Default Settings:**

```
Location Sharing:
  ✓ Enabled (within family group only)
  ✗ Public sharing (always off)
  ✓ Auto-delete based on retention settings

Privacy Controls:
  ✓ End-to-end encryption (always on)
  ✗ Third-party data sharing (always off)
  ✓ Activity logs enabled
```

---

### 9. Accountability

**Principle:** We are accountable to users and the community.

**Accountability Measures:**

1. **Open Source Auditability**
   - Code is available for anyone to review
   - Community-driven improvements and fixes

2. **Incident Response**
   - Public disclosure of any known security incidents
   - Rapid patching of vulnerabilities

**Compliance:**
- Designed to facilitate GDPR compliance (User rights, Data minimization)
- Self-hosters are responsible for their own regulatory compliance

---

### 10. Ethical Data Use

**Principle:** Data is only used for the stated purpose, nothing else.

**Permitted Uses:**
1. Providing location sharing to family members
2. Safety alerts and notifications
3. Service improvement (aggregate, anonymized)
4. Security and fraud prevention

**Prohibited Uses:**
1. ✗ Selling or sharing data with third parties
2. ✗ Advertising or marketing profiling
3. ✗ Training AI models on user data without consent
4. ✗ Cross-service tracking

---

## Technical Privacy Features

### 1. Location Privacy Controls

**Ghost Mode:**
- Temporarily pause location sharing
- Family members see "Ghost Mode Active"
- Automatic resume

**Location Blur (Planned):**
- Reduce precision for privacy
- Useful for adult family members

**Scheduled Sharing (Planned):**
- Share location only during specific times
- Example: school hours, work commute

### 2. Privacy Dashboard

**User Dashboard Shows:**
- Active sessions and devices
- Group permissions
- Data retention settings
- Export/delete options

---

## GDPR Support

Draugar is built with GDPR principles in mind, providing tools for:
- **Right to Access**: Data export functionality
- **Right to Erasure**: Complete account and data deletion
- **Data Minimization**: Only essential data is collected
- **Security**: State-of-the-art encryption

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
   - Mitigation: Only to group members, explicit action required

**Our Philosophy:**
- Privacy is not hiding from family—it's protection from everyone else
- Family safety requires some data sharing—but only within your trusted group
- All processing should be minimal, encrypted, and user-controlled

---

## Privacy Promises

We promise to:

1. ✓ Never sell your data
2. ✓ Never share data without consent
3. ✓ Always encrypt location data end-to-end
4. ✓ Delete data according to retention settings
5. ✓ Be transparent about our practices
6. ✓ Listen to community privacy concerns
7. ✓ Improve privacy protections continuously

---

## Contact

For privacy-related questions or security reports, please contact the project maintainers:

**Security Issues**
Email: security@yourdomain.com (Placeholder)

**General Privacy Questions**
Email: privacy@yourdomain.com (Placeholder)

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-14 | Initial privacy principles document |

---

**These principles are binding commitments to our users. We will never compromise on privacy—that's the Draugar promise.**
