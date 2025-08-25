#!/bin/bash

# Try different ways to run gunicorn
echo "Attempting to start the application..."

# Method 1: Direct gunicorn
if command -v gunicorn &> /dev/null; then
    echo "Using direct gunicorn command"
    exec gunicorn run:app --bind 0.0.0.0:$PORT --workers 1
fi

# Method 2: Python module
echo "Using python -m gunicorn"
exec python -m gunicorn run:app --bind 0.0.0.0:$PORT --workers 1

# Method 3: Fallback to Flask development server
echo "Falling back to Flask development server"
exec python run.py
