import { IdeasHeader } from './ideas-header';
import { IdeaCard } from './idea-card';

const ideas = [
  {
    title: 'Decentralized Finance for SMEs',
    description:
      'Integrating liquidity pools with traditional small business lending to lower interest rates and bypass legacy banking hurdles.',
    tags: ['DeFi', 'Business', 'Fintech'],
    status: 'High Potential',
    updatedAt: '2 days ago',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEBIANHpT3hmI0zFkr47HHXexlu2IrTs6m8ozAXZNzqbOFNC2FuOEkqy-X_IMoraVQVg3ZQVP0HaO0TX6SFBmUVtHUr5nW9yts63MUgzE_7HBzzN-WOzSJveresPlPOokzbLE6K3qKxwZ0ZPUX68kGMIQGpvGVhoB0-q7qY_8Ld8gMzqfoDhQso01zh1xSCsovy6G15JquMIdNmTlbr_tbuHgJ3pzj5hBfEGh5mtjK24kVQaU3uFBRSMCUqiBTEGupXpOM19Mm',
  },
  {
    title: 'AI-Driven Risk Assessment',
    description:
      'Utilizing LLMs to process sentiment analysis across 50,000+ daily financial publications to predict localized market volatility.',
    tags: ['AI', 'Risk Mgmt', 'Big Data'],
    status: 'Active Test',
    updatedAt: '5 hours ago',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqvSBZkFTz9NL6IfnRe1uYM7GOfTPmcwu50Bi7JeJrLkCpoe4aE5E6gO1xEt7dkMEjV_Ji7UUYwSRdVCRQAIqY6fvC7KD7D5GgsBlorM5CDjUmdAwkxW98vow7c3LC5xexUE6R5eEu_KIn5VBAj7LWxRGZUpKNCuceUlwi6gy1-XZ2FsbvuaVzx7YyrcdS_TpkWxjOP0iMp6r9FYc8rECxVTQdCzzU7__goWCjbzKrT_jKNotpdwu_B2MILojTpPY9f0eAy9-Czw',
  },
  {
    title: 'Green Bonds Optimization',
    description:
      'Algorithmic balancing for ESG-heavy portfolios focusing on emerging market renewable energy projects with sovereign backing.',
    tags: ['ESG', 'Impact', 'Fixed Income'],
    status: 'Paused',
    updatedAt: '1 week ago',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AODIvpM9MtV4yA1f4fkCyokxrv9cr7E2ShBMthss5LRBqsWGYATk0G9aeSHCQOz4gC_ekP9gJz2Vl3raIsFMZH7qyB115cMNmWroaES9fPXFlBhZmeb-abD2oBxSmZPFwxIylGZ8nE7RbVGH1FERueq8yVGUPZFXzHuBelMhJuleeFseUUwiTK4OCG5g-KVX_6JPys44mZsqlkNAgcicqJ6AjreMWanAexPadgtH0mJ9e3OPowMOPixoiyLz-DzppFucdEuuKA',
  },
  {
    title: 'Yield Farming Automation',
    description:
      'Proprietary scripts that automatically shift stables between Aave, Compound, and Uniswap V3 based on gas-adjusted net returns.',
    tags: ['Yield', 'Automation', 'Web3'],
    status: 'High Alpha',
    updatedAt: '1 day ago',
  },
  {
    title: 'Hyper-Local Real Estate Tokenization',
    description:
      'A framework for fractionalizing high-yield commercial assets in Tier-2 cities, allowing retail investors to enter markets with as little as $500.',
    tags: ['PropTech', 'Legal', 'Tokenization'],
    status: 'Draft',
    updatedAt: '3 days ago',
  },
  {
    title: 'Draft a new idea',
    description: 'Quickly jot down market observations or potential pivots.',
    tags: [],
    status: 'Draft',
    updatedAt: 'Just now',
  },
];

export function IdeasPageLayout() {
  return (
    <div className="bg-[#f7f9fb] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <IdeasHeader />

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.title} {...idea} />
          ))}
        </div>
      </div>
    </div>
  );
}
