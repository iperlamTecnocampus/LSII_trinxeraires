import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';

import { useAllVideos } from '../useAllVideos';

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = jest.mocked(axios.get);

describe('useAllVideos', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('loads and returns videos from the configured endpoint', async () => {
    mockedGet.mockResolvedValue({ status: 200, data: ['video one', 'video two'] });

    const { result } = renderHook(() => useAllVideos());

    expect(result.current.loading).toBe('loading');
    await waitFor(() => expect(result.current.loading).toBe('success'));
    expect(mockedGet).toHaveBeenCalledWith('other/videos');
    expect(result.current.value).toEqual(['video one', 'video two']);
  });

  it('returns an empty successful result when the response is not 200', async () => {
    mockedGet.mockResolvedValue({ status: 204, data: ['ignored'] });

    const { result } = renderHook(() => useAllVideos());

    await waitFor(() => expect(result.current.loading).toBe('success'));
    expect(result.current.value).toEqual([]);
  });

  it('exposes a useful message when the request fails', async () => {
    mockedGet.mockRejectedValue(new Error('Network unavailable'));

    const { result } = renderHook(() => useAllVideos());

    await waitFor(() => expect(result.current.loading).toBe('error'));
    expect(result.current.message).toBe('Error fetching videos: Network unavailable');
  });
});
