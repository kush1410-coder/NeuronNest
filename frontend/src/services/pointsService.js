// pointsService.js
// Handles coins, XP, and reward unlocking states persistently in localStorage grouped by child profile ID

const getActiveChildId = () => {
  try {
    const child = JSON.parse(localStorage.getItem("activeChild") || "{}");
    return child._id || "default";
  } catch (e) {
    return "default";
  }
};

export const getCoins = (childId = null) => {
  const targetId = childId || getActiveChildId();
  const coins = localStorage.getItem(`coins_${targetId}`);
  if (coins === null) {
    return 0; // Start at 0 for new profiles
  }
  return parseInt(coins, 10);
};

export const getXP = (childId = null) => {
  const targetId = childId || getActiveChildId();
  const xp = localStorage.getItem(`xp_${targetId}`);
  if (xp === null) {
    return 0; // Start at 0 for new profiles
  }
  return parseInt(xp, 10);
};

export const getStoriesRead = (childId = null) => {
  const targetId = childId || getActiveChildId();
  const stories = localStorage.getItem(`stories_${targetId}`);
  if (stories === null) return 0;
  return parseInt(stories, 10);
};

export const incrementStoriesRead = () => {
  const targetId = getActiveChildId();
  const current = getStoriesRead(targetId);
  localStorage.setItem(`stories_${targetId}`, (current + 1).toString());
  localStorage.setItem(`entered_hub_${targetId}`, "true");
  window.dispatchEvent(new Event("pointsUpdated"));
};

export const getGamesPlayed = (childId = null) => {
  const targetId = childId || getActiveChildId();
  const games = localStorage.getItem(`games_${targetId}`);
  if (games === null) return 0;
  return parseInt(games, 10);
};

export const incrementGamesPlayed = () => {
  const targetId = getActiveChildId();
  const current = getGamesPlayed(targetId);
  localStorage.setItem(`games_${targetId}`, (current + 1).toString());
  localStorage.setItem(`entered_hub_${targetId}`, "true");
  window.dispatchEvent(new Event("pointsUpdated"));
};

export const addRewards = (coinsEarned, xpEarned) => {
  const targetId = getActiveChildId();
  const currentCoins = getCoins(targetId);
  const currentXP = getXP(targetId);
  
  const newCoins = currentCoins + coinsEarned;
  const newXP = currentXP + xpEarned;
  
  localStorage.setItem(`coins_${targetId}`, newCoins.toString());
  localStorage.setItem(`xp_${targetId}`, newXP.toString());
  
  // Set flag that child has entered and finished a quest
  localStorage.setItem(`entered_hub_${targetId}`, "true");

  incrementGamesPlayed(); // Dynamically increment games played when a reward is earned
  
  window.dispatchEvent(new Event("pointsUpdated"));
};

export const spendCoins = (amount) => {
  const targetId = getActiveChildId();
  const currentCoins = getCoins(targetId);
  if (currentCoins >= amount) {
    const newCoins = currentCoins - amount;
    localStorage.setItem(`coins_${targetId}`, newCoins.toString());
    window.dispatchEvent(new Event("pointsUpdated"));
    return true;
  }
  return false;
};

export const getUnlockedRewards = (childId = null) => {
  const targetId = childId || getActiveChildId();
  const unlocked = localStorage.getItem(`unlockedRewards_${targetId}`);
  if (!unlocked) return [];
  try {
    return JSON.parse(unlocked);
  } catch (e) {
    return [];
  }
};

export const unlockReward = (rewardTitle) => {
  const targetId = getActiveChildId();
  const unlocked = getUnlockedRewards(targetId);
  if (!unlocked.includes(rewardTitle)) {
    unlocked.push(rewardTitle);
    localStorage.setItem(`unlockedRewards_${targetId}`, JSON.stringify(unlocked));
    window.dispatchEvent(new Event("pointsUpdated"));
  }
};

export const hasEnteredHub = (childId) => {
  return localStorage.getItem(`entered_hub_${childId}`) === "true";
};
