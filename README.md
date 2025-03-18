# TheBartender - Cocktail Recipe App

## Overview

TheBartender is a modern web application for discovering and exploring cocktail recipes. Built with React and Tailwind CSS on the frontend, and Laravel with GraphQL on the backend, it provides an elegant and intuitive interface for cocktail enthusiasts.

## Tech Stack

- **Frontend**: React, Apollo Client, Tailwind CSS
- **Backend**: Laravel, GraphQL
- **Database**: MySQL
- **External API**: TheCocktailDB API

## Folder Structure

- **frontend/**: Contains the client-side application.
  - **src/**: Source code for the React application.
    - **components/**: Contains reusable React components.
    - **lib/**: Contains utility functions and configurations (e.g., Apollo Client).
    - **styles/**: Contains global styles and CSS files.
    - **App.jsx**: Main application component.
    - **main.jsx**: Entry point for the React application.
- **app/**: Contains the backend Laravel application.
- **database/**: Contains database migrations and seeders.
- **routes/**: Contains API routes for the application.

## Installation

```bash
# Clone the repository
git clone https://github.com/shreyas463/TheBartender.git

# Install frontend dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

## Running the Backend

Make sure to set up the backend environment by running the following commands:

```bash
# Navigate to the backend directory
cd app

# Install backend dependencies
composer install

# Run migrations
php artisan migrate

# Start the Laravel server
php artisan serve
```

## Contributing

Contributions are welcome! Please create an issue or submit a pull request for any improvements or bug fixes.

## License

MIT License
