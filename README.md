# Auto Appendix

A FastAPI application that creates appendix documents with one figure per page

## Features

- 📄 Create appendix documents with figures
- 🎨 Modern, responsive web interface
- 🖼️ Support for multiple image formats (PNG, JPG, JPEG, GIF, BMP)
- ⚙️ Customizable image width and caption position
- 🐳 Docker support for easy deployment
- ☁️ Cloud-ready architecture

## Quick Start

### Local Development

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Run the application:**

```bash
python main.py
```

3. **Open your browser:**
   Navigate to http://localhost:8000

### Using Docker

1. **Build and run with Docker Compose:**

```bash
docker-compose up --build
```

2. **Or build manually:**

```bash
docker build -t appendix-creator .
docker run -p 8000:8000 appendix-creator
```

3. **Open your browser:**
   Navigate to http://localhost:8000

## Project Structure

```
auto-appendix/
├── app/
│   ├── __init__.py           # Application factory
│   ├── routers/
│   │   └── appendix.py       # API routes
│   ├── services/
│   │   └── document_service.py  # Business logic
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css     # Styling
│   │   └── js/
│   │       └── main.js       # Frontend logic
│   └── templates/
│       └── index.html        # HTML template
├── main.py                   # Application entry point
├── requirements.txt          # Python dependencies
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## API Documentation

Once running, visit:

- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

### Endpoints

- `GET /` - Web interface
- `POST /upload` - Upload images and generate document
- `GET /health` - Health check endpoint

## Cloud Deployment

### Deploy to Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/[PROJECT-ID]/appendix-creator

# Deploy to Cloud Run
gcloud run deploy appendix-creator \
  --image gcr.io/[PROJECT-ID]/appendix-creator \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to AWS ECS

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com
docker build -t appendix-creator .
docker tag appendix-creator:latest [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/appendix-creator:latest
docker push [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/appendix-creator:latest

# Deploy using ECS
# (Follow AWS ECS deployment guide)
```

### Deploy to Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry [REGISTRY-NAME] --image appendix-creator:latest .

# Deploy to ACI
az container create \
  --resource-group [RESOURCE-GROUP] \
  --name appendix-creator \
  --image [REGISTRY-NAME].azurecr.io/appendix-creator:latest \
  --dns-name-label appendix-creator \
  --ports 8000
```

### Deploy to Heroku

```bash
# Login to Heroku
heroku login
heroku container:login

# Create app
heroku create appendix-creator

# Deploy
heroku container:push web
heroku container:release web
heroku open
```

## Environment Variables

- `PORT` - Port to run the application (default: 8000)
- `HOST` - Host to bind to (default: 0.0.0.0)

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/ main.py
```

### Type Checking

```bash
mypy app/ main.py
```

## License

MIT License

## Author & Copyright

**Created by Ryan Alvita**

© 2025 Ryan Alvita. All rights reserved.

🌐 Website: [https://ryanalvita.github.io/](https://ryanalvita.github.io/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
