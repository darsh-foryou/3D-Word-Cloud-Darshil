from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Request / Response Models
# -------------------------
class AnalyzeRequest(BaseModel):
    url: str

class WordItem(BaseModel):
    word: str
    weight: float

# -------------------------
# API Endpoint
# -------------------------
@app.post("/analyze")
def analyze_article(req: AnalyzeRequest):
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0 Safari/537.36"
            )
        }

        response = requests.get(req.url, headers=headers, timeout=10)

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to fetch article (status {response.status_code})"
            )

        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")

        text = " ".join(p.get_text(strip=True) for p in paragraphs)

        if len(text) < 200:
            raise HTTPException(
                status_code=400,
                detail="Article text too short or could not be extracted"
            )

        vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=30
        )

        tfidf_matrix = vectorizer.fit_transform([text])
        scores = tfidf_matrix.toarray()[0]
        words = vectorizer.get_feature_names_out()

        word_cloud = [
            {"word": word, "weight": float(score)}
            for word, score in sorted(
                zip(words, scores),
                key=lambda x: x[1],
                reverse=True
            )
        ]

        return word_cloud

    # IMPORTANT: do NOT wrap HTTPException into 500
    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
