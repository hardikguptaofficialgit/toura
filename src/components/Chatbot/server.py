# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from monk_ai import MonkAI

# Initialize Flask
app = Flask(__name__)
CORS(app)  # allow frontend (vite at 5173) to connect

# Load Monk AI
bot = MonkAI()

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_query = data.get("query", "").strip()

        if not user_query:
            return jsonify({"reply": "⚠️ Please enter a valid question."}), 400

        bot_response = bot.generate_response(user_query)
        return jsonify({"reply": bot_response})
    
    except Exception as e:
        return jsonify({"reply": f"⚠️ Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
