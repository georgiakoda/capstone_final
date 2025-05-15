from fastapi import FastAPI
from app.routes import router
from fastapi import HTTPException
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient  # asyncio is used to handle async requests
from contextlib import asynccontextmanager 
from pydantic import BaseModel  # ensure incoming data is expected format, automatic validation
import re  # regex for pattern matching and manipulating strings
import uuid  # generate unique IDs for keywords
from fastapi.middleware.cors import CORSMiddleware  # import CORSMiddleware otherwise get error. INFO: 127.0.0.1:54107 - "OPTIONS /keywords/ HTTP/1.1" 405 Method Not Allowed
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from pymongo import MongoClient
import certifi
"""
if the database is pouting, put this in the terminal before running app.
export SSL_CERT_FILE=$(python3 -m certifi)
uvicorn main:app --reload
"""


# add CORSMiddleware to handle CORS (otherwise get 405 Method Not Allowed error)
origins = [
    "http://localhost",  # allow frontend (localhost)
    "http://localhost:3000",
    "http://localhost:8000"  # for example if using react's default port
]

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
print("MONGO_URI =", MONGO_URI)
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["keyword_db"]

# lifespan event handler to manage startup/shutdown of the app
# using asynccontextmanager decorator. Context manager defines async setup and teardown (release resources)
# useful for tasks involving async operations like connecting to DB, making network requests, etc.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: initialize MongoDB client
    app.mongodb_client = AsyncIOMotorClient(MONGO_URI)
    app.db = app.mongodb_client.keyword_db  # keyword_db is our database name
    print(f"Connected to database: {app.db.name}")
    yield
    # shutdown: close MongoDB client
    app.mongodb_client.close()


# use the lifespan context manager to manage app startup and shutdown
app = FastAPI(lifespan=lifespan)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allow all origins (CORS)
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # allow all headers
)

# handle OPTIONS request to respond to preflight request

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Keyword API!"}

# pydantic model for request body
class KeywordRequest(BaseModel):
    query: str
    user_id: str

    
# Define a Pydantic model for Sentiment results    
class SentimentResult(BaseModel):
    keyword_id: str  # matches the _id in keywords collection
    total_analyzed: int
    sentiment_breakdown: Dict[str, int]  

# helper fu"ction to sanitize the input (remove unwanted chars, e.g., special chars)
def sanitize_input(input_str: str) -> str:
    sanitized = re.sub(r'[^a-zA-Z0-9 ]', '', input_str)  # remove all chars except alphabets, numbers, and spaces
    return sanitized.strip().lower()  # strip leading/trailing spaces, convert to lowercase

# to further sanitize the input, we should convert it all to lowercase, and make sure we dont add conjugations of the same word to the db!



# endpoint to handle POST request:
@app.post("/keywords/")
async def create_keyword(keyword: KeywordRequest):
    print("Received keyword:", keyword)
    sanitized_query = sanitize_input(keyword.query)

    if not sanitized_query:
        raise HTTPException(status_code=400, detail="Keyword cannot be empty or invalid.")

    created_at = datetime.now().isoformat()
    keyword_id = str(uuid.uuid4())

    keyword_document = {
        "_id": keyword_id,
        "query": sanitized_query,
        "created_at": created_at,
    }
    if keyword.user_id:
        keyword_document["user_id"] = keyword.user_id

    try:
        result = await app.db.keywords.insert_one(keyword_document)
        return {
            "id": keyword_id,
            "query": sanitized_query,
            "created_at": created_at,
            "message": "Keyword stored successfully"
        }
    except Exception as e:
        print(f"❌ DATABASE ERROR: {e}")
        raise HTTPException(status_code=500, detail="Failed to store keyword in database.")
# Endpoint to fetch all keywords
@app.get("/keywords/")
async def get_keywords():
    keywords = await app.db.keywords.find().to_list(length=100)
    return keywords
