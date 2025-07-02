import {
  User,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";

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
 * Deletes the user's account after re-authenticating.
 * @param user - The current Firebase user object.
 * @param password - The user's password for re-authentication.
 */
export const deleteUserAccount = async (user: User, password: string) => {
  if (!user.email) {
    throw new Error("User does not have an email for re-authentication.");
  }
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
};
