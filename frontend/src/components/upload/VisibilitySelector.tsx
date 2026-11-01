import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Visibility = 'public' | 'unlisted' | 'private';

interface VisibilitySelectorProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
}

const options: {
  value: Visibility;
  title: string;
  description: string;
}[] = [
  {
    value: 'public',
    title: 'Public',
    description: 'Everyone can watch your video.',
  },
  {
    value: 'unlisted',
    title: 'Unlisted',
    description: 'Anyone with the link can watch your video.',
  },
  {
    value: 'private',
    title: 'Private',
    description: 'Only you can watch your video.',
  },
];

export function VisibilitySelector({ value, onChange }: VisibilitySelectorProps) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="font-semibold">Visibility</h3>

        <p className="text-sm text-muted-foreground">Choose who can watch your video</p>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(newValue) => onChange(newValue as Visibility)}
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const id = `visibility-${option.value}`;

          return (
            <div
              key={option.value}
              className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <RadioGroupItem id={id} value={option.value} className="mt-1" />

              <Label htmlFor={id} className="flex cursor-pointer flex-col items-start gap-1">
                <span className="font-medium">{option.title}</span>

                <span className="text-sm font-normal text-muted-foreground">{option.description}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </section>
  );
}
