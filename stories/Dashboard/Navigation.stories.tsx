import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Navigation from '../../app/ui/dashboard/navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Dashboard/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Desktop: Story = {
  args: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=1160',
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Desktop.args,
  },
};

export const ActiveLinkIdeas: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard/ideas',
      },
    },
  },
  args: {
    ...Desktop.args,
  },
};
