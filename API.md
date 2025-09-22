# CalcInvest API Documentation

## Overview

The CalcInvest API provides comprehensive investment calculation and portfolio management services. This RESTful API supports user authentication, investment calculations, portfolio tracking, and personalized recommendations.

**Base URL:** `https://api.calcinvest.com/api/v1`

**API Version:** 1.0

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "country": "US"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 3600
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

#### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "newSecurePassword123"
}
```

## User Management

#### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "country": "US",
    "preferences": {
      "currency": "USD",
      "riskTolerance": "moderate",
      "investmentGoals": ["retirement", "growth"]
    },
    "subscription": {
      "plan": "premium",
      "status": "active",
      "expiresAt": "2024-12-31T23:59:59Z"
    }
  }
}
```

#### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "dateOfBirth": "1990-01-01",
  "country": "US"
}
```

#### PUT /users/preferences
Update user preferences.

**Request Body:**
```json
{
  "currency": "USD",
  "riskTolerance": "aggressive",
  "investmentGoals": ["retirement", "growth", "income"],
  "notifications": {
    "email": true,
    "push": false,
    "marketAlerts": true
  }
}
```

## Investment Calculations

#### POST /calculations/compound-interest
Calculate compound interest growth.

**Request Body:**
```json
{
  "principal": 10000,
  "monthlyContribution": 500,
  "annualInterestRate": 7.5,
  "years": 30,
  "compoundingFrequency": "monthly",
  "inflationRate": 2.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "finalAmount": 1234567.89,
    "totalContributions": 190000,
    "totalInterest": 1044567.89,
    "realValue": 987654.32,
    "yearlyData": [
      {
        "year": 1,
        "balance": 16750.25,
        "contributions": 6000,
        "interest": 750.25,
        "realValue": 16341.71
      }
    ],
    "summary": {
      "effectiveAnnualReturn": 7.5,
      "totalReturnPercentage": 549.77,
      "averageAnnualGrowth": 18.32
    }
  }
}
```

#### POST /calculations/retirement
Calculate retirement planning scenarios.

**Request Body:**
```json
{
  "currentAge": 30,
  "retirementAge": 65,
  "currentSavings": 50000,
  "monthlyContribution": 1000,
  "expectedReturn": 8.0,
  "inflationRate": 2.5,
  "desiredRetirementIncome": 80000,
  "socialSecurityIncome": 24000
}
```

#### POST /calculations/goal-planning
Calculate investment needed to reach financial goals.

**Request Body:**
```json
{
  "goalAmount": 500000,
  "timeHorizon": 20,
  "currentSavings": 25000,
  "expectedReturn": 7.0,
  "inflationRate": 2.5,
  "goalType": "house_purchase"
}
```

#### POST /calculations/tax-optimization
Calculate tax-optimized investment strategies.

**Request Body:**
```json
{
  "income": 100000,
  "taxBracket": 24,
  "state": "CA",
  "investments": [
    {
      "type": "401k",
      "amount": 19500,
      "employerMatch": 5000
    },
    {
      "type": "roth_ira",
      "amount": 6000
    }
  ]
}
```

## Portfolio Management

#### GET /portfolios
Get user's portfolios.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: 'createdAt')
- `sortOrder` (optional): 'asc' or 'desc' (default: 'desc')

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolios": [
      {
        "id": "uuid",
        "name": "Retirement Portfolio",
        "description": "Long-term retirement savings",
        "totalValue": 125000.50,
        "totalReturn": 15.75,
        "riskLevel": "moderate",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "allocations": [
          {
            "assetType": "stocks",
            "percentage": 70,
            "value": 87500.35
          },
          {
            "assetType": "bonds",
            "percentage": 25,
            "value": 31250.13
          },
          {
            "assetType": "cash",
            "percentage": 5,
            "value": 6250.02
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

#### POST /portfolios
Create a new portfolio.

**Request Body:**
```json
{
  "name": "Growth Portfolio",
  "description": "Aggressive growth strategy",
  "riskLevel": "aggressive",
  "allocations": [
    {
      "assetType": "stocks",
      "percentage": 85
    },
    {
      "assetType": "bonds",
      "percentage": 10
    },
    {
      "assetType": "alternatives",
      "percentage": 5
    }
  ]
}
```

#### GET /portfolios/:id
Get specific portfolio details.

#### PUT /portfolios/:id
Update portfolio.

#### DELETE /portfolios/:id
Delete portfolio.

#### GET /portfolios/:id/performance
Get portfolio performance history.

**Query Parameters:**
- `period`: '1M', '3M', '6M', '1Y', '5Y', 'ALL'
- `interval`: 'daily', 'weekly', 'monthly'

## Market Data

#### GET /market/quotes
Get real-time market quotes.

**Query Parameters:**
- `symbols`: Comma-separated list of symbols (e.g., 'AAPL,GOOGL,MSFT')

**Response:**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "symbol": "AAPL",
        "price": 175.50,
        "change": 2.25,
        "changePercent": 1.30,
        "volume": 45678900,
        "marketCap": 2750000000000,
        "pe": 28.5,
        "lastUpdated": "2024-01-15T16:00:00Z"
      }
    ]
  }
}
```

#### GET /market/historical
Get historical market data.

**Query Parameters:**
- `symbol`: Stock symbol
- `period`: '1M', '3M', '6M', '1Y', '5Y'
- `interval`: 'daily', 'weekly', 'monthly'

#### GET /market/indices
Get major market indices.

#### GET /market/sectors
Get sector performance data.

## Recommendations

#### GET /recommendations
Get personalized investment recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "uuid",
        "type": "asset_allocation",
        "title": "Rebalance Your Portfolio",
        "description": "Your stock allocation has grown to 85%. Consider rebalancing to your target 70%.",
        "priority": "medium",
        "potentialImpact": {
          "riskReduction": 15,
          "expectedReturn": 0.5,
          "timeToImplement": "1 day"
        },
        "actionItems": [
          {
            "action": "Sell $18,750 in stocks",
            "reason": "Reduce overweight position"
          },
          {
            "action": "Buy $18,750 in bonds",
            "reason": "Restore target allocation"
          }
        ],
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### POST /recommendations/:id/accept
Accept a recommendation.

#### POST /recommendations/:id/dismiss
Dismiss a recommendation.

## File Upload

#### POST /upload/portfolio
Upload portfolio data from CSV/Excel file.

**Request:** Multipart form data with file

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "fileName": "portfolio.csv",
    "recordsProcessed": 150,
    "recordsImported": 148,
    "errors": [
      {
        "row": 15,
        "error": "Invalid symbol: XYZ123"
      }
    ]
  }
}
```

## Subscription Management

#### GET /subscription
Get current subscription details.

#### POST /subscription/upgrade
Upgrade subscription plan.

#### POST /subscription/cancel
Cancel subscription.

#### GET /subscription/usage
Get API usage statistics.

## Webhooks

#### POST /webhooks
Create webhook endpoint.

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["portfolio.updated", "recommendation.created"],
  "secret": "webhook-secret"
}
```

#### GET /webhooks
List webhook endpoints.

#### DELETE /webhooks/:id
Delete webhook endpoint.

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Code Reference

- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_REQUIRED`: Authentication token required
- `INVALID_TOKEN`: Invalid or expired token
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `DUPLICATE_RESOURCE`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `SUBSCRIPTION_REQUIRED`: Premium subscription required
- `CALCULATION_ERROR`: Error in financial calculations
- `MARKET_DATA_UNAVAILABLE`: Market data service unavailable

## Rate Limiting

API requests are rate limited based on subscription plan:

- **Free Plan**: 100 requests/hour
- **Basic Plan**: 1,000 requests/hour
- **Premium Plan**: 10,000 requests/hour
- **Enterprise Plan**: Unlimited

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

Official SDKs are available for:

- JavaScript/TypeScript: `npm install @calcinvest/sdk`
- Python: `pip install calcinvest-sdk`
- Java: Maven/Gradle dependency
- C#: NuGet package

## Support

For API support:

- Documentation: https://docs.calcinvest.com
- Support Email: api-support@calcinvest.com
- Status Page: https://status.calcinvest.com
- GitHub Issues: https://github.com/calcinvest/api-issues

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Authentication and user management
- Investment calculations
- Portfolio management
- Market data integration
- Recommendation engine

### v1.0.1 (2024-01-15)
- Added tax optimization calculations
- Enhanced error handling
- Improved rate limiting
- Bug fixes and performance improvements