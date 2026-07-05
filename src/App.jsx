import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import PokemonDetail from './pages/PokemonDetail'; // 🚨 เพิ่มตัวนี้เข้ามา

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar มินิมอล */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg group-hover:scale-110 transition-transform">POKÉ</span>
            <span className="font-black text-xl text-slate-800 tracking-tight">DEX</span>
          </Link>
          <div className="flex gap-1">
            <Link to="/" className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition text-sm">หน้าแรก</Link>
            <Link to="/about" className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition text-sm">ผู้จัดทำ</Link>
          </div>
        </div>
      </nav>

      {/* พื้นที่แสดงผล */}
      <main className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} /> {/* 🚨 เพิ่ม Route นี้เข้าไป */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}