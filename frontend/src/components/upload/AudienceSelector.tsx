interface AudienceSelectorProps {
  value: 'yes' | 'no';
  onChange: (value: 'yes' | 'no') => void;
}

export function AudienceSelector({
  value,
  onChange,
}: AudienceSelectorProps) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="font-semibold">Audience</h3>

        <p className="text-sm text-muted-foreground">
          Is this video made for kids?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
          <input
            type="radio"
            name="audience"
            value="yes"
            checked={value === 'yes'}
            onChange={() => onChange('yes')}
            className="mt-1"
          />

          <div>
            <p className="font-medium">
              Yes, it's made for kids
            </p>

            <p className="text-sm text-muted-foreground">
              This video is primarily intended for children.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
          <input
            type="radio"
            name="audience"
            value="no"
            checked={value === 'no'}
            onChange={() => onChange('no')}
            className="mt-1"
          />

          <div>
            <p className="font-medium">
              No, it's not made for kids
            </p>

            <p className="text-sm text-muted-foreground">
              This video is intended for a general audience.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}