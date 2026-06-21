import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IdeasPageLayout } from '../../app/ui/ideas/ideas-page-layout';

const meta: Meta<typeof IdeasPageLayout> = {
  title: 'Ideas/IdeasPageLayout',
  component: IdeasPageLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IdeasPageLayout>;

export const Default: Story = {};
