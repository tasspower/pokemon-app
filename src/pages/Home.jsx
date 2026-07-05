import { useState, useEffect } from 'react';
import { Skeleton } from '@mui/material';
import { Link } from 'react-router-dom'; // 🚨 เพิ่มตัวนี้เข้ามา

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const fetchPokemons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      setPokemons(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4">
      <h2 className="text-3xl font-black text-center text-slate-800 mb-8 tracking-wide">
        Pokédex โลกของโปเกม่อน ({offset + 1} - {Math.min(offset + limit, 1351)})
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {isLoading
          ? Array.from(new Array(limit)).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center">
                <Skeleton variant="circular" width={96} height={96} animation="wave" />
                <Skeleton variant="text" width="60%" height={32} sx={{ mt: 2 }} animation="wave" />
              </div>
            ))
          : pokemons.map((poke, index) => {
              const pokeId = poke.url.split('/')[6];
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;

              return (
                // 🚨 เปลี่ยนจาก <div> เป็น <Link> เพื่อให้กดได้จริง
                <Link 
                  to={`/pokemon/${pokeId}`} 
                  key={index} 
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center group cursor-pointer transform hover:-translate-y-1 block text-decoration-none"
                >
                  <div className="bg-slate-50 rounded-full p-2 w-28 h-28 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <img src={imageUrl} alt={poke.name} className="w-24 h-24 object-contain" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 mt-3 font-mono">#{pokeId.padStart(4, '0')}</span>
                  <p className="mt-1 capitalize font-bold text-slate-700 tracking-wide text-lg text-center">{poke.name}</p>
                </Link>
              );
            })}
      </div>

      <div className="flex justify-center items-center gap-4 mt-12">
        <button 
          disabled={offset === 0} 
          onClick={() => setOffset(offset - limit)}
          className="px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 shadow-sm transition"
        >
          ⬅️ หน้าก่อนหน้า
        </button>
        <button 
          disabled={offset + limit >= 1351} 
          onClick={() => setOffset(offset + limit)}
          className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-40 shadow-md shadow-red-500/20 transition"
        >
          หน้าถัดไป ➡️
        </button>
      </div>
    </div>
  );
}