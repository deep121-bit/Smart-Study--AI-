import subprocess
import time
import webbrowser
from pathlib import Path

ROOT = Path(__file__).parent

subprocess.Popen(
    ["cmd", "/k",
     "cd /d backend && ..\\venv\\Scripts\\activate.bat && python -m uvicorn main:app --reload --port 8000"],
    cwd=ROOT
)

time.sleep(5)

subprocess.Popen(
    ["cmd", "/k",
     "python -m http.server 5500"],
    cwd=ROOT
)

time.sleep(2)

webbrowser.open("http://127.0.0.1:5500/index.html")

print("SmartStudy AI Started")