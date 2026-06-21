import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import ProjectsHeader from '@/app/ui/projects/projects-header';

const meta = {
  title: 'Projects/ProjectHeader',
  component: ProjectsHeader,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ProjectsHeader>;

export default meta;
type ProjectsHeader = StoryObj<typeof meta>;

export const Primary: ProjectsHeader = {
  args: {},
};
