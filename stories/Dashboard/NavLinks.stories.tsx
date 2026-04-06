import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NavLinks from '../../app/ui/dashboard/nav-links';

const meta: Meta<typeof NavLinks> = {
  title: 'Dashboard/NavLinks',
  component: NavLinks,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64 bg-[#f2f4f6] p-4 rounded-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavLinks>;

export const Default: Story = {};

export const ActiveInvoices: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard/invoices',
      },
    },
  },
};

export const ActiveIdeas: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard/ideas',
      },
    },
  },
};
