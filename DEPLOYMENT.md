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
   - `RENDER_FRONTEND_SERVICE_ID`: Your Render frontend service ID (found in your frontend service settings)
   - `RENDER_BACKEND_SERVICE_ID`: Your Render backend service ID (found in your backend service settings)
   
   **How to find Service IDs:**
   - Go to your Render Dashboard → Select the service → Settings → The Service ID is shown at the top of the settings page

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

## GitHub Pages Setup

The project includes a static website deployed to GitHub Pages with project information.

### Configuration
1. Go to your GitHub repository → Settings → Pages
2. Under "Source", select "GitHub Actions" as the source
3. The static HTML page is located in the `docs/` directory
4. The page will be automatically deployed on push to `main`, `master`, or `production` branches

### Accessing GitHub Pages
After deployment, your GitHub Pages site will be available at:
- `https://<username>.github.io/<repository-name>`
- Or `https://<organization>.github.io/<repository-name>` for organization repositories

## GitHub Environments Setup

The CI/CD pipeline uses GitHub Environments to distinguish between Development and Production deployments.

### Creating Environments

1. Go to your GitHub repository → Settings → Environments
2. Click "New environment" and create two environments:

#### Development Environment
- **Name**: `Development`
- **Deployment branches**: Select "Selected branches" and choose `main` (and `master` if applicable)
- **Protection rules**: None required (automatic deployment)

#### Production Environment
- **Name**: `Production`
- **Deployment branches**: Select "Selected branches" and choose `production`
- **Protection rules**: 
  - ✅ Enable "Required reviewers" (add at least one reviewer)
  - This ensures manual approval is required before Production deployments

### Environment Behavior

- **Development Environment**:
  - Triggered on push to `main` or `master` branch
  - Docker images tagged with `dev` tag
  - Automatic deployment (no approval required)

- **Production Environment**:
  - Triggered on push to `production` branch
  - Docker images tagged with `prod` tag
  - Requires manual approval before deployment
  - Also tags images with `latest` tag

## Pipeline Flow

1. **Test Phase**: Runs tests for both frontend and backend
2. **Build Phase**: Builds the applications (only runs after successful tests)
3. **GitHub Pages Deployment**: Deploys static website to GitHub Pages
4. **Docker Build Phase**: 
   - For `main`/`master` branch: Builds images with `dev` tag (Development environment)
   - For `production` branch: Builds images with `prod` tag (Production environment, requires approval)
5. **Docker Push Phase**: Pushes images to Docker Hub with appropriate tags
6. **Deploy Phase**: 
   - Development: Automatic deployment to Render (on `main`/`master` branch)
   - Production: Manual approval required, then deployment to Render (on `production` branch)

## Caching

The pipeline uses caching for:
- **Frontend**: npm cache (node_modules)
- **Backend**: pip cache (Python packages)
- **Docker**: Build cache stored in Docker Hub registry

## Build Artifacts

Build artifacts are stored for 7 days:
- Frontend: `.next` directory and `public` folder
- Backend: `build` directory with application files

## Docker Image Tags

The pipeline creates different Docker image tags based on the branch:

### Development (main/master branch)
- `dev`: Latest development build
- `dev-<commit-sha>`: Specific commit in development

### Production (production branch)
- `prod`: Latest production build
- `prod-<commit-sha>`: Specific commit in production
- `latest`: Alias for the latest production build

## Branch Strategy

- **main/master**: Development branch
  - Automatic deployment to Development environment
  - Images tagged with `dev`
  - No approval required

- **production**: Production branch
  - Requires manual approval for deployment
  - Images tagged with `prod` and `latest`
  - Deploys to Production environment

## Workflow Summary

| Branch | Environment | Docker Tag | Approval Required |
|--------|------------|------------|-------------------|
| `main`/`master` | Development | `dev` | No |
| `production` | Production | `prod`, `latest` | Yes |
