import { useState, useEffect } from "react";
import { getCoins, getXP, getUnlockedRewards, getStoriesRead, getGamesPlayed, addRewards, spendCoins as spendCoinsUtil, unlockReward as unlockRewardUtil } from "../services/pointsService";

export function usePoints() {
  const [coins, setCoins] = useState(getCoins());
  const [xp, setXp] = useState(getXP());
  const [unlockedRewards, setUnlockedRewards] = useState(getUnlockedRewards());
  const [storiesRead, setStoriesRead] = useState(getStoriesRead());
  const [gamesPlayed, setGamesPlayed] = useState(getGamesPlayed());

  const syncPoints = () => {
    setCoins(getCoins());
    setXp(getXP());
    setUnlockedRewards(getUnlockedRewards());
    setStoriesRead(getStoriesRead());
    setGamesPlayed(getGamesPlayed());
  };

  useEffect(() => {
    window.addEventListener("pointsUpdated", syncPoints);
    return () => {
      window.removeEventListener("pointsUpdated", syncPoints);
    };
  }, []);

  const earnPoints = (coinsEarned, xpEarned) => {
    addRewards(coinsEarned, xpEarned);
  };

  const spendCoins = (amount) => {
    return spendCoinsUtil(amount);
  };

  const unlockReward = (rewardTitle) => {
    unlockRewardUtil(rewardTitle);
  };

  return {
    coins,
    xp,
    unlockedRewards,
    storiesRead,
    gamesPlayed,
    earnPoints,
    spendCoins,
    unlockReward
  };
}
