import { createContext, useContext, useCallback, useMemo } from "react";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { unlockAchivements } from "../constants/achievements";

/**
 * @typedef {Object} GameProgressContextType
 * @property {string[]} completedPuzzles - Daftar ID puzzle yang selesai.
 * @property {function(string): Promise<{isNew: boolean}>} savePuzzleProgress - Menyimpan progres puzzle.
 * @property {function(string, string, boolean): Promise<void>} updateDetailedProgress - Mengupdate progres journey detail.
 * @property {function(string, string): Promise<{isNew: boolean}>} completePuzzle - Fungsi terpadu untuk menyelesaikan puzzle.
 */

const GameProgressContext = createContext(
  /** @type {GameProgressContextType | null} */ (null),
);

export const GameProgressProvider = ({ children }) => {
  const { user, userData } = useAuth();

  const completedPuzzles = useMemo(
    () => userData?.completed_puzzles || [],
    [userData?.completed_puzzles],
  );

  /**
   * Menyimpan progres puzzle dan mengupdate kurensi
   * @param {string} puzzleId
   * @returns {Promise<{isNew: boolean}>}
   */
  const savePuzzleProgress = useCallback(
    async (puzzleId, topic, level) => {
      if (!user || !userData) return { isNew: false };

      const userDocRef = doc(db, "users", user.uid);
      const getUser = await getDoc(userDocRef);
      const getUserData = getUser.data();
      const progressDocRef = doc(db, "user_journey", `${user.uid}-${puzzleId}`);
      const progressDoc = await getDoc(progressDocRef);
      const progressData = progressDoc.data();
      const isAlreadyCompleted = completedPuzzles.includes(puzzleId);

      // Kita hanya memberi hadiah EXP jika puzzle baru pertama kali diselesaikan
      if (!isAlreadyCompleted) {
        const updates = {
          completed_puzzles: arrayUnion(puzzleId), // Tambah ID tanpa duplikat
          exp: increment(100), // Atomic increment +100 EXP
        };

        if (topic === "Singly Linked List") {
          updates["current_completed_level"] = {
            ...getUserData.current_completed_level,
            linked_list: level,
          };
        }

        if (topic === "Stack" || topic === "Queue") {
          updates["current_completed_level"] = {
            ...getUserData.current_completed_level,
            stack_and_queue: level,
          };
        }

        if (topic === "Binary Search Tree") {
          updates["current_completed_level"] = {
            ...getUserData.current_completed_level,
            binary_tree: level,
          };
        }

        const currentUserData = userData;
        // added newly completed level
        currentUserData.completed_puzzles.push(puzzleId);

        const newUnlockedBadges = unlockAchivements(
          currentUserData,
          level,
          progressData.ccbh_triggered,
        );

        if (newUnlockedBadges.length > 0) {
          updates["badges"] = arrayUnion(...newUnlockedBadges);
        }

        await updateDoc(userDocRef, updates);
        return { isNew: true };
      }
      return { isNew: false };
    },
    [user, userData, completedPuzzles],
  );

  /**
   * Mengupdate data progres detail user (pelacakan CCBH dan status per puzzle)
   * @param {string} puzzleId
   * @param {string} topic
   * @param {boolean} isCorrect
   */
  const updateDetailedProgress = useCallback(
    async (puzzleId, topic, isCorrect, level) => {
      if (!user) return;

      const progressId = `${user.uid}-${puzzleId}`;
      const progressDocRef = doc(db, "user_journey", progressId);

      try {
        const docSnap = await getDoc(progressDocRef);

        if (!docSnap.exists()) {
          // Buat dokumen baru jika belum ada
          await setDoc(progressDocRef, {
            progress_id: progressId,
            user_id: user.uid,
            puzzle_id: puzzleId,
            topic: topic,
            level: level,
            status: isCorrect ? "completed" : "in progress",
            ccbh_triggered: isCorrect ? 0 : 1,
            updated_at: new Date().toISOString(),
          });
        } else {
          const currentData = docSnap.data();
          // Proteksi: Jika sudah completed, jangan update lagi
          if (currentData.status === "completed") return;

          const updates = {
            updated_at: new Date().toISOString(),
            ...(isCorrect
              ? { status: "completed" }
              : { ccbh_triggered: increment(1) }),
          };

          await updateDoc(progressDocRef, updates);
        }
      } catch (error) {
        console.error("Error updating detailed progress:", error);
      }
    },
    [user],
  );

  /**
   * Fungsi terpadu untuk menyelesaikan puzzle (save progress dan journey status)
   * @param {string} puzzleId
   * @param {string} topic
   * @returns {Promise<{isNew: boolean}>}
   */
  const completePuzzle = useCallback(
    async (puzzleId, topic, level) => {
      await updateDetailedProgress(puzzleId, topic, true, level);
      const result = await savePuzzleProgress(puzzleId, topic, level);
      return result;
    },
    [savePuzzleProgress, updateDetailedProgress],
  );

  return (
    <GameProgressContext.Provider
      value={{
        completedPuzzles,
        savePuzzleProgress,
        updateDetailedProgress,
        completePuzzle,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
};

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error("useGameProgress must be used within GameProgressProvider");
  }
  return context;
};
