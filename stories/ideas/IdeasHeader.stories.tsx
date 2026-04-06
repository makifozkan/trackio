import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IdeasHeader } from '../../app/ui/ideas/ideas-header';

const meta: Meta<typeof IdeasHeader> = {
    title: 'Ideas/IdeasHeader',
    component: IdeasHeader,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-12 bg-white min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof IdeasHeader>;

export const Default: Story = {};
