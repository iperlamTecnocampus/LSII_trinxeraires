import { formatCount as formatVideoCount } from '../watch/format';
import { formatCount, formatDate, timeAgo as profileTimeAgo } from '../profile/format';
import { timeAgo as relativeTimeAgo } from '../../utils/format';

describe('video count formatting', () => {
  it('keeps small counts exact and compacts thousands and millions', () => {
    expect(formatVideoCount(999)).toBe('999');
    expect(formatVideoCount(1_000)).toBe('1K');
    expect(formatVideoCount(1_250)).toBe('1.3K');
    expect(formatVideoCount(1_000_000)).toBe('1M');
    expect(formatVideoCount(12_500_000)).toBe('12.5M');
  });

  it('uses locale-aware compact formatting for generic counts', () => {
    expect(formatCount(999)).toBe('999');
    expect(formatCount(1_250)).toBe('1.3K');
  });
});

describe('date formatting', () => {
  it('formats an ISO date as a readable date', () => {
    expect(formatDate('2026-10-15T00:00:00.000Z')).toBe('Oct 15, 2026');
  });

  it('formats elapsed time from today through months', () => {
    const now = new Date('2026-10-15T00:00:00.000Z');

    expect(profileTimeAgo('2026-10-15T00:00:00.000Z', now)).toBe('today');
    expect(profileTimeAgo('2026-10-14T00:00:00.000Z', now)).toBe('1 day ago');
    expect(profileTimeAgo('2026-10-08T00:00:00.000Z', now)).toBe('1 week ago');
    expect(profileTimeAgo('2026-10-01T00:00:00.000Z', now)).toBe('2 weeks ago');
    expect(profileTimeAgo('2026-09-01T00:00:00.000Z', now)).toBe('1 month ago');
    expect(profileTimeAgo('2026-07-01T00:00:00.000Z', now)).toBe('3 months ago');
  });
});

describe('relative time formatting', () => {
  const now = new Date('2026-10-15T12:00:00.000Z').getTime();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns just now for dates under a minute old', () => {
    expect(relativeTimeAgo(new Date(now - 59_000))).toBe('just now');
    expect(relativeTimeAgo(new Date(now + 1_000))).toBe('just now');
  });

  it.each([
    [60, '1 minute ago'],
    [120, '2 minutes ago'],
    [3_600, '1 hour ago'],
    [7_200, '2 hours ago'],
    [86_400, '1 day ago'],
    [172_800, '2 days ago'],
    [604_800, '1 week ago'],
    [1_209_600, '2 weeks ago'],
    [2_592_000, '1 month ago'],
    [5_184_000, '2 months ago'],
    [31_536_000, '1 year ago'],
    [63_072_000, '2 years ago'],
  ])('formats %i elapsed seconds', (seconds, expected) => {
    expect(relativeTimeAgo(new Date(now - seconds * 1_000))).toBe(expected);
  });
});
