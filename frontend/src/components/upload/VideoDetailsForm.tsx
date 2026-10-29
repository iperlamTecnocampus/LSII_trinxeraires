import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface VideoDetailsFormProps {
  title: string;
  description: string;
  category: string;
  language: string;
  tags: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

const categories = [
  'Technology',
  'Education',
  'Entertainment',
  'Gaming',
  'Music',
  'Sports',
  'Other',
];

const languages = [
  'English',
  'Spanish',
  'Catalan',
  'French',
];

export function VideoDetailsForm({
  title,
  description,
  category,
  language,
  tags,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onLanguageChange,
  onTagsChange,
}: VideoDetailsFormProps) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="font-semibold">Video details</h3>

        <p className="text-sm text-muted-foreground">
          Add information that helps viewers understand your video.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="video-title"
              className="text-sm font-medium"
            >
              Title
            </label>

            <span className="text-xs text-muted-foreground">
              {title.length}/100
            </span>
          </div>

          <Input
            id="video-title"
            value={title}
            maxLength={100}
            placeholder="My new video"
            onChange={(event) =>
              onTitleChange(event.target.value)
            }
          />
        </div>

        <div>
          <label
            htmlFor="video-description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>

          <Textarea
            id="video-description"
            value={description}
            placeholder="Tell viewers about your video..."
            className="min-h-36 resize-y"
            onChange={(event) =>
              onDescriptionChange(event.target.value)
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="video-category"
              className="mb-2 block text-sm font-medium"
            >
              Category
            </label>

            <select
              id="video-category"
              value={category}
              onChange={(event) =>
                onCategoryChange(event.target.value)
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-background text-foreground"
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="video-language"
              className="mb-2 block text-sm font-medium"
            >
              Language
            </label>

            <select
              id="video-language"
              value={language}
              onChange={(event) =>
                onLanguageChange(event.target.value)
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {languages.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-background text-foreground"
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="video-tags"
            className="mb-2 block text-sm font-medium"
          >
            Tags
          </label>

          <Input
            id="video-tags"
            value={tags}
            placeholder="react, typescript, tutorial"
            onChange={(event) =>
              onTagsChange(event.target.value)
            }
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Separate tags with commas.
          </p>
        </div>
      </div>
    </section>
  );
}