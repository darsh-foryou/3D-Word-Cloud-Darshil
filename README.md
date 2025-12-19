# 3D News Topic Cloud

This project analyzes a news article and displays important topics as a 3D word cloud.

---

## Setup

### Clone the repository
```bash
git clone <repo-url>


###BACKEND 
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload
http://127.0.0.1:8000

###FRONTEND 
cd frontend
npm install
npm run dev
http://localhost:5173


###Tech Stack
A) Frontend : 
React (TypeScript)
Vite
Three.js (React Three Fiber)
@react-three/drei

B) Backend
Python
FastAPI
Requests
BeautifulSoup4
scikit-learn (TF-IDF)
