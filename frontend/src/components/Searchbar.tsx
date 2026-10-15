import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon } from '@hugeicons/core-free-icons';

export function Searchbar() {
  return (
    <Field>
      <ButtonGroup>
        <Input id="input-button-group" placeholder="Type to search..." />
        <Button variant="outline">
          <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
        </Button>
      </ButtonGroup>
    </Field>
  );
}
