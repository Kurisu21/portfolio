import React from 'react';
import { motion } from 'framer-motion';
import { Code, Coffee, Rocket, Heart } from 'lucide-react';

const About = () => {
    const skills = [
        { category: 'Frontend', items: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
        { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'MongoDB', 'PostgreSQL'] },
        { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux'] },
    ];

    const interests = [
        { icon: Code, title: 'Coding', description: 'Passionate about building elegant solutions' },
        { icon: Coffee, title: 'Learning', description: 'Always exploring new technologies' },
        { icon: Rocket, title: 'Innovation', description: 'Creating impactful digital experiences' },
        { icon: Heart, title: 'Open Source', description: 'Contributing to the community' },
    ];

    return (
        <section id="about" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">About Me</h2>
                        <div className="h-px bg-slate-700 flex-grow ml-6"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-2xl font-bold text-accent mb-4">Who I Am</h3>
                            <p className="text-slate-400 mb-4 leading-relaxed">
                                I'm an IT student with a love for creating beautiful, functional, and user-centered digital experiences. 
                                With a strong foundation in both frontend and backend development, I enjoy turning complex problems into simple, elegant solutions.
                            </p>
                            <p className="text-slate-400 mb-4 leading-relaxed">
                                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge 
                                with the developer community. I believe in writing clean, maintainable code and always strive to learn and grow.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                My goal is to build products that make a difference and create value for users while continuously improving my craft.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h3 className="text-2xl font-bold text-accent mb-6">Skills & Technologies</h3>
                            <div className="space-y-6">
                                {skills.map((skill, index) => (
                                    <div key={skill.category}>
                                        <h4 className="text-white font-semibold mb-2">{skill.category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skill.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className="px-3 py-1 bg-secondary border border-white/10 rounded-full text-sm text-slate-300 hover:border-accent/50 transition-colors"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h3 className="text-2xl font-bold text-accent mb-8 text-center">What Drives Me</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {interests.map((interest, index) => {
                                const Icon = interest.icon;
                                return (
                                    <motion.div
                                        key={interest.title}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                        className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-accent/50 transition-colors text-center"
                                    >
                                        <Icon className="h-8 w-8 text-accent mx-auto mb-3" />
                                        <h4 className="text-white font-semibold mb-2">{interest.title}</h4>
                                        <p className="text-slate-400 text-sm">{interest.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;

