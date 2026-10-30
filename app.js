""use strict";

const STORAGE_KEYS = {
  username: "collotalk_username",
  messages: "collotalk_messages",
  customItems: "collotalk_custom_items"
};

const state = {
  username: "Guest",
  selectedType: "direct",
  selectedId: "alice",
  selectedServerId: null,
  messages: {},
  customItems: {
    directs: [],
    groups: [],
    servers: []
  },
  createMode: null
};

const data = {
  directs: [
    {
      id: "alice",
      name: "Alice",
      subtitle: "Online",
      preview: "Start a conversation",
      color: "avatar-purple",
      online: true
    },
    {
      id: "ethan",
      name: "Ethan",
      subtitle: "Offline",
      preview: "No messages yet",
      color: "avatar-green",
      online: false
    }
  ],
  groups: [
    {
      id: "study-team",
      name: "Study Team",
      subtitle: "6 members",
      preview: "Private group",
      color: "avatar-orange",
      memberCount: 6,
      limit: 15
    },
    {
      id: "game-night",
      name: "Game Night",
      subtitle: "11 members",
      preview: "Private group",
      color: "avatar-pink",
      memberCount: 11,
      limit: 15
    }
  ],
  servers: [
    {
      id: "collotalk-community",
      name: "ColloTalk Community",
      shortName: "CC",
      description: "The official community server for ColloTalk discussions.",
      memberCount: 128,
      onlineCount: 34,
      categories: [
        {
          name: "Information",
          channels: [
            { id: "welcome", name: "welcome" },
            { id: "announcements", name: "announcements" }
          ]
        },
        {
          name: "Community",
          channels: [
            { id: "general", name: "general" },
            { id: "random", name: "random" },
            { id: "media", name: "media" }
          ]
        }
      ]
    },
    {
      id: "developers",
      name: "Developers",
      shortName: "DV",
      description: "A community server for development projects and ideas.",
      memberCount: 74,
      onlineCount: 18,
      categories: [
        {
          name: "General",
          channels: [
            { id: "general", name: "general" },
            { id: "introductions", name: "introductions" }
          ]
        },
        {
          name: "Development",
          channels: [
            { id: "projects", name: "projects" },
            { id: "ideas", name: "ideas" },
            { id: "bugs", name: "bugs" }
          ]
        }
      ]
    }
  ]
};

const elements = {
  app: document.querySelector(".app"),
  serverButtons: document.getElementById("serverButtons"),
  sidebarTitle: document.getElementById("sidebarTitle"),
  sidebarSubtitle: document.getElementById("sidebarSubtitle"),
  homeNavigation: document.getElementById("homeNavigation"),
  serverNavigation: document.getElementById("serverNavigation"),
  serverDescription: document.getElementById("serverDescription"),
  channelCategories: document.getElementById("channelCategories"),
  directList: document.getElementById("directList"),
  groupList: document.getElementById("groupList"),
  chatAvatar: document.getElementById("chatAvatar"),
  chatTitle: document.getElementById("chatTitle"),
  chatSubtitle: document.getElementById("chatSubtitle"),
  chatStatusDot: document.getElementById("chatStatusDot"),
  messageArea: document.getElementById("messageArea"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  characterCount: document.getElementById("characterCount"),
  detailsPanel: document.getElementById("detailsPanel"),
  detailsContent: document.getElementById("detailsContent"),
  detailsButton: document.getElementById("detailsButton"),
  closeDetailsButton: document.getElementById("closeDetailsButton"),
  clearButton: document.getElementById("clearButton"),
  menuButton: document.getElementById("menuButton"),
  closeSidebarButton: document.getElementById("closeSidebarButton"),
  mobileOverlay: document.getElementById("mobileOverlay"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileName: document.getElementById("profileName"),
  profileButton: document.getElementById("profileButton"),
  settingsButton: document.getElementById("settingsButton"),
  createDirectButton: document.getElementById("createDirectButton"),
  createGroupButton: document.getElementById("createGroupButton"),
  createServerButton: document.getElementById("createServerButton"),
  profileModal: document.getElementById("profileModal"),
  profileForm: document.getElementById("profileForm"),
  usernameInput: document.getElementById("usernameInput"),
  profileError: document.getElementById("profileError"),
  closeProfileModalButton: document.getElementById("closeProfileModalButton"),
  cancelProfileButton: document.getElementById("cancelProfileButton"),
  createModal: document.getElementById("createModal"),
  createForm: document.getElementById("createForm"),
  createModalTitle: document.getElementById("createModalTitle"),
  createModalDescription: document.getElementById("createModalDescription"),
  createNameLabel: document.getElementById("createNameLabel"),
  createNameInput: document.getElementById("createNameInput"),
  createHint: document.getElementById("createHint"),
  createError: document.getElementById("createError"),
  closeCreateModalButton: document.getElementById("closeCreateModalButton"),
  cancelCreateButton: document.getElementById("cancelCreateButton"),
  clearModal: document.getElementById("clearModal"),
  clearForm: document.getElementById("clearForm"),
  cancelClearButton: document.getElementById("cancelClearButton")
};

function loadState() {
  const savedUsername = localStorage.getItem(STORAGE_KEYS.username);
  const savedMessages = localStorage.getItem(STORAGE_KEYS.messages);
  const savedCustomItems = localStorage.getItem(STORAGE_KEYS.customItems);

  if (savedUsername && savedUsername.trim()) {
    state.username = savedUsername.trim().slice(0, 24);
  }

  if (savedMessages) {
    try {
      const parsedMessages = JSON.parse(savedMessages);

      if (
        parsedMessages &&
        typeof parsedMessages === "object" &&
        !Array.isArray(parsedMessages)
      ) {
        state.messages = parsedMessages;
      }
    } catch {
      state.messages = {};
    }
  }

  if (savedCustomItems) {
    try {
      const parsedItems = JSON.parse(savedCustomItems);

      if (parsedItems && typeof parsedItems === "object") {
        state.customItems.directs = Array.isArray(parsedItems.directs)
          ? parsedItems.directs
          : [];

        state.customItems.groups = Array.isArray(parsedItems.groups)
          ? parsedItems.groups
          : [];

        state.customItems.servers = Array.isArray(parsedItems.servers)
          ? parsedItems.servers
          : [];
      }
    } catch {
      state.customItems = {
        directs: [],
        groups: [],
        servers: []
      };
    }
  }
}

function saveMessages() {
  localStorage.setItem(
    STORAGE_KEYS.messages,
    JSON.stringify(state.messages)
  );
}

function saveCustomItems() {
  localStorage.setItem(
    STORAGE_KEYS.customItems,
    JSON.stringify(state.customItems)
  );
}

function getDirects() {
  return [...data.directs, ...state.customItems.directs];
}

function getGroups() {
  return [...data.groups, ...state.customItems.groups];
}

function getServers() {
  return [...data.servers, ...state.customItems.servers];
}

function getInitial(name) {
  const trimmedName = String(name || "").trim();

  if (!trimmedName) {
    return "?";
  }

  return Array.from(trimmedName)[0].toUpperCase();
}

function createId(value) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = Date.now().toString(36);

  return normalized ? `${normalized}-${suffix}` : `item-${suffix}`;
}

function getConversationKey() {
  if (state.selectedType === "server") {
    return `server:${state.selectedServerId}:${state.selectedId}`;
  }

  return `${state.selectedType}:${state.selectedId}`;
}

function findCurrentConversation() {
  if (state.selectedType === "direct") {
    return getDirects().find((item) => item.id === state.selectedId);
  }

  if (state.selectedType === "group") {
    return getGroups().find((item) => item.id === state.selectedId);
  }

  if (state.selectedType === "server") {
    const server = getServers().find(
      (item) => item.id === state.selectedServerId
    );

    if (!server) {
      return null;
    }

    for (const category of server.categories) {
      const channel = category.channels.find(
        (item) => item.id === state.selectedId
      );

      if (channel) {
        return {
          ...channel,
          server
        };
      }
    }
  }

  return null;
}

function updateProfile() {
  elements.profileName.textContent = state.username;
  elements.profileAvatar.textContent = getInitial(state.username);
}

function renderDirects() {
  elements.directList.replaceChildren();

  getDirects().forEach((direct) => {
    const button = createConversationButton(direct, "direct");
    elements.directList.appendChild(button);
  });
}

function renderGroups() {
  elements.groupList.replaceChildren();

  getGroups().forEach((group) => {
    const button = createConversationButton(group, "group");
    elements.groupList.appendChild(button);
  });
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
  avatar.className = `avatar ${item.color || "avatar-purple"}`;
  avatar.textContent = getInitial(item.name);

  const text = document.createElement("div");
  text.className = "conversation-text";

  const top = document.createElement("div");
  top.className = "conversation-top";

  const name = document.createElement("strong");
  name.textContent = item.name;

  const typeLabel = document.createElement("span");
  typeLabel.textContent = type === "direct" ? "DM" : "Private";

  const preview = document.createElement("p");
  preview.className = "conversation-preview";
  preview.textContent = getLatestPreview(type, item);

  top.append(name, typeLabel);
  text.append(top, preview);
  button.append(avatar, text);

  button.addEventListener("click", () => {
    selectConversation(type, item.id);
  });

  return button;
}

function getLatestPreview(type, item) {
  const key = `${type}:${item.id}`;
  const messages = state.messages[key];

  if (Array.isArray(messages) && messages.length > 0) {
    return messages.at(-1).text;
  }

  return item.preview || item.subtitle || "No messages yet";
}

function renderServers() {
  elements.serverButtons.replaceChildren();

  getServers().forEach((server) => {
    const button = document.createElement("button");
    button.className = "rail-button server-button";
    button.type = "button";
    button.textContent = server.shortName || getInitial(server.name);
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

    elements.serverButtons.appendChild(button);
  });
}

function selectConversation(type, id) {
  state.selectedType = type;
  state.selectedId = id;
  state.selectedServerId = null;

  showHomeNavigation();
  renderApplication();
  closeMobileNavigation();
}

function selectServer(serverId) {
  const server = getServers().find((item) => item.id === serverId);

  if (!server || server.categories.length === 0) {
    return;
  }

  const firstCategory = server.categories[0];
  const firstChannel = firstCategory.channels[0];

  if (!firstChannel) {
    return;
  }

  state.selectedType = "server";
  state.selectedServerId = server.id;
  state.selectedId = firstChannel.id;

  showServerNavigation(server);
  renderApplication();
  closeMobileNavigation();
}

function selectChannel(channelId) {
  state.selectedId = channelId;
  renderApplication();
  closeMobileNavigation();
}

function showHomeNavigation() {
  elements.homeNavigation.hidden = false;
  elements.serverNavigation.hidden = true;
  elements.sidebarTitle.textContent = "ColloTalk";
  elements.sidebarSubtitle.textContent = "Simple conversations";
}

function showServerNavigation(server) {
  elements.homeNavigation.hidden = true;
  elements.serverNavigation.hidden = false;
  elements.sidebarTitle.textContent = server.name;
  elements.sidebarSubtitle.textContent = `${server.memberCount} members`;
  elements.serverDescription.textContent = server.description;

  renderChannels(server);
}

function renderChannels(server) {
  elements.channelCategories.replaceChildren();

  server.categories.forEach((category) => {
    const section = document.createElement("section");
    section.className = "channel-category";

    const heading = document.createElement("div");
    heading.className = "section-title";
    heading.textContent = category.name;

    const list = document.createElement("div");
    list.className = "conversation-list";

    category.channels.forEach((channel) => {
      const button = document.createElement("button");
      button.className = "channel-button";
      button.type = "button";

      if (
        state.selectedType === "server" &&
        state.selectedServerId === server.id &&
        state.selectedId === channel.id
      ) {
        button.classList.add("active");
      }

      const hash = document.createElement("span");
      hash.className = "channel-hash";
      hash.textContent = "#";

      const name = document.createElement("span");
      name.textContent = channel.name;

      button.append(hash, name);

      button.addEventListener("click", () => {
        selectChannel(channel.id);
      });

      list.appendChild(button);
    });

    section.append(heading, list);
    elements.channelCategories.appendChild(section);
  });
}

function renderApplication() {
  renderDirects();
  renderGroups();
  renderServers();

  if (state.selectedType === "server") {
    const server = getServers().find(
      (item) => item.id === state.selectedServerId
    );

    if (server) {
      showServerNavigation(server);
    }
  } else {
    showHomeNavigation();
  }

  renderChatHeader();
  renderMessages();
  renderDetails();
}

function renderChatHeader() {
  const conversation = findCurrentConversation();

  if (!conversation) {
    return;
  }

  if (state.selectedType === "direct") {
    elements.chatTitle.textContent = conversation.name;
    elements.chatSubtitle.textContent = conversation.online
      ? "Online · Direct message"
      : "Offline · Direct message";

    elements.chatStatusDot.style.background = conversation.online
      ? "var(--green)"
      : "var(--muted)";

    elements.chatAvatar.textContent = getInitial(conversation.name);
    elements.chatAvatar.className =
      `avatar ${conversation.color || "avatar-purple"}`;
  }

  if (state.selectedType === "group") {
    elements.chatTitle.textContent = conversation.name;
    elements.chatSubtitle.textContent =
      `${conversation.memberCount} of ${conversation.limit} members`;

    elements.chatStatusDot.style.background = "var(--purple-light)";
    elements.chatAvatar.textContent = getInitial(conversation.name);
    elements.chatAvatar.className =
      `avatar ${conversation.color || "avatar-orange"}`;
  }

  if (state.selectedType === "server") {
    elements.chatTitle.textContent = `# ${conversation.name}`;
    elements.chatSubtitle.textContent = conversation.server.name;
    elements.chatStatusDot.style.background = "var(--green)";
    elements.chatAvatar.textContent = "#";
    elements.chatAvatar.className = "avatar avatar-purple";
  }

  elements.messageInput.placeholder =
    `Message ${elements.chatTitle.textContent}`;
}

function renderMessages() {
  elements.messageArea.replaceChildren();

  const key = getConversationKey();
  const messages = Array.isArray(state.messages[key])
    ? state.messages[key]
    : [];

  if (messages.length === 0) {
    elements.messageArea.appendChild(createEmptyState());
    return;
  }

  messages.forEach((message) => {
    elements.messageArea.appendChild(createMessageElement(message));
  });

  scrollToLatestMessage(false);
}

function createEmptyState() {
  const conversation = findCurrentConversation();
  const wrapper = document.createElement("div");
  wrapper.className = "empty-state";

  const icon = document.createElement("div");
  icon.className = "empty-state-icon";
  icon.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 5h9A4.5 4.5 0 0 1 21 9.5v3a4.5 4.5 0 0 1-4.5 4.5H12l-4.8 3.2A.75.75 0 0 1 6 19.58V17A4.5 4.5 0 0 1 3 12.76V9.5A4.5 4.5 0 0 1 7.5 5Z"/>
    </svg>
  `;

  const title = document.createElement("h3");
  const description = document.createElement("p");

  if (state.selectedType === "direct") {
    title.textContent = `Start a conversation with ${conversation.name}`;
    description.textContent =
      "This prototype stores messages locally in this browser. Online delivery will be added in a later development phase.";
  }

  if (state.selectedType === "group") {
    title.textContent = conversation.name;
    description.textContent =
      `This private group currently has ${conversation.memberCount} members and supports up to ${conversation.limit} members.`;
  }

  if (state.selectedType === "server") {
    title.textContent = `Welcome to #${conversation.name}`;
    description.textContent =
      `This is the beginning of the ${conversation.name} channel in ${conversation.server.name}.`;
  }

  wrapper.append(icon, title, description);

  return wrapper;
}

function createMessageElement(message) {
  const group = document.createElement("article");
  group.className = "message-group";

  const isOwnMessage = message.author === state.username;

  if (isOwnMessage) {
    group.classList.add("own-message");
  }

  const avatar = document.createElement("div");
  avatar.className = isOwnMessage
    ? "avatar avatar-blue"
    : "avatar avatar-purple";

  avatar.textContent = getInitial(message.author);

  const content = document.createElement("div");
  content.className = "message-content";

  const metadata = document.createElement("div");
  metadata.className = "message-metadata";

  const author = document.createElement("span");
  author.className = "message-author";
  author.textContent = message.author;

  const time = document.createElement("time");
  time.className = "message-time";
  time.dateTime = message.createdAt;
  time.textContent = formatTime(message.createdAt);

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = message.text;

  metadata.append(author, time);
  content.append(metadata, bubble);
  group.append(avatar, content);

  return group;
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

  if (!text) {
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

  saveMessages();

  elements.messageInput.value = "";
  updateComposer();
  renderApplication();
  scrollToLatestMessage(true);
  elements.messageInput.focus();
}

function updateComposer() {
  const value = elements.messageInput.value;
  const length = value.length;

  elements.characterCount.textContent = `${length} / 2000`;
  elements.sendButton.disabled = value.trim().length === 0;

  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height =
    `${Math.min(elements.messageInput.scrollHeight, 150)}px`;
}

function scrollToLatestMessage(smooth) {
  requestAnimationFrame(() => {
    elements.messageArea.scrollTo({
      top: elements.messageArea.scrollHeight,
      behavior: smooth ? "smooth" : "auto"
    });
  });
}

function renderDetails() {
  const conversation = findCurrentConversation();

  if (!conversation) {
    return;
  }

  elements.detailsContent.replaceChildren();

  const profile = document.createElement("div");
  profile.className = "detail-profile";

  const avatar = document.createElement("div");
  avatar.className = "avatar avatar-purple";

  const title = document.createElement("h3");
  const description = document.createElement("p");
  const statistics = document.createElement("div");
  statistics.className = "detail-statistics";

  if (state.selectedType === "direct") {
    avatar.textContent = getInitial(conversation.name);
    title.textContent = conversation.name;
    description.textContent =
      "A private direct conversation between two people.";

    statistics.append(
      createStatistic("2", "Participants"),
      createStatistic(conversation.online ? "Online" : "Offline", "Status")
    );
  }

  if (state.selectedType === "group") {
    avatar.textContent = getInitial(conversation.name);
    title.textContent = conversation.name;
    description.textContent =
      "A private, invitation-only group conversation.";

    statistics.append(
      createStatistic(String(conversation.memberCount), "Members"),
      createStatistic(String(conversation.limit), "Maximum")
    );
  }

  if (state.selectedType === "server") {
    avatar.textContent = "#";
    title.textContent = conversation.server.name;
    description.textContent = conversation.server.description;

    statistics.append(
      createStatistic(
        String(conversation.server.memberCount),
        "Members"
      ),
      createStatistic(
        String(conversation.server.onlineCount),
        "Online"
      )
    );
  }

  profile.append(avatar, title, description, statistics);
  elements.detailsContent.appendChild(profile);
}

function createStatistic(value, label) {
  const statistic = document.createElement("div");
  statistic.className = "detail-statistic";

  const strong = document.createElement("strong");
  strong.textContent = value;

  const span = document.createElement("span");
  span.textContent = label;

  statistic.append(strong, span);

  return statistic;
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
  });
}

function closeProfileModal() {
  if (elements.profileModal.open) {
    elements.profileModal.close();
  }
}

function saveProfile() {
  const username = elements.usernameInput.value.trim();

  if (!username) {
    elements.profileError.textContent = "Enter a display name.";
    return;
  }

  state.username = username.slice(0, 24);

  localStorage.setItem(STORAGE_KEYS.username, state.username);

  updateProfile();
  renderMessages();
  closeProfileModal();
}

function openCreateModal(mode) {
  state.createMode = mode;
  elements.createNameInput.value = "";
  elements.createError.textContent = "";

  if (mode === "direct") {
    elements.createModalTitle.textContent = "New Direct Message";
    elements.createModalDescription.textContent =
      "Create a local direct conversation for this prototype.";
    elements.createNameLabel.textContent = "Display Name";
    elements.createNameInput.placeholder = "Enter a name";
    elements.createHint.textContent =
      "Online user search will be added later.";
  }

  if (mode === "group") {
    elements.createModalTitle.textContent = "Create Private Group";
    elements.createModalDescription.textContent =
      "Private groups support a maximum of 15 members.";
    elements.createNameLabel.textContent = "Group Name";
    elements.createNameInput.placeholder = "Enter a group name";
    elements.createHint.textContent =
      "This prototype creates the group locally.";
  }

  if (mode === "server") {
    elements.createModalTitle.textContent = "Create Server";
    elements.createModalDescription.textContent =
      "Servers can contain multiple community channels.";
    elements.createNameLabel.textContent = "Server Name";
    elements.createNameInput.placeholder = "Enter a server name";
    elements.createHint.textContent =
      "The server will start with a general channel.";
  }

  if (!elements.createModal.open) {
    elements.createModal.showModal();
  }

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

  const id = createId(name);

  if (state.createMode === "direct") {
    state.customItems.directs.push({
      id,
      name: name.slice(0, 40),
      subtitle: "Offline",
      preview: "No messages yet",
      color: "avatar-purple",
      online: false
    });

    state.selectedType = "direct";
    state.selectedId = id;
    state.selectedServerId = null;
  }

  if (state.createMode === "group") {
    state.customItems.groups.push({
      id,
      name: name.slice(0, 40),
      subtitle: "1 member",
      preview: "Private group",
      color: "avatar-orange",
      memberCount: 1,
      limit: 15
    });

    state.selectedType = "group";
    state.selectedId = id;
    state.selectedServerId = null;
  }

  if (state.createMode === "server") {
    const server = {
      id,
      name: name.slice(0, 40),
      shortName: createServerShortName(name),
      description: "A community server created in this local prototype.",
      memberCount: 1,
      onlineCount: 1,
      categories: [
        {
          name: "General",
          channels: [
            {
              id: "general",
              name: "general"
            }
          ]
        }
      ]
    };

    state.customItems.servers.push(server);
    state.selectedType = "server";
    state.selectedServerId = id;
    state.selectedId = "general";
  }

  saveCustomItems();
  closeCreateModal();
  renderApplication();
}

function createServerShortName(name) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${getInitial(words[0])}${getInitial(words[1])}`;
  }

  return Array.from(name.trim())
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function openClearModal() {
  const key = getConversationKey();
  const messages = state.messages[key];

  if (!Array.isArray(messages) || messages.length === 0) {
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

function clearCurrentMessages() {
  const key = getConversationKey();

  delete state.messages[key];
  saveMessages();
  closeClearModal();
  renderApplication();
}

function openDetails() {
  elements.app.classList.add("details-open");
}

function closeDetails() {
  elements.app.classList.remove("details-open");
}

function openMobileNavigation() {
  elements.app.classList.add("navigation-open");
}

function closeMobileNavigation() {
  elements.app.classList.remove("navigation-open");
}

function closeMobilePanels() {
  closeMobileNavigation();
  closeDetails();
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

  elements.profileButton.addEventListener("click", openProfileModal);
  elements.settingsButton.addEventListener("click", openProfileModal);

  elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProfile();
  });

  elements.closeProfileModalButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.cancelProfileButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.createDirectButton.addEventListener("click", () => {
    openCreateModal("direct");
  });

  elements.createGroupButton.addEventListener("click", () => {
    openCreateModal("group");
  });

  elements.createServerButton.addEventListener("click", () => {
    openCreateModal("server");
  });

  elements.createForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createItem();
  });

  elements.closeCreateModalButton.addEventListener(
    "click",
    closeCreateModal
  );

  elements.cancelCreateButton.addEventListener(
    "click",
    closeCreateModal
  );

  elements.clearButton.addEventListener("click", openClearModal);

  elements.clearForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearCurrentMessages();
  });

  elements.cancelClearButton.addEventListener(
    "click",
    closeClearModal
  );

  elements.detailsButton.addEventListener("click", openDetails);
  elements.closeDetailsButton.addEventListener("click", closeDetails);

  elements.menuButton.addEventListener(
    "click",
    openMobileNavigation
  );

  elements.closeSidebarButton.addEventListener(
    "click",
    closeMobileNavigation
  );

  elements.mobileOverlay.addEventListener(
    "click",
    closeMobilePanels
  );

  document.querySelector(".rail-logo").addEventListener("click", () => {
    selectConversation("direct", "alice");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
      closeMobileNavigation();
    }
  });
}

function initializeApplication() {
  loadState();
  updateProfile();
  setUpEventListeners();
  renderApplication();
  updateComposer();

  if (!localStorage.getItem(STORAGE_KEYS.username)) {
    openProfileModal();
  }
}

initializeApplication();
