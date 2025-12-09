import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Home, 
    User, 
    FolderKanban, 
    Tags, 
    Heart,
    Music, 
    Gamepad2, 
    Mail 
} from 'lucide-react';

const SideMenu = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [activeHash, setActiveHash] = useState('');

    useEffect(() => {
        const updateHash = () => {
            setActiveHash(window.location.hash || '#home');
        };

        updateHash();
        window.addEventListener('hashchange', updateHash);
        window.addEventListener('scroll', updateHash);

        return () => {
            window.removeEventListener('hashchange', updateHash);
            window.removeEventListener('scroll', updateHash);
        };
    }, []);

    const menuItems = [
        { name: 'Home', icon: Home, href: '#home' },
        { name: 'About', icon: User, href: '#about' },
        { name: 'Toolstack', icon: Tags, href: '#stack' },
        { name: 'Projects', icon: FolderKanban, href: '#projects' },
        { name: 'Interests', icon: Heart, href: '#interests' },
        { name: 'Songs', icon: Music, href: '#songs' },
        { name: 'Playground', icon: Gamepad2, href: '#playground' },
        { name: 'Contact', icon: Mail, href: '#contact' },
    ];

    return (
        <motion.div
            className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 hidden md:block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                initial={false}
                animate={{
                    width: isHovered ? 200 : 60,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-secondary/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
                <div className="p-3 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeHash === item.href || 
                            (item.href === '#home' && !activeHash);
                        
                        return (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                initial={false}
                                animate={{
                                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                }}
                                whileHover={{
                                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                }}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                                    transition-colors duration-200 cursor-pointer
                                    ${isActive ? 'text-accent' : 'text-slate-400'}
                                `}
                                style={{
                                    minWidth: isHovered ? 'auto' : '44px',
                                    justifyContent: isHovered ? 'flex-start' : 'center',
                                }}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.a>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SideMenu;

