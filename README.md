# Real Estate Agency Management System

A comprehensive web application for managing real estate agency operations, built with Spring Boot backend and Next.js frontend.

## Project Structure

### Backend (Spring Boot)

#### Configuration Files
- `pom.xml`: Maven configuration file containing project dependencies and build settings
- `application.properties`: Application configuration file with database, JWT, and file upload settings

#### Entities
- `Admin.java`: Represents admin users with fields for authentication and personal information
- `Demande.java`: Represents client property demands with fields for property requirements
- `Offre.java`: Represents property offers with fields for property details and owner information

#### DTOs (Data Transfer Objects)
- `AdminDto.java`: DTO for admin data transfer
- `DemandeDto.java`: DTO for client demand data transfer
- `OffreDto.java`: DTO for property offer data transfer
- `AuthenticationRequest.java`: DTO for login requests
- `AuthenticationResponse.java`: DTO for authentication responses
- `RegisterRequest.java`: DTO for admin registration
- `DashboardStatsDto.java`: DTO for dashboard statistics

#### Controllers
- `AuthController.java`: Handles authentication endpoints (login, register)
- `AdminController.java`: Manages admin-related operations
- `DemandeController.java`: Handles client demand operations
- `OffreController.java`: Manages property offer operations
- `DashboardController.java`: Provides dashboard statistics endpoints

#### Services
- `AuthenticationService.java`: Handles authentication logic
- `AdminService.java`: Manages admin-related business logic
- `DemandeService.java`: Handles demand-related business logic
- `OffreService.java`: Manages offer-related business logic
- `DashboardService.java`: Provides dashboard statistics calculations

#### Repositories
- `AdminRepository.java`: Data access layer for admin entities
- `DemandeRepository.java`: Data access layer for demand entities
- `OffreRepository.java`: Data access layer for offer entities

#### Security
- `SecurityConfig.java`: Spring Security configuration
- `JwtAuthenticationFilter.java`: JWT authentication filter
- `JwtService.java`: JWT token generation and validation
- `ApplicationConfig.java`: Application security configuration

### Frontend (Next.js)

#### Components
- `Sidebar.tsx`: Navigation sidebar component
- `DataTable.tsx`: Reusable data table component
- `PropertyOfferForm.tsx`: Form for creating/editing property offers
- `Modal.tsx`: Reusable modal component
- `ClientDemandForm.tsx`: Form for creating/editing client demands

#### Pages
- `dashboard/page.tsx`: Dashboard page showing statistics
- `offers/page.tsx`: Property offers management page
- `demands/page.tsx`: Client demands management page

#### Layouts
- `(authenticated)/layout.tsx`: Layout for authenticated pages

## Features

### Authentication
- JWT-based authentication
- Role-based access control
- Secure password handling

### Admin Management
- Admin registration
- Admin profile management
- Role management

### Property Offers
- Create, read, update, delete property offers
- Upload property photos
- Filter and search offers
- Property details management

### Client Demands
- Create, read, update, delete client demands
- Filter and search demands
- Demand status tracking

### Dashboard
- Total demands and offers statistics
- Property type distribution
- Average surface and price calculations
- Visual data representation

## Technical Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT Authentication
- Maven

### Frontend
- Next.js
- TypeScript
- React
- Tailwind CSS
- Shadcn UI

## Getting Started

1. Clone the repository
2. Configure the database in `application.properties`
3. Run the Spring Boot application
4. Install frontend dependencies
5. Start the Next.js development server

## Security Features
- JWT token-based authentication
- Password encryption
- Role-based access control
- Secure file upload handling
- CORS configuration
- Input validation

## API Endpoints

### Authentication
- POST `/auth/register`: Register new admin
- POST `/auth/login`: Admin login

### Admin
- GET `/admin/profile`: Get admin profile
- PUT `/admin/profile`: Update admin profile
- PUT `/admin/password`: Change password

### Demands
- GET `/demandes`: List all demands
- POST `/demandes`: Create new demand
- GET `/demandes/{id}`: Get demand details
- PUT `/demandes/{id}`: Update demand
- DELETE `/demandes/{id}`: Delete demand

### Offers
- GET `/offres`: List all offers
- POST `/offres`: Create new offer
- GET `/offres/{id}`: Get offer details
- PUT `/offres/{id}`: Update offer
- DELETE `/offres/{id}`: Delete offer
- POST `/offres/{id}/photos`: Upload offer photos

### Dashboard
- GET `/dashboard/stats`: Get dashboard statistics 