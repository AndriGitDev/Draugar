# Draugar - Quick Start Guide

**Last Updated:** 2026-01-14
**Target Audience:** Solo developer starting from scratch
**Timeline:** Week 1 → MVP in 6 months

---

## Overview

This guide will take you from zero to a deployed MVP in approximately 6 months. It's designed for solo development with AI coding assistance.

**What you'll build:**
- React Native mobile app (iOS + Android)
- Node.js + TypeScript backend
- PostgreSQL database with PostGIS
- Deployed to Render + Neon
- OpenStreetMap integration

---

## Prerequisites

### Required Skills
- Basic JavaScript/TypeScript knowledge
- Basic understanding of REST APIs
- Willingness to learn React Native
- Comfort with command line
- Git basics

### Don't Worry If You Don't Know:
- React Native (you'll learn)
- PostgreSQL (Prisma makes it easy)
- Mobile development (AI will help)
- DevOps (Render simplifies deployment)

### Tools to Install
- [ ] Node.js 20+ LTS ([nodejs.org](https://nodejs.org))
- [ ] Git ([git-scm.com](https://git-scm.com))
- [ ] VS Code or Cursor IDE
- [ ] GitHub Copilot or Claude (recommended)

### Accounts to Create
- [ ] GitHub account (free)
- [ ] Render account ([render.com](https://render.com))
- [ ] Neon.tech account ([neon.tech](https://neon.tech))

---

## Week 1: Hello World

### Day 1-2: Environment Setup

**Backend Setup:**
```bash
# Create backend directory
mkdir draugar-backend && cd draugar-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express typescript @types/node @types/express
npm install prisma @prisma/client zod jsonwebtoken bcrypt
npm install -D tsx nodemon @types/jsonwebtoken @types/bcrypt

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init

# Create basic project structure
mkdir -p src/{routes,middleware,utils,config}
touch src/index.ts
```

**Mobile Setup:**
```bash
# Create mobile app (in a separate directory)
cd ..
npx create-expo-app draugar-mobile
cd draugar-mobile

# Install dependencies
npx expo install expo-location react-native-maps react-native-webview
npm install @react-navigation/native @react-navigation/stack

# Install React Navigation dependencies
npx expo install react-native-screens react-native-safe-area-context
```

### Day 3-4: Backend Hello World

**Goal:** Deploy a simple API to Render

**Steps:**
1. Create a simple Express server in `src/index.ts`
2. Add health check endpoint: `GET /health`
3. Create a Dockerfile
4. Push to GitHub
5. Connect to Render
6. Deploy!

**Test:**
```bash
curl https://your-app.onrender.com/health
# Should return: {"status":"ok"}
```

### Day 5-7: Database + Mobile Hello World

**Backend:**
1. Create Neon PostgreSQL database
2. Configure Prisma schema with users table
3. Run first migration
4. Test connection

**Mobile:**
1. Create a "Hello World" screen
2. Add a button that calls your `/health` endpoint
3. Display the result
4. Test on Expo Go app on your phone

**Success Criteria:**
- ✅ Backend deployed to Render
- ✅ Database connected
- ✅ Mobile app running
- ✅ Mobile can call backend API

---

## Month 1-2: Backend Foundation

### Week 1-2: Setup & Learning
- Initialize projects (done in Week 1)
- Set up Prisma with PostgreSQL
- Configure TypeScript strict mode
- Create basic project structure
- Learn Prisma basics with AI help

### Week 3-4: Core API
**Features to build:**
- User registration & login
- JWT authentication middleware
- Family creation with invite codes
- Location POST/GET endpoints
- Request validation with Zod
- Error handling middleware

**AI Prompt Example:**
```
"Create a Prisma schema for a users table with id (UUID), email (unique),
password_hash, and created_at timestamp. Then generate a registration
endpoint that hashes passwords with bcrypt."
```

### Week 5-6: Polish & Deploy
- Write basic API tests
- Add rate limiting
- Deploy to Render
- Set up CI/CD with GitHub Actions
- Test all endpoints

**Milestone:** Working REST API that you can hit with cURL

---

## Month 3-4: Mobile App MVP

### Week 7-8: React Native Setup
**Learn React Native basics:**
- Navigation (React Navigation)
- State management (useState, useContext)
- Styling (StyleSheet)
- Async operations (useEffect, fetch)

**Build screens:**
- Login screen
- Register screen
- Map screen (with OpenStreetMap)
- Profile screen

**AI Prompt Example:**
```
"Create a React Native login screen with email and password inputs,
a login button, and basic validation. Use TypeScript and handle
the fetch call to POST /api/auth/login"
```

### Week 9-10: Core Features
**Implement:**
- Login/register functionality
- Request location permission (expo-location)
- Manual "Update Location" button
- Send location to API
- Display family members on map
- Basic error handling

**OpenStreetMap Setup:**
```typescript
// Using react-native-maps with OSM tiles
<MapView
  provider={null} // Use default map provider
  customMapStyle={osmStyle} // OSM style
  urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
>
  {/* Your markers here */}
</MapView>
```

### Week 11-12: Testing & Beta
- Test on both iOS and Android devices
- Add loading states
- Improve error messages
- Simple onboarding flow
- Deploy to TestFlight (iOS) and Internal Testing (Android)
- Get 2-3 family members to test

**Milestone:** You and family can share locations!

---

## Month 5-6: Polish & Stability

### Week 13-14: Bug Fixes
- Fix issues found during testing
- Improve UI/UX based on feedback
- Add location history view
- Better map markers and styling

### Week 15-16: Essential Features
- Auto-refresh locations (polling every 30s)
- Battery level sharing
- Push notifications for family join requests
- Profile pictures (optional)

### Week 17-18: DevOps
- Set up error logging (Sentry)
- Database backups
- Monitoring (UptimeRobot or Render dashboard)
- Document deployment process
- Review costs and optimize

**Milestone:** App works reliably, family uses it daily

---

## AI Coding Assistance Tips

### Best Prompts for AI

**Backend Example:**
```
"Using Express and TypeScript, create a JWT authentication middleware
that validates the token from the Authorization header, verifies it
using jsonwebtoken, and adds the user ID to req.user. Handle errors
properly."
```

**Mobile Example:**
```
"Create a React Native component using expo-location that requests
location permission, gets the current position, and displays the
latitude/longitude. Handle permission denied and errors. Use TypeScript."
```

### AI Tools Workflow

1. **Planning:** Ask AI to explain architecture
2. **Boilerplate:** Generate project structure
3. **Implementation:** Pair program with AI
4. **Testing:** Generate test cases
5. **Debugging:** Paste errors, get solutions
6. **Review:** Ask AI to review your code

### Example AI Conversation
```
You: "I need to store location data in PostgreSQL. Should I use
PostGIS or just lat/lng columns?"

AI: "For Phase 1 MVP, simple lat/lng DOUBLE PRECISION columns are
fine. Add PostGIS in Phase 2 when you need spatial queries like
'find nearby users' or geofencing. Here's the Prisma schema..."

You: "Great, now how do I validate the location data before storing?"

AI: "Use Zod to create a schema. Here's an example..."
```

---

## Common Pitfalls to Avoid

### 1. Over-Engineering
❌ Don't build microservices
❌ Don't add caching too early
❌ Don't optimize prematurely
✅ Monolith is perfect for solo dev
✅ Direct database queries are fine initially
✅ Ship MVP first, optimize later

### 2. Feature Creep
❌ "Just one more feature before launch"
❌ Building features nobody asked for
❌ Perfectionism preventing shipping
✅ Stick to MVP scope ruthlessly
✅ Ship early, get feedback
✅ Iterate based on real usage

### 3. Encryption Too Early
❌ Trying to implement E2E encryption in Phase 1
❌ Getting stuck on crypto libraries
✅ Phase 1: HTTPS only (TLS 1.3)
✅ Phase 2: Add E2E encryption after MVP works
✅ Learn encryption properly before implementing

### 4. Mobile Development Struggles
❌ Fighting with Xcode/Android Studio immediately
❌ Trying to support every device/OS version
✅ Use Expo Go for fast testing
✅ Test on your own devices first
✅ Add custom dev client only when needed

---

## Resources

### Documentation
- **React Native:** [reactnative.dev](https://reactnative.dev)
- **Expo:** [docs.expo.dev](https://docs.expo.dev)
- **Prisma:** [prisma.io/docs](https://prisma.io/docs)
- **Express:** [expressjs.com](https://expressjs.com)

### Communities
- **React Native:** r/reactnative, Discord
- **Node.js:** r/node, Stack Overflow
- **PostgreSQL:** r/postgresql
- **Privacy Tech:** r/privacy, r/selfhosted

### AI Coding Tools
- **GitHub Copilot:** [github.com/features/copilot](https://github.com/features/copilot)
- **Claude:** [claude.ai](https://claude.ai)
- **Cursor IDE:** [cursor.sh](https://cursor.sh)

---

## Milestones Checklist

### Week 1
- [ ] Backend deploys to Render
- [ ] Database connected
- [ ] Mobile app runs on device
- [ ] Mobile calls backend API

### Month 2 (Week 8)
- [ ] User can register and login
- [ ] Families can be created
- [ ] API deployed and stable

### Month 4 (Week 16)
- [ ] Mobile app on both iOS and Android
- [ ] Can update and view location
- [ ] Family members see each other on map
- [ ] TestFlight/Internal Testing live

### Month 6 (Week 24)
- [ ] App used daily by you + family
- [ ] No critical bugs for 2+ weeks
- [ ] Battery drain acceptable (< 10%/day)
- [ ] Ready for Phase 2 (E2E encryption)

---

## Getting Help

### When Stuck
1. **Ask AI:** Paste your error, ask for solution
2. **Check docs:** Official documentation
3. **Search:** Stack Overflow, GitHub Issues
4. **Community:** Reddit, Discord servers
5. **Simplify:** Remove complexity, start simpler

### Red Flags (Take a Break)
- Working on same bug for 4+ hours
- Adding features instead of fixing core issues
- Feeling burned out
- Considering rewriting everything

---

## Weekly Routine

### During Active Development

**Monday:** Plan week's tasks
**Tuesday-Thursday:** Code + learn
**Friday:** Deploy, test, review
**Weekend:** Break (seriously, take breaks!)

### Daily Routine

**Morning:**
1. Review yesterday's progress
2. Pick 1-2 tasks for today
3. Start with hardest task

**Afternoon:**
1. Code with AI assistance
2. Test as you go
3. Git commit frequently

**Evening:**
1. Deploy if ready
2. Document what you learned
3. Plan tomorrow

---

## Success Metrics

### Phase 1 (Month 6)
- ✅ Works for you and 2-3 family members
- ✅ Used daily without major issues
- ✅ Battery drain < 10% per day
- ✅ Code is maintainable
- ✅ You learned a ton!

### Not Required for Phase 1
- ❌ Perfect code
- ❌ 100% test coverage
- ❌ Thousands of users
- ❌ Fancy features
- ❌ Zero bugs (impossible!)

---

## Next Steps

1. ✅ Read this guide
2. ✅ Install prerequisites
3. ✅ Create accounts (GitHub, Render, Neon)
4. ⬜ Start Week 1: Hello World
5. ⬜ Follow [PROJECT_PLAN.md](PROJECT_PLAN.md) for details

---

## Motivation

**When it gets hard (it will):**
- Remember why you're building this (privacy matters!)
- Look at what you've already built
- Take breaks when stuck
- Ask AI for help
- Ship imperfect things
- Learn from mistakes
- Keep going!

**You've got this! 🚀**

---

**"Your family's safety, your data's privacy. Built by one developer who cares."**
