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


## NOTE:
When we deal with the APIs you'll have to add an .env file to the backend folder. The API keys will go here. But that's not super important right now just throwing that out there. 