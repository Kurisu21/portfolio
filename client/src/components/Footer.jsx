import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <>
            <section id="contact" className="py-20 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Get In Touch</h2>
                        <div className="h-px bg-slate-700 flex-grow ml-6"></div>
                    </div>

                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-slate-400 text-lg mb-8">
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. 
                            Feel free to reach out!
                        </p>

                        <div className="flex justify-center space-x-6 mb-12">
                            <a 
                                href="https://github.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="transform hover:scale-110 transition-transform duration-200 text-slate-400 hover:text-accent"
                            >
                                <Github className="h-8 w-8" />
                            </a>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="transform hover:scale-110 transition-transform duration-200 text-slate-400 hover:text-accent"
                            >
                                <Linkedin className="h-8 w-8" />
                            </a>
                            <a 
                                href="mailto:contact@example.com" 
                                className="transform hover:scale-110 transition-transform duration-200 text-slate-400 hover:text-accent"
                            >
                                <Mail className="h-8 w-8" />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="transform hover:scale-110 transition-transform duration-200 text-slate-400 hover:text-accent"
                            >
                                <Twitter className="h-8 w-8" />
                            </a>
                        </div>

                        <a
                            href="mailto:contact@example.com"
                            className="inline-block border-2 border-accent text-accent px-10 py-4 rounded-lg font-mono hover:bg-accent/10 transition-colors"
                        >
                            Say Hello
                        </a>
                    </div>
                </div>
            </section>

            <footer className="bg-secondary/50 py-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-400">
                        Designed and Built by <span className="text-accent">Ismael Jose Jumao-as</span>
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Footer;
