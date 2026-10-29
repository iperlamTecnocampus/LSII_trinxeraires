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
    description:
      'Anyone with the link can watch your video.',
  },
  {
    value: 'private',
    title: 'Private',
    description: 'Only you can watch your video.',
  },
];

export function VisibilitySelector({
  value,
  onChange,
}: VisibilitySelectorProps) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="font-semibold">Visibility</h3>

        <p className="text-sm text-muted-foreground">
          Choose who can watch your video
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <input
              type="radio"
              name="visibility"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1"
            />

            <div>
              <p className="font-medium">
                {option.title}
              </p>

              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}