const onlineUsers = new Map();

export function updateUserLastActive(userId) {
  onlineUsers.set(userId.toString(), Date.now());
}

export function getOnlineUsers() {
  const now = Date.now();
  const online = [];

  for (const [userId, timestamp] of onlineUsers.entries()) {
    // Consider user online if active in last 60 seconds
    if (now - timestamp < 60 * 1000) {
      online.push(userId);
    }
  }

  return online;
}
