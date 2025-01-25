import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import Register from "./Register";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../../../context/App.Context";
type Story = StoryObj<typeof Register>;

const meta = {
  title: "Components/Register",
  component: Register,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AppProvider>
          <Story />
        </AppProvider>
      </BrowserRouter>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Register>;
export default meta;

export const EmptyFields: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.click(registerButton);
  },
};

export const invalidEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText("Email");
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(emailInput, "test");
    await userEvent.click(registerButton);
  },
};

export const invalidEmail1: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText("Email");
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(emailInput, "test@gmail");
    await userEvent.click(registerButton);
  },
};

export const validEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText("Email");
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(emailInput, "test@gmail.com");
    await userEvent.click(registerButton);
  },
};

export const inputName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = await canvas.getByPlaceholderText("Name");
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(nameInput, "test");
    await userEvent.click(registerButton);
  },
};

export const invalidPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = await canvas.getByPlaceholderText("Password");
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(passwordInput, "test");
    await userEvent.click(registerButton);
  },
};

export const invalidPassword1: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = await canvas.getByPlaceholderText("Password");
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(passwordInput, "test0930");
    await userEvent.click(registerButton);
  },
};

export const validPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = await canvas.getByPlaceholderText("Password");
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(passwordInput, "test0930!");
    await userEvent.click(registerButton);
  },
};

export const passwordNotMatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = await canvas.getByPlaceholderText("Password");
    const confirmPasswordInput = await canvas.getByPlaceholderText(
      "Confirm Password"
    );
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(passwordInput, "test0930!");
    await userEvent.type(confirmPasswordInput, "test0930");
    await userEvent.click(registerButton);
  },
};

export const passwordsMatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = await canvas.getByPlaceholderText("Password");
    const confirmPasswordInput = await canvas.getByPlaceholderText(
      "Confirm Password"
    );
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(passwordInput, "test0930!");
    await userEvent.type(confirmPasswordInput, "test0930!");
    await userEvent.click(registerButton);
  },
};

export const registerSuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = await canvas.getByPlaceholderText("Name");
    const emailInput = await canvas.getByPlaceholderText("Email");
    const passwordInput = await canvas.getByPlaceholderText("Password");
    const confirmPasswordInput = await canvas.getByPlaceholderText(
      "Confirm Password"
    );
    const registerButton = await canvas.getByRole("button", {
      name: /Register/i,
    });
    await userEvent.type(emailInput, "test@gmail.com", { delay: 200 });
    await userEvent.type(nameInput, "test", { delay: 200 });
    await userEvent.type(passwordInput, "test0930!", { delay: 200 });
    await userEvent.type(confirmPasswordInput, "test0930!", { delay: 200 });
    await userEvent.click(registerButton);
  },
};
