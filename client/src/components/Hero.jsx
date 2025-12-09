import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Stars array
        const stars = [];
        const shootingStars = [];
        const numStars = 200;
        const numShootingStars = 3;

        // Create stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
            });
        }

        // Create shooting stars
        for (let i = 0; i < numShootingStars; i++) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 2 + 1,
                opacity: 0,
                angle: Math.random() * Math.PI * 0.5 - Math.PI * 0.25, // Diagonal
                active: false,
                resetTimer: Math.random() * 200 + 100,
            });
        }

        let animationFrameId;
        let frameCount = 0;

        const animate = () => {
            ctx.fillStyle = '#0f172a'; // Same as bg-primary
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and animate stars
            stars.forEach(star => {
                const twinkle = Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${star.opacity * twinkle})`; // accent color with opacity
                ctx.fill();
            });

            // Draw and animate shooting stars
            shootingStars.forEach((star, index) => {
                frameCount++;
                
                if (!star.active && frameCount % star.resetTimer === 0) {
                    star.active = true;
                    star.x = Math.random() * canvas.width;
                    star.y = -50;
                    star.opacity = 1;
                }

                if (star.active) {
                    ctx.save();
                    ctx.translate(star.x, star.y);
                    ctx.rotate(star.angle);

                    const gradient = ctx.createLinearGradient(0, 0, star.length, 0);
                    gradient.addColorStop(0, `rgba(56, 189, 248, ${star.opacity})`); // accent color
                    gradient.addColorStop(0.5, `rgba(56, 189, 248, ${star.opacity * 0.5})`);
                    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(star.length, 0);
                    ctx.stroke();

                    // Bright point at the head
                    ctx.beginPath();
                    ctx.arc(0, 0, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(56, 189, 248, ${star.opacity})`;
                    ctx.fill();

                    ctx.restore();

                    star.x += Math.cos(star.angle) * star.speed;
                    star.y += Math.sin(star.angle) * star.speed;
                    star.opacity -= 0.01;

                    if (star.y > canvas.height + 50 || star.x > canvas.width + 50 || star.opacity <= 0) {
                        star.active = false;
                        star.resetTimer = Math.random() * 200 + 100;
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
            {/* Animated Galaxy Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ background: '#0f172a' }}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-accent font-medium text-lg mb-4">Hi, my name is</h2>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                        Ismael Jose Jumao-as.
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-bold mb-8 text-slate-400">
                        I build things for the web.
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-12">
                        I'm an IT student specializing in building (and occasionally designing) exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products.
                    </p>

                    <div className="flex justify-center space-x-6 mb-12">
                        <a href="#" className="transform hover:scale-110 transition-transform duration-200 text-slate-400 hover:text-accent">
                            <Github className="h-8 w-8" />
                        </a>
                        <a href="#" className="transform hover:scale-110 transition-transform duration-200 text-slate-400 hover:text-accent">
                            <Linkedin className="h-8 w-8" />
                        </a>
                        <a href="#" className="transform hover:scale-110 transition-transform duration-200 text-slate-400 hover:text-accent">
                            <Mail className="h-8 w-8" />
                        </a>
                    </div>

                    <a
                        href="#projects"
                        className="inline-block border-2 border-accent text-accent px-10 py-4 rounded-lg font-mono hover:bg-accent/10 transition-colors"
                    >
                        Check out my work!
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
