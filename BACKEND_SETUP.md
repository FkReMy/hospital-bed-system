# Backend Setup Guide

## Overview

This guide explains how to set up and run the .NET backend server for the Hospital Bed Management System (HBMS). The frontend requires the backend API to be running to function properly.

## Critical: Backend Must Be Running

**Important:** The frontend application will not work without the backend server running. You will see `ECONNREFUSED` errors in the browser console if the backend is not started.

The frontend is configured to proxy API requests to `https://localhost:7150` (the default ASP.NET Core HTTPS development port).

## Prerequisites

Before starting the backend, ensure you have:

- **.NET 8 SDK** or later installed
  - Download from: https://dotnet.microsoft.com/download
  - Verify installation: `dotnet --version`
- **SQL Server** (LocalDB, Express, or Full Edition)
  - For development, SQL Server Express LocalDB is recommended
  - Download from: https://www.microsoft.com/sql-server/sql-server-downloads
- **Visual Studio 2022** (recommended) or **Visual Studio Code** with C# extensions

## Backend Repository

According to the project documentation, the backend and database are tracked in a **separate repository**. 

If you don't have access to the backend repository yet:

1. Contact your project administrator for access to the backend repository
2. Clone the backend repository to your local machine
3. Follow the backend-specific README instructions in that repository

## Starting the Backend Server

### Option 1: Using Visual Studio

1. Open the backend solution file (`.sln`) in Visual Studio
2. Set the API project as the startup project (right-click → Set as Startup Project)
3. Press **F5** or click the **Run** button to start the server
4. The server should start on `https://localhost:7150` by default

### Option 2: Using Command Line

```bash
# Navigate to the backend API project directory
cd path/to/backend/api/project

# Restore dependencies
dotnet restore

# Run the application
dotnet run
```

### Option 3: Using Visual Studio Code

1. Open the backend project folder in VS Code
2. Install the C# extension if not already installed
3. Press **F5** to start debugging
4. Or use the terminal: `dotnet run`

## Verifying the Backend is Running

Once started, you should see output similar to:

```
Now listening on: https://localhost:7150
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

### Testing the Backend

You can verify the backend is working by:

1. Opening your browser and navigating to: `https://localhost:7150/swagger`
   - This should display the Swagger API documentation
2. Or using curl:
   ```bash
   curl -k https://localhost:7150/api/health
   ```

## Configuring Backend Port

If your backend runs on a **different port** than `7150`:

1. Note the actual port number shown in the console when starting the backend
2. Update the frontend's `vite.config.js` file:
   ```javascript
   proxy: {
     '/api': {
       target: 'https://localhost:YOUR_PORT_HERE', // Change this
       changeOrigin: true,
       secure: false,
     },
     '/hub': {
       target: 'wss://localhost:YOUR_PORT_HERE', // Change this too
       ws: true,
       changeOrigin: true,
       secure: false,
     },
   }
   ```
3. Restart the frontend dev server after making this change

## Common Issues

### Issue: Backend won't start

**Solution:**
- Ensure .NET 8 SDK is installed: `dotnet --version`
- Check if another process is using port 7150: `netstat -ano | findstr :7150` (Windows) or `lsof -i :7150` (Linux/Mac)
- Check the backend logs for specific error messages

### Issue: Database connection errors

**Solution:**
- Ensure SQL Server is running
- Verify the connection string in `appsettings.json` or `appsettings.Development.json`
- Run database migrations if needed: `dotnet ef database update`

### Issue: SSL certificate errors

**Solution:**
- Trust the ASP.NET Core HTTPS development certificate:
  ```bash
  dotnet dev-certs https --trust
  ```

### Issue: CORS errors

**Solution:**
- Ensure the backend CORS policy allows the frontend origin (`http://localhost:5000`)
- Check the `Program.cs` or `Startup.cs` for CORS configuration

## Running Both Frontend and Backend Simultaneously

To run the full application:

1. **Terminal 1:** Start the backend server
   ```bash
   cd path/to/backend
   dotnet run
   ```

2. **Terminal 2:** Start the frontend dev server
   ```bash
   cd path/to/hospital-bed-frontend
   npm run dev
   # or
   yarn dev
   ```

3. **Access the application:** Open `http://localhost:5000` in your browser

## Environment Variables

The backend may require environment variables for:
- Database connection strings
- JWT secret keys
- Azure SignalR connection strings
- External service API keys

Refer to the backend repository's documentation for specific configuration requirements.

## Production Deployment

For production deployment:
- The backend should be deployed to Azure App Service or similar
- Update the frontend's proxy configuration to point to the production API URL
- Ensure proper SSL certificates are configured
- Follow the security guidelines in the main README

## Getting Help

If you continue to experience issues:
1. Check the backend repository's README and documentation
2. Review backend console output for error messages
3. Check browser console for detailed error messages
4. Contact the development team or project administrator

## Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core Documentation](https://docs.microsoft.com/ef/core)
- [.NET CLI Reference](https://docs.microsoft.com/dotnet/core/tools)
