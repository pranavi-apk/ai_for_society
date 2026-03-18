"use client";

import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import Link from 'next/link';
import { MapIcon, BarChart3, Database } from 'lucide-react';
import { useEffect, useState } from 'react';

// Floating dots background for an "AI/Data" feel
const NetworkBackground = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-300 rounded-full blur-sm"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function AnimatedHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#00385e] to-[#0072B7] text-white py-24 px-4 overflow-hidden shadow-inner">
      <NetworkBackground />
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={itemVariants} className="inline-block bg-blue-500/30 border border-blue-400/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider mb-6 text-blue-100 flex items-center gap-2 w-max">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE: AI for Society Simulation
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-md"
          >
            Synthesizing The <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200">
              Displaced
            </span>
          </motion.h1>
          
          <motion.div variants={itemVariants} className="h-16 text-2xl md:text-3xl font-light mb-6 text-blue-100">
            <span>Generative Model for </span>
            <span className="font-bold text-white">
              <Typewriter
                words={['Demographic Analysis', 'Humanitarian Logistics', 'Privacy Preservation', 'Spatial Intelligence']}
                loop={true}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl mb-10 text-blue-50/90 leading-relaxed font-light border-l-4 border-teal-400 pl-4">
            An algorithmic data fusion engine synthesizing <span className="font-bold">5.3 million</span> demographically identical, privacy-preserving individuals using verifiable UNHCR and IRC reporting targets.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link href="/map" className="group bg-white text-[#00385e] hover:bg-slate-50 font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 flex items-center gap-3">
              <MapIcon className="w-5 h-5 group-hover:scale-110 transition-transform" /> Enter Live Map
            </Link>
            <Link href="/demographics" className="group bg-[#004a78]/50 backdrop-blur-md text-white hover:bg-[#004a78]/80 font-bold py-4 px-8 rounded-xl border border-blue-300/30 transition-all hover:-translate-y-1 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Explore Demographics
            </Link>
          </motion.div>
        </motion.div>

        {/* Abstract Data Visualization graphic for the hero right side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="hidden lg:flex justify-center items-center relative"
        >
          <div className="absolute inset-0 bg-blue-400/20 blur-[100px] rounded-full"></div>
          <div className="relative w-full aspect-square max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 blur-3xl rounded-full"></div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
               <div>
                 <p className="text-blue-200 text-xs font-mono mb-1">DATA PROCESSING</p>
                 <p className="text-xl font-bold tracking-tight">Synthetic Fusion</p>
               </div>
               <Database className="w-8 h-8 text-blue-300" />
            </div>

            <div className="space-y-4 my-6">
               <div className="h-2 bg-white/10 rounded overflow-hidden">
                 <motion.div className="h-full bg-teal-400" initial={{ width: "0%" }} animate={{ width: "68%" }} transition={{ duration: 2, delay: 1 }}></motion.div>
               </div>
               <div className="flex justify-between text-xs font-mono text-blue-200">
                 <span>Myanmar IDP Match</span>
                 <span>68% Confidence</span>
               </div>
               
               <div className="h-2 bg-white/10 rounded overflow-hidden">
                 <motion.div className="h-full bg-blue-400" initial={{ width: "0%" }} animate={{ width: "95%" }} transition={{ duration: 2, delay: 1.5 }}></motion.div>
               </div>
               <div className="flex justify-between text-xs font-mono text-blue-200">
                 <span>Privacy Score (PII Free)</span>
                 <span>95% Isolated</span>
               </div>
            </div>

            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-1/5 bg-white/10 rounded-t-sm"
                  initial={{ height: 10 }}
                  animate={{ height: Math.random() * 60 + 20 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
