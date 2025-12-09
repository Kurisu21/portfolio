
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Folder, Star, GitFork, Clock, X, FileText, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

const RepoModal = ({ repo, onClose }) => {
    const [activeTab, setActiveTab] = useState('readme');
    const [readme, setReadme] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Readme
                try {
                    const readmeRes = await axios.get(`https://api.github.com/repos/${repo.full_name}/readme`);
                    const content = atob(readmeRes.data.content);
                    setReadme(content);
                } catch (e) {
                    setReadme("# No README found");
                }

                // Fetch Contents
                try {
                    const filesRes = await axios.get(`https://api.github.com/repos/${repo.full_name}/contents`);
                    setFiles(filesRes.data);
                } catch (e) {
                    setFiles([]);
                }

            } catch (error) {
                console.error("Error details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (repo) fetchData();
    }, [repo]);

    if (!repo) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-secondary w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-slate-900/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{repo.name}</h2>
                        <p className="text-slate-400 text-sm mb-4">{repo.description}</p>
                        <div className="flex space-x-4">
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-accent hover:underline">
                                <Github className="h-4 w-4" />
                                <span>View on GitHub</span>
                            </a>
                            {repo.homepage && (
                                <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-accent hover:underline">
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Live Demo</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-slate-900/30">
                    <button
                        onClick={() => setActiveTab('readme')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'readme' ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>README.md</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'files' ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Folder className="h-4 w-4" />
                            <span>Files</span>
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#0d1117]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                        </div>
                    ) : activeTab === 'readme' ? (
                        <div className="prose prose-invert max-w-none prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-white/10">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {files.sort((a, b) => {
                                if (a.type === b.type) return a.name.localeCompare(b.name);
                                return a.type === 'dir' ? -1 : 1;
                            }).map((file) => (
                                <div key={file.path} className="flex items-center p-3 rounded-lg border border-white/5 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                    {file.type === 'dir' ? (
                                        <Folder className="h-5 w-5 text-blue-400 mr-3" />
                                    ) : (
                                        <Code className="h-5 w-5 text-slate-400 mr-3" />
                                    )}
                                    <span className="text-sm text-slate-300 truncate">{file.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6); // Default 6
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRepo, setSelectedRepo] = useState(null);

    const username = 'Kurisu21';

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();

                const sourceRepos = data.filter(repo => !repo.fork);
                const sortedRepos = sourceRepos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

                setProjects(sortedRepos);
            } catch (err) {
                console.error("Github fetch error:", err);
                setError("Could not load projects from GitHub.");
            } finally {
                setLoading(false);
            }
        };

        fetchGithubData();
    }, []);

    const getLanguageColor = (lang) => {
        const colors = {
            JavaScript: 'text-yellow-400',
            TypeScript: 'text-blue-400',
            HTML: 'text-orange-400',
            CSS: 'text-blue-300',
            Python: 'text-blue-500',
            Java: 'text-red-400',
            Vue: 'text-green-400',
            React: 'text-cyan-400',
            Dart: 'text-teal-400'
        };
        return colors[lang] || 'text-slate-400';
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    return (
        <section id="projects" className="py-20 relative">
            <AnimatePresence>
                {selectedRepo && <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">GitHub Contributions & Projects</h2>
                        <div className="h-px bg-slate-700 flex-grow ml-6"></div>
                    </div>

                    {/* Contribution Calendar */}
                    <div className="mb-16 flex justify-center bg-secondary/30 p-8 rounded-xl border border-white/5 overflow-x-auto shadow-inner">
                        <div className="min-w-[800px] flex justify-center">
                            {/* Using the image chart for reliability and classic look */}
                            <img
                                src={`https://ghchart.rshah.org/38bdf8/${username}`}
                                alt="GitHub Contribution Graph"
                                className="w-full max-w-4xl opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {loading ? (
                        <div className="text-center text-slate-400 py-20 flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mb-4"></div>
                            Loading repositories...
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400 py-20">{error}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {projects.slice(0, visibleCount).map((repo, index) => (
                                    <motion.div
                                        key={repo.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => setSelectedRepo(repo)}
                                        className="bg-secondary rounded-xl p-6 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 border border-white/5 shadow-xl hover:shadow-2xl hover:shadow-accent/10 cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-accent group-hover:text-white transition-colors">
                                                <Folder className="h-8 w-8" />
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <a
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 bg-primary/50 hover:bg-accent/20 rounded-lg border border-white/10 hover:border-accent/50 transition-all duration-300 group/github"
                                                    title="View on GitHub"
                                                >
                                                    <Github className="h-5 w-5 text-slate-400 group-hover/github:text-accent transition-colors" />
                                                </a>
                                                <span className="text-slate-500 text-xs flex items-center bg-primary/50 px-2 py-1 rounded-full">
                                                    {repo.visibility}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 break-words text-accent transition-colors">
                                            {repo.name}
                                        </h3>

                                        <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-3">
                                            {repo.description || "No description available."}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {repo.language && (
                                                <span className={`text-xs font-mono opacity-80 ${getLanguageColor(repo.language)} border border-white/10 px-2 py-1 rounded`}>
                                                    {repo.language}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-slate-500 text-xs mt-auto pt-4 border-t border-white/5">
                                            <div className="flex space-x-4">
                                                <span className="flex items-center space-x-1">
                                                    <Star className="h-3 w-3 text-yellow-500" />
                                                    <span>{repo.stargazers_count}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <GitFork className="h-3 w-3 text-blue-400" />
                                                    <span>{repo.forks_count}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {visibleCount < projects.length && (
                                <div className="flex justify-center">
                                    <button
                                        onClick={loadMore}
                                        className="bg-accent/10 hover:bg-accent text-accent hover:text-primary border border-accent rounded-full px-8 py-3 transition-all duration-300 font-medium"
                                    >
                                        Show More Projects
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
