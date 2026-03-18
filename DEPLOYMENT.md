# Deployment to Google Cloud Run

This Next.js application has been configured with `output: 'standalone'` and a `Dockerfile` specifically designed for seamless deployment to Google Cloud Run.

## Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated
- Billing enabled on your Google Cloud Project
- Docker installed locally (if building locally)

## Deployment Steps

1. **Set your Google Cloud Project**
   ```bash
   gcloud config set project [YOUR_PROJECT_ID]
   ```

2. **Enable Required APIs**
   ```bash
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
   ```

3. **Deploy from Source (Easiest Method)**
   Google Cloud Run can automatically build your Next.js application using Cloud Build and the provided `Dockerfile`.
   
   Navigate to the `synthetic-dashboard` directory and run:
   ```bash
   gcloud run deploy synthetic-dashboard \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 1Gi \
     --cpu 1 \
     --max-instances 10
   ```

   *The above command will build the container using Cloud Build and deploy it instantly. It allocates 1GB of memory which is sufficient for Next.js to parse the CSV files.*

## Environment Variables
The application does not currently require external database API keys, as data is provided statistically via the CSV in `public/data`.

If you expand the app to use Postgres or external APIs later, you can pass environment variables to Cloud Run:
```bash
gcloud run deploy synthetic-dashboard --update-env-vars KEY=VALUE
```
