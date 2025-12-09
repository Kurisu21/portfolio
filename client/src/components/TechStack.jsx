import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Layout, Server, Settings, Terminal, Globe, Cpu } from 'lucide-react';

const TechStack = () => {
    const technologies = [
        { name: 'React', icon: Layout, color: 'text-blue-400' },
        { name: 'Node.js', icon: Server, color: 'text-green-500' },
        { name: 'TypeScript', icon: Code, color: 'text-blue-600' },
        { name: 'Tailwind CSS', icon: Settings, color: 'text-cyan-400' },
        { name: 'Express', icon: Globe, color: 'text-gray-400' },
        { name: 'MongoDB', icon: Database, color: 'text-green-400' },
        { name: 'Next.js', icon: Terminal, color: 'text-white' },
        { name: 'Docker', icon: Cpu, color: 'text-blue-500' },
    ];

    return (
        <section id="stack" className="py-20 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Tech Stack</h2>
                        <div className="h-px bg-slate-700 flex-grow ml-6"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-accent/50 transition-colors group cursor-default"
                            >
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <tech.icon className={`h-12 w-12 ${tech.color} group-hover:scale-110 transition-transform duration-300`} />
                                    <span className="text-slate-300 font-medium">{tech.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TechStack;
