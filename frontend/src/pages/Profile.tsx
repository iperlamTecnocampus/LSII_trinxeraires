import { useState } from 'react';
import { useParams } from 'react-router';

import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { mockActivity } from '@/components/profile/mock-data';
import { $api } from '../lib/api';
import { useAuth } from '@/auth/useAuth';

import { components } from '@/api-schema';
type EditUserDTO = components['schemas']['EditUserDTO'];

interface ProfileProps {
  username?: string;
}

export function Profile({ username: propUsername }: ProfileProps) {
  const { username: urlUsername } = useParams<{ username: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const targetUsername = urlUsername || propUsername || currentUser?.userName;
  const [editing, setEditing] = useState(false);

  // 1. Fetch data and extract 'refetch' to update the UI later
  const {
    data: profile,
    error,
    isLoading,
    refetch,
  } = $api.useQuery(
    'get',
    '/api/users/{username}',
    {
      params: {
        path: {
          username: targetUsername ?? '',
        },
      },
    },
    {
      enabled: Boolean(targetUsername),
    }
  );

  // 2. Define the mutation using $api to perform the PUT request
  const editProfileMutation = $api.useMutation('put', '/api/users/me', {
    onSuccess: (updatedProfile) => {
      updateUser({
        pictureFid: updatedProfile.pictureFid,
        displayName: updatedProfile.displayName,
      });
      setEditing(false); // Close the modal
      refetch(); // Force React Query to fetch the updated user data
    },
    onError: (err) => {
      console.error('Error updating profile:', err);
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div>{error ? `An error has occurred: ${error.message}` : 'User not found'}</div>
      </div>
    );
  }

  const isOwnProfile = Boolean(currentUser?.userName && currentUser.userName === profile.userName);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <ProfileHeader profile={profile} onEdit={isOwnProfile ? () => setEditing(true) : undefined} />

      <ProfileTabs profile={profile} activity={mockActivity} />

      <EditProfileDialog
        open={editing}
        onOpenChange={setEditing}
        profile={profile}
        // Pass the loading state to disable the button while saving
        isSaving={editProfileMutation.isPending}
        saveError={editProfileMutation.isError ? 'Could not save your profile. Please try again.' : null}
        onSave={(updatedProfile) => {
          // Build the payload matching the EditUserDTO schema
          const payload: EditUserDTO = {
            displayName: updatedProfile.displayName,
            description: updatedProfile.description,
            pictureFid: updatedProfile.pictureFid,
            bannerFid: updatedProfile.bannerFid,
          };

          // Execute the request
          editProfileMutation.mutate({
            body: payload,
          });
        }}
      />
    </div>
  );
}
