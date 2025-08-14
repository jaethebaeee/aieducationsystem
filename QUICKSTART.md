# 🚀 AdmitAI Korea Quick Start Guide

Get your AI-powered college admissions essay assistance platform up and running in minutes!

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## ⚡ Quick Start (5 minutes)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/admitai-korea.git
cd admitai-korea

# Run the automated setup script
./setup.sh install
```

### 2. Configure Environment

```bash
# Edit the environment file with your settings
cp env.example .env
# Edit .env with your API keys and configuration
```

**Required Environment Variables:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

### 3. Start the Platform

**Option A: Using Docker (Recommended)**
```bash
./setup.sh docker
```

**Option B: Local Development**
```bash
./setup.sh local
```

### 4. Access the Platform

Once started, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/health
- **Prisma Studio**: http://localhost:5555 (Database GUI)
- **Mailhog**: http://localhost:8025 (Email testing)

## 🏗️ Project Structure

```
admitai-korea/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── services/        # Business logic
├── prisma/                   # Database schema
├── docker-compose.yml        # Docker configuration
└── setup.sh                  # Setup script
```

## 🎯 Key Features

### For Students
- **AI Essay Analysis**: Grammar, style, and content feedback
- **Cultural Adaptation**: Tailored advice for Korean students
- **Progress Tracking**: Visual improvement metrics
- **Resource Library**: Writing guides and sample essays

### For Parents
- **Progress Dashboard**: Monitor child's application progress
- **Bilingual Interface**: Korean and English support
- **Transparent Pricing**: Clear subscription tiers

### For Mentors
- **Student Matching**: Connect with mentees
- **Feedback Tools**: Provide personalized guidance
- **Community Management**: Moderate forums

## 🔧 Development Commands

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Database operations
cd backend
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Run migrations
npx prisma generate        # Generate client
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

## 🧪 Testing

```bash
# Run all tests
./setup.sh test

# Run frontend tests only
cd frontend && npm test

# Run backend tests only
cd backend && npm test
```

## 📊 Database Management

```bash
# Access Prisma Studio (Database GUI)
cd backend && npx prisma studio

# Run migrations
cd backend && npx prisma migrate dev

# Reset database
cd backend && npx prisma migrate reset

# Seed database
cd backend && npm run seed
```

## 🔐 Authentication

The platform supports multiple user roles:

- **Student**: Primary users who submit essays
- **Parent**: Monitor child's progress
- **Mentor**: Provide guidance and feedback
- **Admin**: Platform management

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Essays
- `GET /api/essays` - List user essays
- `POST /api/essays` - Create new essay
- `GET /api/essays/:id` - Get essay details
- `PUT /api/essays/:id` - Update essay
- `DELETE /api/essays/:id` - Delete essay

### Feedback
- `POST /api/feedback/:essayId` - Submit essay for AI analysis
- `GET /api/feedback/:essayId` - Get feedback results

### Resources
- `GET /api/resources` - List resources
- `GET /api/resources/:id` - Get resource details

## 🎨 Customization

### Frontend Styling
- Edit `frontend/tailwind.config.js` for theme customization
- Modify `frontend/src/styles/globals.css` for global styles
- Update color scheme in `frontend/src/contexts/LanguageContext.tsx`

### Backend Configuration
- Modify `backend/prisma/schema.prisma` for database changes
- Update API routes in `backend/src/routes/`
- Configure middleware in `backend/src/middleware/`

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   DATABASE_URL=your-production-db-url
   REDIS_URL=your-production-redis-url
   JWT_SECRET=your-production-secret
   ```

2. **Build and Deploy**
   ```bash
   # Build frontend
   cd frontend && npm run build
   
   # Build backend
   cd backend && npm run build
   
   # Start production services
   docker-compose --profile production up -d
   ```

### Cloud Deployment

- **Frontend**: Deploy to Vercel, Netlify, or AWS S3
- **Backend**: Deploy to AWS EC2, Google Cloud Run, or Heroku
- **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
- **Cache**: Use managed Redis (AWS ElastiCache, Google Memorystore)

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Database connection issues**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres
```

**Node modules issues**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Discord**: Join our community server
- **Email**: support@admitai-korea.com

## 📈 Next Steps

1. **Customize the Platform**
   - Update branding and colors
   - Add your own resources and guides
   - Configure AI feedback prompts

2. **Add Features**
   - Implement payment processing
   - Add video tutorials
   - Create mobile app

3. **Scale Up**
   - Set up monitoring and analytics
   - Implement caching strategies
   - Add load balancing

4. **Launch**
   - Set up production environment
   - Configure SSL certificates
   - Set up backup strategies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need help?** Check out our [Documentation](https://docs.admitai-korea.com) or join our [Discord Community](https://discord.gg/admitai-korea)! 