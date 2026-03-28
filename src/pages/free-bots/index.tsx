import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { load, save_types } from '@/external/bot-skeleton';
import './free-bots.scss';

interface Bot {
    id: string;
    name: string;
    description: string;
    fileName: string;
    category: string;
    badge: string;
    stats: { label: string; value: string }[];
}

const BOTS: Bot[] = [
    {
        id: '1',
        name: 'Smart Over 3 Pro Bot',
        description:
            'A sophisticated over/under digit trading bot that intelligently analyzes digit distribution across Volatility 100 Index. Uses advanced martingale logic with configurable split levels, win percentage thresholds, and multi-layer prediction to maximize profitability while managing risk.',
        fileName: 'Smart_Over_3_Pro_Bot_1774691917575.xml',
        category: 'Over / Under',
        badge: 'PRO',
        stats: [
            { label: 'Market', value: 'Volatility 100' },
            { label: 'Strategy', value: 'Over / Under' },
            { label: 'Type', value: 'Digits' },
            { label: 'Risk', value: 'Managed' },
        ],
    },
];

const FreeBots = observer(() => {
    const { dashboard } = useStore();
    const [loadingBotId, setLoadingBotId] = useState<string | null>(null);

    const loadBot = async (bot: Bot) => {
        if (loadingBotId) return;
        try {
            setLoadingBotId(bot.id);

            const response = await fetch(`/bots/${bot.fileName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bot file');
            }

            const xmlContent = await response.text();

            await load({
                block_string: xmlContent,
                file_name: bot.name,
                workspace: (window as any).Blockly?.derivWorkspace,
                from: save_types.LOCAL,
                drop_event: null,
                strategy_id: null,
                showIncompatibleStrategyDialog: null,
            });

            dashboard.setActiveTab(1);
            window.location.hash = 'bot_builder';
        } catch (error) {
            console.error('Error loading bot:', error);
        } finally {
            setLoadingBotId(null);
        }
    };

    return (
        <div className='free-bots'>
            <div className='free-bots__header'>
                <div className='free-bots__header-badge'>Free Bots</div>
                <h1 className='free-bots__title'>Ready-to-Use Trading Bots</h1>
                <p className='free-bots__subtitle'>
                    Click on a bot card to instantly load it into the Bot Builder and start trading.
                </p>
            </div>

            <div className='free-bots__grid'>
                {BOTS.map(bot => {
                    const isLoading = loadingBotId === bot.id;
                    return (
                        <div
                            key={bot.id}
                            className={`free-bots__card ${isLoading ? 'free-bots__card--loading' : ''}`}
                            onClick={() => loadBot(bot)}
                            role='button'
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && loadBot(bot)}
                            aria-label={`Load ${bot.name} into Bot Builder`}
                        >
                            <div className='free-bots__card-glow' />

                            <div className='free-bots__card-top'>
                                <div className='free-bots__card-icon-wrap'>
                                    <svg
                                        className='free-bots__card-icon-svg'
                                        viewBox='0 0 48 48'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <circle cx='24' cy='24' r='24' fill='url(#botGradient)' />
                                        <path
                                            d='M14 28l6-8 4 5 4-6 6 9'
                                            stroke='white'
                                            strokeWidth='2.5'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                        <circle cx='14' cy='28' r='2' fill='white' />
                                        <circle cx='34' cy='28' r='2' fill='white' />
                                        <defs>
                                            <linearGradient id='botGradient' x1='0' y1='0' x2='48' y2='48'>
                                                <stop offset='0%' stopColor='#ff444f' />
                                                <stop offset='100%' stopColor='#ff8f6b' />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className='free-bots__card-badges'>
                                    <span className='free-bots__card-badge free-bots__card-badge--pro'>
                                        {bot.badge}
                                    </span>
                                    <span className='free-bots__card-badge free-bots__card-badge--category'>
                                        {bot.category}
                                    </span>
                                </div>
                            </div>

                            <div className='free-bots__card-body'>
                                <h3 className='free-bots__card-title'>{bot.name}</h3>
                                <p className='free-bots__card-description'>{bot.description}</p>
                            </div>

                            <div className='free-bots__card-stats'>
                                {bot.stats.map(stat => (
                                    <div key={stat.label} className='free-bots__card-stat'>
                                        <span className='free-bots__card-stat-value'>{stat.value}</span>
                                        <span className='free-bots__card-stat-label'>{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className='free-bots__card-footer'>
                                <div className='free-bots__card-cta'>
                                    {isLoading ? (
                                        <>
                                            <span className='free-bots__card-spinner' />
                                            <span>Loading into Builder...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Open in Bot Builder</span>
                                            <svg
                                                className='free-bots__card-arrow'
                                                width='18'
                                                height='18'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2.5'
                                            >
                                                <path d='M5 12h14M12 5l7 7-7 7' />
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className='free-bots__footer'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <circle cx='12' cy='12' r='10' />
                    <path d='M12 8v4M12 16h.01' />
                </svg>
                <span>All bots are provided for educational purposes. Always test with a demo account first.</span>
            </div>
        </div>
    );
});

export default FreeBots;
