import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "../../lib/auth";
import { ensureUserProfile } from "../../services/userService";
import { migrateProjectsToFirestore } from "../../services/projectService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      setLoading(false);

      // Create user profile if new user
      if (user) {
        try {
          await ensureUserProfile(
            user.uid,
            user.email || "",
            user.displayName || undefined
          );
          
          // Migrate localStorage projects to Firestore on first login
          const hasMigrated = localStorage.getItem(`migrated_${user.uid}`);
          if (!hasMigrated) {
            try {
              await migrateProjectsToFirestore(user.uid);
              localStorage.setItem(`migrated_${user.uid}`, "true");
            } catch (e) {
              console.error("Error migrating projects:", e);
            }
          }
        } catch (e) {
          console.error("Error ensuring user profile:", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

