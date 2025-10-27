<div align="center">
<img src="frontend/my-app/public/logo.png">
A <i> BEST Gamejam</i> game
</div>

---

## Usage

Launch the API server with:
```sh
cd backend
uv run fastapi dev src/main.py

// might be this one actually
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

Launch the frontend CDN with:
```sh
cd frontend/my-app
npm run dev
```
