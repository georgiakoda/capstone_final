from fastapi import FastAPI, HTTPException
import praw
import requests
from dotenv import load_dotenv
import os

#for getting API access info from the .env file
load_dotenv()

app = FastAPI()

#more api access stuff from env file
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

session = requests.Session()

#initialize reddit API client
reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent=REDDIT_USER_AGENT,
    requestor_kwargs={"session": session}
)

@app.get("/search/reddit/")
async def search_reddit(q: str):
    """
    Endpoint to search Reddit submissions using the Reddit API.
    
    :param q: The search query term.
    :return: List of submissions matching the query.
    """
    try:
        submissions = reddit.subreddit("all").search(q, limit=10, sort="new")
        #OK so the situation here right now is, when i test the search with the query "science"
        #and I sort by relevance, only 1 post is returned which isnt great
        #but if I sort by new I get 10 posts that arent *super* relevant
        #might try to fix this by maybe sorting by relevance with a wider time frame? idk. something to think about. 
        
        #format results
        results = []
        for submission in submissions:
            if submission.is_self:  #filters for text-only posts
                results.append({
                    "title": submission.title,
                    "selftext": submission.selftext,
                    "url": submission.url,
                    "score": submission.score,
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

#try without the if submission.is_self condition before results.append?