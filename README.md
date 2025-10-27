<div align="center">
<img src="frontend/my-app/public/logo.png">
A <i> BEST Gamejam</i> game
</div>

---

## Usage

Launch the API server with:
```sh
// relevant now in /backend
python -m venv venv


# Activate it
# On Windows:
venv\Scripts\activate
# in some cases you need first to do this for windows
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# On macOS/Linux:
source venv/bin/activate


pip install -r requirements.txt


#then run this command:
uvicorn src.main:app --host 0.0.0.0 --port 8000




cd backend
uv run fastapi dev src/main.py

// might be this one actually 

```

Launch the frontend CDN with:
```sh
cd frontend/my-app
npm run dev
```
