import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IdeaCardSkeleton, IdeaCardsSkeleton } from '../../app/ui/skeletons';

const meta: Meta<typeof IdeaCardSkeleton> = {
  title: 'Skeletons/IdeaCardSkeleton',
  component: IdeaCardSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-12 bg-[#f7f9fb] min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IdeaCardSkeleton>;

export const Single: Story = {};

export const Grid: Story = {
  render: () => <IdeaCardsSkeleton />,
};
