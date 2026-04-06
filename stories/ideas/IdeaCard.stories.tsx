import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IdeaCard } from '../../app/ui/ideas/idea-card';

const meta: Meta<typeof IdeaCard> = {
    title: 'Ideas/IdeaCard',
    component: IdeaCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IdeaCard>;

export const Default: Story = {
    args: {
        title: 'Decentralized Finance for SMEs',
        description: 'Integrating liquidity pools with traditional small business lending to lower interest rates and bypass legacy banking hurdles.',
        tags: ['DeFi', 'Business', 'Fintech'],
        status: 'High Potential',
        updatedAt: '2 days ago',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIczzD80fnbixWp6oE5cY6KKYpb3sbgfNRHJYbtcSlJQJ9P5AmqUt_JDwUHE8lpXlOGdAQ48JvgPEv1b_GByHMvH-jKeEh5Q0f-BRl1Fr_so8nnhCAUgNfNVPC8KzO68QcaBqSH0CSQdm5JmzTsNstYuh8eHyoBIXHhUoqurd7yOX28_oEDAA3FvidX015yht7Ep9SQn317ubxd6ZGkCOfyoihrl5yqszmpjcXRVf_zXlX-bgI50anTvA02_52n_PbLPMwp9qpCg'},
};

export const ActiveTest: Story = {
    args: {
        title: 'AI-Driven Risk Assessment',
        description: 'Utilizing LLMs to process sentiment analysis across 50,000+ daily financial publications to predict localized market volatility.',
        tags: ['AI', 'Risk Mgmt', 'Big Data'],
        status: 'Active Test',
        updatedAt: '5 hours ago',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqvSBZkFTz9NL6IfnRe1uYM7GOfTPmcwu50Bi7JeJrLkCpoe4aE5E6gO1xEt7dkMEjV_Ji7UUYwSRdVCRQAIqY6fvC7KD7D5GgsBlorM5CDjUmdAwkxW98vow7c3LC5xexUE6R5eEu_KIn5VBAj7LWxRGZUpKNCuceUlwi6gy1-XZ2FsbvuaVzx7YyrcdS_TpkWxjOP0iMp6r9FYc8rECxVTQdCzzU7__goWCjbzKrT_jKNotpdwu_B2MILojTpPY9f0eAy9-Czw',
    },
};

export const Paused: Story = {
    args: {
        title: 'Green Bonds Optimization',
        description: 'Algorithmic balancing for ESG-heavy portfolios focusing on emerging market renewable energy projects with sovereign backing.',
        tags: ['ESG', 'Impact', 'Fixed Income'],
        status: 'Paused',
        updatedAt: '1 week ago',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AODIvpM9MtV4yA1f4fkCyokxrv9cr7E2ShBMthss5LRBqsWGYATk0G9aeSHCQOz4gC_ekP9gJz2Vl3raIsFMZH7qyB115cMNmWroaES9fPXFlBhZmeb-abD2oBxSmZPFwxIylGZ8nE7RbVGH1FERueq8yVGUPZFXzHuBelMhJuleeFseUUwiTK4OCG5g-KVX_6JPys44mZsqlkNAgcicqJ6AjreMWanAexPadgtH0mJ9e3OPowMOPixoiyLz-DzppFucdEuuKA',
    },
};

export const HighAlpha: Story = {
    args: {
        title: 'Yield Farming Automation',
        description: 'Proprietary scripts that automatically shift stables between Aave, Compound, and Uniswap V3 based on gas-adjusted net returns.',
        tags: ['Yield', 'Automation', 'Web3'],
        status: 'High Alpha',
        updatedAt: '1 day ago',
    },
};

export const Draft: Story = {
    args: {
        title: 'Hyper-Local Real Estate Tokenization',
        description: 'A framework for fractionalizing high-yield commercial assets in Tier-2 cities, allowing retail investors to enter markets with as little as $500.',
        tags: ['PropTech', 'Legal', 'Tokenization'],
        status: 'Draft',
        updatedAt: '3 days ago',
    },
};
