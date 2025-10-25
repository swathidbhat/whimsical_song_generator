# ⚡ Quick Start - Flask API (For Teammate)

## 🚨 Got "No module named 'flask'" error?

Run these commands in order:

### Windows (PowerShell):

```powershell
# 1. Navigate to the folder
cd teammate_integration

# 2. Install Python packages
pip install flask flask-cors openai python-dotenv

# 3. Create .env file with your OpenAI key
"OPENAI_API_KEY=your_key_here" | Out-File -FilePath .env -Encoding utf8

# 4. Run the server
python lyrics_api.py
```

### Mac/Linux:

```bash
# 1. Navigate to the folder
cd teammate_integration

# 2. Install Python packages
pip install flask flask-cors openai python-dotenv

# 3. Create .env file with your OpenAI key
echo "OPENAI_API_KEY=your_key_here" > .env

# 4. Run the server
python lyrics_api.py
```

## ✅ Success!

You should see:
```
* Running on http://127.0.0.1:5000
* Running on http://0.0.0.0:5000
```

## 🧪 Test It

Open new terminal and run:

```bash
curl -X POST http://localhost:5000/generate-video -H "Content-Type: application/json" -d "{\"employeeName\": \"Test\", \"employeeInfo\": \"Sales, 3 years\"}"
```

Should return lyrics!

## 🐛 Still Having Issues?

### "pip not found"?
```bash
# Try python -m pip instead
python -m pip install flask flask-cors openai python-dotenv
```

### "Permission denied"?
```bash
# Use --user flag
pip install --user flask flask-cors openai python-dotenv
```

### Using virtual environment (Recommended)?
```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Then install
pip install flask flask-cors openai python-dotenv
```

## 🎯 Next Step

Once Flask is running, tell your web app teammate:
**"Flask running on port 5000 ✅"**

They can now test the integration!
