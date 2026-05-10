"""
Mock LLM Chat implementation for ATLAS VEX.
This is a placeholder until the real emergentintegrations package is available.
"""

import asyncio
from typing import Optional

class UserMessage:
    def __init__(self, text: str):
        self.text = text

class LlmChat:
    def __init__(self, api_key: str, session_id: str, system_message: str):
        self.api_key = api_key
        self.session_id = session_id
        self.system_message = system_message

    def with_model(self, provider: str, model: str):
        self.provider = provider
        self.model = model
        return self

    async def send_message(self, message: UserMessage) -> str:
        # Mock response - in a real implementation, this would call the LLM API
        await asyncio.sleep(0.1)  # Simulate API call delay

        # Simple mock response based on the message
        if "hello" in message.text.lower() or "hi" in message.text.lower():
            return "Greetings, operator. Atlas Vex online. How may I assist with your autonomous systems inquiry?"
        elif "project" in message.text.lower():
            return "I can provide information about Alan's featured systems: LEGION CORE (distributed AI orchestration), ATLAS MEMORY (persistent autonomous memory), and OMEGA SECURITY (adaptive DevSecOps). Which would you like to know more about?"
        else:
            return "Transmission received. Alan specializes in autonomous systems architecture, AI orchestration, and cybernetic execution. Would you like to discuss a specific project or service?"