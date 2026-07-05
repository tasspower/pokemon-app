import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';

export default function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokeData = await res.json();
        setPokemon(pokeData);

        const speciesRes = await fetch(pokeData.species.url);
        const speciesData = await speciesRes.json();

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        let chainData = [];
        let currentEvo = evoData.chain;
        while (currentEvo) {
          const evoId = currentEvo.species.url.split('/')[6];
          chainData.push({
            name: currentEvo.species.name,
            id: evoId,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`
          });
          currentEvo = currentEvo.evolves_to[0];
        }

        // 🚨 ดึงข้อมูลสเตตัสทั้งหมด 6 อย่าง + การเติบโต (ส่วนสูง, น้ำหนัก, Base EXP)
        const fullEvolutionChain = await Promise.all(
          chainData.map(async (evo) => {
            try {
              const statRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo.id}`);
              const statData = await statRes.json();
              
              return { 
                ...evo, 
                hp: statData.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
                atk: statData.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
                def: statData.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
                spAtk: statData.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
                spDef: statData.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
                spd: statData.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
                height: statData.height / 10, // แปลงเป็นเมตร
                weight: statData.weight / 10, // แปลงเป็นกิโลกรัม
                baseExp: statData.base_experience
              };
            } catch {
              return { ...evo, hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0, height: 0, weight: 0, baseExp: 0 };
            }
          })
        );

        setEvolution(fullEvolutionChain);

      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl mt-10 flex flex-col md:flex-row gap-8 items-center">
        <Skeleton variant="rectangular" width="100%" height={300} className="rounded-2xl md:w-1/2" animation="wave" />
        <div className="w-full md:w-1/2 space-y-4">
          <Skeleton variant="text" width="40%" height={40} animation="wave" />
          <Skeleton variant="text" width="80%" height={24} animation="wave" />
          <Skeleton variant="rectangular" width="100%" height={100} className="rounded-xl" animation="wave" />
        </div>
      </div>
    );
  }

  if (!pokemon) return <div className="text-center mt-10 font-bold text-red-500">ไม่พบข้อมูลโปเกม่อนตัวนี้</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-xl border border-slate-100 my-10">
      <Link to="/" className="inline-block text-slate-500 hover:text-slate-800 font-bold mb-6 transition">
        ⬅️ กลับหน้าแรก
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 bg-slate-50 rounded-3xl p-6 flex items-center justify-center relative">
          <span className="absolute top-4 left-4 text-2xl font-black text-slate-300 font-mono">
            #{pokemon.id.toString().padStart(4, '0')}
          </span>
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default} 
            alt={pokemon.name} 
            className="w-64 h-64 object-contain transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-4xl font-black capitalize text-slate-800 tracking-wide">{pokemon.name}</h2>
          
          <div className="flex gap-2">
            {pokemon.types.map((t, idx) => (
              <span key={idx} className="px-4 py-1.5 bg-red-100 text-red-600 font-black rounded-xl text-xs uppercase tracking-wider">
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-500 mb-2">🔊 เสียงร้องของโปเกม่อน (Cries)</p>
            {pokemon.cries?.latest ? (
              <audio controls src={pokemon.cries.latest} className="w-full h-8 mt-1"></audio>
            ) : (
              <p className="text-xs text-slate-400">ไม่มีไฟล์เสียงสำหรับตัวนี้</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-500">📊 ค่าพลังพื้นฐาน (Stats ตัวปัจจุบัน)</p>
            {pokemon.stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600 capitalize">
                  <span>{s.stat.name}</span>
                  <span>{s.base_stat}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((s.base_stat / 150) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🧬 ส่วนแสดงสายวิวัฒนาการพร้อมสเตตัสแบบเต็มสตรีม */}
      <div className="mt-12 pt-8 border-t border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 text-center md:text-left">🧬 สายวิวัฒนาการ และสเตตัสเปรียบเทียบ (Evolution Stats)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
          {evolution.map((evo, index) => (
            <div key={index} className="flex flex-col items-center bg-slate-50 p-5 rounded-2xl border border-slate-100 relative group hover:shadow-lg transition-shadow">
              <span className="absolute top-2 right-3 text-xs font-black text-slate-300">ร่าง {index + 1}</span>
              
              <Link to={`/pokemon/${evo.id}`} className="flex flex-col items-center text-decoration-none w-full">
                <div className="w-24 h-24 bg-white rounded-full p-2 flex items-center justify-center group-hover:bg-red-50 transition-colors shadow-sm mb-3">
                  <img src={evo.image} alt={evo.name} className="w-20 h-20 object-contain" />
                </div>
                <p className="text-lg capitalize font-black text-slate-700 group-hover:text-red-500 transition-colors mb-4">{evo.name}</p>
              </Link>

              {/* 📊 บล็อกแสดงสเตตัส 6 อย่าง + ข้อมูลการเติบโต */}
              <div className="w-full pt-4 border-t border-slate-200/60 space-y-2 text-sm text-slate-600 font-medium">
                <div className="flex justify-between"><span>❤️ HP:</span> <span className="font-bold text-emerald-600">{evo.hp}</span></div>
                <div className="flex justify-between"><span>⚔️ ATK:</span> <span className="font-bold text-amber-600">{evo.atk}</span></div>
                <div className="flex justify-between"><span>🛡️ DEF:</span> <span className="font-bold text-blue-600">{evo.def}</span></div>
                <div className="flex justify-between"><span>🔥 SP.ATK:</span> <span className="font-bold text-orange-500">{evo.spAtk}</span></div>
                <div className="flex justify-between"><span>✨ SP.DEF:</span> <span className="font-bold text-indigo-500">{evo.spDef}</span></div>
                <div className="flex justify-between"><span>⚡ SPEED:</span> <span className="font-bold text-pink-500">{evo.spd}</span></div>
                
                {/* ข้อมูลด้านกายภาพและการเติบโต */}
                <div className="pt-2 mt-2 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs"><span>📏 ส่วนสูง:</span> <span className="font-bold text-slate-800">{evo.height} m</span></div>
                  <div className="flex justify-between text-xs"><span>⚖️ น้ำหนัก:</span> <span className="font-bold text-slate-800">{evo.weight} kg</span></div>
                  <div className="flex justify-between text-xs"><span>🌟 Base EXP:</span> <span className="font-bold text-slate-800">{evo.baseExp}</span></div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}