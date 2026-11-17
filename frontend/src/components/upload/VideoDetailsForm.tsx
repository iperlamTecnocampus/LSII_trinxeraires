import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VideoDetailsFormProps {
  title: string;
  description: string;
  category: string;
  categories: { id: string; name: string }[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  language: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
}

const languages = ['English', 'Spanish', 'Catalan', 'French'];
const NO_CATEGORY_VALUE = '__no_category__';

export function VideoDetailsForm({
  title,
  description,
  category,
  categories,
  categoriesLoading,
  categoriesError,
  language,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onLanguageChange,
}: VideoDetailsFormProps) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="font-semibold">Video details</h3>

        <p className="text-sm text-muted-foreground">Add information that helps viewers understand your video.</p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label htmlFor="video-title" className="text-sm font-medium">
              Title
            </label>

            <span className="text-xs text-muted-foreground">{title.length}/100</span>
          </div>

          <Input
            id="video-title"
            value={title}
            maxLength={100}
            placeholder="My new video"
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="video-description" className="mb-2 block text-sm font-medium">
            Description
          </label>

          <Textarea
            id="video-description"
            value={description}
            placeholder="Tell viewers about your video..."
            className="min-h-36 resize-y"
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>

            <Select
              value={category || NO_CATEGORY_VALUE}
              disabled={categoriesLoading || categories.length === 0}
              onValueChange={(value) => {
                if (value) {
                  onCategoryChange(value === NO_CATEGORY_VALUE ? '' : value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None">
                  {(value: string | null) =>
                    value === NO_CATEGORY_VALUE
                      ? 'None'
                      : (categories.find((item) => item.id === value)?.name ?? 'None')
                  }
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={NO_CATEGORY_VALUE}>None</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoriesError && <p className="mt-1 text-xs text-destructive">Could not load categories.</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Language</label>

            <Select
              value={language}
              onValueChange={(value) => {
                if (value) {
                  onLanguageChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>

              <SelectContent>
                {languages.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
