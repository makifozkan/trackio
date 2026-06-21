import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CreateIdeaModal } from '../../app/ui/ideas/create-idea-modal';
import { useState } from 'react';

const ModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="p-12 bg-gray-100 min-h-screen flex items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Open Modal
      </button>
      <CreateIdeaModal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

const meta: Meta<typeof CreateIdeaModal> = {
  title: 'Ideas/CreateIdeaModal',
  component: CreateIdeaModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreateIdeaModal>;

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} />,
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => <ModalWrapper {...args} />,
};
