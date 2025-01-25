import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../../../context/App.Context";
type Story = StoryObj<typeof Login>;

const meta = {
  title: "Components/Login",
  component: Login,
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
} satisfies Meta<typeof Login>;
export default meta;

export const validateEmptyFields: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByRole("button", { name: /Login/i });
    await userEvent.click(loginButton);
  },
};

export const validateEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText("Email");
    const loginButton = await canvas.getByRole("button", { name: /Login/i });
    await userEvent.type(emailInput, "test");
    await userEvent.click(loginButton);
  },
};

export const validateEmail1: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText("Email");
    const loginButton = await canvas.getByRole("button", { name: /Login/i });
    await userEvent.type(emailInput, "test@gmail");
    await userEvent.click(loginButton);
  },
};

export const validEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText("Email");
    const loginButton = await canvas.getByRole("button", { name: /Login/i });
    await userEvent.type(emailInput, "test@gmail.com");
    await userEvent.click(loginButton);
  },
};

export const loginSucess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText("Email");
    const passwordInput = await canvas.getByPlaceholderText("Password");
    const loginButton = await canvas.getByRole("button", { name: /Login/i });
    await userEvent.type(emailInput, "test@gmail.com", { delay: 200 });
    await userEvent.type(passwordInput, "test0930!", { delay: 200 });
    await userEvent.click(loginButton);
  },
};
