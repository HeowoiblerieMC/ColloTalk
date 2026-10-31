"use strict";

const SUPABASE_URL = "https://mvollazjrwebwqkpqagqk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_mrDiTI54EOV0agHDCJJ2jQ_epAqSxXC";

const { createClient } = window.supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const state = {
  session: null,
  user: null,
  profile: null,
  servers: [],
  selectedServer: null,
  channels: [],
  selectedChannel: null,
  messages: [],
  membership: null,
  realtimeChannel: null
};

const elements = {
  landingScreen: document.getElementById("landingScreen"),
  authScreen: document.getElementById("authScreen"),
  confirmationScreen: document.getElementById("confirmationScreen"),
  appShell: document.getElementById("appShell"),
  connectionStatus: document.getElementById("connectionStatus"),
  getStartedButton: document.getElementById("getStartedButton"),
  signInLandingButton: document.getElementById("signInLandingButton"),
  authBackButton: document.getElementById("authBackButton"),
  signInTab: document.getElementById("signInTab"),
  signUpTab: document.getElementById("signUpTab"),
  signInForm: document.getElementById("signInForm"),
  signUpForm: document.getElementById("signUpForm"),
  signInEmail: document.getElementById("signInEmail"),
  signInPassword: document.getElementById("signInPassword"),
  signInMessage: document.getElementById("signInMessage"),
  signUpUsername: document.getElementById("signUpUsername"),
  signUpDisplayName: document.getElementById("signUpDisplayName"),
  signUpEmail: document.getElementById("signUpEmail"),
  signUpPassword: document.getElementById("signUpPassword"),
  signUpMessage: document.getElementById("signUpMessage"),
  confirmationEmail: document.getElementById("confirmationEmail"),
  returnToSignInButton: document.getElementById("returnToSignInButton"),
  homeButton: document.getElementById("homeButton"),
  serverList: document.getElementById("serverList"),
  createServerButton: document.getElementById("createServerButton"),
  refreshServersButton: document.getElementById("refreshServersButton"),
  navigationTitle: document.getElementById("navigationTitle"),
  navigationSubtitle: document.getElementById("navigationSubtitle"),
  homeNavigation: document.getElementById("homeNavigation"),
  serverNavigation: document.getElementById("serverNavigation"),
  serverDescription: document.getElementById("serverDescription"),
  joinServerButton: document.getElementById("joinServerButton"),
  createChannelButton: document.getElementById("createChannelButton"),
  channelList: document.getElementById("channelList"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileDisplayName: document.getElementById("profileDisplayName"),
  profileUsername: document.getElementById("profileUsername"),
  signOutButton: document.getElementById("signOutButton"),
  chatIcon: document.getElementById("chatIcon"),
  chatTitle: document.getElementById("chatTitle"),
  chatSubtitle: document.getElementById("chatSubtitle"),
  messageArea: document.getElementById("messageArea"),
  composer: document.getElementById("composer"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  composerStatus: document.getElementById("composerStatus"),
  characterCount: document.getElementById("characterCount"),
  menuButton: document.getElementById("menuButton"),
  closeNavigationButton: document.getElementById("closeNavigationButton"),
  mobileOverlay: document.getElementById("mobileOverlay"),
  createServerModal: document.getElementById("createServerModal"),
  createServerForm: document.getElementById("createServerForm"),
  serverNameInput: document.getElementById("serverNameInput"),
  serverDescriptionInput: document.getElementById("serverDescriptionInput"),
  createServerMessage: document.getElementById("createServerMessage"),
  closeServerModalButton: document.getElementById("closeServerModalButton"),
  cancelServerButton: document.getElementById("cancelServerButton"),
  createChannelModal: document.getElementById("createChannelModal"),
  createChannelForm: document.getElementById("createChannelForm"),
  channelNameInput: document.getElementById("channelNameInput"),
  createChannelMessage: document.getElementById("createChannelMessage"),
  cancelChannelButton: document.getElementById("cancelChannelButton")
};

function showOnly(target) {
  [
    elements.landingScreen,
    elements.authScreen,
    elements.confirmationScreen,
    elements.appShell
  ].forEach((screen) => {
    screen.hidden = screen !== target;
  });
}

function showAuth(mode) {
  showOnly(elements.authScreen);
  setAuthMode(mode);
}

function setAuthMode(mode) {
  const isSignIn = mode === "signin";

  elements.signInTab.classList.toggle("active", isSignIn);
  elements.signUpTab.classList.toggle("active", !isSignIn);
  elements.signInForm.hidden = !isSignIn;
  elements.signUpForm.hidden = isSignIn;
  clearAuthMessages();
}

function clearAuthMessages() {
  elements.signInMessage.textContent = "";
  elements.signUpMessage.textContent = "";
  elements.signInMessage.classList.remove("success");
  elements.signUpMessage.classList.remove("success");
}

function setFormMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("success", success);
}

async function testConnection() {
  try {
    const { error } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    elements.connectionStatus.textContent = "ColloTalk services are online";
    elements.connectionStatus.classList.add("connected");
  } catch {
    elements.connectionStatus.textContent =
      "ColloTalk could not connect to the online service";

    elements.connectionStatus.classList.add("error");
  }
}

async function signUp(event) {
  event.preventDefault();

  const username = elements.signUpUsername.value
    .trim()
    .toLowerCase();

  const displayName = elements.signUpDisplayName.value.trim();
  const email = elements.signUpEmail.value.trim();
  const password = elements.signUpPassword.value;

  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    setFormMessage(
      elements.signUpMessage,
      "Use 3 to 24 lowercase letters, numbers, or underscores."
    );
    return;
  }

  setFormMessage(elements.signUpMessage, "Creating your account...", true);

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://heowoibleriemc.github.io/ColloTalk/",
      data: {
        username,
        display_name: displayName
      }
    }
  });

  if (error) {
    setFormMessage(elements.signUpMessage, error.message);
    return;
  }

  if (data.session) {
    await enterApplication(data.session);
    return;
  }

  elements.confirmationEmail.textContent = email;
  showOnly(elements.confirmationScreen);
}

async function signIn(event) {
  event.preventDefault();

  const email = elements.signInEmail.value.trim();
  const password = elements.signInPassword.value;

  setFormMessage(elements.signInMessage, "Signing in...", true);

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    setFormMessage(elements.signInMessage, error.message);
    return;
  }

  await enterApplication(data.session);
}

async function signOut() {
  await unsubscribeFromMessages();
  await supabaseClient.auth.signOut();

  state.session = null;
  state.user = null;
  state.profile = null;
  state.servers = [];
  state.selectedServer = null;
  state.channels = [];
  state.selectedChannel = null;
  state.messages = [];
  state.membership = null;

  showOnly(elements.landingScreen);
}

async function enterApplication(session) {
  state.session = session;
  state.user = session.user;

  showOnly(elements.appShell);

  await loadProfile();
  await loadServers();
  renderHomeState();
}

async function loadProfile() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username, display_name, avatar_url, plan")
    .eq("id", state.user.id)
    .single();

  if (error) {
    elements.profileDisplayName.textContent = "Profile error";
    elements.profileUsername.textContent = error.message;
    return;
  }

  state.profile = data;

  elements.profileDisplayName.textContent = data.display_name;
  elements.profileUsername.textContent = `@${data.username}`;
  elements.profileAvatar.textContent = getInitial(data.display_name);
}

async function loadServers() {
  elements.serverList.replaceChildren();

  const { data, error } = await supabaseClient
    .from("servers")
    .select("id, owner_id, name, description, visibility, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    showMessageState("Server error", error.message);
    return;
  }

  state.servers = data || [];
  renderServers();
}

function renderServers() {
  elements.serverList.replaceChildren();

  state.servers.forEach((server) => {
    const button = document.createElement("button");

    button.className = "rail-button server-button";
    button.type = "button";
    button.textContent = getServerShortName(server.name);
    button.title = server.name;

    if (state.selectedServer?.id === server.id) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      selectServer(server.id);
    });

    elements.serverList.appendChild(button);
  });
}

async function selectServer(serverId) {
  const server = state.servers.find((item) => item.id === serverId);

  if (!server) {
    return;
  }

  await unsubscribeFromMessages();

  state.selectedServer = server;
  state.selectedChannel = null;
  state.channels = [];
  state.messages = [];

  elements.homeNavigation.hidden = true;
  elements.serverNavigation.hidden = false;
  elements.navigationTitle.textContent = server.name;
  elements.navigationSubtitle.textContent = "Community server";
  elements.serverDescription.textContent =
    server.description || "No server description.";

  await loadMembership();
  renderMembershipControls();
  await loadChannels();
  closeNavigation();
}

async function loadMembership() {
  const { data, error } = await supabaseClient
    .from("server_members")
    .select("server_id, user_id, role")
    .eq("server_id", state.selectedServer.id)
    .eq("user_id", state.user.id)
    .maybeSingle();

  state.membership = error ? null : data;
}

function renderMembershipControls() {
  const isMember = Boolean(state.membership);

  elements.joinServerButton.hidden = isMember;
  elements.createChannelButton.hidden =
    !state.membership ||
    !["owner", "admin"].includes(state.membership.role);
}

async function joinSelectedServer() {
  if (!state.selectedServer) {
    return;
  }

  elements.joinServerButton.disabled = true;
  elements.joinServerButton.textContent = "Joining...";

  const { error } = await supabaseClient
    .from("server_members")
    .insert({
      server_id: state.selectedServer.id,
      user_id: state.user.id,
      role: "member"
    });

  elements.joinServerButton.disabled = false;
  elements.joinServerButton.textContent = "Join Server";

  if (error) {
    window.alert(error.message);
    return;
  }

  await loadMembership();
  renderMembershipControls();
  await loadChannels();
}

async function loadChannels() {
  elements.channelList.replaceChildren();

  if (!state.membership) {
    const message = document.createElement("p");
    message.className = "empty-list";
    message.textContent = "Join this server to view its channels.";
    elements.channelList.appendChild(message);

    showMessageState(
      state.selectedServer.name,
      "Join this community to open its channels and messages."
    );

    return;
  }

  const { data, error } = await supabaseClient
    .from("channels")
    .select("id, server_id, name, description, position, created_at")
    .eq("server_id", state.selectedServer.id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    showMessageState("Channel error", error.message);
    return;
  }

  state.channels = data || [];
  renderChannels();

  if (state.channels.length > 0) {
    await selectChannel(state.channels[0].id);
  } else {
    showMessageState(
      state.selectedServer.name,
      "This server does not have any channels yet."
    );
  }
}

function renderChannels() {
  elements.channelList.replaceChildren();

  state.channels.forEach((channel) => {
    const button = document.createElement("button");

    button.className = "channel-button";
    button.type = "button";

    if (state.selectedChannel?.id === channel.id) {
      button.classList.add("active");
    }

    const symbol = document.createElement("span");
    symbol.className = "channel-symbol";
    symbol.textContent = "#";

    const name = document.createElement("span");
    name.textContent = channel.name;

    button.append(symbol, name);

    button.addEventListener("click", () => {
      selectChannel(channel.id);
    });

    elements.channelList.appendChild(button);
  });
}

async function selectChannel(channelId) {
  const channel = state.channels.find((item) => item.id === channelId);

  if (!channel) {
    return;
  }

  await unsubscribeFromMessages();

  state.selectedChannel = channel;
  state.messages = [];

  renderChannels();

  elements.chatIcon.textContent = "#";
  elements.chatTitle.textContent = `# ${channel.name}`;
  elements.chatSubtitle.textContent = state.selectedServer.name;
  elements.messageInput.placeholder = `Message #${channel.name}`;
  elements.composer.hidden = false;

  await loadMessages();
  subscribeToMessages();
}

async function loadMessages() {
  const { data, error } = await supabaseClient
    .from("messages")
    .select(`
      id,
      channel_id,
      sender_id,
      content,
      created_at,
      edited_at,
      profiles:sender_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("channel_id", state.selectedChannel.id)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    showMessageState("Message error", error.message);
    return;
  }

  state.messages = data || [];
  renderMessages();
}

function renderMessages() {
  elements.messageArea.replaceChildren();

  if (state.messages.length === 0) {
    showMessageState(
      `#${state.selectedChannel.name}`,
      `This is the beginning of #${state.selectedChannel.name}.`
    );
    return;
  }

  state.messages.forEach((message) => {
    elements.messageArea.appendChild(createMessageElement(message));
  });

  scrollToBottom();
}

function createMessageElement(message) {
  const profile = message.profiles || {};
  const displayName = profile.display_name || "Unknown user";
  const isOwnMessage = message.sender_id === state.user.id;

  const article = document.createElement("article");
  article.className = "message";

  if (isOwnMessage) {
    article.classList.add("own-message");
  }

  const avatar = document.createElement("div");
  avatar.className = isOwnMessage
    ? "avatar avatar-blue"
    : "avatar avatar-purple";

  avatar.textContent = getInitial(displayName);

  const body = document.createElement("div");
  body.className = "message-body";

  const meta = document.createElement("div");
  meta.className = "message-meta";

  const author = document.createElement("strong");
  author.textContent = displayName;

  const time = document.createElement("time");
  time.dateTime = message.created_at;
  time.textContent = formatTime(message.created_at);

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = message.content;

  meta.append(author, time);
  body.append(meta, bubble);
  article.append(avatar, body);

  return article;
}

async function sendMessage(event) {
  event.preventDefault();

  const content = elements.messageInput.value.trim();

  if (!content || !state.selectedChannel) {
    return;
  }

  elements.sendButton.disabled = true;
  elements.composerStatus.textContent = "Sending...";

  const { error } = await supabaseClient
    .from("messages")
    .insert({
      channel_id: state.selectedChannel.id,
      sender_id: state.user.id,
      content: content.slice(0, 2000)
    });

  if (error) {
    elements.composerStatus.textContent = error.message;
    updateComposer();
    return;
  }

  elements.messageInput.value = "";
  elements.composerStatus.textContent = "Connected";
  updateComposer();
}

function subscribeToMessages() {
  if (!state.selectedChannel) {
    return;
  }

  const channelId = state.selectedChannel.id;

  state.realtimeChannel = supabaseClient
    .channel(`messages:${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`
      },
      async () => {
        if (state.selectedChannel?.id === channelId) {
          await loadMessages();
        }
      }
    )
    .subscribe((status) => {
      elements.composerStatus.textContent =
        status === "SUBSCRIBED" ? "Connected" : status;
    });
}

async function unsubscribeFromMessages() {
  if (!state.realtimeChannel) {
    return;
  }

  await supabaseClient.removeChannel(state.realtimeChannel);
  state.realtimeChannel = null;
}

async function createServer(event) {
  event.preventDefault();

  const name = elements.serverNameInput.value.trim();
  const description = elements.serverDescriptionInput.value.trim();

  setFormMessage(
    elements.createServerMessage,
    "Creating server...",
    true
  );

  const { data: server, error: serverError } =
    await supabaseClient
      .from("servers")
      .insert({
        owner_id: state.user.id,
        name,
        description,
        visibility: "public"
      })
      .select("id, owner_id, name, description, visibility, created_at")
      .single();

  if (serverError) {
    setFormMessage(
      elements.createServerMessage,
      serverError.message
    );
    return;
  }

  const { error: channelError } = await supabaseClient
    .from("channels")
    .insert({
      server_id: server.id,
      name: "general",
      description: "General conversation",
      position: 0
    });

  if (channelError) {
    setFormMessage(
      elements.createServerMessage,
      channelError.message
    );
    return;
  }

  closeServerModal();
  await loadServers();
  await selectServer(server.id);
}

async function createChannel(event) {
  event.preventDefault();

  if (!state.selectedServer) {
    return;
  }

  const name = elements.channelNameInput.value
    .trim()
    .toLowerCase();

  if (!/^[a-z0-9_-]{1,40}$/.test(name)) {
    setFormMessage(
      elements.createChannelMessage,
      "Use lowercase letters, numbers, hyphens, or underscores."
    );
    return;
  }

  const { data, error } = await supabaseClient
    .from("channels")
    .insert({
      server_id: state.selectedServer.id,
      name,
      description: "",
      position: state.channels.length
    })
    .select("id, server_id, name, description, position, created_at")
    .single();

  if (error) {
    setFormMessage(elements.createChannelMessage, error.message);
    return;
  }

  closeChannelModal();
  await loadChannels();
  await selectChannel(data.id);
}

function showMessageState(title, description) {
  elements.messageArea.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "empty-state";

  const icon = document.createElement("div");
  icon.className = "empty-state-icon";
  icon.textContent = getInitial(title);

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = description;

  wrapper.append(icon, heading, paragraph);
  elements.messageArea.appendChild(wrapper);
}

function renderHomeState() {
  state.selectedServer = null;
  state.selectedChannel = null;
  state.channels = [];
  state.messages = [];
  state.membership = null;

  elements.homeNavigation.hidden = false;
  elements.serverNavigation.hidden = true;
  elements.navigationTitle.textContent = "ColloTalk";
  elements.navigationSubtitle.textContent = "Online conversations";
  elements.composer.hidden = true;

  elements.chatIcon.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 5h9A4.5 4.5 0 0 1 21 9.5v3A4.5 4.5 0 0 1 16.5 17H12l-4.8 3.2A.75.75 0 0 1 6 19.58V17A4.5 4.5 0 0 1 3 12.76V9.5A4.5 4.5 0 0 1 7.5 5Z"/>
    </svg>
  `;

  elements.chatTitle.textContent = "Welcome to ColloTalk";
  elements.chatSubtitle.textContent =
    "Select or create a community server";

  showMessageState(
    "ColloTalk is online",
    "Create a server or select an existing community from the server rail."
  );

  renderServers();
}

function updateComposer() {
  const value = elements.messageInput.value;

  elements.characterCount.textContent = `${value.length} / 2000`;
  elements.sendButton.disabled = value.trim().length === 0;

  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height =
    `${Math.min(elements.messageInput.scrollHeight, 150)}px`;
}

function getInitial(value) {
  const text = String(value || "").trim();
  return text ? Array.from(text)[0].toUpperCase() : "?";
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

function scrollToBottom() {
  requestAnimationFrame(() => {
    elements.messageArea.scrollTop =
      elements.messageArea.scrollHeight;
  });
}

function openServerModal() {
  elements.serverNameInput.value = "";
  elements.serverDescriptionInput.value = "";
  elements.createServerMessage.textContent = "";
  elements.createServerModal.showModal();
}

function closeServerModal() {
  if (elements.createServerModal.open) {
    elements.createServerModal.close();
  }
}

function openChannelModal() {
  elements.channelNameInput.value = "";
  elements.createChannelMessage.textContent = "";
  elements.createChannelModal.showModal();
}

function closeChannelModal() {
  if (elements.createChannelModal.open) {
    elements.createChannelModal.close();
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

function setupEvents() {
  elements.getStartedButton.addEventListener("click", () => {
    showAuth("signup");
  });

  elements.signInLandingButton.addEventListener("click", () => {
    showAuth("signin");
  });

  elements.authBackButton.addEventListener("click", () => {
    showOnly(elements.landingScreen);
  });

  elements.signInTab.addEventListener("click", () => {
    setAuthMode("signin");
  });

  elements.signUpTab.addEventListener("click", () => {
    setAuthMode("signup");
  });

  elements.signInForm.addEventListener("submit", signIn);
  elements.signUpForm.addEventListener("submit", signUp);

  elements.returnToSignInButton.addEventListener("click", () => {
    showAuth("signin");
  });

  elements.signOutButton.addEventListener("click", signOut);
  elements.homeButton.addEventListener("click", renderHomeState);
  elements.refreshServersButton.addEventListener("click", loadServers);
  elements.createServerButton.addEventListener("click", openServerModal);
  elements.createServerForm.addEventListener("submit", createServer);
  elements.closeServerModalButton.addEventListener("click", closeServerModal);
  elements.cancelServerButton.addEventListener("click", closeServerModal);
  elements.joinServerButton.addEventListener("click", joinSelectedServer);
  elements.createChannelButton.addEventListener("click", openChannelModal);
  elements.createChannelForm.addEventListener("submit", createChannel);
  elements.cancelChannelButton.addEventListener("click", closeChannelModal);
  elements.messageForm.addEventListener("submit", sendMessage);
  elements.messageInput.addEventListener("input", updateComposer);

  elements.messageInput.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      elements.messageForm.requestSubmit();
    }
  });

  elements.menuButton.addEventListener("click", openNavigation);
  elements.closeNavigationButton.addEventListener("click", closeNavigation);
  elements.mobileOverlay.addEventListener("click", closeNavigation);
}

async function initialize() {
  setupEvents();
  updateComposer();
  await testConnection();

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    await enterApplication(session);
  } else {
    showOnly(elements.landingScreen);
  }

  supabaseClient.auth.onAuthStateChange((event, sessionValue) => {
    if (event === "SIGNED_OUT") {
      showOnly(elements.landingScreen);
      return;
    }

    if (
      event === "SIGNED_IN" &&
      sessionValue &&
      !state.session
    ) {
      window.setTimeout(() => {
        enterApplication(sessionValue);
      }, 0);
    }
  });
}

initialize();
