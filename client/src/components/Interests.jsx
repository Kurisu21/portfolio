import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink } from 'lucide-react';

const Interests = () => {
    // You can update image URLs here with direct links to images
    // For better images, you can use:
    // - MyAnimeList CDN for anime: https://cdn.myanimelist.net/images/anime/...
    // - IMDB for TV shows: https://m.media-amazon.com/images/...
    // - YouTube thumbnails for VTubers: https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg
    // - Or any direct image URL
    const interests = [
        {
            category: 'Anime',
            items: [
                {
                    name: 'Steins Gate',
                    description: 'My favorite anime - a masterpiece of time travel and science fiction',
                    image: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
                    link: 'https://myanimelist.net/anime/9253/Steins_Gate',
                    fallbackImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop'
                }
            ]
        },
        {
            category: 'VTubers',
            items: [
                {
                    name: 'Hoshimachi Suisei',
                    description: 'My favorite VTuber - amazing singer and entertainer',
                    image: 'https://s1.zerochan.net/Hoshimachi.Suisei.600.3388494.jpg',
                    link: 'https://www.youtube.com/channel/UC5CwaMl1eIgY8h02uZw7u8A',
                    fallbackImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
                }
            ]
        },
        {
            category: 'TV Shows',
            items: [
                {
                    name: 'Breaking Bad',
                    description: 'One of the greatest TV series of all time',
                    image: 'https://images7.alphacoders.com/617/617964.jpg',
                    link: 'https://www.imdb.com/title/tt0903747/',
                    fallbackImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop'
                },
                {
                    name: 'Mr. Robot',
                    description: 'Brilliant hacking and psychological thriller',
                    image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dec831ab-cc3b-47d1-aea9-d5652208c684/ddn3p6j-323dfe13-c48a-42aa-aed3-6245685a580d.jpg/v1/fill/w_1600,h_900,q_75,strp/mr__robot___hello_friend___season_finale_wallpaper_by_niushsitaula_ddn3p6j-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTAwIiwicGF0aCI6Ii9mL2RlYzgzMWFiLWNjM2ItNDdkMS1hZWE5LWQ1NjUyMjA4YzY4NC9kZG4zcDZqLTMyM2RmZTEzLWM0OGEtNDJhYS1hZWQzLTYyNDU2ODVhNTgwZC5qcGciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.SuKuCTipaF6STe3qDDTr-Ep3Wp1Ri9j6xWpzKa6n0Mc',
                    link: 'https://www.imdb.com/title/tt4158110/',
                    fallbackImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop'
                }
            ]
        }
    ];

    const handleImageError = (e, fallback) => {
        if (e.target.src !== fallback) {
            e.target.src = fallback;
        }
    };

    return (
        <section id="interests" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Interests</h2>
                        <div className="h-px bg-slate-700 flex-grow ml-6"></div>
                    </div>

                    {/* Interests by Category */}
                    <div className="space-y-16">
                        {interests.map((category, categoryIndex) => (
                            <motion.div
                                key={category.category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                            >
                                <h3 className="text-2xl font-bold text-accent mb-8 flex items-center">
                                    <Heart className="h-6 w-6 mr-3" />
                                    {category.category}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.items.map((item, itemIndex) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                                            className="group relative bg-secondary rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10"
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-48 overflow-hidden bg-slate-800">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => handleImageError(e, item.fallbackImage)}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-80"></div>
                                                
                                                {/* External Link Icon */}
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-accent rounded-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="h-4 w-4 text-white" />
                                                </a>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                                                    {item.name}
                                                </h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Interests;

