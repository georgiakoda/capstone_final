#tasks:
#1) handle POST request
#2) sanitize the input
#3) store the sanitized keyword in MongoDB (?)

from fastapi import FastAPI
from app.routes import router
from fastapi import HTTPException
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient #asyncio is used to handle async requests
from contextlib import asynccontextmanager 
from pydantic import BaseModel #ensure incoming data is expected format, automatic validation
import re #regex for pattern mathinc and manipulating strings
import uuid #generate unique IDs for keywords
from fastapi.middleware.cors import CORSMiddleware  #import CORSMiddleware otherwise get error. INFO: 127.0.0.1:54107 - "OPTIONS /keywords/ HTTP/1.1" 405 Method Not Allowed
from fastapi.responses import JSONResponse
import tracemalloc
from app.routes import router, search_reddit
from nltk.stem import PorterStemmer #for stemming keywords
import nltk #stemming
from bson import ObjectId


tracemalloc.start()
nltk.download('punkt')  # download tokenizer data (for keyword stemming)
stemmer = PorterStemmer() #initialize stemmer

#add CORSMiddleware to handle CORS (otherwise get 405 Method Not Allowed error)
origins = [
    "http://localhost",  #allow frontend (localhost)
    "http://localhost:3000",  #for example if using react's default port
]

#lifespan event handler to manage startup/shutdown of the app
#using asynccontextmanager decorator. Context manager defines async setup and teardown (release resources)
#useful for tasks involving async operations like connecting to DB, making network requests, etc.
@asynccontextmanager
async def lifespan(app: FastAPI):
    #startup: initialize MongoDB client
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017") 
    app.db = app.mongodb_client.keyword_db #keyword_db is our database name
    print(f"Connected to database: {app.db.name}")
    yield
    #shutdown: close MongoDB client
    app.mongodb_client.close()

#use the lifespan context manager to manage app startup and shutdown
app = FastAPI(lifespan=lifespan)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  #allow these origins
    allow_credentials=True,
    allow_methods=["*"],  #allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  #allow all headers
)


#handle OPTIONS request to respond to preflight request
@app.options("/keywords/")
async def handle_options():
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",  # Frontend URL
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    )


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Keyword API!"}

#pydantic model for request body
class KeywordRequest(BaseModel):
    query: str

#helper fu"ction to sanitize the input (remove unwanted chars, e.g., special chars)
def sanitize_input(input_str: str) -> str:
    sanitized = re.sub(r'[^a-zA-Z0-9 ]', '', input_str) #remove all chars except alphabets, numbers, and spaces
    sanitized = sanitized.strip().lower() #strip leading/trailing spaces, convert to lowercase

    # tokenze input into words
    words = sanitized.split()  
    
    # apply stemming to each word
    stemmed_words = [stemmer.stem(word) for word in words]  
    
    # join words back into a single string
    stemmed = ' '.join(stemmed_words)

    return sanitized, stemmed
 

#endpoint to handle POST request:
@app.post("/keywords/") 
async def create_keyword(keyword: KeywordRequest):
    sanitized_query, stemmed_query = sanitize_input(keyword.query)

    if not sanitized_query:
        raise HTTPException(status_code=400, detail="Keyword cannot be empty or invalid.")
    
    created_at = datetime.now().isoformat()

    keyword_id = str(uuid.uuid4()) #unique identifier for keyword
    keyword_document = {
        #"_id": keyword_id, #unique ID
        "query": stemmed_query, #search term
        "created_at": created_at,  #search date
    }

    #store sanitized keyword into MongoDB collection (aka table) and send to RedditAPI
    try:
        try:
        #store keyword search into "keywords" MongoDB collection in keyword_db:
            await app.db.keywords.insert_one(keyword_document) #insert document into dynamically created collection
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to store keyword in database.")

        #*****************NEW CODE***************** 
        #search reddit for the keyword
        print(f"query: {keyword.query}")
        try:
            search_results = await search_reddit(sanitized_query)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to search Reddit for keyword.")
        print(f"Search Results: {search_results}")
        for result in search_results["results"]:
            #store reddit search results into "search-results" MongoDB collection in keyword_db:
            search_results_document = {
                #"keyword_id": keyword_id, #from user search 1)
                #search_term_id # not needed, MongoDB will automatically create a unique ID for this document 2)
                "reddit_results": result, #3)
                "created_at": created_at,  #search date 4)
                "sentiment_results": None, #placeholder for sentiment analysis results #5)
            }

            await app.db.search_results.insert_one(search_results_document) #insert document into dynamically created collection "search_results"
        return {"query": sanitized_query, "message": "Keyword added successfuly with date", "created_at": created_at, "search_results": search_results["results"]}
        #return {"id": keyword_id, "query": sanitized_query, "message": "Keyword added successfuly with date", "created_at": created_at, "search_results": search_results["results"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error during create_keyword")
"""
#new GET endpoint to search Reddit for a keyword stored in MongoDB
@app.get("/search_reddit/{keyword_id}")
async def search_reddit_for_keyword(keyword_id: str):

    try:
        object_id = ObjectId(keyword_id)


        #fetch the keyword document from MongoDB
        keyword_document = await app.db.keywords.find_one({"_id": object_id})

        if not keyword_document:
            raise HTTPException(status_code=404, detail="Keyword not found in searc_reddit func.")
        
        query = keyword_document["query"]
        #perform the Reddit search (adjust parameters as needed)
        submissions = reddit.subreddit("all").search(query, limit=1, sort="relevance", time_filter="all")
        
        #format results
        results = []
        for submission in submissions:
            if submission.is_self:
                results.append({
                    "title": submission.title,
                    "selftext": submission.selftext,
                    "url": submission.url,
                    "score": submission.score,
                    "subreddit": submission.subreddit.display_name,
                })
        
        return {"results": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search Reddit: {str(e)}")
"""
#tasks:
#text pre-processing:
#1)remove special characters - done
#2)convert to lowercase - done
#3)remove stop words (e.g., 'the', 'and', 'is', etc.) - need
#4)stemming (e.g., convert 'running' to 'run') - done
#5)lemmatization (e.g., convert 'better' to 'good') (might not be needed)
#6)tokenization (e.g., split sentence into words) - done
