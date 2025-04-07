from fastapi import APIRouter, HTTPException, Query
import praw
import requests
from dotenv import load_dotenv
import os
from pathlib import Path
from app.sentiment import analyze_sentiment


#loads env file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


session = requests.Session()

#initialize Reddit API client
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

router = APIRouter()

def reddit_search_logic(q: str, subreddit: str = None, sort: str = "relevance"):
    sub = reddit.subreddit(subreddit) if subreddit else reddit.subreddit("all")

    if sort not in ["relevance", "new", "top", "hot", "comments"]:
        sort = "relevance"

    submissions = sub.search(q, limit=15, sort=sort)

    results = []
    for submission in submissions:
        if submission.is_self:
            combined_text = f"{submission.title}\n\n{submission.selftext}"
            results.append({
                "content": combined_text,
                "subreddit": submission.subreddit.display_name
            })

    rate_limit_info = {
        "rate_limit_remaining": reddit.auth.limits.get("remaining"),
        "rate_limit_used": reddit.auth.limits.get("used"),
        "rate_limit_reset": reddit.auth.limits.get("reset_timestamp")
    }

    return {
        "results": results,
        "rate_limit_info": rate_limit_info
    }


@router.get("/search/reddit/")
async def search_reddit(
    q: str,
    subreddit: str = Query(None, description="Optional subreddit to search in"),
    sort: str = Query("relevance", description="Sort order (new, top, hot, relevance, comments)")
):
    try:
        return reddit_search_logic(q, subreddit=subreddit, sort=sort)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyze-reddit")
async def analyze_reddit(
    q: str,
    subreddit: str = Query(None),
    sort: str = Query("relevance")
):
    try:
        print(f"searching term: '{q}' in subreddit: '{subreddit}'")

        reddit_data = reddit_search_logic(q, subreddit=subreddit, sort=sort)
        texts = [post["content"] for post in reddit_data["results"]]

        if not texts:
            return {
                "results": [],
                "rate_limit_info": reddit_data["rate_limit_info"],
                "sentiment_results": {"results": [], "max_emotion_counts": {}}
            }

        sentiment = analyze_sentiment(texts)

        return {
            "results": reddit_data["results"],
            "rate_limit_info": reddit_data["rate_limit_info"],
            "sentiment_results": sentiment
        }

    except Exception as e:
        print(f"ERROR in /analyze-reddit: {e}")
        raise HTTPException(status_code=500, detail=str(e))
