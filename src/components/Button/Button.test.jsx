import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe('Button component', () => {
    it('executes onClick and renders children', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        
        render(<Button onClick={handleClick}>Click Me</Button>);
        
        const btn = screen.getByRole('button', { name: /click me/i });
        await user.click(btn);
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
})