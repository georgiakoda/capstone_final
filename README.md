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
## 3. Test
Go to the frontend folder and try running:
   ```bash
   npm start
   ```
If it works a browser window should open on http://localhost:3000/

Next, go to the backend folder and run:
   ```bash
   uvicorn main:app --reload
   ```
If everything is good it should say:
   ```bash
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   INFO:     Started reloader process [12345] using StatReload
   INFO:     Started server process [12346]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   ```
In your broswer go to: http://127.0.0.1:8000/
and a JSON should show up with the message "test". 

## Switching to your branch
Run:
   ```bash
   git checkout <your name>
   ```
It's just your first name, all lowercase, no < >.
