export const GAME_CONFIG = {
  TOTAL_PUZZLES: 14,
  BASE_EXP: 100,
  EXP_MULTIPLIER: {
    LEVEL_1_2: 1,
    LEVEL_3_4: 2,
    LEVEL_5_PLUS: 3,
  },

  TOPICS: {
    LINKED_LIST: {
      NAME: "Single Linked List",
      LEVELS: 5,
      LEVEL_IDS: ["LL-LVL-1", "LL-LVL-2", "LL-LVL-3", "LL-LVL-4", "LL-LVL-5"],
    },
    STACK_AND_QUEUE: {
      NAME: "Stack and Queue",
      LEVELS: 4,
      LEVEL_IDS: ["SQ-LVL-1", "SQ-LVL-2", "SQ-LVL-3", "SQ-LVL-4"],
    },
    BINARY_TREE: {
      NAME: "Binary Tree",
      LEVELS: 5,
      LEVEL_IDS: ["TR-LVL-1", "TR-LVL-2", "TR-LVL-3", "TR-LVL-4", "TR-LVL-5"],
    },
  },
};

/**
 * Menghitung perolehan EXP berdasarkan level/tingkat kesulitan misi:
 * - Level 1 - 2: BASE_EXP x 1 multiplier (100 EXP)
 * - Level 3 - 4: BASE_EXP x 1.2 multiplier (120 EXP)
 * - Level 5 ke atas: BASE_EXP x 1.5 multiplier (150 EXP)
 *
 * @param {number|string} level - Level misi dari database
 * @returns {number} Jumlah EXP yang didapatkan
 */
export const calculateExp = (level) => {
  const parsedLevel = Number(level) || 1;
  const baseExp = GAME_CONFIG.BASE_EXP;

  if (parsedLevel >= 5) {
    return Math.round(baseExp * GAME_CONFIG.EXP_MULTIPLIER.LEVEL_5_PLUS);
  }
  if (parsedLevel >= 3) {
    return Math.round(baseExp * GAME_CONFIG.EXP_MULTIPLIER.LEVEL_3_4);
  }
  return Math.round(baseExp * GAME_CONFIG.EXP_MULTIPLIER.LEVEL_1_2);
};
