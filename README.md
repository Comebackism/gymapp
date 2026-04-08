# Gym App - Secure Login System

A secure Next.js application with authentication features built following modern security best practices.

## Features

### 🔐 Security Features
- **Password Hashing**: Uses bcrypt with 12 salt rounds for secure password storage
- **JWT Authentication**: Secure token-based authentication with expiration
- **Rate Limiting**: Prevents brute force attacks with IP-based rate limiting
- **Input Sanitization**: Protects against XSS and injection attacks
- **CSRF Protection**: Cross-Site Request Forgery protection
- **Secure Headers**: Comprehensive security headers implementation
- **Session Management**: Secure cookie handling with HttpOnly, Secure, and SameSite flags

### 🎨 UI Features
- **Modern Design**: Clean, responsive interface using Tailwind CSS
- **Form Validation**: Client-side validation with Zod schema
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading indicators
- **Password Visibility Toggle**: Show/hide password functionality

### 🛠 Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Custom JWT implementation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gymapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update the JWT secret in `.env.local`:
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

For testing purposes, you can use these credentials:

- **Email**: `admin@gymapp.com`
- **Password**: `SecurePass123!`

- **Email**: `user@gymapp.com`  
- **Password**: `SecurePass123!`

## Security Implementation Details

### Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Minimum password requirements: 8+ characters, uppercase, lowercase, numbers, special characters
- Password validation on both client and server side

### Authentication Flow
1. User submits login form with email and password
2. Server validates inputs and applies rate limiting
3. Credentials are verified against hashed passwords
4. JWT token is generated upon successful authentication
5. Token is stored in secure HttpOnly cookie
6. Subsequent requests include the token for authentication

### Rate Limiting
- 5 login attempts per IP address per 15 minutes
- Automatic blocking after threshold is reached
- Configurable limits and time windows

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Project Structure

```
gymapp/
├── app/
│   ├── api/auth/login/          # Login API route
│   ├── dashboard/               # Protected dashboard
│   ├── login/                   # Login page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/ui/               # Reusable UI components
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── security.ts             # Security functions
│   └── utils.ts                # General utilities
├── middleware.ts               # Authentication middleware
└── .env.local                  # Environment variables
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Production Considerations

1. **Environment Variables**: Always use strong, unique secrets in production
2. **Database**: Replace mock user data with a proper database
3. **HTTPS**: Always use HTTPS in production
4. **Monitoring**: Implement logging and monitoring for security events
5. **Dependencies**: Regularly update dependencies for security patches
6. **Content Security Policy**: Implement CSP headers for additional XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
