# Grova - Revolutionary Financial Platform

Grova is a next-generation financial platform designed to revolutionize how people in developing economies access and manage their finances. Built with cutting-edge technology and inclusive design principles, Grova bridges the gap between traditional banking and modern fintech solutions.

## Overview

Grova is a revolutionary financial application designed to compete with global fintech giants like PayPal, Bitcoin, and M-Pesa. The platform features a triple wallet system (Fiat, Crypto, Credits), AI-powered financial coaching, offline capabilities, and community banking features. Built as a full-stack TypeScript application with React frontend and Express backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom configuration for Replit environment

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with JSON responses

### Database Layer
- **Database**: PostgreSQL (via Neon Database serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling via @neondatabase/serverless

## Core Features

### 1. Triple Wallet System
- **Fiat Wallet**: Traditional currencies (KES, USD, INR, etc.)
- **Crypto Wallet**: Cryptocurrency and stablecoins support
- **Credits Wallet**: Community-backed digital credits for offline economies
- Each wallet maintains separate balances with decimal precision

### 2. Peer-to-Peer Bluetooth Transfers
- **Direct Device Connection**: Send money directly between devices via Bluetooth
- **Offline Capability**: Transfer money without internet connectivity
- **Secure Protocol**: Encrypted transfers with digital signatures
- **Device Discovery**: Automatic scanning for nearby Grova devices

### 3. AI Financial Coach
- **Integration**: OpenAI GPT-4o for personalized financial advice
- **Features**: Daily tips, spending analysis, voice commands, multilingual support
- **Context-Aware**: Adapts advice for developing economies and underbanked populations

### 4. Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Security**: HTTPS-only cookies, CSRF protection

### 5. Voice Interface
- **Recognition**: Web Speech API with fallbacks for unsupported browsers
- **Processing**: AI-powered command interpretation and response
- **Accessibility**: Multi-language support with local dialect recognition

### 6. Community Features
- **Groups**: User-created financial communities
- **Proposals**: Democratic decision-making for community funds
- **Cash Agents**: Location-based agent network for cash-in/cash-out

## Data Flow

### User Authentication Flow
1. User accesses application → Landing page
2. Login initiation → Redirect to Replit Auth
3. Auth callback → Session creation in PostgreSQL
4. User data storage → Profile creation/update
5. Wallet initialization → Default wallet creation

### Transaction Processing Flow
1. User initiates transaction → Form validation
2. Wallet balance check → Database verification
3. Transaction creation → Database insertion with pending status
4. Processing logic → Balance updates and status changes
5. Notification system → User feedback and confirmation

### AI Coaching Flow
1. User requests advice → Voice or text input
2. Data collection → Spending patterns and user context
3. OpenAI API call → Personalized advice generation
4. Response formatting → Culturally appropriate recommendations
5. Session storage → Coaching history tracking

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (PostgreSQL serverless)
- **Authentication**: Replit Auth service
- **AI Services**: OpenAI API (GPT-4o model)

### Frontend Libraries
- **UI Components**: Radix UI primitives with shadcn/ui wrapper
- **Icons**: Lucide React icons
- **Social Auth**: React Icons for provider buttons
- **Styling**: Tailwind CSS with PostCSS

### Backend Services
- **WebSocket Support**: ws package for Neon Database compatibility
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for schema validation with Drizzle integration

## Deployment Strategy

### Development Environment
- **Platform**: Replit with custom Vite configuration
- **Hot Reload**: Vite HMR with Express middleware integration
- **Error Handling**: Runtime error overlay for development debugging

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: esbuild compilation with ES module output
- **Serving**: Express server with static file serving for production

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Auth**: Replit Auth configuration via environment variables
- **AI**: OpenAI API key configuration
- **Sessions**: Secure session secret management

### Scalability Considerations
- **Database**: Connection pooling with configurable limits
- **API**: Stateless design for horizontal scaling
- **Frontend**: Static asset optimization and CDN-ready build output

## Recent Major Updates (July 01, 2025)

### Revolutionary Features Complete:
1. **Founders Investor Room** - Complete crowd funding platform with startup idea submission, investor matching, progress tracking, and community voting. Includes business plan uploads, pitch videos, equity management, and funding goal tracking
2. **Banking & Financial Integration** - Comprehensive integration with banks, SACCOs, microfinance institutions, and digital wallets across Africa. Features account linking, real-time balances, transaction routing, and institutional partnerships
3. **Professional Financial Advisors Hub** - Connect with certified financial experts featuring professional portrait integration with real advisor profiles and consultation booking system
4. **QR Code Payment System** - Generate and scan QR codes for instant payments with camera integration and secure payment processing
5. **Investment Portfolio Management** - Complete investment platform with portfolio analytics, performance charts, risk assessment, and investment education modules
6. **Enhanced More Page** - Central hub organizing all platform features with intuitive navigation and quick access to core services
7. **Enhanced AI Coaching** - Improved fallback system with diverse financial tips for developing economies
8. **Mobile-First Navigation** - Updated bottom navigation featuring all major platform sections

### Technical Enhancements:
- Professional portrait assets integrated into advisor profiles
- Recharts integration for investment analytics and portfolio visualization  
- Camera API integration for QR code scanning functionality
- Complete Financial Calculator with loan, investment, and savings calculations
- Comprehensive Budget Planner with category tracking and progress visualization
- Real-time Currency Exchange with live rates for African and global currencies
- Advanced Crypto Tracker with portfolio management and market data
- Enhanced TypeScript typing for all new components
- Improved responsive design across all new features
- Fallback systems for offline functionality

### UI/UX Improvements:
- Gradient backgrounds and modern card designs
- Professional avatar system with fallback initials
- Interactive charts and data visualization
- Contextual badges and status indicators
- Smooth animations and hover effects

## Changelog
- July 01, 2025: Complete platform enhancement with 6 major new features
- July 01, 2025: Initial MVP setup

## User Preferences

Preferred communication style: Simple, everyday language.