import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, provider } from "../services/firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";

/**
 * @typedef {Object} UserData
 * @property {number} exp - Experience points user.
 * @property {number} diamonds - Mata uang premium.
 * @property {string[]} completed_puzzles - Daftar ID puzzle yang selesai.
 * @property {string[]} earned_badges - Daftar ID badge yang didapat.
 * @property {boolean} bonus_claimed - Status klaim bonus awal.
 * @property {string} joinedAt - Tanggal saat user pertama kali bergabung (ISO String).
 */

/**
 * @typedef {Object} AuthContextType
 * @property {import("firebase/auth").User | null} user - Firebase User object.
 * @property {UserData | null} userData - Data tambahan dari Firestore.
 * @property {boolean} loading - State loading saat fetch auth.
 * @property {function(): Promise<void>} loginWithGoogle - Fungsi login.
 * @property {function(): Promise<void>} logout - Fungsi logout.
 * @property {function(string): Promise<void>} savePuzzleProgress - Fungsi update progres.
 * @property {function(string, string, boolean): Promise<void>} updateDetailedProgress - Fungsi simpan progress detail (CCBH & status).
 */

const AuthContext = createContext(/** @type {AuthContextType | null} */ (null));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    /** @type {import("firebase/auth").User | null} */ (null),
  );
  const [userData, setUserData] = useState(
    /** @type {UserData | null} */ (null),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      // Bersihkan listener Firestore sebelumnya jika ada (mencegah duplikasi)
      if (unsubDoc) unsubDoc();

      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);

        unsubDoc = onSnapshot(
          userDocRef,
          (doc) => {
            if (doc.exists()) {
              setUserData(/** @type {UserData} */ (doc.data()));
            }
            setLoading(false); // Set loading false HANYA setelah snapshot pertama tiba
          },
          (error) => {
            console.error("Firestore Listener Error:", error);
            setLoading(false);
          },
        );
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // Cek apakah user baru
      const userDocRef = doc(db, "users", loggedInUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const initialData = {
          exp: 0,
          diamonds: 0,
          completed_puzzles: [],
          earned_badges: [],
          bonus_claimed: false,
          joinedAt: new Date().toISOString(),
          name: loggedInUser.displayName,
        };
        await setDoc(userDocRef, initialData);
        setUserData(initialData);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = () => signOut(auth);

  /**
   * Menyimpan progres puzzle dan mengupdate kurensi
   * @param {string} puzzleId
   * @returns {Promise<{isNew: boolean}>}
   */
  const savePuzzleProgress = async (puzzleId) => {
    if (!user || !userData) return { isNew: false };
    // if (!user || !userData) return;

    const userDocRef = doc(db, "users", user.uid);
    const isAlreadyCompleted = userData.completed_puzzles.includes(puzzleId);

    // Kita hanya memberi hadiah EXP jika puzzle baru pertama kali diselesaikan
    if (!isAlreadyCompleted) {
      const updates = {
        completed_puzzles: arrayUnion(puzzleId), // Tambah ID tanpa duplikat
        exp: increment(100), // Atomic increment +100 EXP
      };

      // --- LOGIKA PENGECEKAN MISI 12 SOAL ---
      const totalCompleted = userData.completed_puzzles.length + 1;
      if (totalCompleted === 11 && !userData.bonus_claimed) {
        updates["diamonds"] = increment(3);
        updates["bonus_claimed"] = true; // Tandai agar tidak bisa diklaim berulang
      }
      // --------------------------------------

      await updateDoc(userDocRef, updates);
      return { isNew: true };
    }
    return { isNew: false };
  };

  /**
   * Mengupdate data progres detail user (pelacakan CCBH dan status per puzzle)
   * @param {string} puzzleId
   * @param {string} topic
   * @param {boolean} isCorrect
   */
  const updateDetailedProgress = async (puzzleId, topic, isCorrect) => {
    if (!user) return;

    const progressId = `${user.uid}_${puzzleId}`;
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        loginWithGoogle,
        logout,
        savePuzzleProgress,
        updateDetailedProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
