"use strict";

const STORAGE_KEY = "collotalk_state_v1";

const state = {
  username: "Guest",
  directs: [],
  groups: [],
  servers: [],
  messages: {},
  selectedType: null,
  selectedId: null,
  selectedServerId: null,
  createMode: null
};

const elements = {
  app: document.querySelector(".app"),
  homeButton: document.getElementById("homeButton"),
  serverList: document.getElementById("serverList"),
  addServerButton: document.getElementById("addServerButton"),
  navigationTitle: document.getElementById("navigationTitle"),
  navigationSubtitle: document.getElementById("navigationSubtitle"),
  homeContent: document.getElementById("homeContent"),
  serverContent: document.getElementById("serverContent"),
  serverDescription: document.getElementById("serverDescription"),
  channelList: document.getElementById("channelList"),
  directList: document.getElementById("directList"),
  groupList: document.getElementById("groupList"),
  addDirectButton: document.getElementById("addDirectButton"),
  addGroupButton: document.getElementById("addGroupButton"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileName: document.getElementById("profileName"),
  profileButton: document.getElementById("profileButton"),
  settingsButton: document.getElementById("settingsButton"),
  chatIcon: document.getElementById("chatIcon"),
  chatTitle: document.getElementById("chatTitle"),
  chatSubtitle: document.getElementById("chatSubtitle"),
  deleteButton: document.getElementById("deleteButton"),
  messageArea: document.getElementById("messageArea"),
  composer: document.getElementById("composer"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  characterCount: document.getElementById("characterCount"),
  menuButton: document.getElementById("menuButton"),
  closeNavigationButton: document.getElementById("closeNavigationButton"),
  overlay: document.getElementById("overlay"),
  createModal: document.getElementById("createModal"),
  createForm: document.getElementById("createForm"),
  createTitle: document.getElementById("createTitle"),
  createDescription: document.getElementById("createDescription"),
  createLabel: document.getElementById("createLabel"),
  createNameInput: document.getElementById("createNameInput"),
  createHint: document.getElementById("createHint"),
  createError: document.getElementById("createError"),
  closeCreateButton: document.getElementById("closeCreateButton"),
  cancelCreateButton: document.getElementById("cancelCreateButton"),
  profileModal: document.getElementById("profileModal"),
  profileForm: document.getElementById("profileForm"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileError: document.getElementById("profileError"),
  closeProfileButton: document.getElementById("closeProfileButton"),
  cancelProfileButton: document.getElementById("cancelProfileButton")
};

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return;
  }

  try {
    const parsed = JSON.parse(savedState);

    state.username =
      typeof parsed.username === "string" ? parsed.username : "Guest";

    state.directs = Array.isArray(parsed.directs) ? parsed.directs : [];
    state.groups = Array.isArray(parsed.groups) ? parsed.groups : [];
    state.servers = Array.isArray(parsed.servers) ? parsed.servers : [];

    state.messages =
      parsed.messages &&
      typeof parsed.messages === "object" &&
      !Array.isArray(parsed.messages)
        ? parsed.messages
        : {};
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      username: state.username,
      directs: state.directs,
      groups: state.groups,
      servers: state.servers,
      messages: state.messages
    })
  );
}

function createId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function getInitial(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "?";
  }

  return Array.from(text)[0].toUpperCase();
}

function getServerShortName(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${getInitial(words[0])}${getInitial(words[1])}`;
  }

  return Array.from(name.trim()).slice(0, 2).join("").toUpperCase();
}

function getConversationKey() {
  if (state.selectedType === "server") {
    return `server:${state.selectedServerId}:${state.selectedId}`;
  }

  return `${state.selectedType}:${state.selectedId}`;
}

function getCurrentItem() {
  if (state.selectedType === "direct") {
    return state.directs.find((item) => item.id === state.selectedId);
  }

  if (state.selectedType === "group") {
    return state.groups.find((item) => item.id === state.selectedId);
  }

  if (state.selectedType === "server") {
    const server = state.servers.find(
      (item) => item.id === state.selectedServerId
    );

    if (!server) {
      return null;
    }

    const channel = server.channels.find(
      (item) => item.id === state.selectedId
    );

    if (!channel) {
      return null;
    }

    return {
      ...channel,
      server
    };
  }

  return null;
}

function updateProfile() {
  elements.profileName.textContent = state.username;
  elements.profileAvatar.textContent = getInitial(state.username);
}

function renderHome() {
  elements.homeContent.hidden = false;
  elements.serverContent.hidden = true;
  elements.navigationTitle.textContent = "ColloTalk";
  elements.navigationSubtitle.textContent = "Simple conversations";

  renderDirects();
  renderGroups();
}

function renderDirects() {
  elements.directList.replaceChildren();

  if (state.directs.length === 0) {
    elements.directList.appendChild(
      createEmptyList("No direct messages yet.")
    );
    return;
  }

  state.directs.forEach((direct) => {
    const button = createItemButton(direct, "direct");
    elements.directList.appendChild(button);
  });
}

function renderGroups() {
  elements.groupList.replaceChildren();

  if (state.groups.length === 0) {
    elements.groupList.appendChild(
      createEmptyList("No private groups yet.")
    );
    return;
  }

  state.groups.forEach((group) => {
    const button = createItemButton(group, "group");
    elements.groupList.appendChild(button);
  });
}

function createEmptyList(text) {
  const paragraph = document.createElement("p");
  paragraph.className = "empty-list";
  paragraph.textContent = text;
  return paragraph;
}

function createItemButton(item, type) {
  const button = document.createElement("button");
  button.className = "item-button";
  button.type = "button";

  if (
    state.selectedType === type &&
    state.selectedId === item.id
  ) {
    button.classList.add("active");
  }

  const avatar = document.createElement("div");
  avatar.className =
    type === "group"
      ? "avatar avatar-orange"
      : "avatar avatar-purple";

  avatar.textContent = getInitial(item.name);

  const information = document.createElement("div");
  information.className = "item-information";

  const name = document.createElement("strong");
  name.textContent = item.name;

  const subtitle = document.createElement("span");
  subtitle.textContent =
    type === "group"
      ? `${item.memberCount} of 15 members`
      : "Direct message";

  information.append(name, subtitle);
  button.append(avatar, information);

  button.addEventListener("click", () => {
    selectConversation(type, item.id);
  });

  return button;
}

function renderServers() {
  elements.serverList.replaceChildren();

  state.servers.forEach((server) => {
    const button = document.createElement("button");
    button.className = "server-button";
    button.type = "button";
    button.textContent = server.shortName;
    button.title = server.name;
    button.setAttribute("aria-label", `Open ${server.name}`);

    if (
      state.selectedType === "server" &&
      state.selectedServerId === server.id
    ) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      selectServer(server.id);
    });

    elements.serverList.appendChild(button);
  });
}

function renderServerNavigation(server) {
  elements.homeContent.hidden = true;
  elements.serverContent.hidden = false;
  elements.navigationTitle.textContent = server.name;
  elements.navigationSubtitle.textContent = "Community server";
  elements.serverDescription.textContent = server.description;

  elements.channelList.replaceChildren();

  const section = document.createElement("section");
  section.className = "channel-category";

  const heading = document.createElement("div");
  heading.className = "section-heading";
  heading.textContent = "Text Channels";

  section.appendChild(heading);

  server.channels.forEach((channel) => {
    const button = document.createElement("button");
    button.className = "channel-button";
    button.type = "button";

    if (
      state.selectedType === "server" &&
      state.selectedId === channel.id
    ) {
      button.classList.add("active");
    }

    const symbol = document.createElement("span");
    symbol.className = "channel-symbol";
    symbol.textContent = "#";

    const name = document.createElement("span");
    name.textContent = channel.name;

    button.append(symbol, name);

    button.addEventListener("click", () => {
      state.selectedId = channel.id;
      renderApplication();
      closeNavigation();
    });

    section.appendChild(button);
  });

  elements.channelList.appendChild(section);
}

function selectConversation(type, id) {
  state.selectedType = type;
  state.selectedId = id;
  state.selectedServerId = null;

  renderApplication();
  closeNavigation();
}

function selectServer(serverId) {
  const server = state.servers.find((item) => item.id === serverId);

  if (!server || server.channels.length === 0) {
    return;
  }

  state.selectedType = "server";
  state.selectedServerId = server.id;
  state.selectedId = server.channels[0].id;

  renderApplication();
  closeNavigation();
}

function showHome() {
  state.selectedType = null;
  state.selectedId = null;
  state.selectedServerId = null;

  renderApplication();
  closeNavigation();
}

function renderChat() {
  const item = getCurrentItem();

  if (!item) {
    renderWelcome();
    return;
  }

  elements.composer.hidden = false;
  elements.deleteButton.hidden = false;
  elements.chatIcon.replaceChildren();

  if (state.selectedType === "direct") {
    elements.chatIcon.textContent = getInitial(item.name);
    elements.chatTitle.textContent = item.name;
    elements.chatSubtitle.textContent = "Direct message";
  }

  if (state.selectedType === "group") {
    elements.chatIcon.textContent = getInitial(item.name);
    elements.chatTitle.textContent = item.name;
    elements.chatSubtitle.textContent =
      `${item.memberCount} of 15 members`;
  }

  if (state.selectedType === "server") {
    elements.chatIcon.textContent = "#";
    elements.chatTitle.textContent = `# ${item.name}`;
    elements.chatSubtitle.textContent = item.server.name;
  }

  elements.messageInput.placeholder =
    `Message ${elements.chatTitle.textContent}`;

  renderMessages();
}

function renderWelcome() {
  elements.composer.hidden = true;
  elements.deleteButton.hidden = true;
  elements.chatTitle.textContent = "Welcome to ColloTalk";
  elements.chatSubtitle.textContent =
    "Create a conversation to get started";

  elements.chatIcon.replaceChildren();

  const icon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  icon.setAttribute("viewBox", "0 0 24 24");
  icon.innerHTML =
    '<path d="M7.5 5h9A4.5 4.5 0 0 1 21 9.5v3A4.5 4.5 0 0 1 16.5 17H12l-4.8 3.2A.75.75 0 0 1 6 19.58V17A4.5 4.5 0 0 1 3 12.76V9.5A4.5 4.5 0 0 1 7.5 5Z"/>';

  elements.chatIcon.appendChild(icon);

  elements.messageArea.innerHTML = `
    <div class="welcome-state">
      <div class="welcome-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.5 5h9A4.5 4.5 0 0 1 21 9.5v3A4.5 4.5 0 0 1 16.5 17H12l-4.8 3.2A.75.75 0 0 1 6 19.58V17A4.5 4.5 0 0 1 3 12.76V9.5A4.5 4.5 0 0 1 7.5 5Z"/>
        </svg>
      </div>
      <h3>Your conversations start here</h3>
      <p>Create a direct message, private group, or community server.</p>
    </div>
  `;
}

function renderMessages() {
  elements.messageArea.replaceChildren();

  const key = getConversationKey();
  const messages = Array.isArray(state.messages[key])
    ? state.messages[key]
    : [];

  if (messages.length === 0) {
    const item = getCurrentItem();
    const wrapper = document.createElement("div");
    wrapper.className = "welcome-state";

    const icon = document.createElement("div");
    icon.className = "welcome-icon";
    icon.textContent =
      state.selectedType === "server"
        ? "#"
        : getInitial(item.name);

    const title = document.createElement("h3");
    const description = document.createElement("p");

    if (state.selectedType === "direct") {
      title.textContent = item.name;
      description.textContent =
        "This direct conversation is stored locally in this browser.";
    }

    if (state.selectedType === "group") {
      title.textContent = item.name;
      description.textContent =
        "This private group can contain up to 15 members.";
    }

    if (state.selectedType === "server") {
      title.textContent = `#${item.name}`;
      description.textContent =
        `This channel belongs to ${item.server.name}.`;
    }

    wrapper.append(icon, title, description);
    elements.messageArea.appendChild(wrapper);
    return;
  }

  messages.forEach((message) => {
    elements.messageArea.appendChild(createMessageElement(message));
  });

  scrollToBottom();
}

function createMessageElement(message) {
  const article = document.createElement("article");
  article.className = "message";

  const avatar = document.createElement("div");
  avatar.className = "avatar avatar-blue";
  avatar.textContent = getInitial(message.author);

  const body = document.createElement("div");
  body.className = "message-body";

  const meta = document.createElement("div");
  meta.className = "message-meta";

  const author = document.createElement("strong");
  author.textContent = message.author;

  const time = document.createElement("time");
  time.dateTime = message.createdAt;
  time.textContent = formatTime(message.createdAt);

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = message.text;

  meta.append(author, time);
  body.append(meta, bubble);
  article.append(avatar, body);

  return article;
}

function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function sendMessage() {
  const text = elements.messageInput.value.trim();

  if (!text || !state.selectedType) {
    return;
  }

  const key = getConversationKey();

  if (!Array.isArray(state.messages[key])) {
    state.messages[key] = [];
  }

  state.messages[key].push({
    id: createId("message"),
    author: state.username,
    text: text.slice(0, 2000),
    createdAt: new Date().toISOString()
  });

  elements.messageInput.value = "";
  updateComposer();
  saveState();
  renderMessages();
  scrollToBottom();
}

function updateComposer() {
  const value = elements.messageInput.value;

  elements.characterCount.textContent =
    `${value.length} / 2000`;

  elements.sendButton.disabled = value.trim().length === 0;

  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height =
    `${Math.min(elements.messageInput.scrollHeight, 150)}px`;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    elements.messageArea.scrollTop =
      elements.messageArea.scrollHeight;
  });
}

function openCreateModal(mode) {
  state.createMode = mode;
  elements.createNameInput.value = "";
  elements.createError.textContent = "";

  if (mode === "direct") {
    elements.createTitle.textContent = "New Direct Message";
    elements.createDescription.textContent =
      "Create a local direct conversation.";
    elements.createLabel.textContent = "Display Name";
    elements.createNameInput.placeholder = "Enter a name";
    elements.createHint.textContent =
      "Online user search will be added later.";
  }

  if (mode === "group") {
    elements.createTitle.textContent = "Create Private Group";
    elements.createDescription.textContent =
      "Private groups support up to 15 members.";
    elements.createLabel.textContent = "Group Name";
    elements.createNameInput.placeholder = "Enter a group name";
    elements.createHint.textContent =
      "You will be the first member of the group.";
  }

  if (mode === "server") {
    elements.createTitle.textContent = "Create Server";
    elements.createDescription.textContent =
      "Create a community server with a general channel.";
    elements.createLabel.textContent = "Server Name";
    elements.createNameInput.placeholder =
      "ColloTalk Official OpenChat";
    elements.createHint.textContent =
      "The server will initially be stored on this device.";
  }

  elements.createModal.showModal();
  elements.createNameInput.focus();
}

function closeCreateModal() {
  if (elements.createModal.open) {
    elements.createModal.close();
  }

  state.createMode = null;
}

function createItem() {
  const name = elements.createNameInput.value.trim();

  if (!name) {
    elements.createError.textContent = "Enter a name.";
    return;
  }

  if (state.createMode === "direct") {
    const item = {
      id: createId("direct"),
      name: name.slice(0, 50)
    };

    state.directs.push(item);
    state.selectedType = "direct";
    state.selectedId = item.id;
    state.selectedServerId = null;
  }

  if (state.createMode === "group") {
    const item = {
      id: createId("group"),
      name: name.slice(0, 50),
      memberCount: 1
    };

    state.groups.push(item);
    state.selectedType = "group";
    state.selectedId = item.id;
    state.selectedServerId = null;
  }

  if (state.createMode === "server") {
    const server = {
      id: createId("server"),
      name: name.slice(0, 50),
      shortName: getServerShortName(name),
      description:
        "A community server created with ColloTalk.",
      channels: [
        {
          id: createId("channel"),
          name: "general"
        }
      ]
    };

    state.servers.push(server);
    state.selectedType = "server";
    state.selectedServerId = server.id;
    state.selectedId = server.channels[0].id;
  }

  saveState();
  closeCreateModal();
  renderApplication();
}

function openProfileModal() {
  elements.profileNameInput.value =
    state.username === "Guest" ? "" : state.username;

  elements.profileError.textContent = "";
  elements.profileModal.showModal();
  elements.profileNameInput.focus();
}

function closeProfileModal() {
  if (elements.profileModal.open) {
    elements.profileModal.close();
  }
}

function saveProfile() {
  const name = elements.profileNameInput.value.trim();

  if (!name) {
    elements.profileError.textContent =
      "Enter a display name.";
    return;
  }

  state.username = name.slice(0, 24);
  saveState();
  updateProfile();
  closeProfileModal();
}

function deleteCurrentItem() {
  if (!state.selectedType) {
    return;
  }

  const confirmed = window.confirm(
    "Delete the current local conversation?"
  );

  if (!confirmed) {
    return;
  }

  const key = getConversationKey();
  delete state.messages[key];

  if (state.selectedType === "direct") {
    state.directs = state.directs.filter(
      (item) => item.id !== state.selectedId
    );
  }

  if (state.selectedType === "group") {
    state.groups = state.groups.filter(
      (item) => item.id !== state.selectedId
    );
  }

  if (state.selectedType === "server") {
    state.servers = state.servers.filter(
      (item) => item.id !== state.selectedServerId
    );
  }

  state.selectedType = null;
  state.selectedId = null;
  state.selectedServerId = null;

  saveState();
  renderApplication();
}

function openNavigation() {
  elements.app.classList.add("navigation-open");
}

function closeNavigation() {
  elements.app.classList.remove("navigation-open");
}

function renderApplication() {
  updateProfile();
  renderServers();

  if (state.selectedType === "server") {
    const server = state.servers.find(
      (item) => item.id === state.selectedServerId
    );

    if (server) {
      renderServerNavigation(server);
    } else {
      showHome();
      return;
    }
  } else {
    renderHome();
  }

  renderChat();
}

function setUpEvents() {
  elements.homeButton.addEventListener("click", showHome);

  elements.addDirectButton.addEventListener("click", () => {
    openCreateModal("direct");
  });

  elements.addGroupButton.addEventListener("click", () => {
    openCreateModal("group");
  });

  elements.addServerButton.addEventListener("click", () => {
    openCreateModal("server");
  });

  elements.createForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createItem();
  });

  elements.closeCreateButton.addEventListener(
    "click",
    closeCreateModal
  );

  elements.cancelCreateButton.addEventListener(
    "click",
    closeCreateModal
  );

  elements.profileButton.addEventListener(
    "click",
    openProfileModal
  );

  elements.settingsButton.addEventListener(
    "click",
    openProfileModal
  );

  elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProfile();
  });

  elements.closeProfileButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.cancelProfileButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
  });

  elements.messageInput.addEventListener(
    "input",
    updateComposer
  );

  elements.messageInput.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.isComposing
      ) {
        event.preventDefault();
        sendMessage();
      }
    }
  );

  elements.deleteButton.addEventListener(
    "click",
    deleteCurrentItem
  );

  elements.menuButton.addEventListener(
    "click",
    openNavigation
  );

  elements.closeNavigationButton.addEventListener(
    "click",
    closeNavigation
  );

  elements.overlay.addEventListener(
    "click",
    closeNavigation
  );
}

function initialize() {
  loadState();
  setUpEvents();
  renderApplication();
  updateComposer();

  if (state.username === "Guest") {
    openProfileModal();
  }
}

initialize();
