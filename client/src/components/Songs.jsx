import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

const Songs = () => {
    const tracks = [
        {
            id: 1,
            title: 'Shelter',
            artist: 'Porter Robinson & Madeon',
            genre: 'Electronic',
            youtubeUrl: 'https://www.youtube.com/watch?v=fzQ6gRAEoy0',
            videoId: 'fzQ6gRAEoy0',
        },
        {
            id: 2,
            title: 'Hello/How Are You',
            artist: 'Kano',
            genre: 'Electronic',
            youtubeUrl: 'https://youtu.be/fNB8VRwCPTM',
            videoId: 'fNB8VRwCPTM',
        },
        {
            id: 3,
            title: 'Last Frontier',
            artist: 'Hoshimachi Suisei',
            genre: 'J-Pop',
            youtubeUrl: 'https://youtu.be/-9wUbw5qevU',
            videoId: '-9wUbw5qevU',
        },
        {
            id: 4,
            title: 'Look at the Sky',
            artist: 'Porter Robinson',
            genre: 'Electronic',
            youtubeUrl: 'https://youtu.be/PuMz4v5PYKc',
            videoId: 'PuMz4v5PYKc',
        },
    ];

    const handlePlayClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <section id="songs" className="py-20 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Songs</h2>
                        <div className="h-px bg-slate-700 flex-grow ml-6"></div>
                    </div>

                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        A collection of songs I love and enjoy listening to.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tracks.map((track, index) => (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-secondary rounded-xl p-4 border border-white/5 hover:border-accent/50 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800">
                                            <img
                                                src={`https://img.youtube.com/vi/${track.videoId}/maxresdefault.jpg`}
                                                alt={`${track.title} by ${track.artist}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = `https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg`;
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handlePlayClick(track.youtubeUrl)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            title="Listen on YouTube"
                                        >
                                            <Play className="h-6 w-6 text-white ml-1" />
                                        </button>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold truncate group-hover:text-accent transition-colors">
                                            {track.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm truncate">{track.artist}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-slate-500">{track.genre}</span>
                                        </div>
                                    </div>

                                    <a
                                        href={track.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Open on YouTube"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink className="h-5 w-5 text-slate-400 hover:text-accent transition-colors" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Songs;

