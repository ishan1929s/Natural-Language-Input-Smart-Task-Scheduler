#!/bin/bash

# Deployment script for Smart Task Scheduler
# This script handles deployment to various platforms

set -e

# Configuration
APP_NAME="scheduling-project"
DOCKER_IMAGE="scheduling-project:latest"
BACKEND_PORT=3000
FRONTEND_PORT=5173

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    log_success "All dependencies are installed."
}

# Build Docker image
build_docker_image() {
    log_info "Building Docker image..."
    
    if docker build -t $DOCKER_IMAGE .; then
        log_success "Docker image built successfully."
    else
        log_error "Failed to build Docker image."
        exit 1
    fi
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Backend tests
    log_info "Running backend tests..."
    cd backend
    if npm test; then
        log_success "Backend tests passed."
    else
        log_error "Backend tests failed."
        exit 1
    fi
    cd ..
    
    # Frontend tests
    log_info "Running frontend tests..."
    cd frontend
    if npm test; then
        log_success "Frontend tests passed."
    else
        log_error "Frontend tests failed."
        exit 1
    fi
    cd ..
}

# Build frontend
build_frontend() {
    log_info "Building frontend..."
    
    cd frontend
    if npm run build; then
        log_success "Frontend built successfully."
    else
        log_error "Frontend build failed."
        exit 1
    fi
    cd ..
}

# Deploy to local Docker
deploy_local() {
    log_info "Deploying to local Docker..."
    
    # Stop existing container if running
    if docker ps -q -f name=$APP_NAME | grep -q .; then
        log_info "Stopping existing container..."
        docker stop $APP_NAME
        docker rm $APP_NAME
    fi
    
    # Run new container
    if docker run -d \
        --name $APP_NAME \
        -p $BACKEND_PORT:$BACKEND_PORT \
        -p $FRONTEND_PORT:$FRONTEND_PORT \
        -e NODE_ENV=production \
        $DOCKER_IMAGE; then
        log_success "Application deployed locally on ports $BACKEND_PORT and $FRONTEND_PORT"
    else
        log_error "Failed to deploy application locally."
        exit 1
    fi
}

# Deploy to AWS ECS
deploy_aws_ecs() {
    log_info "Deploying to AWS ECS..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    # Push image to ECR
    log_info "Pushing image to ECR..."
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
    docker tag $DOCKER_IMAGE $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$APP_NAME:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$APP_NAME:latest
    
    # Update ECS service
    log_info "Updating ECS service..."
    aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment
    
    log_success "Application deployed to AWS ECS."
}

# Deploy to Google Cloud Run
deploy_gcp_cloud_run() {
    log_info "Deploying to Google Cloud Run..."
    
    if ! command -v gcloud &> /dev/null; then
        log_error "Google Cloud CLI is not installed. Please install gcloud first."
        exit 1
    fi
    
    # Build and push to Google Container Registry
    log_info "Building and pushing to GCR..."
    gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/$APP_NAME .
    
    # Deploy to Cloud Run
    log_info "Deploying to Cloud Run..."
    gcloud run deploy $APP_NAME \
        --image gcr.io/$GCP_PROJECT_ID/$APP_NAME \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated
    
    log_success "Application deployed to Google Cloud Run."
}

# Deploy to Heroku
deploy_heroku() {
    log_info "Deploying to Heroku..."
    
    if ! command -v heroku &> /dev/null; then
        log_error "Heroku CLI is not installed. Please install Heroku CLI first."
        exit 1
    fi
    
    # Login to Heroku
    heroku login
    
    # Create Heroku app if it doesn't exist
    if ! heroku apps:info --app $HEROKU_APP_NAME &> /dev/null; then
        log_info "Creating Heroku app..."
        heroku create $HEROKU_APP_NAME
    fi
    
    # Set environment variables
    log_info "Setting environment variables..."
    heroku config:set NODE_ENV=production --app $HEROKU_APP_NAME
    heroku config:set MONGODB_URL=$MONGODB_URL --app $HEROKU_APP_NAME
    heroku config:set JWT_ACCESS_TOKEN_SECRET=$JWT_ACCESS_TOKEN_SECRET --app $HEROKU_APP_NAME
    heroku config:set JWT_REFRESH_TOKEN_SECRET=$JWT_REFRESH_TOKEN_SECRET --app $HEROKU_APP_NAME
    
    # Deploy
    log_info "Deploying to Heroku..."
    git push heroku main
    
    log_success "Application deployed to Heroku."
}

# Deploy to Railway
deploy_railway() {
    log_info "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        log_error "Railway CLI is not installed. Please install Railway CLI first."
        exit 1
    fi
    
    # Login to Railway
    railway login
    
    # Deploy
    railway up
    
    log_success "Application deployed to Railway."
}

# Deploy to Render
deploy_render() {
    log_info "Deploying to Render..."
    
    # Render deployment is typically done through Git integration
    # This script can be used to trigger deployment via webhook
    if [ -n "$RENDER_WEBHOOK_URL" ]; then
        log_info "Triggering Render deployment..."
        curl -X POST $RENDER_WEBHOOK_URL
        log_success "Render deployment triggered."
    else
        log_warning "RENDER_WEBHOOK_URL not set. Please deploy manually through Render dashboard."
    fi
}

# Deploy to DigitalOcean App Platform
deploy_digitalocean() {
    log_info "Deploying to DigitalOcean App Platform..."
    
    if ! command -v doctl &> /dev/null; then
        log_error "DigitalOcean CLI is not installed. Please install doctl first."
        exit 1
    fi
    
    # Deploy using doctl
    doctl apps create-deployment $DIGITALOCEAN_APP_ID
    
    log_success "Application deployed to DigitalOcean App Platform."
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check backend health
    if curl -f http://localhost:$BACKEND_PORT/api/v1/auth/me &> /dev/null; then
        log_success "Backend is healthy."
    else
        log_error "Backend health check failed."
        exit 1
    fi
    
    # Check frontend health
    if curl -f http://localhost:$FRONTEND_PORT &> /dev/null; then
        log_success "Frontend is healthy."
    else
        log_error "Frontend health check failed."
        exit 1
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    log_success "Cleanup completed."
}

# Main deployment function
main() {
    log_info "Starting deployment process..."
    
    # Parse command line arguments
    case "${1:-local}" in
        "local")
            check_dependencies
            run_tests
            build_frontend
            build_docker_image
            deploy_local
            health_check
            ;;
        "aws")
            check_dependencies
            run_tests
            build_docker_image
            deploy_aws_ecs
            ;;
        "gcp")
            check_dependencies
            run_tests
            build_docker_image
            deploy_gcp_cloud_run
            ;;
        "heroku")
            check_dependencies
            run_tests
            deploy_heroku
            ;;
        "railway")
            check_dependencies
            run_tests
            deploy_railway
            ;;
        "render")
            check_dependencies
            run_tests
            deploy_render
            ;;
        "digitalocean")
            check_dependencies
            run_tests
            build_docker_image
            deploy_digitalocean
            ;;
        "test")
            check_dependencies
            run_tests
            ;;
        "build")
            check_dependencies
            build_frontend
            build_docker_image
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            echo "Usage: $0 {local|aws|gcp|heroku|railway|render|digitalocean|test|build|cleanup}"
            echo ""
            echo "Deployment targets:"
            echo "  local        - Deploy to local Docker"
            echo "  aws          - Deploy to AWS ECS"
            echo "  gcp          - Deploy to Google Cloud Run"
            echo "  heroku       - Deploy to Heroku"
            echo "  railway      - Deploy to Railway"
            echo "  render       - Deploy to Render"
            echo "  digitalocean - Deploy to DigitalOcean App Platform"
            echo ""
            echo "Other commands:"
            echo "  test         - Run tests only"
            echo "  build        - Build application only"
            echo "  cleanup      - Clean up Docker resources"
            exit 1
            ;;
    esac
    
    log_success "Deployment completed successfully!"
}

# Run main function with all arguments
main "$@"
