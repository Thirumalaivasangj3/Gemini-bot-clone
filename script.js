const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

// State variables
let userMessage = null;
let isResponseGenerating = false;

// Updated API configuration for Gemini 1.5 Flash (latest stable)
const API_KEY = "AIzaSyD-s05_QqnizUk3MuJJoWQBWbeLkjQlgjg"; // Replace with your key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Load saved data
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  const isLightMode = localStorage.getItem("themeColor") === "light_mode";

  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", savedChats);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

// Create message element
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

// Typing effect
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    if (currentWordIndex < words.length) {
      textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex];
      currentWordIndex++;
      incomingMessageDiv.querySelector(".icon")?.classList.add("hide");
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
    } else {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon")?.classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML);
    }
  }, 50);
}

// API Request with updated format
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userMessage }]
        }],
        generationConfig: {
          temperature: 0.9,
          topP: 1,
          topK: 40
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "API request failed");
    }

    const apiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "Sorry, I couldn't generate a response.";
    showTypingEffect(apiResponse, textElement, incomingMessageDiv);
  } catch (error) {
    console.error("API Error:", error);
    isResponseGenerating = false;
    textElement.innerText = `Error: ${error.message}`;
    textElement.parentElement.classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
}

// Loading animation
const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="downloads.png" alt="Gemini avatar">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onclick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  generateAPIResponse(incomingMessageDiv);
}

// Copy function
window.copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText).then(() => {
    copyButton.innerText = "done";
    setTimeout(() => copyButton.innerText = "content_copy", 1000);
  });
}

// Add timestamp
const appendTimestamp = (messageDiv) => {
  const timestamp = document.createElement("span");
  timestamp.className = "timestamp";
  timestamp.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  messageDiv.querySelector(".message-content").appendChild(timestamp);
}

// Handle outgoing messages
const handleOutgoingChatLogic = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim();
  if (!userMessage || isResponseGenerating) return;

  isResponseGenerating = true;

  const html = `<div class="message-content">
                  <img class="avatar" src="download1.png" alt="User avatar">
                  <p class="text">${userMessage}</p>
                </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  chatContainer.appendChild(outgoingMessageDiv);
  appendTimestamp(outgoingMessageDiv);

  typingForm.reset();
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showLoadingAnimation, 500);
}

// Event listeners
typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChatLogic();
});

suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChatLogic();
  });
});

toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

deleteChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all chats?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
});

// Initialize
loadDataFromLocalstorage();
