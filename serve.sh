#!/bin/bash
# ============================================
# Meraki Roofing — Local Dev Server
# ============================================
# Run this instead of opening HTML files directly.
# Google Maps API requires a proper HTTP server.
#
# Usage: double-click this file, or run in terminal:
#   ./serve.sh
#
# Then open: http://localhost:8000
# ============================================

PORT=8000
echo ""
echo "  🏠 Meraki Roofing — Local Server"
echo "  ─────────────────────────────────"
echo "  Open in browser: http://localhost:$PORT"
echo "  Press Ctrl+C to stop"
echo ""

# Try Python 3 first, then Python 2
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "  ❌ Python not found. Install Python or use:"
    echo "     npx serve -p $PORT"
    echo ""
    if command -v npx &> /dev/null; then
        npx serve -p $PORT
    fi
fi
