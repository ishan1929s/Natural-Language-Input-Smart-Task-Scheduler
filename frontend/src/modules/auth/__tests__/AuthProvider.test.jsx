import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../AuthProvider';

function ShowState() {
  const { user } = useAuth();
  return <div>{user ? 'logged' : 'anon'}</div>;
}

test('renders anon by default', async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <ShowState />
      </AuthProvider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText(/anon/i)).toBeInTheDocument();
  });
});
