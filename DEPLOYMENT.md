# Deployment Setup Guide

## GitHub Secrets Configuration

To enable the CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

### Docker Hub Secrets
1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

### Render Secrets
1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `RENDER_API_KEY`: Your Render API key (found in Render Dashboard → Account Settings → API Keys)
   - `RENDER_SERVICE_ID`: Your Render service ID (found in your service settings)

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: (Optional) The backend API URL for production. Defaults to `http://localhost:8000/api` if not set.

## Render Configuration

The `render.yaml` file is configured for two services:
- **Backend**: FastAPI service running on port 8000
- **Frontend**: Next.js service running on port 3000

### Manual Render Setup (Alternative)

If you prefer to set up Render services manually:

1. **Backend Service**:
   - Type: Web Service
   - Runtime: Docker
   - Dockerfile Path: `./server/Dockerfile`
   - Docker Context: `./server`
   - Environment Variables:
     - `PORT`: 8000
     - `CORS_ORIGINS`: https://your-frontend-url.onrender.com

2. **Frontend Service**:
   - Type: Web Service
   - Runtime: Docker
   - Dockerfile Path: `./client/Dockerfile`
   - Docker Context: `./client`
   - Environment Variables:
     - `PORT`: 3000
     - `NEXT_PUBLIC_API_URL`: https://your-backend-url.onrender.com/api

## Pipeline Flow

1. **Test Phase**: Runs tests for both frontend and backend
2. **Build Phase**: Builds the applications (only runs after successful tests)
3. **Docker Build Phase**: Builds Docker images for both services
4. **Docker Push Phase**: Pushes images to Docker Hub
5. **Deploy Phase**: Deploys to Render (only on push to main/master branch)

## Caching

The pipeline uses caching for:
- **Frontend**: npm cache (node_modules)
- **Backend**: pip cache (Python packages)
- **Docker**: Build cache stored in Docker Hub registry

## Build Artifacts

Build artifacts are stored for 7 days:
- Frontend: `.next` directory and `public` folder
- Backend: `build` directory with application files
