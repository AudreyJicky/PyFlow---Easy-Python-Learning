
import React from 'react';
import { UserProfile, Language, SubscriptionTier } from '../types';
import { translations } from '../translations';
import { Check, Star, Crown, Zap, Infinity, Gift } from 'lucide-react';

interface SubscriptionProps {
    user: UserProfile;
    language: Language;
    onSubscribe: (tier: SubscriptionTier) => void;
    onRedeemXp?: (cost: number, tier: SubscriptionTier) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ user, language, onSubscribe, onRedeemXp }) => {
    // See comment in ProfileSettings re: language access
    const t = translations[language].subscription;

    const plans = [
        { id: 'WEEKLY', title: t.weekly, price: '$2.99', icon: <Zap className="w-6 h-6 text-blue-500" /> },
        { id: 'MONTHLY', title: t.monthly, price: '$9.99', icon: <Star className="w-6 h-6 text-purple-500" />, popular: true },
        { id: 'YEARLY', title: t.yearly, price: '$79.99', icon: <Crown className="w-6 h-6 text-yellow-500" /> },
        { id: 'LIFETIME', title: t.lifetime, price: '$199.99', icon: <Infinity className="w-6 h-6 text-slate-800 dark:text-white" /> },
    ];

    const redemptionOptions = [
        { cost: 1000, tier: 'WEEKLY', label: t.redeem.week },
        { cost: 10000, tier: 'MONTHLY', label: t.redeem.month },
        { cost: 1000000, tier: 'YEARLY', label: t.redeem.year },
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">{t.title}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                {t.desc}
            </p>

            {user.isTrial && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-xl inline-block mb-10 font-bold shadow-lg animate-pulse">
                    🎉 {t.trial}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {plans.map((plan) => (
                    <div 
                        key={plan.id}
                        className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 transition-all hover:scale-105 cursor-pointer flex flex-col ${
                            user.subscriptionTier === plan.id 
                            ? 'border-blue-500 shadow-xl ring-4 ring-blue-500/20' 
                            : 'border-slate-100 dark:border-slate-700 shadow-lg hover:border-blue-300'
                        }`}
                        onClick={() => onSubscribe(plan.id as SubscriptionTier)}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                {t.popular}
                            </div>
                        )}
                        <div className="bg-slate-50 dark:bg-slate-700/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            {plan.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{plan.title}</h3>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mb-6">{plan.price}</div>
                        
                        <div className="space-y-3 mb-8 text-left text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> {t.benefits.unlimited}</div>
                            <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> {t.benefits.offline}</div>
                            <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> {t.benefits.certified}</div>
                            {plan.id !== 'WEEKLY' && <div className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> {t.benefits.ads}</div>}
                        </div>

                        <button 
                            className={`w-full py-3 rounded-xl font-bold mt-auto transition-colors ${
                                user.subscriptionTier === plan.id 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                            }`}
                        >
                            {user.subscriptionTier === plan.id ? t.current : t.select}
                        </button>
                    </div>
                ))}
            </div>

            {/* XP Redemption Section */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div className="text-left">
                            <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <Gift className="w-8 h-8 text-yellow-400" />
                                {t.redeem.title}
                            </h3>
                            <p className="text-indigo-200">{t.redeem.desc}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl border border-white/20">
                            <span className="text-sm text-indigo-300 uppercase font-bold tracking-wider">{t.redeem.balance}</span>
                            <div className="text-3xl font-mono font-bold text-yellow-400">{user.xp.toLocaleString()} XP</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {redemptionOptions.map((opt) => {
                            const canAfford = user.xp >= opt.cost;
                            return (
                                <div key={opt.tier} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                    <div className="text-lg font-bold mb-2">{opt.label}</div>
                                    <div className="text-2xl font-mono text-yellow-400 mb-6">{opt.cost.toLocaleString()} XP</div>
                                    <button
                                        disabled={!canAfford}
                                        onClick={() => onRedeemXp && onRedeemXp(opt.cost, opt.tier as SubscriptionTier)}
                                        className={`w-full py-3 rounded-xl font-bold transition-all ${
                                            canAfford 
                                            ? 'bg-yellow-500 hover:bg-yellow-400 text-yellow-900 shadow-lg' 
                                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                                        }`}
                                    >
                                        {canAfford ? t.redeem.btn : t.redeem.insufficient}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
