import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import { Button } from '@/app/ui/ideas/buttons';
import { Input } from '@/app/ui/ideas/inputs';

const meta = {
    title: 'Trackio/Inputs',
    component: Input,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    args: {

    },
} satisfies Meta<typeof Input>;


export default meta;
type Input = StoryObj<typeof meta>;

export const Primary: Input = {
    args: {
        label: 'User Email',
    },
};

