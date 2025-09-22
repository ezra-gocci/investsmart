# CalcInvest Development Guide

## Overview

This guide covers the development setup, workflows, and best practices for the CalcInvest investment calculation platform. The application is built with React (frontend), Node.js/Express (backend), PostgreSQL (database), and Redis (cache).

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git
- VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Docker
  - GitLens

### Initial Setup

1. **Clone the repository:**

```bash
git clone https://github.com/your-org/calcinvest.git
cd calcinvest
```

2. **Install dependencies:**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

3. **Environment setup:**

```bash
# Copy environment template
cp .env.example .env

# Edit with your local settings
nano .env
```

4. **Start development environment:**

```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start services individually
npm run dev:backend    # Backend on port 3000
npm run dev:frontend   # Frontend on port 5173
```

5. **Initialize database:**

```bash
# Run migrations
npm run migrate

# Seed development data
npm run seed:dev
```

6. **Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

## Project Structure

```
calcinvest/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API and business logic
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles and themes
│   │   └── __tests__/      # Frontend tests
│   ├── package.json
│   └── vite.config.ts      # Vite configuration
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── config/         # Configuration files
│   │   └── __tests__/      # Backend tests
│   ├── migrations/         # Database migrations
│   ├── seeds/              # Database seed files
│   ├── package.json
│   └── tsconfig.json       # TypeScript configuration
├── nginx/                   # Nginx configuration files
├── docs/                    # Additional documentation
├── scripts/                 # Build and deployment scripts
├── docker-compose.yml       # Development Docker setup
├── docker-compose.prod.yml  # Production Docker setup
├── .env.example            # Environment variables template
├── .gitignore
├── README.md
├── API.md                  # API documentation
├── DEPLOYMENT.md           # Deployment guide
└── DEVELOPMENT.md          # This file
```

## Development Workflow

### Git Workflow

We use Git Flow with the following branches:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `hotfix/*`: Critical bug fixes
- `release/*`: Release preparation branches

**Creating a new feature:**

```bash
# Create and switch to feature branch
git checkout develop
git pull origin develop
git checkout -b feature/investment-calculator

# Make your changes and commit
git add .
git commit -m "feat: add compound interest calculator"

# Push and create pull request
git push origin feature/investment-calculator
```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(calculator): add retirement planning calculator
fix(auth): resolve JWT token expiration issue
docs(api): update authentication endpoints documentation
test(utils): add unit tests for formatters
```

### Code Style and Linting

**ESLint and Prettier configuration:**

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

**Pre-commit hooks:**

```bash
# Install husky for git hooks
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

## Frontend Development

### Technology Stack

- **React 18**: UI library with hooks and functional components
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Zustand**: Client state management
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Chart.js**: Data visualization
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Component Development

**Component structure:**

```typescript
// components/Calculator/CompoundInterestCalculator.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  principal: z.number().min(0),
  monthlyContribution: z.number().min(0),
  annualRate: z.number().min(0).max(100),
  years: z.number().min(1).max(50),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onCalculate: (data: FormData) => void;
  loading?: boolean;
}

export const CompoundInterestCalculator: React.FC<Props> = ({
  onCalculate,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onCalculate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Initial Investment
        </label>
        <input
          type="number"
          {...register('principal', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.principal && (
          <p className="mt-1 text-sm text-red-600">{errors.principal.message}</p>
        )}
      </div>
      
      {/* Additional form fields */}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
};
```

### State Management

**Zustand store example:**

```typescript
// stores/calculatorStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CalculatorState {
  results: CalculationResult[];
  loading: boolean;
  error: string | null;
  addResult: (result: CalculationResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
}

export const useCalculatorStore = create<CalculatorState>()()
  devtools(
    (set) => ({
      results: [],
      loading: false,
      error: null,
      addResult: (result) =>
        set((state) => ({ results: [...state.results, result] })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearResults: () => set({ results: [] }),
    }),
    { name: 'calculator-store' }
  )
);
```

### API Integration

**React Query setup:**

```typescript
// hooks/useCalculations.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useCompoundInterestCalculation = () => {
  return useMutation({
    mutationFn: apiService.calculateCompoundInterest,
    onSuccess: (data) => {
      // Handle success
      console.log('Calculation completed:', data);
    },
    onError: (error) => {
      // Handle error
      console.error('Calculation failed:', error);
    },
  });
};

export const useUserPortfolios = () => {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: apiService.getPortfolios,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Testing

**Component testing with React Testing Library:**

```typescript
// __tests__/components/Calculator.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompoundInterestCalculator } from '../components/Calculator/CompoundInterestCalculator';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CompoundInterestCalculator', () => {
  it('should render form fields', () => {
    const mockOnCalculate = jest.fn();
    
    render(
      <CompoundInterestCalculator onCalculate={mockOnCalculate} />,
      { wrapper: createWrapper() }
    );
    
    expect(screen.getByLabelText(/initial investment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly contribution/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });
  
  it('should call onCalculate with form data', async () => {
    const mockOnCalculate = jest.fn();
    
    render(
      <CompoundInterestCalculator onCalculate={mockOnCalculate} />,
      { wrapper: createWrapper() }
    );
    
    fireEvent.change(screen.getByLabelText(/initial investment/i), {
      target: { value: '10000' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    
    await waitFor(() => {
      expect(mockOnCalculate).toHaveBeenCalledWith(
        expect.objectContaining({ principal: 10000 })
      );
    });
  });
});
```

## Backend Development

### Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Prisma**: Database ORM
- **JWT**: Authentication
- **Joi**: Request validation
- **Winston**: Logging
- **Jest**: Testing framework
- **Swagger**: API documentation

### API Development

**Controller example:**

```typescript
// controllers/calculationController.ts
import { Request, Response } from 'express';
import { calculationService } from '../services/calculationService';
import { validateCompoundInterestInput } from '../utils/validators';
import { logger } from '../utils/logger';

export const calculateCompoundInterest = async (
  req: Request,
  res: Response
) => {
  try {
    const { error, value } = validateCompoundInterestInput(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.details,
        },
      });
    }
    
    const result = await calculationService.calculateCompoundInterest(value);
    
    // Log calculation for analytics
    logger.info('Compound interest calculation completed', {
      userId: req.user?.id,
      input: value,
      result: result.finalAmount,
    });
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Calculation error:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'CALCULATION_ERROR',
        message: 'Failed to perform calculation',
      },
    });
  }
};
```

**Service layer:**

```typescript
// services/calculationService.ts
import { CompoundInterestInput, InvestmentResult } from '../types/investment';
import { cacheService } from './cacheService';

class CalculationService {
  async calculateCompoundInterest(
    input: CompoundInterestInput
  ): Promise<InvestmentResult> {
    const cacheKey = `compound_interest_${JSON.stringify(input)}`;
    
    // Check cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const {
      principal,
      monthlyContribution,
      annualInterestRate,
      years,
      compoundingFrequency,
    } = input;
    
    const monthlyRate = annualInterestRate / 100 / 12;
    const totalMonths = years * 12;
    const yearlyData = [];
    
    let balance = principal;
    
    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly contribution
      balance += monthlyContribution;
      
      // Apply compound interest
      balance *= (1 + monthlyRate);
      
      // Store yearly data
      if (month % 12 === 0) {
        const year = month / 12;
        yearlyData.push({
          year,
          balance: Math.round(balance * 100) / 100,
          contributions: principal + (monthlyContribution * month),
          interest: balance - principal - (monthlyContribution * month),
        });
      }
    }
    
    const result: InvestmentResult = {
      finalAmount: Math.round(balance * 100) / 100,
      totalContributions: principal + (monthlyContribution * totalMonths),
      totalInterest: balance - principal - (monthlyContribution * totalMonths),
      yearlyData,
      summary: {
        effectiveAnnualReturn: annualInterestRate,
        totalReturnPercentage: ((balance / principal) - 1) * 100,
        averageAnnualGrowth: Math.pow(balance / principal, 1 / years) - 1,
      },
    };
    
    // Cache result for 1 hour
    await cacheService.set(cacheKey, JSON.stringify(result), 3600);
    
    return result;
  }
}

export const calculationService = new CalculationService();
```

### Database Management

**Prisma schema:**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String
  lastName  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  portfolios Portfolio[]
  calculations Calculation[]
  
  @@map("users")
}

model Portfolio {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  allocations AssetAllocation[]
  
  @@map("portfolios")
}

model Calculation {
  id        String   @id @default(cuid())
  type      String
  input     Json
  result    Json
  userId    String?
  createdAt DateTime @default(now())
  
  user      User?    @relation(fields: [userId], references: [id])
  
  @@map("calculations")
}
```

**Migration example:**

```sql
-- migrations/001_create_users_table.sql
CREATE TABLE users (
  id VARCHAR(25) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Testing

**Unit testing:**

```typescript
// __tests__/services/calculationService.test.ts
import { calculationService } from '../services/calculationService';
import { CompoundInterestInput } from '../types/investment';

describe('CalculationService', () => {
  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest correctly', async () => {
      const input: CompoundInterestInput = {
        principal: 10000,
        monthlyContribution: 500,
        annualInterestRate: 7,
        years: 10,
        compoundingFrequency: 'monthly',
      };
      
      const result = await calculationService.calculateCompoundInterest(input);
      
      expect(result.finalAmount).toBeGreaterThan(input.principal);
      expect(result.totalContributions).toBe(70000); // 10000 + (500 * 12 * 10)
      expect(result.yearlyData).toHaveLength(10);
      expect(result.yearlyData[0].year).toBe(1);
    });
    
    it('should handle zero monthly contribution', async () => {
      const input: CompoundInterestInput = {
        principal: 10000,
        monthlyContribution: 0,
        annualInterestRate: 7,
        years: 10,
        compoundingFrequency: 'monthly',
      };
      
      const result = await calculationService.calculateCompoundInterest(input);
      
      expect(result.totalContributions).toBe(10000);
      expect(result.finalAmount).toBeCloseTo(19671.51, 2);
    });
  });
});
```

**Integration testing:**

```typescript
// __tests__/integration/calculations.test.ts
import request from 'supertest';
import { app } from '../app';
import { createTestUser, getAuthToken } from '../utils/testHelpers';

describe('POST /api/calculations/compound-interest', () => {
  let authToken: string;
  
  beforeAll(async () => {
    const user = await createTestUser();
    authToken = await getAuthToken(user.id);
  });
  
  it('should calculate compound interest', async () => {
    const input = {
      principal: 10000,
      monthlyContribution: 500,
      annualInterestRate: 7,
      years: 10,
      compoundingFrequency: 'monthly',
    };
    
    const response = await request(app)
      .post('/api/calculations/compound-interest')
      .set('Authorization', `Bearer ${authToken}`)
      .send(input)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.finalAmount).toBeGreaterThan(input.principal);
    expect(response.body.data.yearlyData).toHaveLength(10);
  });
  
  it('should return validation error for invalid input', async () => {
    const input = {
      principal: -1000, // Invalid negative value
      monthlyContribution: 500,
      annualInterestRate: 7,
      years: 10,
    };
    
    const response = await request(app)
      .post('/api/calculations/compound-interest')
      .set('Authorization', `Bearer ${authToken}`)
      .send(input)
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

## Development Tools

### VS Code Configuration

**.vscode/settings.json:**

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

**.vscode/launch.json:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Database Tools

**Prisma Studio:**

```bash
# Open database GUI
npx prisma studio
```

**Database seeding:**

```typescript
// seeds/dev.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  });
  
  // Create sample portfolios
  await prisma.portfolio.create({
    data: {
      name: 'Conservative Portfolio',
      description: 'Low-risk investment portfolio',
      userId: testUser.id,
      allocations: {
        create: [
          { assetType: 'bonds', percentage: 60 },
          { assetType: 'stocks', percentage: 30 },
          { assetType: 'cash', percentage: 10 },
        ],
      },
    },
  });
  
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Performance and Optimization

### Frontend Optimization

1. **Code splitting:**

```typescript
// Lazy load components
const CalculatorPage = lazy(() => import('../pages/CalculatorPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));

// Use in router
<Route
  path="/calculator"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <CalculatorPage />
    </Suspense>
  }
/>
```

2. **Bundle analysis:**

```bash
# Analyze bundle size
npm run build:analyze
```

3. **Performance monitoring:**

```typescript
// utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};
```

### Backend Optimization

1. **Database query optimization:**

```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  },
});

// Use pagination
const portfolios = await prisma.portfolio.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
});
```

2. **Caching strategies:**

```typescript
// Cache expensive calculations
const cacheKey = `calculation_${userId}_${JSON.stringify(input)}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await performCalculation(input);
await redis.setex(cacheKey, 3600, JSON.stringify(result));

return result;
```

## Debugging

### Frontend Debugging

1. **React Developer Tools:**
   - Install browser extension
   - Use Profiler to identify performance issues
   - Inspect component state and props

2. **Console debugging:**

```typescript
// Debug hooks
const useDebugValue = (value: any, label: string) => {
  React.useDebugValue(value, (val) => `${label}: ${JSON.stringify(val)}`);
};

// Debug renders
const useWhyDidYouUpdate = (name: string, props: Record<string, any>) => {
  const previous = useRef<Record<string, any>>();
  
  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedProps: Record<string, any> = {};
      
      allKeys.forEach((key) => {
        if (previous.current![key] !== props[key]) {
          changedProps[key] = {
            from: previous.current![key],
            to: props[key],
          };
        }
      });
      
      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }
    
    previous.current = props;
  });
};
```

### Backend Debugging

1. **Logging:**

```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

2. **Request debugging:**

```typescript
// middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  });
  
  next();
};
```

## Deployment and CI/CD

### GitHub Actions

**.github/workflows/ci.yml:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: calcinvest_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run linting
        run: |
          cd backend && npm run lint
          cd ../frontend && npm run lint
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/calcinvest_test
          REDIS_URL: redis://localhost:6379
      
      - name: Build applications
        run: |
          cd backend && npm run build
          cd ../frontend && npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Add deployment script here
          echo "Deploying to production..."
```

### Docker Development

**Multi-stage Dockerfile for backend:**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

## Best Practices

### Code Quality

1. **TypeScript strict mode:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

2. **ESLint configuration:**

```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Security

1. **Environment variables:**
   - Never commit secrets to version control
   - Use different .env files for different environments
   - Validate environment variables on startup

2. **Input validation:**
   - Validate all user inputs
   - Sanitize data before database operations
   - Use parameterized queries

3. **Authentication:**
   - Implement proper JWT handling
   - Use secure session management
   - Implement rate limiting

### Performance

1. **Database:**
   - Use indexes for frequently queried fields
   - Implement connection pooling
   - Monitor slow queries

2. **Caching:**
   - Cache expensive calculations
   - Use Redis for session storage
   - Implement proper cache invalidation

3. **Frontend:**
   - Implement code splitting
   - Optimize images and assets
   - Use React.memo for expensive components

## Troubleshooting

### Common Issues

1. **Port conflicts:**

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

2. **Database connection issues:**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U calcinvest_user -d calcinvest
```

3. **Node modules issues:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

4. **TypeScript compilation errors:**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Clear TypeScript cache
npx tsc --build --clean
```

## Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) - API testing
- [DBeaver](https://dbeaver.io/) - Database management
- [Redis Commander](https://github.com/joeferner/redis-commander) - Redis GUI

### Learning Resources
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

For more detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).