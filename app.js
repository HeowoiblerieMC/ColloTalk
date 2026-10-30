"use strict";

const STORAGE_KEY = "collotalk_state_v2";
const LEGACY_STORAGE_KEY = "collotalk_state_v1";
const WELCOME_KEY = "collotalk_hide_welcome";

const state = {
  username: "Guest",
  plan: "Collo Free",
  directs: [],
  groups: [],
  servers: [],
  messages: {},
  selectedType: null,
  selectedId: null,
  selectedServerId: null,
  createMode: null,
  familyMode: false
};

const elements = {
  splashScreen: document.getElementById("splashScreen"),
  appShell: document.getElementById("appShell"),
  openAppButton: document.getElementById("openAppButton"),
  openPlansButton: document.getElementById("openPlansButton"),
  skipWelcomeButton: document.getElementById("skipWelcomeButton"),
  homeButton: document.getElementById("homeButton"),
  serverList: document.getElementById("serverList"),
  addServerButton: document.getElementById("addServerButton"),
  navigationTitle: document.getElementById("navigationTitle"),
  navigationSubtitle: document.getElementById("navigationSubtitle"),
  homeNavigation: document.getElementById("homeNavigation"),
  serverNavigation: document.getElementById("serverNavigation"),
  serverDescription: document.getElementById("serverDescription"),
  channelList: document.getElementById("channelList"),
  directList: document.getElementById("directList"),
  groupList: document.getElementById("groupList"),
  addDirectButton: document.getElementById("addDirectButton"),
  addGroupButton: document.getElementById("addGroupButton"),
  plansNavigationButton: document.getElementById("plansNavigationButton"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileName: document.getElementById("profileName"),
  profilePlan: document.getElementById("profilePlan"),
  profileButton: document.getElementById("profileButton"),
  profilePlanButton: document.getElementById("profilePlanButton"),
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
  mobileOverlay: document.getElementById("mobileOverlay"),
  plansModal: document.getElementById("plansModal"),
  closePlansButton: document.getElementById("closePlansButton"),
  individualPlansButton: document.getElementById("individualPlansButton"),
  familyPlansButton: document.getElementById("familyPlansButton"),
  giftPreviewButton: document.getElementById("giftPreviewButton"),
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
  cancelProfileButton: document.getElementById("cancelProfileButton"),
  previewModal: document.getElementById("previewModal"),
  previewTitle: document.getElementById("previewTitle"),
  previewDescription: document.getElementById("previewDescription"),
  closePreviewButton: document.getElementById("closePreviewButton")
};

function loadState() {
  const savedState =
    localStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!savedState) {
    return;
  }

  try {
    const parsed = JSON.parse(savedState);

    state.username =
      typeof parsed.username === "string" && parsed.username.trim()
        ? parsed.username
        : "Guest";

    state.plan =
      typeof parsed.plan === "string"
        ? parsed.plan
        : "Collo Free";

    state.directs = Array.isArray(parsed.directs)
      ? parsed.directs
      : [];

    state.groups = Array.isArray(parsed.groups)
      ? parsed.groups
      : [];

    state.servers = Array.isArray(parsed.servers)
      ? parsed.servers
      : [];

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
      plan: state.plan,
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

  return Array.from(name.trim())
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function showApplication() {
  elements.appShell.hidden = false;
  elements.splashScreen.classList.add("closing");

  window.setTimeout(() => {
    elements.splashScreen.hidden = true;
  }, 500);
}

function showWelcome() {
  elements.splashScreen.hidden = false;
  elements.splashScreen.classList.remove("closing");
  elements.appShell.hidden = true;
}

function initializeEntryScreen() {
  if (localStorage.getItem(WELCOME_KEY) === "true") {
    elements.splashScreen.hidden = true;
    elements.appShell.hidden = false;
    return;
  }

  showWelcome();
}

function getConversationKey() {
  if (state.selectedType === "server") {
    return `server:${state.selectedServerId}:${state.selectedId}`;
  }

  return `${state.selectedType}:${state.selectedId}`;
}

function getCurrentItem() {
  if (state.selectedType === "direct") {
    return state.directs.find(
      (item) => item.id === state.selectedId
    );
  }

  if (state.selectedType === "group") {
    return state.groups.find(
      (item) => item.id === state.selectedId
    );
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
  elements.profilePlan.textContent = state.plan;

  const shortPlan = state.plan.replace("Collo ", "").toUpperCase();
  elements.profilePlanButton.textContent = shortPlan;
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
      resetSelection();
      renderHomeNavigation();
    }
  } else {
    renderHomeNavigation();
  }

  renderChat();
}

function renderHomeNavigation() {
  elements.homeNavigation.hidden = false;
  elements.serverNavigation.hidden = true;
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
    elements.directList.appendChild(
      createConversationButton(direct, "direct")
    );
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
    elements.groupList.appendChild(
      createConversationButton(group, "group")
    );
  });
}

function createEmptyList(text) {
  const paragraph = document.createElement("p");
  paragraph.className = "empty-list";
  paragraph.textContent = text;
  return paragraph;
}

function createConversationButton(item, type) {
  const button = document.createElement("button");
  button.className = "conversation-button";
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
  information.className = "conversation-information";

  const name = document.createElement("strong");
  name.textContent = item.name;

  const subtitle = document.createElement("span");
  subtitle.textContent =
    type === "group"
      ? `${item.memberCount || 1} of 15 members`
      : "Direct message";

  information.append(name, subtitle);
  button.append(avatar, information);

  button.addEventListener("click", () => {
    state.selectedType = type;
    state.selectedId = item.id;
    state.selectedServerId = null;

    renderApplication();
    closeNavigation();
  });

  return button;
}

function renderServers() {
  elements.serverList.replaceChildren();

  state.servers.forEach((server) => {
    const button = document.createElement("button");
    button.className = "rail-button server-button";
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
  elements.homeNavigation.hidden = true;
  elements.serverNavigation.hidden = false;
  elements.navigationTitle.textContent = server.name;
  elements.navigationSubtitle.textContent = "Community server";
  elements.serverDescription.textContent = server.description;
  elements.channelList.replaceChildren();

  server.channels.forEach((channel) => {
    const button = document.createElement("button");
    button.className = "channel-button";
    button.type = "button";

    if (state.selectedId === channel.id) {
      button.classList.add("active");
    }

    const symbol = document.createElement("span");
    symbol.className = "channel-symbol";
    symbol.textContent = "#";

    const name = document.createElement("span");
    name.textContent = channel.name;

    button.append(symbol, name);

    button.addEventListener("click", () => {
      state.selectedType = "server";
      state.selectedServerId = server.id;
      state.selectedId = channel.id;

      renderApplication();
      closeNavigation();
    });

    elements.channelList.appendChild(button);
  });
}

function selectServer(serverId) {
  const server = state.servers.find(
    (item) => item.id === serverId
  );

  if (!server || server.channels.length === 0) {
    return;
  }

  state.selectedType = "server";
  state.selectedServerId = server.id;
  state.selectedId = server.channels[0].id;

  renderApplication();
  closeNavigation();
}

function resetSelection() {
  state.selectedType = null;
  state.selectedId = null;
  state.selectedServerId = null;
}

function showHome() {
  resetSelection();
  renderApplication();
  closeNavigation();
}

function renderChat() {
  const item = getCurrentItem();

  if (!item) {
    renderWelcomeState();
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
      `${item.memberCount || 1} of 15 members`;
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

function renderWelcomeState() {
  elements.composer.hidden = true;
  elements.deleteButton.hidden = true;
  elements.chatTitle.textContent = "Welcome to ColloTalk";
  elements.chatSubtitle.textContent =
    "Create a conversation to get started";

  elements.chatIcon.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 5h9A4.5 4.5 0 0 1 21 9.5v3A4.5 4.5 0 0 1 16.5 17H12l-4.8 3.2A.75.75 0 0 1 6 19.58V17A4.5 4.5 0 0 1 3 12.76V9.5A4.5 4.5 0 0 1 7.5 5Z"/>
    </svg>
  `;

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
    title.textContent =
      state.selectedType === "server"
        ? `#${item.name}`
        : item.name;

    const description = document.createElement("p");

    if (state.selectedType === "direct") {
      description.textContent =
        "This direct conversation is stored locally in this browser.";
    }

    if (state.selectedType === "group") {
      description.textContent =
        "This private group can contain up to 15 people.";
    }

    if (state.selectedType === "server") {
      description.textContent =
        `This channel belongs to ${item.server.name}.`;
    }

    wrapper.append(icon, title, description);
    elements.messageArea.appendChild(wrapper);
    return;
  }

  messages.forEach((message) => {
    elements.messageArea.appendChild(
      createMessageElement(message)
    );
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
      "Private groups support up to 15 people.";
    elements.createLabel.textContent = "Group Name";
    elements.createNameInput.placeholder = "Enter a group name";
    elements.createHint.textContent =
      "You will be the first member.";
  }

  if (mode === "server") {
    elements.createTitle.textContent = "Create Server";
    elements.createDescription.textContent =
      "Create an open community with a general channel.";
    elements.createLabel.textContent = "Server Name";
    elements.createNameInput.placeholder =
      "ColloTalk Official OpenChat";
    elements.createHint.textContent =
      "The server will be stored on this device.";
  }

  elements.createModal.showModal();

  requestAnimationFrame(() => {
    elements.createNameInput.focus();
  });
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
      description: "A community server created with ColloTalk.",
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

  requestAnimationFrame(() => {
    elements.profileNameInput.focus();
  });
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

  resetSelection();
  saveState();
  renderApplication();
}

function openPlansModal() {
  if (!elements.plansModal.open) {
    elements.plansModal.showModal();
  }
}

function closePlansModal() {
  if (elements.plansModal.open) {
    elements.plansModal.close();
  }
}

function setPlanMode(familyMode) {
  state.familyMode = familyMode;

  elements.individualPlansButton.classList.toggle(
    "active",
    !familyMode
  );

  elements.familyPlansButton.classList.toggle(
    "active",
    familyMode
  );

  document
    .querySelectorAll(".dynamic-plan-detail")
    .forEach((detail) => {
      const parent = detail.closest(".plan-price");

      detail.textContent = familyMode
        ? parent.dataset.family
        : parent.dataset.individual;
    });

  document
    .querySelectorAll("[data-plan]")
    .forEach((button) => {
      const basePlan = button.dataset.plan;

      button.textContent = familyMode
        ? `Preview ${basePlan} Family`
        : `Preview ${basePlan.replace("Collo ", "")}`;
    });
}

function openPreview(title, description) {
  elements.previewTitle.textContent = title;
  elements.previewDescription.textContent = description;

  if (!elements.previewModal.open) {
    elements.previewModal.showModal();
  }
}

function closePreview() {
  if (elements.previewModal.open) {
    elements.previewModal.close();
  }
}

function openNavigation() {
  elements.appShell.classList.add("navigation-open");
  elements.mobileOverlay.classList.add("visible");
}

function closeNavigation() {
  elements.appShell.classList.remove("navigation-open");
  elements.mobileOverlay.classList.remove("visible");
}

function setUpEvents() {
  elements.openAppButton.addEventListener(
    "click",
    showApplication
  );

  elements.openPlansButton.addEventListener("click", () => {
    elements.appShell.hidden = false;
    openPlansModal();
  });

  elements.skipWelcomeButton.addEventListener("click", () => {
    localStorage.setItem(WELCOME_KEY, "true");
    showApplication();
  });

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

  elements.plansNavigationButton.addEventListener(
    "click",
    openPlansModal
  );

  elements.profilePlanButton.addEventListener(
    "click",
    openPlansModal
  );

  elements.closePlansButton.addEventListener(
    "click",
    closePlansModal
  );

  elements.individualPlansButton.addEventListener(
    "click",
    () => {
      setPlanMode(false);
    }
  );

  elements.familyPlansButton.addEventListener(
    "click",
    () => {
      setPlanMode(true);
    }
  );

  document
    .querySelectorAll("[data-plan]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const basePlan = button.dataset.plan;

        const planName = state.familyMode
          ? `${basePlan} Family`
          : basePlan;

        openPreview(
          planName,
          state.familyMode
            ? "This family plan will support up to four independent accounts for the price of three individual subscriptions. Payments are not active yet."
            : "Subscriptions and payments are not active in this prototype. This screen currently previews the planned membership experience."
        );
      });
    });

  elements.giftPreviewButton.addEventListener("click", () => {
    openPreview(
      "Collo Gifts",
      "Collo Plus and Collo Pro will be giftable to another user. Gift subscriptions will not renew automatically."
    );
  });

  elements.closePreviewButton.addEventListener(
    "click",
    closePreview
  );

  elements.menuButton.addEventListener(
    "click",
    openNavigation
  );

  elements.closeNavigationButton.addEventListener(
    "click",
    closeNavigation
  );

  elements.mobileOverlay.addEventListener(
    "click",
    closeNavigation
  );
}

function initialize() {
  loadState();
  setUpEvents();
  renderApplication();
  updateComposer();
  setPlanMode(false);
  initializeEntryScreen();

  if (
    state.username === "Guest" &&
    localStorage.getItem(WELCOME_KEY) === "true"
  ) {
    openProfileModal();
  }
}

initialize();
