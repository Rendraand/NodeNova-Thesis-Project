import { GAME_CONFIG } from "./gameConfig";

const ACHIVEMETS = {
  MASTER_OF_LISTS: {
    NAME: "Master of Lists",
    DESCRIPTION: "Successfully completed all levels of Single Linked List.",
    ID: "6VZvKYz93oyuuslYDsM5",
  },
  TREE_ARCHITECT: {
    NAME: "Tree Architect",
    DESCRIPTION: "Successfully completed all levels of Binary Tree.",
    ID: "OtRUWqLZ5K3H7iKsbmqz",
  },
  LOGIC_SURVIVOR: {
    NAME: "Logic Survivor",
    DESCRIPTION:
      "Successfully completed a hard level (3 or above) without triggering any CCBH.",
    ID: "kVPG9ErmxraJ13qWN0Kf",
  },
};

export const unlockAchivements = (userData, level, ccbh_triggered) => {
  const newUnlocked = [];

  // check if eligible for master of lists
  if (
    GAME_CONFIG.TOPICS.LINKED_LIST.LEVEL_IDS.every((id) =>
      userData.completed_puzzles.includes(id),
    ) &&
    !userData.badges.includes(ACHIVEMETS.MASTER_OF_LISTS.ID)
  ) {
    newUnlocked.push(ACHIVEMETS.MASTER_OF_LISTS.ID);
  }

  // check if eligible for tree architect
  if (
    GAME_CONFIG.TOPICS.BINARY_TREE.LEVEL_IDS.every((id) =>
      userData.completed_puzzles.includes(id),
    ) &&
    !userData.badges.includes(ACHIVEMETS.TREE_ARCHITECT.ID)
  ) {
    newUnlocked.push(ACHIVEMETS.TREE_ARCHITECT.ID);
  }

  // check if eligible for logic survivor
  if (
    level >= 3 &&
    ccbh_triggered === 0 &&
    !userData.badges.includes(ACHIVEMETS.LOGIC_SURVIVOR.ID)
  ) {
    newUnlocked.push(ACHIVEMETS.LOGIC_SURVIVOR.ID);
  }

  return newUnlocked;
};
