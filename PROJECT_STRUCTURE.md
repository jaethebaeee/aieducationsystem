# AdmitAI Korea - Project Structure

## Overview

AdmitAI Korea is a monorepo containing a full-stack AI-powered college admissions platform specifically designed for Korean students applying to U.S. universities. The project follows a clean, standardized structure for maintainability and scalability.

## Directory Structure

```
AIeducationsystem/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── common/      # Shared components (Button, Card, etc.)
│   │   │   └── layout/      # Layout components (Header, Footer, etc.)
│   │   ├── contexts/        # React contexts (Auth, Language)
│   │   ├── i18n/           # Internationalization
│   │   │   └── locales/    # Translation files (ko.json, en.json)
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── community/  # Community features
│   │   │   ├── dashboard/  # User dashboard
│   │   │   ├── essays/     # Essay management
│   │   │   ├── feedback/   # Feedback system
│   │   │   ├── mentor/     # AI mentor interface
│   │   │   ├── onboarding/ # User onboarding
│   │   │   ├── parent/     # Parent dashboard
│   │   │   ├── profile/    # User profile/settings
│   │   │   └── resources/  # Educational resources
│   │   ├── services/       # API service layer
│   │   ├── styles/         # Global styles
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main application component
│   │   └── index.tsx       # Application entry point
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── Dockerfile          # Frontend container configuration
│   └── nginx.conf          # Nginx configuration for production
│
├── backend/                 # Express.js backend API
│   ├── src/                # Source code
│   │   ├── routes/         # API route handlers
│   │   │   ├── analytics.ts # Analytics endpoints
│   │   │   ├── auth.ts     # Authentication endpoints
│   │   │   ├── community.ts # Community features
│   │   │   ├── essays.ts   # Essay management
│   │   │   ├── feedback.ts # Feedback system
│   │   │   ├── mentor.ts   # AI mentor endpoints
│   │   │   ├── resources.ts # Educational resources
│   │   │   ├── stories.ts  # Cultural storytelling
│   │   │   ├── timeline.ts # Application timeline
│   │   │   └── weather.ts  # University weather system
│   │   ├── services/       # Business logic services
│   │   │   └── aiService.ts # AI integration service
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.ts     # Authentication middleware
│   │   │   ├── errorHandler.ts # Error handling
│   │   │   └── requestLogger.ts # Request logging
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── errors.ts   # Error type definitions
│   │   ├── utils/          # Utility functions
│   │   │   ├── dbSetup.ts  # Database setup utilities
│   │   │   ├── logger.ts   # Logging utilities
│   │   │   └── seedUniversities.ts # Database seeding
│   │   └── index.ts        # Application entry point
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Database schema definition
│   │   └── migrations/     # Database migration files
│   ├── logs/               # Application logs
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── Dockerfile          # Backend container configuration
│
├── nginx/                  # Nginx configuration for production
│   ├── nginx.conf          # Main nginx configuration
│   ├── logs/               # Nginx logs
│   └── ssl/                # SSL certificates
│
├── scripts/                # Development and deployment scripts
│   ├── clone-repositories.sh # Repository setup script
│   └── enhanced-setup.sh   # Enhanced setup script
│
├── uploads/                # File upload storage
├── examples/               # Example implementations
├── external-repositories/  # External repository analysis
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production environment
├── scripts/deploy.sh       # Deployment script
├── start-dev.sh            # Development startup script
├── setup.sh                # Project setup script
├── env.example             # Environment variables template
├── package.json            # Root package.json for workspace management
└── README.md               # Project documentation
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Create React App
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Context
- **Routing**: React Router DOM
- **Internationalization**: i18next
- **UI Components**: Headless UI + Heroicons
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Animations**: Framer Motion

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **AI Integration**: OpenAI API
- **File Upload**: Multer
- **Validation**: Zod
- **Logging**: Winston
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet + CORS

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **Process Management**: PM2 (production)
- **Environment**: Node.js 18+

## Key Features

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
- **Performance** - Optimized loading and caching

## Development Workflow

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (for local development)

### Setup
1. Clone the repository
2. Copy `env.example` to `.env` and configure variables
3. Run `./setup.sh` to initialize the project
4. Start development servers with `./start-dev.sh`

### Development Commands
```bash
# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests

# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run migrate      # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run seed         # Seed database
```

### Production Deployment
```bash
# Build and deploy
./deploy.sh

# Or use Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## Code Standards

### Frontend
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb + Prettier configuration
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State**: Context for global state, local state for components
- **Testing**: Jest + React Testing Library

### Backend
- **TypeScript**: Strict mode enabled
- **ESLint**: Node.js + Prettier configuration
- **Architecture**: MVC pattern with service layer
- **Validation**: Zod schemas for all inputs
- **Error Handling**: Centralized error middleware
- **Logging**: Structured logging with Winston
- **Testing**: Jest + Supertest

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and profile data
- **Essay**: Essay content and metadata
- **Feedback**: AI-generated feedback
- **University**: University information and weather data
- **StoryBlock**: Cultural storytelling components
- **StoryDraft**: Story drafts and versions
- **Timeline**: Application timeline management
- **Task**: Task management and tracking
- **Resource**: Educational resources
- **Community**: Community posts and interactions

## Security Considerations

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive validation with Zod
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configured for production domains
- **Helmet**: Security headers
- **File Upload**: Secure file handling and validation
- **Environment Variables**: Sensitive data in environment variables

## Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, query optimization, caching
- **CDN**: Static asset delivery
- **Compression**: Gzip compression for responses
- **Caching**: Redis for session and data caching

## Monitoring and Analytics

- **Logging**: Structured logging with Winston
- **Error Tracking**: Centralized error handling
- **Performance**: Response time monitoring
- **User Analytics**: Feature usage tracking
- **Database**: Query performance monitoring

This structure provides a solid foundation for the AdmitAI Korea platform, ensuring scalability, maintainability, and developer productivity. 