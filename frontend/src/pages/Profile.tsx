import { useState } from 'react';

import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import {
  mockActivity,
  mockProfile,
} from '@/components/profile/mock-data';

export function Profile() {
  const [profile, setProfile] = useState(mockProfile);
  const [editing, setEditing] = useState(false);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <ProfileHeader
        profile={profile}
        onEdit={() => setEditing(true)}
      />

      <ProfileTabs
        profile={profile}
        activity={mockActivity}
      />

      <EditProfileDialog
        open={editing}
        onOpenChange={setEditing}
        profile={profile}
        onSave={setProfile}
      />
    </div>
  );
}