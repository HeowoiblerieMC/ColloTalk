"use strict";

const SUPABASE_URL =
  "https://mvollazjrwebwqkpagqk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_mrDiTI54EOV0agHDCJJ2jQ_epAqSxXC";

const OWNER_USER_ID = "";

const BADGE_IMAGES = {
  owner: "./img/owner.jpg",
  pro: "./img/pro.jpg",
  plus: "./img/plus.jpg",
  admin: "./img/admin.jpg",
  moderator: "./img/mod.jpg",
  support: "./img/support.jpg",
  developer: "./img/dev.jpg",
  gifter: "./img/gifter.jpg",
  bugHunter: "./img/bughunt.jpg"
};

const BADGE_INFORMATION = {
  owner: {
    label: "Owner",
    description: "Official owner of ColloTalk."
  },
  pro: {
    label: "Collo Pro",
    description: "Active Collo Pro member."
  },
  plus: {
    label: "Collo Plus",
    description: "Active Collo Plus member."
  },
  admin: {
    label: "Admin",
    description: "ColloTalk administrator."
  },
  moderator: {
    label: "Moderator",
    description: "ColloTalk moderation team member."
  },
  support: {
    label: "Support",
    description: "ColloTalk support team member."
  },
  developer: {
    label: "Developer",
    description: "ColloTalk developer."
  },
  gifter: {
    label: "Gifter",
    description: "Recognized for gifting Collo memberships."
  },
  bugHunter: {
    label: "Bug Hunter",
    description: "Recognized for reporting important ColloTalk bugs."
  }
};

const PLAN_PRICES = {
  individual: {
    monthly: {
      plus: "$3.99",
      pro: "$9.99",
      period: "per month"
    },
    yearly: {
      plus: "$39.99",
      pro: "$99.99",
      period: "per year"
    }
  },
  family: {
    monthly: {
      plus: "$11.99",
      pro: "$29.99",
      period: "per month"
    },
    yearly: {
      plus: "$119.99",
      pro: "$299.99",
      period: "per year"
    }
  }
};

if (!window.supabase) {
  throw new Error(
    "Supabase could not be loaded. Check the Supabase script tag in index.html."
  );
}

const { createClient } = window.supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const state = {
  session: null,
  user: null,
  profile: null,
  profileStyle: {
    backgroundUrl: ""
  },
  servers: [],
  selectedServer: null,
  channels: [],
  selectedChannel: null,
  messages: [],
  membership: null,
  realtimeChannel: null,
  profilePanelUser: null,
  planAudience: "individual",
  billingPeriod: "monthly"
};

const elements = {
  landingScreen: document.getElementById("landingScreen"),
  authScreen: document.getElementById("authScreen"),
  confirmationScreen: document.getElementById("confirmationScreen"),
  appShell: document.getElementById("appShell"),
  connectionStatus: document.getElementById("connectionStatus"),

  getStartedButton: document.getElementById("getStartedButton"),
  signInLandingButton: document.getElementById("signInLandingButton"),
  landingPlansButton: document.getElementById("landingPlansButton"),

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
  returnToSignInButton: document.getElementById(
    "returnToSignInButton"
  ),

  homeButton: document.getElementById("homeButton"),
  serverList: document.getElementById("serverList"),
  createServerButton: document.getElementById("createServerButton"),
  refreshServersButton: document.getElementById(
    "refreshServersButton"
  ),

  navigationTitle: document.getElementById("navigationTitle"),
  navigationSubtitle: document.getElementById(
    "navigationSubtitle"
  ),
  homeNavigation: document.getElementById("homeNavigation"),
  serverNavigation: document.getElementById("serverNavigation"),
  serverDescription: document.getElementById("serverDescription"),
  joinServerButton: document.getElementById("joinServerButton"),
  createChannelButton: document.getElementById(
    "createChannelButton"
  ),
  channelList: document.getElementById("channelList"),

  profileButton: document.getElementById("profileButton"),
  profileInformationButton: document.getElementById(
    "profileInformationButton"
  ),
  profileAvatar: document.getElementById("profileAvatar"),
  profileDisplayName: document.getElementById(
    "profileDisplayName"
  ),
  profileUsername: document.getElementById("profileUsername"),
  profilePlanButton: document.getElementById("profilePlanButton"),
  signOutButton: document.getElementById("signOutButton"),

  chatIcon: document.getElementById("chatIcon"),
  chatTitle: document.getElementById("chatTitle"),
  chatSubtitle: document.getElementById("chatSubtitle"),
  messageArea: document.getElementById("messageArea"),
  composer: document.getElementById("composer"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  aiReplyButton: document.getElementById("aiReplyButton"),
  composerStatus: document.getElementById("composerStatus"),
  characterCount: document.getElementById("characterCount"),

  menuButton: document.getElementById("menuButton"),
  closeNavigationButton: document.getElementById(
    "closeNavigationButton"
  ),
  mobileOverlay: document.getElementById("mobileOverlay"),

  profilePanel: document.getElementById("profilePanel"),
  profileCover: document.getElementById("profileCover"),
  closeProfilePanelButton: document.getElementById(
    "closeProfilePanelButton"
  ),
  profilePanelAvatar: document.getElementById(
    "profilePanelAvatar"
  ),
  profilePanelDisplayName: document.getElementById(
    "profilePanelDisplayName"
  ),
  profilePanelUsername: document.getElementById(
    "profilePanelUsername"
  ),
  profileBadgeList: document.getElementById("profileBadgeList"),
  profilePanelBio: document.getElementById("profilePanelBio"),
  editProfileButton: document.getElementById("editProfileButton"),
  messageProfileButton: document.getElementById(
    "messageProfileButton"
  ),
  callProfileButton: document.getElementById("callProfileButton"),
  openCosmeticsButton: document.getElementById(
    "openCosmeticsButton"
  ),
  profileCosmeticsText: document.getElementById(
    "profileCosmeticsText"
  ),
  copyUserIdButton: document.getElementById("copyUserIdButton"),

  plansNavigationButton: document.getElementById(
    "plansNavigationButton"
  ),
  plansModal: document.getElementById("plansModal"),
  closePlansButton: document.getElementById("closePlansButton"),
  individualPlanButton: document.getElementById(
    "individualPlanButton"
  ),
  familyPlanButton: document.getElementById("familyPlanButton"),
  monthlyBillingButton: document.getElementById(
    "monthlyBillingButton"
  ),
  yearlyBillingButton: document.getElementById(
    "yearlyBillingButton"
  ),
  familyNote: document.getElementById("familyNote"),
  plusPrice: document.getElementById("plusPrice"),
  plusPricePeriod: document.getElementById("plusPricePeriod"),
  proPrice: document.getElementById("proPrice"),
  proPricePeriod: document.getElementById("proPricePeriod"),
  previewPlusButton: document.getElementById("previewPlusButton"),
  previewProButton: document.getElementById("previewProButton"),
  previewGiftButton: document.getElementById("previewGiftButton"),

  createServerModal: document.getElementById("createServerModal"),
  createServerForm: document.getElementById("createServerForm"),
  serverNameInput: document.getElementById("serverNameInput"),
  serverDescriptionInput: document.getElementById(
    "serverDescriptionInput"
  ),
  createServerMessage: document.getElementById(
    "createServerMessage"
  ),
  closeServerModalButton: document.getElementById(
    "closeServerModalButton"
  ),
  cancelServerButton: document.getElementById("cancelServerButton"),

  createChannelModal: document.getElementById("createChannelModal"),
  createChannelForm: document.getElementById("createChannelForm"),
  channelNameInput: document.getElementById("channelNameInput"),
  createChannelMessage: document.getElementById(
    "createChannelMessage"
  ),
  closeChannelModalButton: document.getElementById(
    "closeChannelModalButton"
  ),
  cancelChannelButton: document.getElementById(
    "cancelChannelButton"
  ),

  profileEditModal: document.getElementById("profileEditModal"),
  profileEditForm: document.getElementById("profileEditForm"),
  profileDisplayNameInput: document.getElementById(
    "profileDisplayNameInput"
  ),
  profileBioInput: document.getElementById("profileBioInput"),
  profileAvatarUrlInput: document.getElementById(
    "profileAvatarUrlInput"
  ),
  profileBackgroundUrlInput: document.getElementById(
    "profileBackgroundUrlInput"
  ),
  profileEditMessage: document.getElementById(
    "profileEditMessage"
  ),
  closeProfileEditButton: document.getElementById(
    "closeProfileEditButton"
  ),
  cancelProfileEditButton: document.getElementById(
    "cancelProfileEditButton"
  ),

  previewModal: document.getElementById("previewModal"),
  previewIcon: document.getElementById("previewIcon"),
  previewTitle: document.getElementById("previewTitle"),
  previewDescription: document.getElementById(
    "previewDescription"
  ),
  closePreviewButton: document.getElementById("closePreviewButton")
};

function validateRequiredElements() {
  Object.entries(elements).forEach(([name, element]) => {
    if (!element) {
      throw new Error(`Missing required HTML element: ${name}`);
    }
  });
}

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
  setFormMessage(elements.signInMessage, "");
  setFormMessage(elements.signUpMessage, "");
}

function setFormMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("success", success);
}

function getErrorMessage(error, fallback) {
  if (error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
}

async function testConnection() {
  elements.connectionStatus.textContent =
    "Connecting to ColloTalk...";

  elements.connectionStatus.classList.remove("connected", "error");

  try {
    const { error } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    elements.connectionStatus.textContent =
      "ColloTalk services are online";

    elements.connectionStatus.classList.add("connected");
  } catch (error) {
    console.error("Connection error:", error);

    elements.connectionStatus.textContent =
      "Online services are unavailable on this network";

    elements.connectionStatus.classList.add("error");
  }
}

async function signUp(event) {
  event.preventDefault();

  const username = elements.signUpUsername.value
    .trim()
    .toLowerCase();

  const displayName =
    elements.signUpDisplayName.value.trim();

  const email = elements.signUpEmail.value.trim();
  const password = elements.signUpPassword.value;

  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    setFormMessage(
      elements.signUpMessage,
      "Use 3 to 24 lowercase letters, numbers, or underscores."
    );

    return;
  }

  setFormMessage(
    elements.signUpMessage,
    "Creating your account...",
    true
  );

  try {
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
      throw error;
    }

    if (data.session) {
      await enterApplication(data.session);
      return;
    }

    elements.confirmationEmail.textContent = email;
    showOnly(elements.confirmationScreen);
  } catch (error) {
    console.error("Sign-up error:", error);

    setFormMessage(
      elements.signUpMessage,
      getErrorMessage(error, "Account creation failed.")
    );
  }
}

async function signIn(event) {
  event.preventDefault();

  const email = elements.signInEmail.value.trim();
  const password = elements.signInPassword.value;

  setFormMessage(
    elements.signInMessage,
    "Signing in...",
    true
  );

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      throw error;
    }

    await enterApplication(data.session);
  } catch (error) {
    console.error("Sign-in error:", error);

    setFormMessage(
      elements.signInMessage,
      getErrorMessage(error, "Sign in failed.")
    );
  }
}

async function signOut() {
  closeProfilePanel();
  await unsubscribeFromMessages();

  try {
    await supabaseClient.auth.signOut();
  } catch (error) {
    console.error("Sign-out error:", error);
  }

  resetApplicationState();
  showOnly(elements.landingScreen);
}

function resetApplicationState() {
  state.session = null;
  state.user = null;
  state.profile = null;
  state.profileStyle = {
    backgroundUrl: ""
  };
  state.servers = [];
  state.selectedServer = null;
  state.channels = [];
  state.selectedChannel = null;
  state.messages = [];
  state.membership = null;
  state.profilePanelUser = null;

  elements.serverList.replaceChildren();
  elements.channelList.replaceChildren();
}

async function enterApplication(session) {
  if (!session || !session.user) {
    showOnly(elements.landingScreen);
    return;
  }

  state.session = session;
  state.user = session.user;

  showOnly(elements.appShell);

  loadProfileStyle();

  await loadProfile();
  await loadServers();
  await renderHomeState();
}

function getProfileStyleStorageKey() {
  const userId = state.user?.id || "guest";
  return `collotalk_profile_style_${userId}`;
}

function loadProfileStyle() {
  state.profileStyle = {
    backgroundUrl: ""
  };

  try {
    const savedStyle = localStorage.getItem(
      getProfileStyleStorageKey()
    );

    if (!savedStyle) {
      return;
    }

    const parsedStyle = JSON.parse(savedStyle);

    state.profileStyle.backgroundUrl =
      typeof parsedStyle.backgroundUrl === "string"
        ? parsedStyle.backgroundUrl
        : "";
  } catch (error) {
    console.error("Profile style load error:", error);
  }
}

function saveProfileStyle() {
  localStorage.setItem(
    getProfileStyleStorageKey(),
    JSON.stringify(state.profileStyle)
  );
}

async function loadProfile() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select(
      "id, username, display_name, avatar_url, bio, plan, created_at"
    )
    .eq("id", state.user.id)
    .single();

  if (error) {
    console.error("Profile load error:", error);

    state.profile = {
      id: state.user.id,
      username:
        state.user.user_metadata?.username || "user",
      display_name:
        state.user.user_metadata?.display_name || "User",
      avatar_url: null,
      bio: "",
      plan: "free",
      created_at: state.user.created_at,
      badges: []
    };
  } else {
    state.profile = {
      ...data,
      badges: []
    };
  }

  renderCurrentProfile();
}

function renderCurrentProfile() {
  if (!state.profile) {
    return;
  }

  const displayName =
    state.profile.display_name || state.profile.username;

  elements.profileDisplayName.textContent = displayName;
  elements.profileUsername.textContent =
    `@${state.profile.username}`;

  setAvatarElement(
    elements.profileAvatar,
    state.profile.avatar_url,
    displayName
  );

  renderPlanButton();
  updateAiButton();
}

function normalizePlan(plan) {
  if (plan === "plus" || plan === "pro") {
    return plan;
  }

  return "free";
}

function isOfficialOwner(profile) {
  if (!profile || !OWNER_USER_ID) {
    return false;
  }

  return profile.id === OWNER_USER_ID;
}

function getEffectivePlan(profile) {
  if (isOfficialOwner(profile)) {
    return "pro";
  }

  return normalizePlan(profile?.plan);
}

function renderPlanButton() {
  const plan = getEffectivePlan(state.profile);

  elements.profilePlanButton.classList.remove(
    "plan-free",
    "plan-plus",
    "plan-pro"
  );

  elements.profilePlanButton.classList.add(`plan-${plan}`);
  elements.profilePlanButton.textContent = plan.toUpperCase();
}

function updateAiButton() {
  const plan = getEffectivePlan(state.profile);
  const hasAccess = plan === "pro";

  elements.aiReplyButton.classList.toggle(
    "locked",
    !hasAccess
  );

  elements.aiReplyButton.title = hasAccess
    ? "Generate AI reply suggestions"
    : "AI Reply requires Collo Pro";
}

async function loadServers() {
  elements.serverList.replaceChildren();

  const { data, error } = await supabaseClient
    .from("servers")
    .select(
      "id, owner_id, name, description, visibility, created_at"
    )
    .order("created_at", {
      ascending: true
    });

  if (error) {
    console.error("Server load error:", error);

    showMessageState(
      "Server error",
      getErrorMessage(error, "Servers could not be loaded.")
    );

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

    button.setAttribute(
      "aria-label",
      `Open ${server.name}`
    );

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
  const server = state.servers.find(
    (item) => item.id === serverId
  );

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

  renderServers();
  closeNavigation();
}

async function loadMembership() {
  const { data, error } = await supabaseClient
    .from("server_members")
    .select("server_id, user_id, role")
    .eq("server_id", state.selectedServer.id)
    .eq("user_id", state.user.id)
    .maybeSingle();

  if (error) {
    console.error("Membership load error:", error);
  }

  state.membership = error ? null : data;
}

function renderMembershipControls() {
  const isMember = Boolean(state.membership);

  const canManage =
    state.membership &&
    ["owner", "admin"].includes(state.membership.role);

  elements.joinServerButton.hidden = isMember;
  elements.createChannelButton.hidden = !canManage;
}

async function joinSelectedServer() {
  if (!state.selectedServer || !state.user) {
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
    openPreview(
      "Join Failed",
      getErrorMessage(
        error,
        "The server could not be joined."
      ),
      "!"
    );

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
    message.textContent =
      "Join this server to view its channels.";

    elements.channelList.appendChild(message);
    elements.composer.hidden = true;

    showMessageState(
      state.selectedServer.name,
      "Join this community to open its channels and messages."
    );

    return;
  }

  const { data, error } = await supabaseClient
    .from("channels")
    .select(
      "id, server_id, name, description, position, created_at"
    )
    .eq("server_id", state.selectedServer.id)
    .order("position", {
      ascending: true
    })
    .order("created_at", {
      ascending: true
    });

  if (error) {
    console.error("Channel load error:", error);

    showMessageState(
      "Channel error",
      getErrorMessage(error, "Channels could not be loaded.")
    );

    return;
  }

  state.channels = data || [];
  renderChannels();

  if (state.channels.length > 0) {
    const selected =
      state.channels.find(
        (channel) =>
          channel.id === state.selectedChannel?.id
      ) || state.channels[0];

    await selectChannel(selected.id);
  } else {
    elements.composer.hidden = true;

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
  const channel = state.channels.find(
    (item) => item.id === channelId
  );

  if (!channel) {
    return;
  }

  await unsubscribeFromMessages();

  state.selectedChannel = channel;
  state.messages = [];

  renderChannels();

  elements.chatIcon.textContent = "#";
  elements.chatTitle.textContent = `# ${channel.name}`;
  elements.chatSubtitle.textContent =
    state.selectedServer.name;

  elements.messageInput.placeholder =
    `Message #${channel.name}`;

  elements.composer.hidden = false;

  await loadMessages();
  subscribeToMessages();
}

async function loadMessages() {
  if (!state.selectedChannel) {
    return;
  }

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
        id,
        username,
        display_name,
        avatar_url,
        bio,
        plan,
        created_at
      )
    `)
    .eq("channel_id", state.selectedChannel.id)
    .order("created_at", {
      ascending: true
    })
    .limit(200);

  if (error) {
    console.error("Message load error:", error);

    showMessageState(
      "Message error",
      getErrorMessage(error, "Messages could not be loaded.")
    );

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
    elements.messageArea.appendChild(
      createMessageElement(message)
    );
  });

  scrollToBottom();
}

function normalizeJoinedProfile(value) {
  if (Array.isArray(value)) {
    return value[0] || {};
  }

  return value || {};
}

function createMessageElement(message) {
  const profile = normalizeJoinedProfile(message.profiles);

  const displayName =
    profile.display_name ||
    profile.username ||
    "Unknown user";

  const isOwnMessage =
    message.sender_id === state.user.id;

  const article = document.createElement("article");
  article.className = "message";

  if (isOwnMessage) {
    article.classList.add("own-message");
  }

  const avatar = document.createElement("button");

  avatar.className = isOwnMessage
    ? "avatar avatar-blue"
    : "avatar avatar-purple";

  avatar.type = "button";

  avatar.setAttribute(
    "aria-label",
    `Open ${displayName}'s profile`
  );

  setAvatarElement(
    avatar,
    profile.avatar_url,
    displayName
  );

  avatar.addEventListener("click", () => {
    openProfilePanel({
      ...profile,
      id: message.sender_id,
      badges: []
    });
  });

  const body = document.createElement("div");

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

  if (
    !content ||
    !state.selectedChannel ||
    !state.user
  ) {
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
    console.error("Message send error:", error);

    elements.composerStatus.textContent =
      getErrorMessage(error, "Message failed");

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
        event: "*",
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
        status === "SUBSCRIBED"
          ? "Connected"
          : status;
    });
}

async function unsubscribeFromMessages() {
  if (!state.realtimeChannel) {
    return;
  }

  try {
    await supabaseClient.removeChannel(
      state.realtimeChannel
    );
  } catch (error) {
    console.error(
      "Realtime unsubscribe error:",
      error
    );
  }

  state.realtimeChannel = null;
}

async function createServer(event) {
  event.preventDefault();

  const name = elements.serverNameInput.value.trim();

  const description =
    elements.serverDescriptionInput.value.trim();

  setFormMessage(
    elements.createServerMessage,
    "Creating server...",
    true
  );

  const { data: server, error } =
    await supabaseClient
      .from("servers")
      .insert({
        owner_id: state.user.id,
        name,
        description,
        visibility: "public"
      })
      .select(
        "id, owner_id, name, description, visibility, created_at"
      )
      .single();

  if (error) {
    setFormMessage(
      elements.createServerMessage,
      getErrorMessage(error, "Server creation failed.")
    );

    return;
  }

  const { error: channelError } =
    await supabaseClient
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
      getErrorMessage(
        channelError,
        "The general channel could not be created."
      )
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

  setFormMessage(
    elements.createChannelMessage,
    "Creating channel...",
    true
  );

  const { data, error } =
    await supabaseClient
      .from("channels")
      .insert({
        server_id: state.selectedServer.id,
        name,
        description: "",
        position: state.channels.length
      })
      .select(
        "id, server_id, name, description, position, created_at"
      )
      .single();

  if (error) {
    setFormMessage(
      elements.createChannelMessage,
      getErrorMessage(error, "Channel creation failed.")
    );

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

async function renderHomeState() {
  state.selectedServer = null;
  state.selectedChannel = null;
  state.channels = [];
  state.messages = [];
  state.membership = null;

  await unsubscribeFromMessages();

  elements.homeNavigation.hidden = false;
  elements.serverNavigation.hidden = true;
  elements.navigationTitle.textContent = "ColloTalk";
  elements.navigationSubtitle.textContent =
    "Online conversations";

  elements.composer.hidden = true;

  elements.chatIcon.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 5h9A4.5 4.5 0 0 1 21 9.5v3A4.5 4.5 0 0 1 16.5 17H12l-4.8 3.2A.75.75 0 0 1 6 19.58V17A4.5 4.5 0 0 1 3 12.76V9.5A4.5 4.5 0 0 1 7.5 5Z"></path>
    </svg>
  `;

  elements.chatTitle.textContent =
    "Welcome to ColloTalk";

  elements.chatSubtitle.textContent =
    "Select or create a community server";

  showMessageState(
    "ColloTalk is online",
    "Create a server or select an existing community from the server rail."
  );

  renderServers();
  closeNavigation();
}

function updateComposer() {
  const value = elements.messageInput.value;

  elements.characterCount.textContent =
    `${value.length} / 2000`;

  elements.sendButton.disabled =
    value.trim().length === 0;

  elements.messageInput.style.height = "auto";

  elements.messageInput.style.height =
    `${Math.min(
      elements.messageInput.scrollHeight,
      150
    )}px`;
}

function openProfilePanel(profile = state.profile) {
  if (!profile) {
    return;
  }

  state.profilePanelUser = profile;

  const displayName =
    profile.display_name ||
    profile.username ||
    "User";

  elements.profilePanelDisplayName.textContent =
    displayName;

  elements.profilePanelUsername.textContent =
    `@${profile.username || "username"}`;

  elements.profilePanelBio.textContent =
    profile.bio?.trim() ||
    "No bio has been added yet.";

  setAvatarElement(
    elements.profilePanelAvatar,
    profile.avatar_url,
    displayName
  );

  const isOwnProfile =
    profile.id === state.user?.id;

  applyProfileCover(
    isOwnProfile
      ? state.profileStyle.backgroundUrl
      : ""
  );

  renderProfileBadges(profile);
  renderProfileActions(profile);

  elements.profilePanel.hidden = false;
  elements.mobileOverlay.classList.add("visible");
}

function closeProfilePanel() {
  elements.profilePanel.hidden = true;
  state.profilePanelUser = null;

  if (
    !elements.appShell.classList.contains(
      "navigation-open"
    )
  ) {
    elements.mobileOverlay.classList.remove("visible");
  }
}

function renderProfileBadges(profile) {
  elements.profileBadgeList.replaceChildren();

  const badgeKeys = getProfileBadgeKeys(profile);

  badgeKeys.forEach((badgeKey) => {
    elements.profileBadgeList.appendChild(
      createProfileBadge(badgeKey)
    );
  });

  const plan = getEffectivePlan(profile);

  if (plan === "pro") {
    elements.profileCosmeticsText.textContent =
      "Plus and Pro cosmetics included";
    return;
  }

  if (plan === "plus") {
    elements.profileCosmeticsText.textContent =
      "Plus cosmetics included";
    return;
  }

  elements.profileCosmeticsText.textContent =
    "Free and permanently purchased cosmetics";
}

function getProfileBadgeKeys(profile) {
  const badgeKeys = [];

  if (isOfficialOwner(profile)) {
    badgeKeys.push("owner");
  }

  const plan = getEffectivePlan(profile);

  if (plan === "pro") {
    badgeKeys.push("pro");
  } else if (plan === "plus") {
    badgeKeys.push("plus");
  }

  const assignedBadges = Array.isArray(profile.badges)
    ? profile.badges
    : [];

  assignedBadges.forEach((badgeKey) => {
    if (
      Object.prototype.hasOwnProperty.call(
        BADGE_IMAGES,
        badgeKey
      ) &&
      !badgeKeys.includes(badgeKey)
    ) {
      badgeKeys.push(badgeKey);
    }
  });

  return badgeKeys;
}

function createProfileBadge(badgeKey) {
  const information = BADGE_INFORMATION[badgeKey];
  const imagePath = BADGE_IMAGES[badgeKey];

  const button = document.createElement("button");

  button.className =
    `profile-image-badge badge-${badgeKey}`;

  button.type = "button";
  button.title =
    information?.label || "ColloTalk Badge";

  button.setAttribute(
    "aria-label",
    information?.label || "ColloTalk Badge"
  );

  const image = document.createElement("img");

  image.src = imagePath;

  image.alt =
    `${information?.label || "ColloTalk"} badge`;

  image.loading = "lazy";
  image.draggable = false;

  image.addEventListener("error", () => {
    button.classList.add("badge-image-error");
    button.textContent =
      information?.label?.charAt(0) || "?";
  });

  button.appendChild(image);

  button.addEventListener("click", () => {
    openPreview(
      `${information?.label || "ColloTalk"} Badge`,
      information?.description ||
        "Official ColloTalk badge.",
      information?.label?.charAt(0) || "B"
    );
  });

  return button;
}

function renderProfileActions(profile) {
  const isOwnProfile =
    profile.id === state.user?.id;

  elements.editProfileButton.hidden = !isOwnProfile;
  elements.messageProfileButton.hidden = isOwnProfile;
  elements.callProfileButton.hidden = isOwnProfile;
}

function applyProfileCover(backgroundUrl) {
  if (!backgroundUrl) {
    elements.profileCover.style.backgroundImage = "";
    return;
  }

  elements.profileCover.style.backgroundImage =
    `linear-gradient(rgba(7, 9, 16, 0.12), rgba(7, 9, 16, 0.22)), url("${escapeCssUrl(backgroundUrl)}")`;
}

function escapeCssUrl(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"');
}

function openProfileEditModal() {
  if (!state.profile) {
    return;
  }

  elements.profileDisplayNameInput.value =
    state.profile.display_name || "";

  elements.profileBioInput.value =
    state.profile.bio || "";

  elements.profileAvatarUrlInput.value =
    state.profile.avatar_url || "";

  elements.profileBackgroundUrlInput.value =
    state.profileStyle.backgroundUrl || "";

  setFormMessage(elements.profileEditMessage, "");

  if (!elements.profileEditModal.open) {
    elements.profileEditModal.showModal();
  }
}

function closeProfileEditModal() {
  if (elements.profileEditModal.open) {
    elements.profileEditModal.close();
  }
}

async function saveProfileEdits(event) {
  event.preventDefault();

  const displayName =
    elements.profileDisplayNameInput.value.trim();

  const bio =
    elements.profileBioInput.value.trim();

  const avatarUrl =
    elements.profileAvatarUrlInput.value.trim();

  const backgroundUrl =
    elements.profileBackgroundUrlInput.value.trim();

  if (!displayName) {
    setFormMessage(
      elements.profileEditMessage,
      "Enter a display name."
    );

    return;
  }

  setFormMessage(
    elements.profileEditMessage,
    "Saving profile...",
    true
  );

  const { data, error } = await supabaseClient
    .from("profiles")
    .update({
      display_name: displayName.slice(0, 40),
      bio: bio.slice(0, 300),
      avatar_url: avatarUrl || null
    })
    .eq("id", state.user.id)
    .select(
      "id, username, display_name, avatar_url, bio, plan, created_at"
    )
    .single();

  if (error) {
    setFormMessage(
      elements.profileEditMessage,
      getErrorMessage(error, "Profile update failed.")
    );

    return;
  }

  state.profile = {
    ...data,
    badges: state.profile?.badges || []
  };

  state.profileStyle.backgroundUrl = backgroundUrl;

  saveProfileStyle();
  renderCurrentProfile();
  closeProfileEditModal();
  openProfilePanel(state.profile);
}

function setAvatarElement(
  element,
  imageUrl,
  fallbackName
) {
  element.textContent = getInitial(fallbackName);
  element.style.backgroundImage = "";

  if (!imageUrl) {
    return;
  }

  const image = new Image();

  image.addEventListener("load", () => {
    element.textContent = "";
    element.style.backgroundImage =
      `url("${escapeCssUrl(imageUrl)}")`;
  });

  image.addEventListener("error", () => {
    element.textContent = getInitial(fallbackName);
    element.style.backgroundImage = "";
  });

  image.src = imageUrl;
}

function openPlansModal() {
  updatePlanPricing();

  if (!elements.plansModal.open) {
    elements.plansModal.showModal();
  }
}

function closePlansModal() {
  if (elements.plansModal.open) {
    elements.plansModal.close();
  }
}

function setPlanAudience(audience) {
  state.planAudience = audience;

  elements.individualPlanButton.classList.toggle(
    "active",
    audience === "individual"
  );

  elements.familyPlanButton.classList.toggle(
    "active",
    audience === "family"
  );

  elements.familyNote.hidden =
    audience !== "family";

  updatePlanPricing();
}

function setBillingPeriod(period) {
  state.billingPeriod = period;

  elements.monthlyBillingButton.classList.toggle(
    "active",
    period === "monthly"
  );

  elements.yearlyBillingButton.classList.toggle(
    "active",
    period === "yearly"
  );

  updatePlanPricing();
}

function updatePlanPricing() {
  const prices =
    PLAN_PRICES[state.planAudience][state.billingPeriod];

  elements.plusPrice.textContent = prices.plus;
  elements.proPrice.textContent = prices.pro;
  elements.plusPricePeriod.textContent = prices.period;
  elements.proPricePeriod.textContent = prices.period;

  const familySuffix =
    state.planAudience === "family"
      ? " Family"
      : "";

  elements.previewPlusButton.textContent =
    `Preview Plus${familySuffix}`;

  elements.previewProButton.textContent =
    `Preview Pro${familySuffix}`;
}

function previewPlan(plan) {
  const family =
    state.planAudience === "family";

  const title = family
    ? `Collo ${plan} Family`
    : `Collo ${plan}`;

  const billing =
    state.billingPeriod === "yearly"
      ? "yearly"
      : "monthly";

  const featureText =
    plan === "Pro"
      ? "Collo Pro includes Plus and Pro cosmetics, AI replies, AI rewriting, summaries, translation, and advanced server tools."
      : "Collo Plus includes Plus cosmetics, profile backgrounds, themes, larger uploads, and advanced search.";

  const familyText = family
    ? "The Family plan supports up to four independent accounts for approximately the price of three individual subscriptions."
    : "This is an individual membership.";

  openPreview(
    title,
    `${familyText} This preview uses ${billing} billing. ${featureText} Payments are not active in this prototype.`,
    plan === "Pro" ? "P" : "+"
  );
}

function handleAiReply() {
  const plan = getEffectivePlan(state.profile);

  if (plan !== "pro") {
    openPreview(
      "Collo Pro AI",
      "AI replies, rewriting, summaries, and translation are available with Collo Pro. AI-generated text will always be inserted into the composer for review before sending.",
      "AI"
    );

    return;
  }

  openPreview(
    "AI Reply",
    "The AI reply interface is prepared, but an AI service has not been connected yet. ColloTalk will never send an AI-generated message without user review.",
    "AI"
  );
}

function openPreview(
  title,
  description,
  icon = "C"
) {
  elements.previewTitle.textContent = title;
  elements.previewDescription.textContent =
    description;
  elements.previewIcon.textContent = icon;

  if (!elements.previewModal.open) {
    elements.previewModal.showModal();
  }
}

function closePreview() {
  if (elements.previewModal.open) {
    elements.previewModal.close();
  }
}

async function copyCurrentUserId() {
  const userId =
    state.profilePanelUser?.id ||
    state.user?.id;

  if (!userId) {
    return;
  }

  try {
    await navigator.clipboard.writeText(userId);

    openPreview(
      "User ID Copied",
      "The user ID was copied to the clipboard.",
      "ID"
    );
  } catch (error) {
    console.error("Clipboard error:", error);

    openPreview(
      "Copy Failed",
      "The browser did not allow access to the clipboard.",
      "!"
    );
  }
}

function openServerModal() {
  elements.serverNameInput.value = "";
  elements.serverDescriptionInput.value = "";

  setFormMessage(elements.createServerMessage, "");

  if (!elements.createServerModal.open) {
    elements.createServerModal.showModal();
  }

  requestAnimationFrame(() => {
    elements.serverNameInput.focus();
  });
}

function closeServerModal() {
  if (elements.createServerModal.open) {
    elements.createServerModal.close();
  }
}

function openChannelModal() {
  elements.channelNameInput.value = "";

  setFormMessage(elements.createChannelMessage, "");

  if (!elements.createChannelModal.open) {
    elements.createChannelModal.showModal();
  }

  requestAnimationFrame(() => {
    elements.channelNameInput.focus();
  });
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

  if (elements.profilePanel.hidden) {
    elements.mobileOverlay.classList.remove("visible");
  }
}

function closeAllPanels() {
  closeNavigation();
  closeProfilePanel();
}

function getInitial(value) {
  const text = String(value || "").trim();

  return text
    ? Array.from(text)[0].toUpperCase()
    : "?";
}

function getServerShortName(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${getInitial(words[0])}${getInitial(words[1])}`;
  }

  return Array.from(String(name || "").trim())
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

function setupEvents() {
  elements.getStartedButton.addEventListener(
    "click",
    () => {
      showAuth("signup");
    }
  );

  elements.signInLandingButton.addEventListener(
    "click",
    () => {
      showAuth("signin");
    }
  );

  elements.landingPlansButton.addEventListener(
    "click",
    openPlansModal
  );

  elements.authBackButton.addEventListener(
    "click",
    () => {
      showOnly(elements.landingScreen);
    }
  );

  elements.signInTab.addEventListener(
    "click",
    () => {
      setAuthMode("signin");
    }
  );

  elements.signUpTab.addEventListener(
    "click",
    () => {
      setAuthMode("signup");
    }
  );

  elements.signInForm.addEventListener(
    "submit",
    signIn
  );

  elements.signUpForm.addEventListener(
    "submit",
    signUp
  );

  elements.returnToSignInButton.addEventListener(
    "click",
    () => {
      showAuth("signin");
    }
  );

  elements.signOutButton.addEventListener(
    "click",
    signOut
  );

  elements.homeButton.addEventListener(
    "click",
    renderHomeState
  );

  elements.refreshServersButton.addEventListener(
    "click",
    loadServers
  );

  elements.createServerButton.addEventListener(
    "click",
    openServerModal
  );

  elements.createServerForm.addEventListener(
    "submit",
    createServer
  );

  elements.closeServerModalButton.addEventListener(
    "click",
    closeServerModal
  );

  elements.cancelServerButton.addEventListener(
    "click",
    closeServerModal
  );

  elements.joinServerButton.addEventListener(
    "click",
    joinSelectedServer
  );

  elements.createChannelButton.addEventListener(
    "click",
    openChannelModal
  );

  elements.createChannelForm.addEventListener(
    "submit",
    createChannel
  );

  elements.closeChannelModalButton.addEventListener(
    "click",
    closeChannelModal
  );

  elements.cancelChannelButton.addEventListener(
    "click",
    closeChannelModal
  );

  elements.messageForm.addEventListener(
    "submit",
    sendMessage
  );

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
        elements.messageForm.requestSubmit();
      }
    }
  );

  elements.aiReplyButton.addEventListener(
    "click",
    handleAiReply
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
    closeAllPanels
  );

  elements.profileButton.addEventListener(
    "click",
    () => {
      openProfilePanel(state.profile);
    }
  );

  elements.profileInformationButton.addEventListener(
    "click",
    () => {
      openProfilePanel(state.profile);
    }
  );

  elements.profilePlanButton.addEventListener(
    "click",
    openPlansModal
  );

  elements.closeProfilePanelButton.addEventListener(
    "click",
    closeProfilePanel
  );

  elements.editProfileButton.addEventListener(
    "click",
    openProfileEditModal
  );

  elements.messageProfileButton.addEventListener(
    "click",
    () => {
      openPreview(
        "Direct Messages",
        "Direct messages are planned but are not active in this prototype.",
        "M"
      );
    }
  );

  elements.callProfileButton.addEventListener(
    "click",
    () => {
      openPreview(
        "Voice Calls",
        "Voice calls are planned but are not active in this prototype.",
        "C"
      );
    }
  );

  elements.openCosmeticsButton.addEventListener(
    "click",
    () => {
      openPreview(
        "Collo Cosmetics",
        "Cosmetics are generally paid items. Plus members receive Plus cosmetics while subscribed. Pro members receive both Plus and Pro cosmetics while subscribed. Permanently purchased cosmetics remain available after a subscription ends.",
        "C"
      );
    }
  );

  elements.copyUserIdButton.addEventListener(
    "click",
    copyCurrentUserId
  );

  elements.profileEditForm.addEventListener(
    "submit",
    saveProfileEdits
  );

  elements.closeProfileEditButton.addEventListener(
    "click",
    closeProfileEditModal
  );

  elements.cancelProfileEditButton.addEventListener(
    "click",
    closeProfileEditModal
  );

  elements.plansNavigationButton.addEventListener(
    "click",
    openPlansModal
  );

  elements.closePlansButton.addEventListener(
    "click",
    closePlansModal
  );

  elements.individualPlanButton.addEventListener(
    "click",
    () => {
      setPlanAudience("individual");
    }
  );

  elements.familyPlanButton.addEventListener(
    "click",
    () => {
      setPlanAudience("family");
    }
  );

  elements.monthlyBillingButton.addEventListener(
    "click",
    () => {
      setBillingPeriod("monthly");
    }
  );

  elements.yearlyBillingButton.addEventListener(
    "click",
    () => {
      setBillingPeriod("yearly");
    }
  );

  elements.previewPlusButton.addEventListener(
    "click",
    () => {
      previewPlan("Plus");
    }
  );

  elements.previewProButton.addEventListener(
    "click",
    () => {
      previewPlan("Pro");
    }
  );

  elements.previewGiftButton.addEventListener(
    "click",
    () => {
      openPreview(
        "Collo Gifts",
        "Collo Plus and Collo Pro will be giftable for selected durations. Gift memberships will not renew automatically.",
        "G"
      );
    }
  );

  elements.closePreviewButton.addEventListener(
    "click",
    closePreview
  );

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
      closeNavigation();
    }
  });
}

async function initialize() {
  validateRequiredElements();
  setupEvents();
  updateComposer();
  updatePlanPricing();

  await testConnection();

  try {
    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    if (session) {
      await enterApplication(session);
    } else {
      showOnly(elements.landingScreen);
    }
  } catch (error) {
    console.error(
      "Session restoration error:",
      error
    );

    showOnly(elements.landingScreen);
  }

  supabaseClient.auth.onAuthStateChange(
    (event, sessionValue) => {
      if (event === "SIGNED_OUT") {
        resetApplicationState();
        showOnly(elements.landingScreen);
        return;
      }

      if (
        event === "SIGNED_IN" &&
        sessionValue &&
        state.session?.access_token !==
          sessionValue.access_token
      ) {
        window.setTimeout(() => {
          enterApplication(sessionValue);
        }, 0);
      }
    }
  );
}

initialize();
