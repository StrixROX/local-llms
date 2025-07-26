const BASE_URL = "http://localhost:11434";

const MODEL_SEED = undefined;

const ENDPOINTS = {
  CHAT: `${BASE_URL}/api/chat`,
  LIST_MODELS: `${BASE_URL}/api/tags`,
};

const ROLE_CLASS_MAP = {
  USER: "user",
  ASSISSTANT: "assisstant",
};

const chatLog = [];

function scrollToBottom(element) {
  setTimeout(() => {
    element.scrollTop = element.scrollHeight;
  }, 0);
}

/**
 * Adds message to chat history based on sender role
 *
 * @param {keyof typeof ROLE_CLASS_MAP} role role of message sender
 * @param {string} message message string
 */
function addMessage(role, message, isStreaming = false, isThinking = false) {
  if (!message) return;

  const chatHistory = document.getElementById("chat-history");
  const thinkingClass = isThinking ? "thinking" : "not-thinking";

  if (isStreaming) {
    // add block to DOM
    const lastMessageBlock = document.querySelector(
      `.${ROLE_CLASS_MAP[role]}.${thinkingClass}:last-child`
    );

    let newMdContent = message;

    if (lastMessageBlock) {
      lastMessageBlock.remove();

      const prevMdContent =
        lastMessageBlock.querySelector("md-block").mdContent;
      newMdContent = prevMdContent + message;
    }

    chatHistory.innerHTML += `<div class="${ROLE_CLASS_MAP[role]} message ${thinkingClass}"><md-block>${newMdContent}</md-block></div>`;

    // update chatLog
    if (chatLog[chatLog.length - 1].role === ROLE_CLASS_MAP[role]) {
      chatLog[chatLog.length - 1].content += message;
    } else {
      chatLog.push({ role: ROLE_CLASS_MAP[role], content: message });
    }
  } else {
    // add block to DOM
    chatHistory.innerHTML += `<div class="${ROLE_CLASS_MAP[role]} message ${thinkingClass}"><md-block>${message}</md-block></div>`;

    // update chatLog
    chatLog.push({ role: ROLE_CLASS_MAP[role], content: message });
  }
}

let isReceivingMessage = false;

function onUserSend({ model, think, stream = true }) {
  if (isReceivingMessage) return;

  const input = document.getElementById("user-input");
  const message = input.value.trim();

  if (message === "") return;

  input.value = "";

  addMessage("USER", message);
  generateResponse({ model, think, stream });
}

function generateResponse({ model, think, stream }) {
  const requestBody = JSON.stringify({
    model,
    messages: chatLog,
    stream,
    think,
    options: {
      seed: MODEL_SEED,
      format: "json",
    },
  });

  fetch(ENDPOINTS.CHAT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleStreamingResponse(response);
    })
    .catch((error) => {
      console.error("Error:", error);
      addMessage("ASSISSTANT", `Sorry, there was an error: ${error.message}`);
    });
}

async function handleStreamingResponse(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  isReceivingMessage = true;

  while (isReceivingMessage) {
    const { done, value } = await reader.read();

    const ndJsonChunk = decoder.decode(value);

    if (ndJsonChunk) {
      const parsedJson = JSON.parse(ndJsonChunk);
      addMessage(
        "ASSISSTANT",
        parsedJson.message.content || parsedJson.message.thinking,
        true,
        !!parsedJson.message.thinking
      );
    }

    if (done) {
      isReceivingMessage = false;
      return;
    }
  }
}
