import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import type { ReactNode } from 'react';

import { VideoGrid } from '../VideoGrid';
import fetchMock from 'jest-fetch-mock';

jest.mock('react-router', () => ({
  Link: ({
    children,
    to,
  }: {
    children: ReactNode;
    to: string;
  }) => <a href={to}>{children}</a>,
}));

describe('this component', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset mocks before each test
  });

  it('renders correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(['video 1 test', 'video 2 test']));
    const asFragment = await act(async () => {
      return render(<VideoGrid />).asFragment;
    });
    expect(asFragment()).toMatchSnapshot();
  });
});

