'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { parseStringify } from '../utils';

type AccountProps = {
  email: string;
  fullname: string;
};

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(
      ID.unique(),
      email
    );

    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email OTP');
  }
};

export const createAccount = async ({
  fullname,
  email,
}: AccountProps) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error('Failed to send email OTP');

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullname,
        email,
        avatar:
          'https://images.icon-icons.com/3446/PNG/512/account_profile_user_avatar_icon_219236.png',
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};
