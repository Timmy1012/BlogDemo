# BlogDemo

This project sets up a very basic blogging application.

## Features

- **User Authentication**: JWT-based authentication with secure token management
- **Article Management**: Full CRUD operations for blog articles
- **Responsive Design**: Clean, Bootstrap-styled interface
- **Containerized Deployment**: Docker and docker-compose setup for easy deployment
- **API-First Architecture**: RESTful API with clear separation between frontend and backend

## Tech Stack

- **Backend**: Django REST Framework, SQLite, JWT Authentication
- **Frontend**: React, Bootstrap/Reactstrap, Axios
- **Infrastructure**: Docker, docker-compose
- **Development**: Makefile for common tasks

## Quick Start

The application uses Docker for easy setup and deployment. All common development tasks are defined in the project Makefile.

### Start the application

```bash
make docker-start
```

### Stop the application

```bash
make docker-kill
```

### Run tests

```bash
make test
```

### Run linters and formatters

```bash
make lint
```

## Project Structure

```text
├── backend/                # Django REST API
│   ├── backend/            # Django project settings
│   ├── blogdemo/           # Main application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container configuration
├── frontend/               # React application
│   ├── src/                # React source code
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Frontend container configuration
├── docker-compose.yml      # Multi-container setup
├── makefile                # Development commands
└── README.md               # This file
```

## API Endpoints

All endpoints require authentication via JWT tokens.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/articles/` | List all articles |
| `POST` | `/api/articles/` | Create a new article |
| `PUT` | `/api/articles/{id}/` | Update an existing article |
| `DELETE` | `/api/articles/{id}/` | Delete an article |

### Backend

This section documents some of the design choices made in the backend.

The project was set up using the django project start command, which sets up a basic structure, and sqllite connection.

As the time that should be spent on this project validation (e.g. title length, minimum content size) is configured only in the database. If there was more time, I would keep this validation in the database, but also define it at higher level to reduce the load on the database.

Django configures new projects with CSRF by default, so I kept this, although it required some further configuring.
Adding CORS protection, was achieved by adding an existing django package in the middleware.

As I have recently found, adding authentication is easily achieved by adding the simple JWT package. This plays nicely into the knowledge I have gathered on JWT for the research position I followed.

### Frontend

This section documents some of the design choices made in the frontend.

The project was set up using Create React App, which provides a modern build setup with no configuration needed.

The application uses React class components for the main App component and functional components with hooks for authentication. While modern React favors hooks, the class-based approach for the main component provides a clear structure for managing state and lifecycle methods.

For styling, I chose Bootstrap with Reactstrap components, which provides an easy way of styling componts with consistency.

Authentication is handled using JWT tokens with a custom React Context. This approach centralizes authentication state management and provides clean separation of concerns. The tokens are stored in localStorage for persistence across browser sessions.

API communication is managed through Axios, which provides better error handling and request/response interceptors compared to the native fetch API. The proxy configuration in package.json simplifies development by routing API calls to the backend container.

CSRF protection is implemented by extracting the token from cookies and including it in request headers.

The application follows a simple CRUD pattern for articles, with a modal-based editing interface that provides a clean user experience without page navigation.

## Future improvements

As this project was somewhat time limited, there are some steps that could be taken if there was more time. These include:

- Improving the frontend styling
- Search and filter capabilities
- More extensive testing
- Auto deployment of the application
- CI/CD, for automating the linters, and tests
- Adding caching in the backend to limit database load (and increase application performance)
