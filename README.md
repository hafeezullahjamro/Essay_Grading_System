# CorestoneGrader

A production-ready AI-powered essay grading platform for International Baccalaureate (IB) students and educators. CorestoneGrader provides intelligent scoring, comprehensive feedback, and professional assessment using authentic IB rubrics.

## Features

### Core Functionality
- **AI-Powered Essay Grading**: Uses OpenAI GPT-4o with authentic IB assessment criteria
- **Three IB Essay Types**: Extended Essay, TOK Essay, and TOK Exhibition
- **Comprehensive Feedback**: Detailed scoring, feedback, and improvement recommendations
- **File Upload Support**: Accepts PDF, DOCX, and TXT file formats
- **Real-time Processing**: Fast essay analysis and instant results

### User Management
- **Secure Authentication**: Username/password authentication with session management
- **Credit System**: Flexible credit-based usage model
- **Purchase History**: Complete transaction tracking
- **User Dashboard**: Analytics and usage statistics
- **Admin Panel**: User management and system monitoring

### Technical Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Production Ready**: Docker support, health monitoring, and deployment scripts
- **Database Integration**: PostgreSQL with Drizzle ORM
- **File Processing**: Advanced text extraction from multiple document formats
- **Security**: Rate limiting, SSL support, and secure headers

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Development Setup

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd corestone-grader
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
npm run db:push
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Production Deployment

### Option 1: Docker Deployment (Recommended)

1. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

2. **Or build manually**
```bash
docker build -t corestone-grader .
docker run -p 5000:5000 --env-file .env corestone-grader
```

### Option 2: Manual Deployment

1. **Run deployment script**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

2. **Start the application**
```bash
npm run build
npm start
```

### Option 3: Cloud Platform Deployment

The application is compatible with major cloud platforms:

- **Vercel/Netlify**: Frontend deployment with serverless functions
- **Heroku**: Full-stack deployment with Postgres addon
- **AWS/Google Cloud**: Container deployment with managed databases
- **DigitalOcean**: App Platform or Droplet deployment

## Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/corestone_grader

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Session Security
SESSION_SECRET=your-very-secure-session-secret-key-here

# Application
NODE_ENV=production
PORT=5000
```

### Optional Environment Variables

```env
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key-here

# Firebase Google Authentication
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

## API Documentation

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Essay Grading
- `POST /api/grade` - Submit essay for grading
- `GET /api/rubrics` - Get available rubrics
- `POST /api/upload` - Upload essay file

### User Management
- `GET /api/credits` - Get user credits
- `POST /api/purchase` - Purchase credit bundle
- `GET /api/purchases` - Get purchase history

### System
- `GET /api/health` - Health check endpoint

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Wouter** for routing
- **TanStack Query** for data fetching
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Passport.js** for authentication
- **Drizzle ORM** for database operations
- **OpenAI API** for essay grading
- **Express Session** for session management

### Database
- **PostgreSQL** for data persistence
- **Drizzle Schema** for type-safe queries
- **Connection pooling** for performance
- **Automated migrations** with Drizzle Kit

## IB Assessment Integration

CorestoneGrader uses authentic IB assessment criteria extracted from official documents:

### Extended Essay (EE)
- Knowledge and Understanding (6 points)
- Critical Thinking (12 points)
- Formal Presentation (4 points)
- Engagement (6 points)
- Total: 28 points

### Theory of Knowledge Essay (TOK)
- Understanding Knowledge Questions (10 points)
- Quality of Analysis (10 points)
- Organization and Presentation (4 points)
- Total: 24 points

### TOK Exhibition
- Object Selection and Context (10 points)
- Knowledge Question Development (10 points)
- Analysis and Evaluation (10 points)
- Total: 30 points

## Security Features

- **Rate Limiting**: API endpoint protection
- **SSL/TLS**: HTTPS encryption
- **Secure Headers**: XSS and CSRF protection
- **Session Management**: Secure cookie handling
- **Input Validation**: Zod schema validation
- **File Upload Security**: Type and size validation

## Monitoring and Health Checks

- **Health Endpoint**: `/api/health` for monitoring
- **Docker Health Checks**: Built-in container monitoring
- **Application Metrics**: Uptime and performance tracking
- **Error Logging**: Comprehensive error tracking

## File Processing

Supported file formats:
- **PDF**: Text extraction with pdfjs-dist
- **DOCX**: Document processing with mammoth
- **TXT**: Plain text files

Maximum file size: 10MB per upload

## Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

### Testing
- **Health Checks**: Automated endpoint testing
- **Type Checking**: Compile-time validation
- **Manual Testing**: Comprehensive user flow testing

## Support

### Getting API Keys

1. **OpenAI API Key**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create new secret key
   - Add to `OPENAI_API_KEY` environment variable

2. **Stripe Keys** (Optional)
   - Visit [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy publishable key to `VITE_STRIPE_PUBLIC_KEY`
   - Copy secret key to `STRIPE_SECRET_KEY`

3. **Firebase Keys** (Optional)
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Create new project and web app
   - Copy config values to respective environment variables

### Troubleshooting

**Application won't start**
- Check environment variables are set correctly
- Verify database connection
- Ensure OpenAI API key is valid

**Essay grading fails**
- Verify OpenAI API key has sufficient credits
- Check internet connectivity
- Review API usage limits

**File upload issues**
- Ensure file size is under 10MB
- Verify file format is supported (PDF, DOCX, TXT)
- Check upload directory permissions

## License

MIT License - See LICENSE file for details

## Version

Current Version: 1.0.0
Last Updated: June 2025

---

Built with ❤️ for IB students and educators worldwide.
# Essay_Grading_System
React base full stack AI Essay Grading System
