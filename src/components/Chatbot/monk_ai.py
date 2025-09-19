# monk_ai.py
import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
import difflib
import google.generativeai as genai

# Load Gemini API key from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")
genai.configure(api_key=API_KEY)

class MonkAI:
    def __init__(self, training_file="training_examples.json"):
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.training_file = training_file
        self.training_data = self._load_training_data()
        self.conversation_history = []  # store conversation context
        self.last_refresh = datetime.now()
        self.refresh_interval = timedelta(hours=24)

    def _load_training_data(self):
        with open(self.training_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data

    def _refresh_embeddings_if_needed(self):
        # Placeholder if you implement automatic retrieval updates
        if datetime.now() - self.last_refresh > self.refresh_interval:
            self.training_data = self._load_training_data()
            self.last_refresh = datetime.now()

    def retrieve(self, query, top_k=3):
        # Find top_k similar questions from training_data
        similarities = []
        for entry in self.training_data:
            ratio = difflib.SequenceMatcher(None, query.lower(), entry["question"].lower()).ratio()
            similarities.append((ratio, entry))
        similarities.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in similarities[:top_k]]

    def generate_response(self, user_query: str) -> str:
        self._refresh_embeddings_if_needed()

        # Add user query to conversation history
        self.conversation_history.append({"role": "user", "content": user_query})

        # Limit conversation window to last 6 messages to keep prompt short
        MAX_HISTORY = 6
        self.conversation_history = self.conversation_history[-MAX_HISTORY:]

        # Retrieve top examples
        retrieved = self.retrieve(user_query)
        context = "\n".join([f"Q: {ex['question']}\nA: {ex['answer']}" for ex in retrieved])

        # Build conversation history text
        history_text = "\n".join([f"{m['role'].title()}: {m['content']}" for m in self.conversation_history])

        # Build prompt for Gemini
        prompt = f"""
You are Monk AI — a polite, professional Sikkim travel guide.
- Give concise answers by default (4–5 lines).
- Expand only if the user explicitly asks.
- Reference previous conversation context when needed.

Conversation so far:
{history_text}

Retrieved knowledge from training data:
{context}

User Question: {user_query}
Monk AI Answer:
"""

        # Generate response
        response = self.model.generate_content(prompt)
        bot_reply = response.text.strip()

        # Save AI reply to conversation history
        self.conversation_history.append({"role": "assistant", "content": bot_reply})

        return bot_reply

    def feedback_loop(self, user_question, bot_answer, feedback):
        """
        Optional: Add feedback-based Q&A to training_examples.json
        feedback = {"useful": True/False, "preferred_answer": "text"}
        """
        if feedback.get("useful") and "preferred_answer" in feedback:
            new_id = max([x["id"] for x in self.training_data]) + 1
            new_entry = {
                "id": new_id,
                "type": "Expanded" if len(feedback["preferred_answer"].split()) > 50 else "Concise",
                "question": user_question,
                "answer": feedback["preferred_answer"]
            }
            self.training_data.append(new_entry)
            with open(self.training_file, "w", encoding="utf-8") as f:
                json.dump(self.training_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    bot = MonkAI()
    print("Welcome to Monk AI — your Sikkim travel guide. Type 'exit' to quit.")
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == "exit":
            print("Monk AI: Safe travels, my friend!")
            break
        bot_response = bot.generate_response(user_input)
        print(f"Monk AI: {bot_response}")
