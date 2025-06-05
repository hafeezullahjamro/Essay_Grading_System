# CorestoneGrader - Local Development Setup

## Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
3. **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Clone or Extract Project
```bash
# If using git
git clone <your-repository-url>
cd corestoneGrader

# If using extracted files, navigate to the project directory
cd corestoneGrader
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

#### Required API Keys:
- **OpenAI API Key**: Get from [OpenAI Dashboard](https://platform.openai.com/api-keys)
- **Stripe Keys**: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- **Firebase Config**: Get from [Firebase Console](https://console.firebase.google.com/)

#### Database Setup:
```bash
# Create PostgreSQL database
createdb corestoneGrader

# Update .env with your database credentials
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/corestoneGrader
```

### 4. Database Migration
```bash
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:5000`

## API Keys Setup

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env`: `OPENAI_API_KEY=sk-your-key-here`

### Stripe Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Get your publishable key (starts with `pk_test_`)
3. Get your secret key (starts with `sk_test_`)
4. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your-secret-key
   VITE_STRIPE_PUBLIC_KEY=pk_test_your-public-key
   ```

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Add a web app to your project
4. Enable Google Authentication
5. Add your local domain to authorized domains: `localhost`
6. Get configuration values and add to `.env`:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations

## Project Structure

```
corestoneGrader/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # React hooks
│   │   └── lib/           # Utilities
├── server/                 # Express backend
│   ├── routes.ts          # API endpoints
│   ├── auth.ts            # Authentication
│   ├── storage.ts         # Data layer
│   └── openai.ts          # AI integration
├── shared/                 # Shared types/schemas
└── uploads/               # File uploads
```

## Features

### Authentication
- Traditional username/password registration
- Google OAuth integration via Firebase
- Session-based authentication

### Essay Grading
- AI-powered grading using OpenAI GPT-4
- IB-specific rubrics (Extended Essay, TOK Essay, TOK Exhibition)
- Comprehensive feedback and scoring

### Payment System
- Stripe integration for credit purchases
- Multiple credit bundles available
- Secure payment processing

### Export Functionality
- PDF, CSV, and JSON export formats
- Individual or bulk grading exports
- Professional formatting

## Production Deployment

### Build Application
```bash
npm run build
```

### Environment Variables for Production
Update `.env` with production values:
- Set `NODE_ENV=production`
- Use production database URL
- Use production Stripe keys
- Use production Firebase configuration

### Deploy Options
1. **Docker**: Use included `Dockerfile` and `docker-compose.yml`
2. **Traditional**: Deploy to VPS or cloud provider
3. **Replit**: Deploy directly from Replit

## Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if database exists

**OpenAI API Error**
- Verify API key is correct
- Check account has credits
- Ensure internet connection

**Stripe Payment Error**
- Verify test/live keys match environment
- Check webhook configuration
- Ensure domain is authorized

**Firebase Auth Error**
- Add domain to Firebase authorized domains
- Verify configuration keys
- Check Firebase project settings

### Development Tips

1. **Hot Reload**: Frontend and backend auto-reload on changes
2. **Database**: Use `npm run db:push` after schema changes
3. **Logs**: Check browser console and terminal for errors
4. **Testing**: Use Stripe test cards for payment testing

## Support

For technical support or questions:
- Check the troubleshooting section above
- Review application logs
- Verify all environment variables are set correctly

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys and secrets
- Use HTTPS in production