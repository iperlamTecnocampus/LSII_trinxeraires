import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const categories = ['Technology', 'Education', 'Entertainment', 'Gaming', 'Music', 'Sports', 'Other'];

const languages = ['English', 'Spanish', 'Catalan', 'French'];

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
              value={category}
              onValueChange={(value) => {
                if (value) {
                  onCategoryChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <div>
          <label htmlFor="video-tags" className="mb-2 block text-sm font-medium">
            Tags
          </label>

          <Input
            id="video-tags"
            value={tags}
            placeholder="react, typescript, tutorial"
            onChange={(event) => onTagsChange(event.target.value)}
          />

          <p className="mt-1 text-xs text-muted-foreground">Separate tags with commas.</p>
        </div>
      </div>
    </section>
  );
}
