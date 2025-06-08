import { render } from '@testing-library/react';
import { ApplePayButton, GooglePayButton } from './PaymentButtons';

test('renders Apple pay button', () => {
  render(<ApplePayButton />);
});

test('renders Google Pay button', () => {
  render(<GooglePayButton />);
});
