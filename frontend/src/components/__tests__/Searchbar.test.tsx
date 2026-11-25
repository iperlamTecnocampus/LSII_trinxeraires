import { fireEvent, render, screen } from '@testing-library/react';

import { Searchbar } from '../Searchbar';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams()],
}));

describe('Searchbar', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('navigates to the home page with the trimmed search query', () => {
    render(<Searchbar />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search videos' }), {
      target: { value: '  React videos  ' },
    });
    fireEvent.submit(screen.getByRole('search'));

    expect(mockNavigate).toHaveBeenCalledWith('/search?query=React%20videos');
  });

  it('clears the search when submitted with an empty query', () => {
    render(<Searchbar />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search videos' }), { target: { value: ' ' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(mockNavigate).toHaveBeenCalledWith('/search');
  });
});
