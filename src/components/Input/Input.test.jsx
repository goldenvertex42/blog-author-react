import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Component', () => {
  const defaultProps = {
    id: 'username',
    name: 'username',
    label: 'Username',
    value: '',
    onChange: vi.fn(),
  };

  it('renders with the correct label and associates it with the input', () => {
    render(<Input {...defaultProps} />);
    
    // This checks that clicking the label focuses the input (accessibility)
    const label = screen.getByText(/username/i);
    const input = screen.getByLabelText(/username/i);
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
  });

  it('calls onChange when the user types', () => {
    const handleChange = vi.fn();
    render(<Input {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByLabelText(/username/i);
    fireEvent.change(input, { target: { value: 'new-user' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('displays an error message when the error prop is provided', () => {
    const errorMessage = "Username is already taken";
    render(<Input {...defaultProps} error={errorMessage} />);
    
    const errorDisplay = screen.getByText(errorMessage);
    expect(errorDisplay).toBeInTheDocument();
    expect(errorDisplay).toHaveClass('error-message');
  });

  it('passes extra props like type and placeholder to the input', () => {
    render(
      <Input 
        {...defaultProps} 
        type="password" 
        placeholder="Enter secret" 
      />
    );
    
    const input = screen.getByLabelText(/username/i);
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'Enter secret');
  });

  it('marks the input as required if the required prop is passed', () => {
    render(<Input {...defaultProps} required />);
    
    const input = screen.getByLabelText(/username/i);
    expect(input).toBeRequired();
  });
});
