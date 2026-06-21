import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import { Button } from '../../app/ui/ideas/buttons';
import { Header } from '../Header';

const meta = {
  title: 'Trackio/Button',
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
type Button = StoryObj<typeof meta>;

export const Primary: Button = {
  args: {
    title: 'Hello World',
  },
};
