import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';

import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon } from '@hugeicons/core-free-icons';

export function Searchbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get('query') ?? '';
  const [query, setQuery] = useState(currentSearch);

  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/search?query=${encodeURIComponent(search)}` : '/search');
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full max-w-xl">
      <ButtonGroup className="w-full">
        <Input
          aria-label="Search videos"
          placeholder="Search videos"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" variant="outline" aria-label="Search">
          <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
        </Button>
      </ButtonGroup>
    </form>
  );
}
