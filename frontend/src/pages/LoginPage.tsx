import { Navigate, useNavigate } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { GoogleIcon, PlayCircle02Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/auth/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  function handleGoogleLogin() {
    window.location.assign('/oauth2/authorization/google');
  }

  function handleGuestAccess() {
    navigate('/');
  }

  if (isLoading) {
    return (
      <div className="p-6" role="status">
        Checking your session…
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex items-center gap-2">
            <HugeiconsIcon icon={PlayCircle02Icon} size={32} />
            <span className="text-xl font-semibold">ProTube</span>
          </div>

          <CardTitle className="text-2xl">Log in to ProTube</CardTitle>

          <CardDescription>Continue with one of your existing accounts</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start gap-3 rounded-full px-5"
              onClick={handleGoogleLogin}
            >
              <HugeiconsIcon icon={GoogleIcon} size={20} />
              Continue with Google
            </Button>
          </div>

          <div className="my-6">
            <Separator />
          </div>

          <Button type="button" variant="ghost" className="w-full" onClick={handleGuestAccess}>
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
