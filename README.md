# AdmitAI Korea

> AI-powered college admissions platform specifically designed for Korean students applying to U.S. universities

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## 🌟 Overview

AdmitAI Korea is a revolutionary AI-powered college admissions platform that operates as "university admissions meteorologists." We analyze the broader context and external factors that influence admissions decisions, providing Korean students with real-time, university-specific intelligence to maximize their admission success.

### 🎯 Our Unique Approach

Unlike generic AI essay analyzers, we provide:
- **University Weather System**: Real-time admissions intelligence for each school
- **Cultural Storytelling Coach**: AI-powered cultural narrative development
- **Personalized Application Roadmap**: Timeline and task management
- **Context-Aware AI**: Analyzes entire university ecosystem, not just essays
- **Bilingual Support**: Korean/English interface for accessibility

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AIeducationsystem
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

4. **Start development servers**
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: http://localhost:5555

## 📁 Project Structure

```
AIeducationsystem/
├── frontend/          # React frontend application
├── backend/           # Express.js backend API
├── nginx/             # Production web server config
├── scripts/           # Development and deployment scripts
├── uploads/           # File upload storage
└── docs/              # Documentation
```

For detailed structure information, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **i18next** for internationalization
- **Zustand** for state management
- **Framer Motion** for animations

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **OpenAI API** for AI features
- **Winston** for logging
- **Zod** for validation

### Infrastructure
- **Docker** for containerization
- **Nginx** for production serving
- **Redis** for caching (production)

## 🎨 Key Features

### Core Platform Features
1. **University Weather System** - Real-time admissions intelligence
2. **Cultural Storytelling Coach** - AI-powered cultural narrative development
3. **Personalized Application Roadmap** - Timeline and task management
4. **AI Essay Analysis** - Comprehensive essay feedback and improvement
5. **Community Platform** - Student and mentor collaboration
6. **Parent Dashboard** - Progress tracking and communication
7. **Resource Hub** - Educational materials and guides

### Technical Features
- **Bilingual Support** - Korean/English interface
- **Real-time Updates** - WebSocket integration
- **File Management** - Secure upload and storage
- **Analytics** - User behavior and performance tracking
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliance

## 🚀 Development

### Available Scripts

#### Frontend (`cd frontend`)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
```

#### Backend (`cd backend`)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run migrate      # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run seed         # Seed database
```

### Database Management

```bash
# Generate Prisma client
cd backend && npm run db:generate

# Run migrations
cd backend && npm run migrate

# Open Prisma Studio
cd backend && npm run db:studio

# Seed database
cd backend && npm run seed
```

## 🚀 Deployment

### Production Deployment

```bash
# Build and deploy
chmod +x deploy.sh
./deploy.sh

# Or use Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

Required environment variables (see `env.example`):

```bash
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-jwt-secret

# OpenAI
OPENAI_API_KEY=your-openai-key

# Server
PORT=5000
NODE_ENV=production
```

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed project organization
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Development guidelines
- [Production Deployment](./PRODUCTION_DEPLOYMENT.md) - Deployment instructions
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
 - SEO Parity Dashboard:
   - API: `GET /api/seo/parity`
   - UI: `/seo/parity` (protected, noindex)
   - Sample data: `monitoring/seo/sample-parity.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb + Prettier configuration
- **Testing**: Jest + React Testing Library
- **Commits**: Conventional commits format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the [Troubleshooting](./TROUBLESHOOTING.md) guide
- Review the [Implementation Guide](./IMPLEMENTATION_GUIDE.md)

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Prisma for database management
- Tailwind CSS for styling
- React community for the ecosystem

---

**AdmitAI Korea** - Transforming Korean students into culturally authentic, strategically positioned candidates for U.S. university admissions. 