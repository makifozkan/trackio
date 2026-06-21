import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import ProjectTaskEditable from '@/app/ui/projects/project-task-editable';

const meta = {
  title: 'Projects/ProjectTaskEditable',
  component: ProjectTaskEditable,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ProjectTaskEditable>;

export default meta;
type ProjectTaskEditable = StoryObj<typeof meta>;

export const Primary: ProjectTaskEditable = {
  args: {},
};
