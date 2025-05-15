# Setup Guide

## 1. Install `frontend` dependencies:
   ```bash
   cd frontend
   npm install
   ```
   
## 2. Install `backend` dependencies:
   ```bash
   cd backend

   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   venv\Scripts\activate     # On Windows

   pip install -r requirements.txt
   ```
## 3. API Keys
You will need to create an .env file in the `backend` folder. It should look like:

   ```bash
    REDDIT_CLIENT_ID=
    REDDIT_CLIENT_SECRET=
    REDDIT_USER_AGENT=WhateverYouNamedYourProject (by /u/yourusername)

    MONGO_URI=
   ```
To get your own REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET, go to https://www.reddit.com/prefs/apps/ and create a new app. Select "script" as the app type. The Client ID should be in the top left corner underneath "personal use script" and the Client Secret is the string next to "secret". 

As for the MONGO_URI value, if you're our professor, Georgia emailed it to you. If you're having trouble getting the database part to work, I might have to invite you to the project as a Project Owner on MongoDB so just email Georgia again. 

If you want to use your own MongoDB cluster, go to "Connect", click "Drivers", select Python from the drop down menu (this project uses Python 3.9.6) and copy paste the value inside the quotations that follows `uri =` in the code sample. 


## 4. Run
Go to the backend folder and run:
   ```bash
   uvicorn main:app --reload
   ```
If everything is good it should say something like:
   ```bash
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   INFO:     Started reloader process [12345] using StatReload
   INFO:     Started server process [12346]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   ```
Next, go to the frontend folder and run:
   ```bash
   npm start
   ```
If set up correctly a browser window should open on http://localhost:3000/

## 5. Use
Enter a search term in the text box on the homepage. Optionally, you can specify a subreddit to search in as well as a filter (top, new, relevance, hot or comments). If no subreddit is provided, it will default to searching all. If no filter is selected, it will default to sorting by relevance. DO NOT INCLUDE SPACES IN THE SUBREDDIT NAME! It won't return any results. 

You can also select how many posts you would like to return. The Reddit API will typically return less than selected.

Note: sorting by relevance will limit the amount of posts returned significantly. Consider sorting by new to get more posts. 


# Below this point are updates that were used for team communication, disregard them

### Update 5/5 - Georgia
Graph is made using plotly, so do this in the frontend folder:
```bash
   npm install plotly.js-dist-min
```

### Update 4/6 - Mohib

**BackEnd**
Prevented duplicate keywords from being added to the database
Added a new GET /keywords/ endpoint to fetch keyword search history

**Frontend**
Created a Keyword History page to show all previously searched keywords
Built an About Us section
Added axios to fetch data from backend
And updated the NavBar with about us and history section


### Update 3/19 -Georgia
Updated frontend using Bootstrap. Do this in the frontend folder:

```bash
   npm install bootstrap bootstrap-icons react-router-dom
```
bootstrap and bootstrap-icons is for styling and react-router-dom is for page navigation

#### Info about getting the Reddit search endpoint to work
Apparently to get it working you need to either set up your own reddit app and get your own API credentials (select "script" not "web app") OR give me your reddit username so I can add you as a developer and you can use the reddit API credentials I put in the gc. 

#### Mongo DB update
In the .env file I asked you to add in the 2/22 update, add this field:

```bash
   MONGO_URI=
```
Check the group chat for the value. Or message again if you can't find it I'll resend it. Make sure you don't upload your .env file to the github, it's public! It should be listed in your .gitignore file like: *.env so it doesn't upload but just make sure you don't upload it. 

This should make it so that we can all view the database online through the MongoDB website. But Tam and Mohib you have to send me the email address you have associated with your MongoDB account so I can invite you to the project. 

One more thing I'm realizing we didn't explictly discuss the .gitignore, make sure you have one in the main project folder that looks like this:

```bash
   # Node.js modules
   frontend/node_modules/

   # Python virtual environment
   backend/venv/

   # Other files
   *.log
   *.env
```

### Update 3/10 -Eva
To work with database, type mongosh in the terminal. If unrecognized, follow instructions for download. Once mongosh terminal is working, do:

```bash
    use keyword_db
    db.keywords.find()
```

to be able to look at the keywords.


### Update 2/22 -Georgia
We're using the Reddit API! Not pushshift! You have to install the python-dotenv package. This is just so that the private API info doesn't publish to github for everyone to see. Do:
```bash
    pip install python-dotenv
```
Then in the "backend" folder make a file called ".env". Write this this in the file:
```bash
    # .env file
    REDDIT_CLIENT_ID=
    REDDIT_CLIENT_SECRET=
    REDDIT_USER_AGENT=
```
Then when youre ready to work with the API inquire within the whatsapp group chat and I'll give you the info. 