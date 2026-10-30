"use strict";

const STORAGE_KEYS = {
  username: "collotalk_username",
  messages: "collotalk_messages"
};

const state = {
  username: "Guest",
  messages: []
};

const elements = {
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  menuButton: document.getElementById("menuButton"),
  newConversationButton: document.getElementById("newConversationButton"),
  editProfileButton: document.getElementById("editProfileButton"),
  profileName: document.getElementById("profileName"),
  profileAvatar: document.getElementById("profileAvatar"),
  conversationPreview: document.getElementById("conversationPreview"),
  messageArea: document.getElementById("messageArea"),
  emptyState: document.getElementById("emptyState"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  characterCount: document.getElementById("characterCount"),
  clearMessagesButton: document.getElementById("clearMessagesButton"),
  profileModal: document.getElementById("profileModal"),
  profileForm: document.getElementById("profileForm"),
  usernameInput: document.getElementById("usernameInput"),
  profileError: document.getElementById("profileError"),
  closeProfileButton: document.getElementById("closeProfileButton"),
  cancelProfileButton: document.getElementById("cancelProfileButton"),
  clearModal: document.getElementById("clearModal"),
  clearForm: document.getElementById("clearForm"),
  cancelClearButton: document.getElementById("cancelClearButton")
};

function loadState() {
  const savedUsername = localStorage.getItem(STORAGE_KEYS.username);
  const savedMessages = localStorage.getItem(STORAGE_KEYS.messages);

  if (savedUsername && savedUsername.trim()) {
    state.username = savedUsername.trim().slice(0, 24);
  }

  if (savedMessages) {
    try {
      const parsedMessages = JSON.parse(savedMessages);

      if (Array.isArray(parsedMessages)) {
        state.messages = parsedMessages.filter(isValidMessage);
      }
    } catch {
      state.messages = [];
    }
  }
}

function isValidMessage(message) {
  return Boolean(
    message &&
    typeof message.id === "string" &&
    typeof message.author === "string" &&
    typeof message.text === "string" &&
    typeof message.createdAt === "string"
  );
}

function saveUsername() {
  localStorage.setItem(STORAGE_KEYS.username, state.username);
}

function saveMessages() {
  localStorage.setItem(
    STORAGE_KEYS.messages,
    JSON.stringify(state.messages)
  );
}

function getInitial(name) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "?";
  }

  return Array.from(trimmedName)[0].toUpperCase();
}

function updateProfileDisplay() {
  elements.profileName.textContent = state.username;
  elements.profileAvatar.textContent = getInitial(state.username);
}

function renderMessages() {
  const existingMessages = elements.messageArea.querySelectorAll(
    ".message-group"
  );

  existingMessages.forEach((messageElement) => {
    messageElement.remove();
  });

  elements.emptyState.hidden = state.messages.length > 0;

  state.messages.forEach((message) => {
    const messageElement = createMessageElement(message);
    elements.messageArea.appendChild(messageElement);
  });

  updateConversationPreview();
  scrollToLatestMessage(false);
}

function createMessageElement(message) {
  const group = document.createElement("article");
  group.className = "message-group own-message";
  group.dataset.messageId = message.id;

  const avatar = document.createElement("div");
  avatar.className = "avatar avatar-blue";
  avatar.textContent = getInitial(message.author);
  avatar.setAttribute("aria-hidden", "true");

  const content = document.createElement("div");
  content.className = "message-content";

  const meta = document.createElement("div");
  meta.className = "message-meta";

  const author = document.createElement("span");
  author.className = "message-author";
  author.textContent = message.author;

  const time = document.createElement("time");
  time.className = "message-time";
  time.dateTime = message.createdAt;
  time.textContent = formatMessageTime(message.createdAt);

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = message.text;

  meta.append(author, time);
  content.append(meta, bubble);
  group.append(avatar, content);

  return group;
}

function formatMessageTime(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function updateConversationPreview() {
  const latestMessage = state.messages.at(-1);

  if (!latestMessage) {
    elements.conversationPreview.textContent = "Start a conversation";
    return;
  }

  elements.conversationPreview.textContent = latestMessage.text;
}

function sendMessage() {
  const text = elements.messageInput.value.trim();

  if (!text) {
    return;
  }

  const message = {
    id: createMessageId(),
    author: state.username,
    text: text.slice(0, 1000),
    createdAt: new Date().toISOString()
  };

  state.messages.push(message);
  saveMessages();

  elements.emptyState.hidden = true;

  const messageElement = createMessageElement(message);
  elements.messageArea.appendChild(messageElement);

  updateConversationPreview();

  elements.messageInput.value = "";
  updateComposer();
  scrollToLatestMessage(true);
  elements.messageInput.focus();
}

function createMessageId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function updateComposer() {
  const length = elements.messageInput.value.length;
  const hasMessage = elements.messageInput.value.trim().length > 0;

  elements.characterCount.textContent = `${length} / 1000`;
  elements.sendButton.disabled = !hasMessage;

  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height = `${Math.min(
    elements.messageInput.scrollHeight,
    150
  )}px`;
}

function scrollToLatestMessage(smooth) {
  requestAnimationFrame(() => {
    elements.messageArea.scrollTo({
      top: elements.messageArea.scrollHeight,
      behavior: smooth ? "smooth" : "auto"
    });
  });
}

function openProfileModal() {
  elements.usernameInput.value =
    state.username === "Guest" ? "" : state.username;

  elements.profileError.textContent = "";

  if (!elements.profileModal.open) {
    elements.profileModal.showModal();
  }

  requestAnimationFrame(() => {
    elements.usernameInput.focus();
    elements.usernameInput.select();
  });
}

function closeProfileModal() {
  if (elements.profileModal.open) {
    elements.profileModal.close();
  }

  elements.profileError.textContent = "";
}

function saveProfile() {
  const username = elements.usernameInput.value.trim();

  if (!username) {
    elements.profileError.textContent = "Enter a display name.";
    elements.usernameInput.focus();
    return;
  }

  state.username = username.slice(0, 24);
  saveUsername();
  updateProfileDisplay();
  closeProfileModal();
  elements.messageInput.focus();
}

function openClearModal() {
  if (state.messages.length === 0) {
    return;
  }

  if (!elements.clearModal.open) {
    elements.clearModal.showModal();
  }
}

function closeClearModal() {
  if (elements.clearModal.open) {
    elements.clearModal.close();
  }
}

function clearMessages() {
  state.messages = [];
  saveMessages();
  renderMessages();
  closeClearModal();
  elements.messageInput.focus();
}

function openSidebar() {
  elements.sidebar.classList.add("open");
  elements.sidebarOverlay.classList.add("visible");
  elements.menuButton.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  elements.sidebar.classList.remove("open");
  elements.sidebarOverlay.classList.remove("visible");
  elements.menuButton.setAttribute("aria-expanded", "false");
}

function toggleSidebar() {
  if (elements.sidebar.classList.contains("open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function setUpEventListeners() {
  elements.messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
  });

  elements.messageInput.addEventListener("input", updateComposer);

  elements.messageInput.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      sendMessage();
    }
  });

  elements.editProfileButton.addEventListener(
    "click",
    openProfileModal
  );

  elements.newConversationButton.addEventListener(
    "click",
    openClearModal
  );

  elements.closeProfileButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.cancelProfileButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProfile();
  });

  elements.clearMessagesButton.addEventListener(
    "click",
    openClearModal
  );

  elements.cancelClearButton.addEventListener(
    "click",
    closeClearModal
  );

  elements.clearForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessages();
  });

  elements.menuButton.addEventListener("click", toggleSidebar);
  elements.sidebarOverlay.addEventListener("click", closeSidebar);

  elements.profileModal.addEventListener("click", (event) => {
    if (event.target === elements.profileModal) {
      closeProfileModal();
    }
  });

  elements.clearModal.addEventListener("click", (event) => {
    if (event.target === elements.clearModal) {
      closeClearModal();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeSidebar();
    }
  });
}

function initializeApp() {
  loadState();
  updateProfileDisplay();
  renderMessages();
  updateComposer();
  setUpEventListeners();

  if (!localStorage.getItem(STORAGE_KEYS.username)) {
    openProfileModal();
  } else {
    elements.messageInput.focus();
  }
}

initializeApp();
