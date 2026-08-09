import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, provider } from "../services/firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

/**
 * @typedef {Object} UserData
 * @property {number} exp - Experience points user.
 * @property {number} diamonds - Mata uang premium.
 * @property {string[]} completed_puzzles - Daftar ID puzzle yang selesai.
 * @property {string[]} badges - Daftar ID badge yang didapat.
 * @property {boolean} bonus_claimed - Status klaim bonus awal.
 * @property {string} joined_at - Tanggal saat user pertama kali bergabung (ISO String).
 */

/**
 * @typedef {Object} AuthContextType
 * @property {import("firebase/auth").User | null} user - Firebase User object.
 * @property {UserData | null} userData - Data tambahan dari Firestore.
 * @property {boolean} loading - State loading saat fetch auth.
 * @property {function(): Promise<void>} loginWithGoogle - Fungsi login.
 * @property {function(): Promise<void>} logout - Fungsi logout.
 * @property {function(string): Promise<void>} registerNewUser - Fungsi registrasi user baru dengan nama tampilan.
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
          async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(/** @type {UserData} */ (data));

              // Sync photoURL if it differs or is missing in Firestore
              if (
                currentUser.photoURL &&
                data.photo_url !== currentUser.photoURL
              ) {
                try {
                  await updateDoc(userDocRef, {
                    photo_url: currentUser.photoURL,
                  });
                } catch (error) {
                  console.error(
                    "Error updating photoURL in users collection:",
                    error,
                  );
                }
              }
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
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
    }
  };

  /**
   * Mendaftarkan user baru ke Firestore dengan nama tampilan yang dipilih
   * @param {string} displayName
   * @returns {Promise<void>}
   */
  const registerNewUser = async (displayName) => {
    if (!user) throw new Error("No user is signed in.");
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const initialData = {
        exp: 0,
        completed_puzzles: [],
        joined_at: new Date().toISOString(),
        name: displayName,
        photo_url: user.photoURL || null,
        badges: [],
        current_completed_level: {
          linked_list: 0,
          stack_and_queue: 0,
          binary_tree: 0,
        },
      };
      await setDoc(userDocRef, initialData);
      setUserData(initialData);
      setLoading(false);
      ``;
    } catch (error) {
      console.error("Error registering new user:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        loginWithGoogle,
        logout,
        registerNewUser,
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
