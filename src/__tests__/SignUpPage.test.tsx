import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import { store } from '../store/store';
import LangContextProvider from 'src/context/LangContext';
import TEXT from 'src/constants/text';

describe('Page SignUp', () => {
  const renderComponent = (url: string) =>
    render(
      <LangContextProvider>
        <Provider store={store}>
          <MemoryRouter initialEntries={[url]}>
            <SignUpPage />
          </MemoryRouter>
        </Provider>
      </LangContextProvider>
    );

  const T = TEXT.EN;

  vi.mock('firebase/auth');

  it('should render SignUpPage component successfully', () => {
    renderComponent('/');

    expect(screen.getByTestId('sign-up-page')).toBeInTheDocument();
  });

  it('should check email validation', async () => {
    renderComponent('/');

    const emailInput = screen.getByTestId('email-input');

    expect(screen.queryByText(T.YUP_EMAIL_INVALID)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.input(emailInput, { target: { value: 'email' } });
    });

    expect(screen.getByText(T.YUP_EMAIL_INVALID)).toBeInTheDocument();

    await act(async () => {
      fireEvent.input(emailInput, { target: { value: 'email@gmail.com' } });
    });

    expect(screen.queryByText(T.YUP_EMAIL_INVALID)).not.toBeInTheDocument();
  });

  it('should block the SignUp button if validation fails', async () => {
    renderComponent('/');

    const firstNameInput = screen.getByTestId('first-name-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    const btnSubmit = screen.getByRole('button', { name: 'Sign Up' });

    await act(async () => {
      fireEvent.input(firstNameInput, { target: { value: 'Firstname' } });
      fireEvent.input(emailInput, { target: { value: 'test@gmail.com' } });
      fireEvent.input(passwordInput, { target: { value: '@Qwerty123' } });
    });

    expect(btnSubmit).toBeDisabled();
  });

  it('should unlock the login button if validation is passed', async () => {
    renderComponent('/');

    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const rulesInput = screen.getByTestId('rules-input');

    const btnSubmit = screen.getByRole('button', { name: 'Sign Up' });

    await act(async () => {
      fireEvent.input(firstNameInput, { target: { value: 'Firstname' } });
      fireEvent.input(lastNameInput, { target: { value: 'Lastname' } });
      fireEvent.input(emailInput, { target: { value: 'test@gmail.com' } });
      fireEvent.input(passwordInput, { target: { value: '@Qwerty123' } });
      fireEvent.click(rulesInput);
    });

    await act(async () => {
      fireEvent.click(btnSubmit);
    });

    expect(btnSubmit).not.toBeDisabled();
  });
});
