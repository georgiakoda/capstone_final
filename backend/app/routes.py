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

@router.get("/search/reddit/")
async def search_reddit(
    q: str,
    subreddit: str = Query(None, description="Optional subreddit to search in"),
    sort: str = Query("relevance", description="Sort order (new, top, hot, relevance, comments)")
):
    """
    Endpoint to search Reddit submissions using the Reddit API.
    
    :param q: The search query term.
    :return: List of submissions matching the query.
    """
    try:
        
        sub = reddit.subreddit(subreddit) if subreddit else reddit.subreddit("all")

        if sort not in ["relevance", "new", "top", "hot", "comments"]:
            sort = "relevance"  # Fallback to default

        submissions = sub.search(q, limit=3, sort=sort)

        #format results
        results = []
        for submission in submissions:
            if submission.is_self:  #filters for text-only posts
                combined_text = f"{submission.title}\n\n{submission.selftext}"
                results.append({
                    "content": combined_text,
                    #"title": submission.title,
                    #"selftext": submission.selftext,
                    #"url": submission.url,
                    #"score": submission.score,
                    "subreddit": submission.subreddit.display_name
                })

         #this is to get the rate limit info
         #also note that the "rate limit reset" time is a unix timestamp
         #if you need to know when the rate limit will reset, paste the value into epochconverter.com or something similar
        rate_limit_info = {
            "rate_limit_remaining": reddit.auth.limits.get("remaining"),
            "rate_limit_used": reddit.auth.limits.get("used"),
            "rate_limit_reset": reddit.auth.limits.get("reset_timestamp")
        }
        
        return {
            "results": results,
            "rate_limit_info": rate_limit_info
        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))

@router.get("/emotion-data")
async def get_emotion_data(q: str):
    try:
        reddit_data = await search_reddit(q)
        test_texts = [post["content"] for post in reddit_data["results"]]

        analysis = analyze_sentiment(test_texts)

        return {
            "sentiment_results": analysis
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    #test_texts = [
        # "I hate this. It's terrible.",
      #  "This is so exciting I can't wait!",
      #  "I'm so angry right now I hate you so much",
      #  "I am so sad right now",
      #  "Wow, that was surprising!",
      #  "Im eating dinner at 6"
    #]
   # results = analyze_sentiment(test_texts)
    #return results