import {
  User,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { ref, remove } from "firebase/database";
import { database } from "./firebaseConfig";

/**
 * Updates the user's profile (display name).
 * @param user - The current Firebase user object.
 * @param displayName - The new display name for the user.
 */
export const updateUserProfile = async (user: User, displayName: string) => {
  await updateProfile(user, { displayName });
};

/**
 * Changes the user's password after re-authenticating.
 * @param user - The current Firebase user object.
 * @param currentPassword - The user's current password for re-authentication.
 * @param newPassword - The new password to set.
 */
export const changeUserPassword = async (
  user: User,
  currentPassword: string,
  newPassword: string
) => {
  if (!user.email) {
    throw new Error("User does not have an email for re-authentication.");
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

/**
 * Deletes the user's account and all their data from the database after re-authenticating.
 * @param user - The current Firebase user object.
 * @param password - The user's password for re-authentication.
 */
export const deleteUserAccount = async (user: User, password: string) => {
  const userId = user.uid; // Simpan UID sebelum user dihapus

  // Jika pengguna anonim, langsung hapus data dan akun
  if (user.isAnonymous) {
    const userDatabaseRef = ref(database, `${userId}`);
    await remove(userDatabaseRef);
    await deleteUser(user);
    return;
  }

  // Untuk pengguna email, perlu re-autentikasi
  if (!user.email) {
    throw new Error("User does not have an email for re-authentication.");
  }
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);

  // Hapus data dari Realtime Database
  const userDatabaseRef = ref(database, `${userId}`);
  await remove(userDatabaseRef);

  // Hapus akun pengguna
  await deleteUser(user);
};
