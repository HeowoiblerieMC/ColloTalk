"use strict";

const SUPABASE_URL = "https://mvollazjrwebwqkpqagqk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_mrDiTI54EOV0agHDCJJ2jQ_epAqSxXC";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const state = {
  authMode: "signup",
  session: null,
  user: null,
  profile: null,
  servers: [],
  memberships: [],
  channels: [],
  selectedServer: null,
  selectedChannel: null,
  messageSubscription: null
};

const elements = {
  landingScreen: document.getElementById("landingScreen"),
  authScreen: document.getElementById("authScreen"),
  appShell: document.getElementById("appShell"),
  getStartedButton: document.getElementById("getStartedButton"),
  signInButton: document.getElementById("signInButton"),
  authBackButton: document.getElementById("authBackButton"),
  authForm: document.getElementById("authForm"),
  authEyebrow: document.getElementById("authEyebrow"),
  authTitle: document.getElementById("authTitle"),
  authDescription: document.getElementById("authDescription"),
  signupFields: document.getElementById("signupFields"),
  usernameInput: document.getElementById("usernameInput"),
  displayNameInput: document.getElementById("displayNameInput"),
  emailInput: document.getElementById("emailInput"),
  passwordInput: document.getElementById("passwordInput"),
  authMessage: document.getElementById("authMessage"),
  authSubmitButton: document.getElementById("authSubmitButton"),
  authSwitchButton: document.getElementById("authSwitchButton"),
  homeButton: document.getElementById("homeButton"),
  serverList: document.getElementById("serverList"),
  addServerButton: document.getElementById("addServerButton"),
  navigationTitle: document.getElementById("navigationTitle"),
  navigationSubtitle: document.getElementById("navigationSubtitle"),
  homeNavigation: document.getElementById("homeNavigation"),
  serverNavigation: document.getElementById("serverNavigation"),
  discoverNavigation: document.getElementById("discoverNavigation"),
  serverDescription: document.getElementById("serverDescription"),
  channelList: document.getElementById("channelList"),
  discoverServersButton: document.getElementById("discoverServersButton"),
  discoverList: document.getElementById("discoverList"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileName: document.getElementById("profileName"),
  profileUsername: document.getElementById("profileUsername"),
  profileButton: document.getElementById("profileButton"),
  signOutButton: document.getElementById("signOutButton"),
  chatIcon: document.getElementById("chatIcon"),
  chatTitle: document.getElementById("chatTitle"),
  chatSubtitle: document.getElementById("chatSubtitle"),
  messageArea: document.getElementById("messageArea"),
  composer: document.getElementById("composer"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  characterCount: document.getElementById("characterCount"),
  menuButton: document.getElementById("menuButton"),
  closeNavigationButton: document.getElementById("closeNavigationButton"),
  mobileOverlay: document.getElementById("mobileOverlay"),
  createServerModal: document.getElementById("createServerModal"),
  createServerForm: document.getElementById("createServerForm"),
  serverNameInput: document.getElementById("serverNameInput"),
  serverDescriptionInput: document.getElementById("serverDescriptionInput"),
  publicServerInput: document.getElementById("publicServerInput"),
  createServerMessage: document.getElementById("createServerMessage"),
  closeCreateServerButton: document.getElementById("closeCreateServerButton"),
  cancelCreateServerButton: document.getElementById("cancelCreateServerButton"),
  profileModal: document.getElementById("profileModal"),
  profileForm: document.getElementById("profileForm"),
  profileDisplayNameInput: document.getElementById(
    "profileDisplayNameInput"
  ),
  profileBioInput: document.getElementById("profileBioInput"),
  profileMessage: document.getElementById("profileMessage"),
  closeProfileButton: document.getElementById("closeProfileButton"),
  cancelProfileButton: document.getElementById("cancelProfileButton")
};

function showScreen(screenName) {
  elements.landingScreen.hidden = screenName !== "landing";
  elements.authScreen.hidden = screenName !== "auth";
  elements.appShell.hidden = screenName !== "app";
}

function setFormMessage(element, message, type = "") {
  element.textContent = message;
  element.className = "form-message";

  if (type) {
    element.classList.add(type);
  }
}

function getInitial(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "?";
  }

  return Array.from(text)[0].toUpperCase();
}

function createServerShortName(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${getInitial(words[0])}${getInitial(words[1])}`;
  }

  return Array.from(name.trim())
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function setAuthMode(mode) {
  state.authMode = mode;
  const signup = mode === "signup";

  elements.signupFields.hidden = !signup;
  elements.usernameInput.required = signup;
  elements.displayNameInput.required = signup;

  elements.passwordInput.autocomplete = signup
    ? "new-password"
    : "current-password";

  elements.authEyebrow.textContent = signup
    ? "CREATE ACCOUNT"
    : "WELCOME BACK";

  elements.authTitle.textContent = signup
    ? "Join ColloTalk"
    : "Sign in to ColloTalk";

  elements.authDescription.textContent = signup
    ? "Create an account and begin connecting."
    : "Continue your conversations and communities.";

  elements.authSubmitButton.textContent = signup
    ? "Create Account"
    : "Sign In";

  elements.authSwitchButton.textContent = signup
    ? "Already have an account? Sign in"
    : "Need an account? Create one";

  setFormMessage(elements.authMessage, "");
}

async function handleAuthentication(event) {
  event.preventDefault();

  const email = elements.emailInput.value.trim();
  const password = elements.passwordInput.value;

  elements.authSubmitButton.disabled = true;
  setFormMessage(elements.authMessage, "Connecting...");

  try {
    if (state.authMode === "signup") {
      const username = elements.usernameInput.value.trim();
      const displayName = elements.displayNameInput.value.trim();

      if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
        throw new Error(
          "Username must be 3 to 24 characters and use only letters, numbers, or underscores."
        );
      }

      if (!displayName) {
        throw new Error("Enter a display name.");
      }

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        setFormMessage(
          elements.authMessage,
          "Account created. Check your email and confirm your account before signing in.",
          "success"
        );

        setAuthMode("signin");
        elements.emailInput.value = email;
        return;
      }

      await startAuthenticatedApplication(data.session);
    } else {
      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) {
        throw error;
      }

      await startAuthenticatedApplication(data.session);
    }
  } catch (error) {
    setFormMessage(
      elements.authMessage,
      error.message || "Authentication failed.",
      "error"
    );
  } finally {
    elements.authSubmitButton.disabled = false;
  }
}

async function startAuthenticatedApplication(session) {
  state.session = session;
  state.user = session.user;

  setFormMessage(elements.authMessage, "");
  showScreen("app");

  await loadProfile();
  await loadServers();
  renderHome();
}

async function loadProfile() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", state.user.id)
    .single();

  if (error) {
    console.error("Profile loading failed:", error);
    return;
  }

  state.profile = data;
  renderProfile();
}

function renderProfile() {
  if (!state.profile) {
    return;
  }

  elements.profileName.textContent = state.profile.display_name;
  elements.profileUsername.textContent = `@${state.profile.username}`;
  elements.profileAvatar.textContent = getInitial(
    state.profile.display_name
  );
}

async function loadServers() {
  const [
    serversResult,
    membershipsResult
  ] = await Promise.all([
    supabaseClient
      .from("servers")
      .select("*")
      .order("created_at", { ascending: true }),
    supabaseClient
      .from("server_members")
      .select("server_id, role")
      .eq("user_id", state.user.id)
  ]);

  if (serversResult.error) {
    console.error("Server loading failed:", serversResult.error);
    state.servers = [];
  } else {
    state.servers = serversResult.data || [];
  }

  if (membershipsResult.error) {
    console.error(
      "Membership loading failed:",
      membershipsResult.error
    );
    state.memberships = [];
  } else {
    state.memberships = membershipsResult.data || [];
  }

  renderServerRail();
}

function isServerMember(serverId) {
  return state.memberships.some(
    (membership) => membership.server_id === serverId
  );
}

function renderServerRail() {
  elements.serverList.replaceChildren();

  const joinedServers = state.servers.filter((server) =>
    isServerMember(server.id)
  );

  joinedServers.forEach((server) => {
    const button = document.createElement("button");
    button.className = "rail-button server-button";
    button.type = "button";
    button.textContent = createServerShortName(server.name);
    button.title = server.name;
    button.setAttribute("aria-label", `Open ${server.name}`);

    if (state.selectedServer?.id === server.id) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      openServer(server.id);
    });

    elements.serverList.appendChild(button);
  });
}

function hideNavigationViews() {
  elements.homeNavigation.hidden = true;
  elements.serverNavigation.hidden = true;
  elements.discoverNavigation.hidden = true;
}

function renderHome() {
  hideNavigationViews();
  elements.homeNavigation.hidden = false;

  elements.navigationTitle.textContent = "ColloTalk";
  elements.navigationSubtitle.textContent = "Online conversations";

  state.selectedServer = null;
  state.selectedChannel = null;
  state.channels = [];

  removeMessageSubscription();
  renderServerRail();

  elements.composer.hidden = true;
  elements.chatTitle.textContent = "Welcome to ColloTalk";
  elements.chatSubtitle.textContent =
    "Select or create a server to begin";

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
      <h3>Talk. Speak. Open your world.</h3>
      <p>Create a server or discover a public community.</p>
    </div>
  `;

  closeNavigation();
}

async function openServer(serverId) {
  const server = state.servers.find((item) => item.id === serverId);

  if (!server || !isServerMember(serverId)) {
    return;
  }

  state.selectedServer = server;

  hideNavigationViews();
  elements.serverNavigation.hidden = false;

  elements.navigationTitle.textContent = server.name;
  elements.navigationSubtitle.textContent = "Community server";
  elements.serverDescription.textContent =
    server.description || "No description provided.";

  const { data, error } = await supabaseClient
    .from("channels")
    .select("*")
    .eq("server_id", server.id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Channel loading failed:", error);
    return;
  }

  state.channels = data || [];
  renderChannels();
  renderServerRail();

  if (state.channels.length > 0) {
    await openChannel(state.channels[0].id);
  }

  closeNavigation();
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
      openChannel(channel.id);
    });

    elements.channelList.appendChild(button);
  });
}

async function openChannel(channelId) {
  const channel = state.channels.find(
    (item) => item.id === channelId
  );

  if (!channel) {
    return;
  }

  state.selectedChannel = channel;

  elements.chatIcon.textContent = "#";
  elements.chatTitle.textContent = `# ${channel.name}`;
  elements.chatSubtitle.textContent = state.selectedServer.name;
  elements.composer.hidden = false;
  elements.messageInput.placeholder = `Message #${channel.name}`;

  renderChannels();
  await loadMessages();
  subscribeToMessages(channel.id);
}

async function loadMessages() {
  if (!state.selectedChannel) {
    return;
  }

  elements.messageArea.innerHTML = `
    <div class="welcome-state">
      <p>Loading messages...</p>
    </div>
  `;

  const { data, error } = await supabaseClient
    .from("server_messages")
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
    console.error("Message loading failed:", error);

    elements.messageArea.innerHTML = `
      <div class="welcome-state">
        <h3>Messages could not be loaded</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;

    return;
  }

  renderMessages(data || []);
}

function renderMessages(messages) {
  elements.messageArea.replaceChildren();

  if (messages.length === 0) {
    elements.messageArea.innerHTML = `
      <div class="welcome-state">
        <div class="welcome-icon">#</div>
        <h3>Welcome to #${escapeHtml(state.selectedChannel.name)}</h3>
        <p>This is the beginning of the channel.</p>
      </div>
    `;

    return;
  }

  messages.forEach((message) => {
    elements.messageArea.appendChild(
      createMessageElement(message)
    );
  });

  scrollMessagesToBottom();
}

function createMessageElement(message) {
  const article = document.createElement("article");
  article.className = "message";

  const isOwnMessage = message.sender_id === state.user.id;

  if (isOwnMessage) {
    article.classList.add("own-message");
  }

  const profile = Array.isArray(message.profiles)
    ? message.profiles[0]
    : message.profiles;

  const displayName =
    profile?.display_name ||
    profile?.username ||
    "Unknown User";

  const avatar = document.createElement("div");
  avatar.className = isOwnMessage
    ? "avatar avatar-blue"
    : "avatar avatar-purple";

  avatar.textContent = getInitial(displayName);

  const content = document.createElement("div");
  content.className = "message-content";

  const metadata = document.createElement("div");
  metadata.className = "message-meta";

  const author = document.createElement("strong");
  author.textContent = displayName;

  const time = document.createElement("time");
  time.dateTime = message.created_at;
  time.textContent = formatTime(message.created_at);

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = message.content;

  metadata.append(author, time);
  content.append(metadata, bubble);
  article.append(avatar, content);

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

async function sendMessage() {
  const content = elements.messageInput.value.trim();

  if (!content || !state.selectedChannel) {
    return;
  }

  elements.sendButton.disabled = true;

  const { error } = await supabaseClient
    .from("server_messages")
    .insert({
      channel_id: state.selectedChannel.id,
      sender_id: state.user.id,
      content: content.slice(0, 2000)
    });

  if (error) {
    console.error("Message sending failed:", error);
    window.alert(`Message could not be sent: ${error.message}`);
    elements.sendButton.disabled = false;
    return;
  }

  elements.messageInput.value = "";
  updateComposer();
}

function subscribeToMessages(channelId) {
  removeMessageSubscription();

  state.messageSubscription = supabaseClient
    .channel(`channel-messages-${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "server_messages",
        filter: `channel_id=eq.${channelId}`
      },
      () => {
        loadMessages();
      }
    )
    .subscribe();
}

function removeMessageSubscription() {
  if (!state.messageSubscription) {
    return;
  }

  supabaseClient.removeChannel(state.messageSubscription);
  state.messageSubscription = null;
}

async function showDiscoverServers() {
  hideNavigationViews();
  elements.discoverNavigation.hidden = false;

  elements.navigationTitle.textContent = "Discover";
  elements.navigationSubtitle.textContent = "Public communities";
  elements.discoverList.innerHTML =
    '<p class="empty-navigation-text">Loading servers...</p>';

  await loadServers();

  const publicServers = state.servers.filter(
    (server) => server.visibility === "public"
  );

  elements.discoverList.replaceChildren();

  if (publicServers.length === 0) {
    elements.discoverList.appendChild(
      createTextElement(
        "p",
        "empty-navigation-text",
        "No public servers are available yet."
      )
    );
    return;
  }

  publicServers.forEach((server) => {
    const card = document.createElement("article");
    card.className = "discover-card";

    const title = document.createElement("h3");
    title.textContent = server.name;

    const description = document.createElement("p");
    description.textContent =
      server.description || "No description provided.";

    const button = document.createElement("button");
    button.type = "button";

    const joined = isServerMember(server.id);
    button.textContent = joined ? "Open Server" : "Join Server";

    button.addEventListener("click", async () => {
      if (joined) {
        await openServer(server.id);
      } else {
        await joinServer(server.id);
      }
    });

    card.append(title, description, button);
    elements.discoverList.appendChild(card);
  });

  closeNavigation();
}

async function joinServer(serverId) {
  const { error } = await supabaseClient
    .from("server_members")
    .insert({
      server_id: serverId,
      user_id: state.user.id,
      role: "member"
    });

  if (error) {
    window.alert(`Server could not be joined: ${error.message}`);
    return;
  }

  await loadServers();
  await openServer(serverId);
}

function openCreateServerModal() {
  elements.serverNameInput.value = "";
  elements.serverDescriptionInput.value = "";
  elements.publicServerInput.checked = true;
  setFormMessage(elements.createServerMessage, "");

  elements.createServerModal.showModal();

  requestAnimationFrame(() => {
    elements.serverNameInput.focus();
  });
}

function closeCreateServerModal() {
  if (elements.createServerModal.open) {
    elements.createServerModal.close();
  }
}

async function createServer(event) {
  event.preventDefault();

  const name = elements.serverNameInput.value.trim();
  const description =
    elements.serverDescriptionInput.value.trim();

  setFormMessage(
    elements.createServerMessage,
    "Creating server..."
  );

  const { data, error } = await supabaseClient
    .from("servers")
    .insert({
      owner_id: state.user.id,
      name,
      description,
      visibility: elements.publicServerInput.checked
        ? "public"
        : "private"
    })
    .select()
    .single();

  if (error) {
    setFormMessage(
      elements.createServerMessage,
      error.message,
      "error"
    );
    return;
  }

  setFormMessage(
    elements.createServerMessage,
    "Server created.",
    "success"
  );

  closeCreateServerModal();
  await loadServers();
  await openServer(data.id);
}

function openProfileModal() {
  if (!state.profile) {
    return;
  }

  elements.profileDisplayNameInput.value =
    state.profile.display_name;

  elements.profileBioInput.value = state.profile.bio || "";
  setFormMessage(elements.profileMessage, "");

  elements.profileModal.showModal();
}

function closeProfileModal() {
  if (elements.profileModal.open) {
    elements.profileModal.close();
  }
}

async function saveProfile(event) {
  event.preventDefault();

  const displayName =
    elements.profileDisplayNameInput.value.trim();

  const bio = elements.profileBioInput.value.trim();

  setFormMessage(elements.profileMessage, "Saving profile...");

  const { data, error } = await supabaseClient
    .from("profiles")
    .update({
      display_name: displayName,
      bio
    })
    .eq("id", state.user.id)
    .select()
    .single();

  if (error) {
    setFormMessage(
      elements.profileMessage,
      error.message,
      "error"
    );
    return;
  }

  state.profile = data;
  renderProfile();

  setFormMessage(
    elements.profileMessage,
    "Profile saved.",
    "success"
  );

  closeProfileModal();
}

async function signOut() {
  removeMessageSubscription();

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    window.alert(`Sign out failed: ${error.message}`);
    return;
  }

  state.session = null;
  state.user = null;
  state.profile = null;
  state.servers = [];
  state.memberships = [];
  state.channels = [];
  state.selectedServer = null;
  state.selectedChannel = null;

  showScreen("landing");
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

function scrollMessagesToBottom() {
  requestAnimationFrame(() => {
    elements.messageArea.scrollTop =
      elements.messageArea.scrollHeight;
  });
}

function openNavigation() {
  elements.appShell.classList.add("navigation-open");
  elements.mobileOverlay.classList.add("visible");
}

function closeNavigation() {
  elements.appShell.classList.remove("navigation-open");
  elements.mobileOverlay.classList.remove("visible");
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = String(value || "");
  return element.innerHTML;
}

function setUpEventListeners() {
  elements.getStartedButton.addEventListener("click", () => {
    setAuthMode("signup");
    showScreen("auth");
  });

  elements.signInButton.addEventListener("click", () => {
    setAuthMode("signin");
    showScreen("auth");
  });

  elements.authBackButton.addEventListener("click", () => {
    showScreen("landing");
  });

  elements.authSwitchButton.addEventListener("click", () => {
    setAuthMode(
      state.authMode === "signup" ? "signin" : "signup"
    );
  });

  elements.authForm.addEventListener(
    "submit",
    handleAuthentication
  );

  elements.homeButton.addEventListener("click", renderHome);

  elements.discoverServersButton.addEventListener(
    "click",
    showDiscoverServers
  );

  elements.addServerButton.addEventListener(
    "click",
    openCreateServerModal
  );

  elements.createServerForm.addEventListener(
    "submit",
    createServer
  );

  elements.closeCreateServerButton.addEventListener(
    "click",
    closeCreateServerModal
  );

  elements.cancelCreateServerButton.addEventListener(
    "click",
    closeCreateServerModal
  );

  elements.profileButton.addEventListener(
    "click",
    openProfileModal
  );

  elements.profileForm.addEventListener(
    "submit",
    saveProfile
  );

  elements.closeProfileButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.cancelProfileButton.addEventListener(
    "click",
    closeProfileModal
  );

  elements.signOutButton.addEventListener("click", signOut);

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

async function initializeApplication() {
  setUpEventListeners();
  updateComposer();

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    await startAuthenticatedApplication(session);
  } else {
    showScreen("landing");
  }

  supabaseClient.auth.onAuthStateChange(
    async (event, currentSession) => {
      if (
        event === "SIGNED_IN" &&
        currentSession &&
        currentSession.user.id !== state.user?.id
      ) {
        await startAuthenticatedApplication(currentSession);
      }

      if (event === "SIGNED_OUT") {
        showScreen("landing");
      }
    }
  );
}

initializeApplication();
