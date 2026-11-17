import { useState } from 'react';
import { useParams } from 'react-router';

import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { mockActivity } from '@/components/profile/mock-data';
import { $api } from '../lib/api';

// 1. Definim que el component pot rebre un username opcional
interface ProfileProps {
  username?: string;
}

// 2. Afegim la prop al component
export function Profile({ username: propUsername }: ProfileProps) {
  // 3. Capturem l'usuari de la URL (si n'hi ha)
  const { username: urlUsername } = useParams<{ username: string }>();

  // 4. Lògica clau: Si la URL té un usuari (ex: /profile/joan), mirem el del joan.
  // Si la URL no en té (ex: /profile), mirem el que ens arriba per la prop (el teu).
  const targetUsername = urlUsername || propUsername;

  const [editing, setEditing] = useState(false);

  // 5. Fem la petició fent servir el targetUsername
  const {
    data: profile,
    error,
    isLoading,
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

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div>Carregant perfil...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div>{error ? `S'ha produït un error: ${error.message}` : 'Usuari no trobat'}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <ProfileHeader profile={profile} onEdit={() => setEditing(true)} />
      <ProfileTabs profile={profile} activity={mockActivity} />
      <EditProfileDialog
        open={editing}
        onOpenChange={setEditing}
        profile={profile}
        onSave={(updatedProfile) => {
          console.log("Pendent d'enviar al backend:", updatedProfile);
          setEditing(false);
        }}
      />
    </div>
  );
}
