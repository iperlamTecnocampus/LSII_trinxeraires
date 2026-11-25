import { render, screen } from '@testing-library/react';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from '@/components/ui/button-group';
import { Separator } from '@/components/ui/separator';

describe('avatar primitives', () => {
  it.each([
    ['sm', 'sm'],
    ['lg', 'lg'],
  ] as const)('sets the %s size on the root', (size, expectedSize) => {
    render(
      <Avatar data-testid="avatar" size={size}>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId('avatar')).toHaveAttribute('data-slot', 'avatar');
    expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', expectedSize);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('uses the default size when none is provided', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'default');
  });

  it('renders an image with a fallback, a badge, and group count', () => {
    render(
      <AvatarGroup data-testid="avatar-group" className="custom-group">
        <Avatar size="lg">
          <AvatarImage src="/avatar.png" alt="Profile" />
          <AvatarFallback>Fallback</AvatarFallback>
          <AvatarBadge data-testid="avatar-badge">Online</AvatarBadge>
        </Avatar>
        <AvatarGroupCount data-testid="avatar-count">+2</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByTestId('avatar-group')).toHaveClass('custom-group');
    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-badge')).toHaveTextContent('Online');
    expect(screen.getByTestId('avatar-count')).toHaveTextContent('+2');
  });
});

describe('button group primitives', () => {
  it('uses a horizontal orientation by default and exposes variant classes', () => {
    render(
      <ButtonGroup data-testid="button-group">
        <ButtonGroupText>Actions</ButtonGroupText>
      </ButtonGroup>
    );

    expect(screen.getByRole('group')).toHaveAttribute('data-slot', 'button-group');
    expect(screen.getByRole('group')).toHaveClass(buttonGroupVariants({ orientation: 'horizontal' }));
    expect(screen.getByText('Actions')).toHaveAttribute('data-slot', 'button-group-text');
  });

  it('supports vertical groups, custom text rendering, and separators', () => {
    render(
      <ButtonGroup orientation="vertical" aria-label="Video actions">
        <ButtonGroupText render={<span data-testid="custom-text" />}>Edit</ButtonGroupText>
        <ButtonGroupSeparator data-testid="group-separator" orientation="horizontal" />
        <ButtonGroupSeparator data-testid="default-group-separator" />
        <ButtonGroupText>Delete</ButtonGroupText>
      </ButtonGroup>
    );

    expect(screen.getByRole('group', { name: 'Video actions' })).toHaveAttribute(
      'data-orientation',
      'vertical'
    );
    expect(screen.getByTestId('custom-text')).toHaveAttribute('data-slot', 'button-group-text');
    expect(screen.getByTestId('group-separator')).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getByTestId('default-group-separator')).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});

describe('separator', () => {
  it('defaults to a horizontal separator and allows a vertical orientation', () => {
    const { rerender } = render(<Separator data-testid="separator" />);

    expect(screen.getByTestId('separator')).toHaveAttribute('data-slot', 'separator');
    expect(screen.getByTestId('separator')).toHaveAttribute('data-orientation', 'horizontal');

    rerender(<Separator data-testid="separator" orientation="vertical" />);

    expect(screen.getByTestId('separator')).toHaveAttribute('data-orientation', 'vertical');
  });
});
