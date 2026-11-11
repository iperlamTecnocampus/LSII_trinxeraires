import { useNavigate } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Facebook01Icon,
  Github01Icon,
  GoogleIcon,
  PlayCircle02Icon,
} from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function LoginPage() {
  const navigate = useNavigate();

  function handleProviderLogin(provider: string) {
    console.log(`Login with ${provider}`);
  }

  function handleGuestAccess() {
    navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex items-center gap-2">
            <HugeiconsIcon icon={PlayCircle02Icon} size={32} />
            <span className="text-xl font-semibold">ProTube</span>
          </div>

          <CardTitle className="text-2xl">
            Log in to ProTube
          </CardTitle>

          <CardDescription>
            Continue with one of your existing accounts
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start gap-3 rounded-full px-5"
              onClick={() => handleProviderLogin('Google')}
            >
              <HugeiconsIcon icon={GoogleIcon} size={20} />
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start gap-3 rounded-full px-5"
              onClick={() => handleProviderLogin('GitHub')}
            >
              <HugeiconsIcon icon={Github01Icon} size={20} />
              Continue with GitHub
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start gap-3 rounded-full px-5"
              onClick={() => handleProviderLogin('Facebook')}
            >
              <HugeiconsIcon icon={Facebook01Icon} size={20} />
              Continue with Facebook
            </Button>
          </div>

          <div className="my-6">
            <Separator />
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleGuestAccess}
          >
            Continue without account
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Authentication is handled securely by external providers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}