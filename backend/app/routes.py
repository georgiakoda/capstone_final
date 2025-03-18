from fastapi import APIRouter, HTTPException
import praw
import requests
from dotenv import load_dotenv
import os
from pathlib import Path
#from app.sentiment import analyze_sentiment

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
async def search_reddit(q: str):
    """
    Endpoint to search Reddit submissions using the Reddit API.
    
    :param q: The search query term.
    :return: List of submissions matching the query.
    """
    try:
        #submissions = reddit.subreddit("all").search(q, limit=10, sort="new")
        #OK so the situation here right now is, when i test the search with the query "science"
        #and I sort by relevance, only 1 post is returned which isnt great
        #but if I sort by new I get 10 posts that arent *super* relevant
        #might try to fix this by maybe sorting by relevance with a wider time frame? idk. something to think about. 
        submissions = reddit.subreddit("all").search(q, limit=1000, sort="new", time_filter="all")
        #submissions = reddit.subreddit("all").search(q, limit=10, sort="relevance", time_filter="all")

        
        #format results
        print(f"Searching Reddit for: {q}")
        results = []
        for submission in submissions:
            if submission.is_self:  #filters for text-only posts
                results.append({
                    #"title": submission.title, might be useful actually because some people put some sentiment in the title as well
                    "selftext": submission.selftext,
                    #"url": submission.url,
                    #"score": submission.score, might need later to add more variables to our project analysis for, say, higher ranking posts
                    #"subreddit": submission.subreddit.display_name,
                })
        print(f"Found {len(results)} results: {results}")
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

""" 
@router.get("/emotion-data")
async def get_emotion_data():
    test_texts = [
        "Get out! Are you for real?! Spill the tea", #surprise?
        "This is the most basic thing I have ever seen", #disgust?
        "I can't believe you would do something like that", #anger?
        "Woah, I will pretend I did not see that", #disgust?
        "I just don't know how to cope with all the emotion I have, wow this is so on another level!", #joy?
        "No thanks, I am good as I am", #anger?
        "There seems to be no point to this...", #sadness?
        "Is he really going to sign that bill? We need to stop him or else we can get in trouble", #fear?
        "Im eating dinner at 6", #neutral
        "Are you kidding me", #anger?
        "Wow, totally. What a great idea. Haha." #?
    ]
    results = analyze_sentiment(test_texts)
    return results"""