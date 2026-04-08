import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import ProjectCard from '@/app/ui/projects/project-card';

const meta = {
    title: 'Projects/ProjectCard',
    component: ProjectCard,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    args: {
    }
} satisfies Meta<typeof ProjectCard>;


export default meta;
type ProjectCard = StoryObj<typeof meta>;

export const Primary: ProjectCard = {
    args: {
        project: {
            name: 'Project Name',
            description: 'Project Description',
            status: 'Active',
            source_idea: {
                title: 'Source Idea Title',
                description: 'Source Idea Description',
                categories: ['Category 1', 'Category 2'],
                keywords: ['Keyword 1', 'Keyword 2'],
                status: 'High Potential',
                is_ai_generated: false,
                created_at: '2024-01-01T00:00:00Z',
                id: 'idea-1',
            },
            team_members: [
                {
                    id: '1',
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwiI-qwfy16T8LSrm8ICFFaGmOB-uRXenEUIcKTx2e1wSamXnhxt_DCanOhjfHSwfCrWPUua7mefL-rMcM4TELWma7C-wW5GMSiUADJRYSSGurug4Hnhjo3nmQTIaaKLFPIZyD2lKFICysALIHaA-NQRstc2d1PHzBgJ7hX6M7mrwxGAObgEURZCt1sPqweqM1aoQ2kbgtD4u9CkJlOwpGfpSU3AgQNYj4ekrkysNU5VhoFx7MOzD_9qWfD6CiwoAQzg9bNthDlQ',
                },
                {
                    id: '2',
                    name: 'Bob Smith',
                    email: 'bob@example.com',
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWi4QVlq_gsmckVAJnO2XJXGsETUfPYjIuPHfJ5ZXm3tWuGwmFNG25BTbt67in2CS1tXY-Q4ta3A9KXvA9X0FEO89UAx9y-FlUnA9IluUAhE8Grhtna-0JWZKNm5dEcqnwIbpJAU2E0G-r2wjPrrs7Z61TWHf-r2Ejwx3snxNIgmDXTRw9Rshqoo2S1GIrSOJr4_7EaOoTwgyAooXJV5DW2HPIxGbqoGXewE_gGYsLIZaKK3DTtcR81riwJy_KdJoQNsJI1ZaTHA"
                }
            ],
            id: 'project-1',
            source_idea_id: 'idea-1',
            start_date: '2024-01-01T00:00:00Z',
            end_date: '2024-12-31T23:59:59Z',
        }
    },
};

