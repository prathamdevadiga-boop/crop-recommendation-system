# crop-recommendation-system
A machine learning project that recommends suitable crops based on soil and weather conditions.

## Run locally

Start the Python API from the repository root:

```bash
py -m venv .venv
.venv\\Scripts\\activate
py -m pip install -r requirements.txt
py -m uvicorn backend.main:app --reload
```

Start the frontend in a second terminal:

```bash
cd app
npx --yes pnpm@12.3.4 run dev
```

## Deploy

Deploy the Python API to Render using `render.yaml`. Then deploy the `app` directory to Vercel and set the Vercel environment variable `BACKEND_URL` to the public Render API URL. The frontend must not use the default `127.0.0.1:8000` URL after deployment.
