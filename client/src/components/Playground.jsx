import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Gamepad2, Zap, Sparkles } from 'lucide-react';

const Playground = () => {
    const [activeDemo, setActiveDemo] = useState(null);

    const demos = [
        {
            id: 1,
            title: 'Interactive Code Editor',
            description: 'Try out code snippets in real-time',
            icon: Code,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
        },
        {
            id: 2,
            title: 'Animation Playground',
            description: 'Experiment with CSS and JS animations',
            icon: Sparkles,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10',
        },
        {
            id: 3,
            title: 'Game Demos',
            description: 'Play mini-games built with web technologies',
            icon: Gamepad2,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
        },
        {
            id: 4,
            title: 'API Tester',
            description: 'Test and explore various APIs',
            icon: Zap,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10',
        },
    ];

    return (
        <section id="playground" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Playground</h2>
                        <div className="h-px bg-slate-700 flex-grow ml-6"></div>
                    </div>

                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Interactive demos and experiments. Click to explore and play around!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {demos.map((demo, index) => {
                            const Icon = demo.icon;
                            return (
                                <motion.div
                                    key={demo.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
                                    className={`
                                        bg-secondary rounded-xl p-8 border border-white/5 
                                        hover:border-accent/50 transition-all duration-300 
                                        cursor-pointer group relative overflow-hidden
                                        ${activeDemo === demo.id ? 'border-accent/50' : ''}
                                    `}
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${demo.bgColor} rounded-full blur-3xl opacity-20`}></div>
                                    
                                    <div className="relative z-10">
                                        <div className={`${demo.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <Icon className={`h-8 w-8 ${demo.color}`} />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                                            {demo.title}
                                        </h3>

                                        <p className="text-slate-400 text-sm mb-4">
                                            {demo.description}
                                        </p>

                                        <div className={`
                                            mt-6 pt-4 border-t border-white/5
                                            ${activeDemo === demo.id ? 'block' : 'hidden group-hover:block'}
                                        `}>
                                            <div className="bg-primary/50 rounded-lg p-4 border border-white/5">
                                                <p className="text-slate-400 text-sm text-center">
                                                    Demo coming soon! 🚀
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Playground;

