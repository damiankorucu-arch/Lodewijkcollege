/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight,
  Menu,
  X,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Opleidingen', href: '#opleidingen' },
  { name: 'Onze School', href: '#school' },
  { name: 'Nieuws', href: '#nieuws' },
  { name: 'Contact', href: '#contact' },
];

const educationLevels = [
  {
    title: 'Mavo',
    description: 'Theoretische leerweg voor leerlingen die graag praktisch én theoretisch bezig zijn.',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-blue-500'
  },
  {
    title: 'Havo',
    description: 'Hoger algemeen voortgezet onderwijs, de perfecte voorbereiding op het HBO.',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-orange-500'
  },
  {
    title: 'Vwo',
    description: 'Voorbereidend wetenschappelijk onderwijs (Atheneum & Gymnasium) voor de onderzoekers.',
    icon: <Trophy className="w-6 h-6" />,
    color: 'bg-green-500'
  }
];export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: string) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );

  const SchoolGame = () => {
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [basketX, setBasketX] = useState(50);
    const [items, setItems] = useState<{ id: number; x: number; y: number; type: 'diploma' | 'ink' }[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [highScore, setHighScore] = useState(0);

    const startGame = () => {
      setIsPlaying(true);
      setScore(0);
      setTimeLeft(30);
      setItems([]);
    };

    useEffect(() => {
      if (!isPlaying || timeLeft <= 0) {
        if (timeLeft <= 0) {
          setIsPlaying(false);
          if (score > highScore) setHighScore(score);
        }
        return;
      }

      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      const spawnItem = setInterval(() => {
        setItems(prev => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 90 + 5,
            y: -10,
            type: Math.random() > 0.3 ? 'diploma' : 'ink'
          }
        ]);
      }, 600);

      const gameLoop = setInterval(() => {
        setItems(prev => {
          return prev
            .map(item => ({ ...item, y: item.y + 2 }))
            .filter(item => {
              // Collision detection
              if (item.y > 85 && item.y < 95 && Math.abs(item.x - basketX) < 15) {
                setScore(s => (item.type === 'diploma' ? s + 10 : Math.max(0, s - 15)));
                return false;
              }
              return item.y < 100;
            });
        });
      }, 20);

      return () => {
        clearInterval(timer);
        clearInterval(spawnItem);
        clearInterval(gameLoop);
      };
    }, [isPlaying, timeLeft, basketX, score, highScore]);

    return (
      <div className="bg-indigo-950 py-16 text-white overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-4">Mini Game</h3>
            <h4 className="text-4xl font-black uppercase tracking-tighter mb-4">Grijp je Diploma!</h4>
            <p className="text-slate-400 text-sm italic">Beweeg je tas en vang zoveel mogelijk diploma's.</p>
          </div>

          <div 
            className="max-w-xl mx-auto h-[400px] bg-indigo-900/50 border-4 border-indigo-800 rounded-lg relative cursor-none touch-none overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              setBasketX(Math.min(90, Math.max(10, x)));
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              const x = ((touch.clientX - rect.left) / rect.width) * 100;
              setBasketX(Math.min(90, Math.max(10, x)));
            }}
          >
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-950/80 z-20 p-6 text-center">
                {timeLeft === 30 ? (
                  <>
                    <Trophy className="w-16 h-16 text-orange-400 mb-6" />
                    <h5 className="text-2xl font-black mb-4 uppercase tracking-tighter">Bereid je voor op succes!</h5>
                    <p className="mb-8 text-sm text-slate-300">Vang diploma's (+10) en ontwijk de rode inkt (-15).</p>
                  </>
                ) : (
                  <>
                    <h5 className="text-4xl font-black mb-2 uppercase tracking-tighter">Einde!</h5>
                    <p className="text-xl mb-2">Jouw score: <span className="text-orange-400 font-black">{score}</span></p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-8">Top score: {highScore}</p>
                  </>
                )}
                <button 
                  onClick={startGame}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 font-black text-xs uppercase tracking-[0.2em] transition-all"
                >
                  {timeLeft === 30 ? 'Start Spel' : 'Probeer Opnieuw'}
                </button>
              </div>
            ) : (
              <>
                <div className="absolute top-4 left-6 flex gap-8">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Score</span>
                    <span className="text-2xl font-black text-orange-400">{score}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tijd</span>
                    <span className="text-2xl font-black">{timeLeft}s</span>
                  </div>
                </div>

                {items.map(item => (
                  <motion.div
                    key={item.id}
                    className="absolute text-3xl"
                    style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translateX(-50%)' }}
                  >
                    {item.type === 'diploma' ? '🎓' : '✒️'}
                  </motion.div>
                ))}

                <div 
                  className="absolute bottom-4 h-16 w-20 flex items-center justify-center text-5xl transition-all duration-75"
                  style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}
                >
                  🎒
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-800/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled || activePage !== 'home' ? 'bg-white shadow-sm py-4 border-slate-200' : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button onClick={() => navigateTo('home')} className="flex items-center gap-3 group cursor-pointer text-left">
            <div className="w-10 h-10 bg-indigo-900 flex items-center justify-center text-white font-bold text-xl rounded-sm group-hover:bg-indigo-700 transition-colors">L</div>
            <span className={`text-xl font-bold tracking-tight uppercase ${isScrolled || activePage !== 'home' ? 'text-indigo-950 block' : 'text-white md:text-indigo-950 lg:block'}`}>
              Lodewijk College
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => navigateTo(link.href.replace('#', ''))}
                className={`text-xs font-bold uppercase tracking-widest hover:text-indigo-700 transition-colors cursor-pointer ${
                  (isScrolled || activePage !== 'home') ? 'text-slate-500' : 'text-white md:text-slate-600'
                } ${activePage === link.href.replace('#', '') ? 'text-indigo-700 underline underline-offset-4' : ''}`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => navigateTo('contact')}
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Contact
            </button>
          </div>

          <button 
            className={`md:hidden ${isScrolled || activePage !== 'home' ? 'text-indigo-950' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => navigateTo(link.href.replace('#', ''))}
                className={`text-sm font-bold uppercase tracking-widest border-b border-slate-100 pb-2 text-left ${
                  activePage === link.href.replace('#', '') ? 'text-indigo-700' : 'text-slate-500'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => navigateTo('contact')}
              className="bg-indigo-900 text-white py-3 rounded-sm font-bold text-xs uppercase tracking-widest"
            >
              Contact Opnemen
            </button>
          </motion.div>
        )}
      </nav>

      <main>
        {activePage === 'home' && (
          <PageWrapper>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center overflow-hidden bg-white">
              <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center pt-20">
                <div className="w-full lg:w-1/2 flex flex-col justify-center py-16 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="mb-4 inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
                      Kwaliteit in Onderwijs - Terneuzen
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black leading-[0.85] text-indigo-950 mb-8 uppercase tracking-tighter font-display">
                      Jouw toekomst<br/>begint<br/><span className="text-indigo-700 decoration-orange-500 decoration-8 underline-offset-8">hier.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-md mb-12 leading-relaxed">
                      Bij het Lodewijk College ontdek je wie je bent en wat je kunt. Samen bouwen we aan een succesvolle toekomst.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => navigateTo('opleidingen')}
                        className="bg-indigo-900 hover:bg-indigo-800 text-white px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg shadow-indigo-900/20"
                      >
                        Bekijk Opleidingen
                      </button>
                      <button 
                        onClick={() => navigateTo('school')}
                        className="border-2 border-indigo-900 text-indigo-900 hover:bg-indigo-50 px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer"
                      >
                        Ontdek Onze School
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center relative scale-90 md:scale-100">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                    <img src="https://picsum.photos/seed/lc-1/400/600" className="w-full aspect-[2/3] object-cover grayscale rounded-sm" />
                    <div className="flex flex-col gap-4">
                      <div className="bg-orange-500 flex-1 flex flex-col items-center justify-center text-white p-6 rounded-sm">
                        <Trophy className="w-10 h-10 mb-4" />
                        <span className="text-3xl font-black">98%</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Geslaagd</span>
                      </div>
                      <img src="https://picsum.photos/seed/lc-2/400/400" className="w-full aspect-square object-cover grayscale rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <SchoolGame />
          </PageWrapper>
        )}

        {activePage === 'opleidingen' && (
          <PageWrapper>
            <section className="pt-40 pb-24 bg-white">
              <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-16">
                  <h2 className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.3em] mb-4">Opleidingen</h2>
                  <h3 className="text-5xl md:text-7xl font-black text-indigo-950 uppercase tracking-tighter mb-8 font-display">Passend onderwijs voor iedereen.</h3>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Op het Lodewijk College kun je terecht voor alle leerwegen. 
                    Van praktijkonderwijs tot en met gymnasium.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { title: 'Mavo', desc: 'Theoretische leerweg die voorbereidt op het mbo of de havo.', loc: 'Zeldenrustlaan' },
                    { title: 'Havo', desc: 'Hoger algemeen voortgezet onderwijs, voorbereiding op het hbo.', loc: 'Oude Vaart / Zeldenrust' },
                    { title: 'Vwo', desc: 'Voorbereidend wetenschappelijk onderwijs (Atheneum & Gymnasium).', loc: 'Oude Vaart' },
                    { title: 'Praktijkonderwijs', desc: 'Persoonlijk onderwijs voor leerlingen die leren door te doen.', loc: 'Zeldenrustlaan' },
                    { title: 'TTO', desc: 'Tweetalig onderwijs op havo en vwo niveau.', loc: 'Oude Vaart' },
                    { title: 'Technasium', desc: 'Vakoverstijgend onderwijs gericht op bèta-techniek.', loc: 'Zeldenrustlaan' }
                  ].map((edu) => (
                    <div key={edu.title} className="border border-slate-200 p-10 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <h4 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter mb-4">{edu.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">{edu.desc}</p>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-700 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> {edu.loc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </PageWrapper>
        )}

        {activePage === 'school' && (
          <PageWrapper>
            <section className="pt-40 pb-24 bg-slate-50 min-h-screen">
              <div className="container mx-auto px-6">
                <h2 className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.3em] mb-4">Onze School</h2>
                <h3 className="text-5xl font-black text-indigo-950 uppercase tracking-tighter mb-16 font-display">Onze locaties in Terneuzen.</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                  {[
                    { 
                      name: 'Locatie Zeldenrustlaan', 
                      adress: 'Zeldenrustlaan 2, Terneuzen', 
                      levels: 'Mavo, Havo (onderbouw), Vwo (onderbouw), Praktijkonderwijs',
                      img: 'https://picsum.photos/seed/loc-z/800/600'
                    },
                    { 
                      name: 'Locatie Oude Vaart', 
                      adress: 'Oude Vaart 1, Terneuzen', 
                      levels: 'Havo (bovenbouw), Vwo (bovenbouw), TTO',
                      img: 'https://picsum.photos/seed/loc-o/800/600'
                    }
                  ].map((loc) => (
                    <div key={loc.name} className="bg-white border border-slate-200 p-4">
                      <img src={loc.img} className="w-full h-48 object-cover mb-6 grayscale" />
                      <div className="px-4 pb-4">
                        <h4 className="text-xl font-black text-indigo-950 uppercase tracking-tighter mb-2">{loc.name}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{loc.adress}</p>
                        <p className="text-sm text-slate-500 italic mb-6">Aanbod: {loc.levels}</p>
                        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900 border-b-2 border-indigo-950 pb-1">Bezoeklocatie</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </PageWrapper>
        )}

        {activePage === 'nieuws' && (
          <PageWrapper>
            <section className="pt-40 pb-24 bg-white min-h-screen">
              <div className="container mx-auto px-6">
                <h2 className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.3em] mb-4">Nieuws</h2>
                <h3 className="text-5xl font-black text-indigo-950 uppercase tracking-tighter mb-16 font-display">Het laatste nieuws.</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="h-64 bg-slate-100 mb-6 overflow-hidden relative">
                        <img src={`https://picsum.photos/seed/news-${i}/600/400`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-900">Nieuws</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">12 Mei 2024</span>
                      <h4 className="text-xl font-black text-indigo-950 uppercase tracking-tighter group-hover:text-indigo-700 transition-colors">Lodewijk College blikt terug op een geslaagd schooljaar</h4>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </PageWrapper>
        )}

        {activePage === 'contact' && (
          <PageWrapper>
            <section className="pt-40 pb-24 bg-indigo-950 text-white min-h-screen">
              <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-20">
                <div className="lg:w-1/2">
                  <h2 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4">Contact</h2>
                  <h3 className="text-6xl font-black font-display uppercase tracking-tighter mb-12">Stel je<br/>vraag aan<br/>ons team.</h3>
                  <div className="space-y-12">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-orange-400">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Telefoon</div>
                        <div className="text-xl font-bold uppercase tracking-tight">0115 648 348</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-orange-400">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Email</div>
                        <div className="text-xl font-bold uppercase tracking-tight">info@lodewijkcollege.nl</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-orange-400">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Bestuurskantoor</div>
                        <div className="text-xl font-bold uppercase tracking-tight">Terneuzen, Nederland</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-white p-10 text-slate-900 border-2 border-orange-500 shadow-2xl">
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-8">Neem contact op</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Volledige Naam</label>
                        <input type="text" className="w-full border-b border-slate-200 py-3 outline-none focus:border-orange-500 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">E-mail</label>
                        <input type="email" className="w-full border-b border-slate-200 py-3 outline-none focus:border-orange-500 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Bericht</label>
                        <textarea className="w-full border-b border-slate-200 py-3 outline-none focus:border-orange-500 transition-colors h-32 resize-none"></textarea>
                      </div>
                      <button className="w-full bg-indigo-900 text-white p-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-colors cursor-pointer">
                        Verstuur Bericht
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </PageWrapper>
        )}
      </main>

      {/* Footer Info Bar Style */}
      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row justify-between gap-16">
          <div className="max-w-xs">
            <button onClick={() => navigateTo('home')} className="flex items-center gap-3 mb-8 cursor-pointer">
              <div className="w-10 h-10 bg-indigo-950 flex items-center justify-center text-white font-bold text-xl rounded-sm">L</div>
              <span className="text-indigo-950 text-xl font-black tracking-tight uppercase">Lodewijk College</span>
            </button>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              Het Lodewijk College is een school voor voortgezet onderwijs in Terneuzen en omstreken. Wij maken deel uit van VO-Zeeuws Vlaanderen.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-indigo-900 hover:text-white hover:border-indigo-900 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-slate-600">
            <div>
              <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-950 mb-8">Navigatie</h6>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <li><button onClick={() => navigateTo('home')} className="hover:text-indigo-900 cursor-pointer">Home</button></li>
                <li><button onClick={() => navigateTo('opleidingen')} className="hover:text-indigo-900 cursor-pointer">Opleidingen</button></li>
                <li><button onClick={() => navigateTo('school')} className="hover:text-indigo-900 cursor-pointer">Onze School</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-indigo-900 cursor-pointer">Contact</button></li>
              </ul>
            </div>
            <div>
              <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-950 mb-8">Locaties</h6>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <li><button onClick={() => navigateTo('school')} className="hover:text-indigo-900 text-left">Zeldenrustlaan</button></li>
                <li><button onClick={() => navigateTo('school')} className="hover:text-indigo-900 text-left">Oude Vaart</button></li>
              </ul>
            </div>
            <div>
              <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-950 mb-8">Handig</h6>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <li><a href="#" className="hover:text-indigo-900">Magister</a></li>
                <li><a href="#" className="hover:text-indigo-900">Zermelo</a></li>
                <li><a href="#" className="hover:text-indigo-900">Mijn Scholen</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar Pattern */}
        <div className="h-20 bg-slate-50 border-t border-slate-200 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 gap-4 text-center">
            <div className="flex gap-4 lg:gap-12">
              <span>TERNEUZEN, NL</span>
              <span className="hidden sm:inline">MAVO / HAVO / VWO / GYMNASIUM / TTO</span>
            </div>
            <div className="flex gap-8 items-center">
              <a href="https://www.lodewijkcollege.nl" target="_blank" rel="noopener noreferrer" className="text-indigo-900 hover:underline">Officiële Website</a>
              <div className="w-px h-4 bg-slate-200"></div>
              <span>&copy; 2026 Lodewijk College</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
