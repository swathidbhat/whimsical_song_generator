"""
Simple Flask API for Lyrics Generation
Give this file to your teammate working on lyrics/video generation
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dataclasses import dataclass
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Allow Next.js to call this API

@dataclass
class EmployeeInfo:
    name: str
    department: str
    role: str
    years: int

PROMPT_TEMPLATE = """You are a songwriter creating parody corporate jingles for a fictional HR training app. 
Each song is an over-the-top, cheerful parody about firing an employee — intended to show how absurd or tone-deaf corporate communication can sound.

Your task:
Write a 30-second song announcing that an employee has been "let go," using the following details:
- Employee name: {employee_name}
- Department: {department}
- Role: {role}
- Years at company: {years_of_work}

Guidelines:
- Keep lyrics between 6–8 lines (≈ 30 seconds when sung)
- Tone: overly optimistic, corporate-jargon-heavy, ironically cheerful
- Style: parody of a motivational company jingle
- Must sound playful and fictional — no cruelty or realism
- Include workplace clichés like "synergy," "restructuring," "growth mindset"
- End with a catchy, ironic corporate tagline (e.g., "We wish you synergy on your way!")
- Avoid profanity, real company names, or specific insults

Output format:
Return ONLY the song lyrics (no explanations, no preambles).
Optionally suggest a musical style in parentheses at the top.
"""

def build_prompt(emp: EmployeeInfo) -> str:
    return PROMPT_TEMPLATE.format(
        employee_name=emp.name,
        department=emp.department,
        role=emp.role,
        years_of_work=emp.years
    )

def generate_lyrics(emp: EmployeeInfo) -> str:
    """Generate lyrics using OpenAI"""
    client = OpenAI()
    prompt = build_prompt(emp)
    
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You write concise, catchy parody corporate songs."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
    )
    return resp.choices[0].message.content.strip()

@app.route('/generate-video', methods=['POST'])
def generate_video():
    """
    Endpoint that Next.js will call to generate termination video
    
    Expected input:
    {
        "employeeName": "John Doe",
        "employeeInfo": "Sales rep, 3 years at company, missed quota..."
    }
    
    Expected output:
    {
        "videoUrl": "https://replicate.delivery/video123.mp4",
        "status": "ready",
        "lyrics": "... generated lyrics ..."
    }
    """
    try:
        data = request.json
        employee_name = data.get('employeeName', '')
        employee_info = data.get('employeeInfo', '')
        
        # Parse employee info (simple parsing for hackathon)
        # You can improve this parsing logic
        info_lower = employee_info.lower()
        
        # Extract department and role from info text
        department = "Operations"  # Default
        if 'sales' in info_lower:
            department = "Sales"
        elif 'engineering' in info_lower or 'developer' in info_lower:
            department = "Engineering"
        elif 'marketing' in info_lower:
            department = "Marketing"
        
        # Extract years
        years = 3  # Default
        import re
        year_match = re.search(r'(\d+)\s*year', info_lower)
        if year_match:
            years = int(year_match.group(1))
        
        # Create employee info object
        emp = EmployeeInfo(
            name=employee_name,
            department=department,
            role="Employee",  # Can parse from info if needed
            years=years
        )
        
        # Generate lyrics
        lyrics = generate_lyrics(emp)
        print(f"Generated lyrics for {employee_name}:")
        print(lyrics)
        
        # TODO: Call ElevenLabs for voice generation
        # TODO: Call Replicate for video generation
        # For now, return mock data
        
        # MOCK RESPONSE - Replace with real video URL from Replicate
        return jsonify({
            "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            "status": "ready",
            "lyrics": lyrics
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": str(e),
            "status": "failed"
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # Run on port 5000
    # Your teammate should run: python lyrics_api.py
    app.run(host='0.0.0.0', port=5000, debug=True)
