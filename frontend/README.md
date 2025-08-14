# AdmitAI Korea Frontend

A modern, bilingual React application for Korean students applying to U.S. universities, featuring AI-powered essay analysis, cultural storytelling, and personalized application guidance.

## 🚀 Features

- **Bilingual Support**: Korean and English interfaces with cultural adaptation
- **AI-Powered Essay Analysis**: Real-time feedback with cultural context
- **University Weather System**: Dynamic admissions trend analysis
- **Cultural Storytelling Coach**: Guided narrative development
- **Personalized Roadmap**: Application timeline and task management
- **Community Platform**: Peer support and mentorship
- **Parent Dashboard**: Progress tracking and guidance

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React i18next** for internationalization
- **Heroicons** for icons
- **React Hook Form** for form management
- **React Query** for data fetching (planned)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── StatCard.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── common/             # Common components
│   ├── layout/             # Layout components
│   └── auth/               # Authentication components
├── contexts/
│   ├── AuthContext.tsx     # Authentication state
│   └── LanguageContext.tsx # Language switching
├── pages/
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard and overview
│   ├── essays/             # Essay management
│   ├── community/          # Community features
│   ├── mentor/             # Mentor interaction
│   ├── resources/          # Resource library
│   ├── parent/             # Parent dashboard
│   └── profile/            # User profile
├── services/
│   └── api.ts              # API service layer
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── performance.ts      # Performance utilities
└── i18n/
    └── locales/            # Translation files
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) - Trust, professionalism
- **Secondary**: Purple (#7c3aed) - Innovation, creativity
- **Success**: Green (#059669) - Progress, completion
- **Warning**: Yellow (#d97706) - Attention, caution
- **Error**: Red (#dc2626) - Errors, alerts
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weights
- **Korean Text**: Noto Sans KR for Korean content

### Components
All UI components are built with:
- TypeScript for type safety
- Tailwind CSS for styling
- Consistent prop interfaces
- Accessibility features
- Responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all components
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful component and function names

### Component Structure
```typescript
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ComponentProps } from '../types';

interface MyComponentProps {
  // Define props with TypeScript
}

const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  const { t } = useLanguage();
  
  // Component logic here
  
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default MyComponent;
```

### Internationalization
- All user-facing text should use the translation function `t()`
- Translation keys should be descriptive and organized
- Support both Korean and English content
- Use cultural adaptation, not direct translation

### State Management
- Use React Context for global state (auth, language)
- Use local state for component-specific data
- Implement proper loading and error states
- Use React Query for server state (when implemented)

### API Integration
- All API calls go through the `services/api.ts` layer
- Use TypeScript interfaces for request/response types
- Implement proper error handling
- Use loading states for better UX

## 🧪 Testing

### Component Testing
```bash
# Test specific component
npm test -- --testPathPattern=Button

# Test with coverage
npm test -- --coverage
```

### E2E Testing
```bash
# Run E2E tests (when implemented)
npm run test:e2e
```

## 📦 Building and Deployment

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t admitai-korea-frontend .

# Run container
docker run -p 3000:3000 admitai-korea-frontend
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## 🌐 Internationalization

The application supports Korean and English with cultural adaptation:

### Translation Structure
```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  },
  "essays": {
    "title": "Essays",
    "createNew": "Create New Essay",
    "status": {
      "draft": "Draft",
      "submitted": "Submitted"
    }
  }
}
```

### Language Switching
```typescript
const { t, language, toggleLanguage } = useLanguage();
```

## 🔐 Authentication

The app uses JWT-based authentication with the following features:
- Automatic token refresh
- Protected routes
- User role management (student, parent, mentor, admin)
- Session persistence

## 📊 Performance

### Optimization Techniques
- Code splitting with React.lazy()
- Memoization with React.memo() and useMemo()
- Image optimization
- Bundle size monitoring
- Performance monitoring with React DevTools

### Monitoring
- Bundle analyzer for size optimization
- Performance metrics tracking
- Error boundary implementation
- Loading state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Core features implemented
- Bilingual support
- AI essay analysis
- User dashboard
- Community features

---

**Built with ❤️ for Korean students pursuing their dreams in U.S. universities** 