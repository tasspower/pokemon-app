export default function About() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 my-10 text-center">
      <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-4xl mb-4 shadow-inner">
        🧑‍💻
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">About This Project</h2>
      <p className="text-slate-500 mb-6 text-sm">ระบบค้นหาและแสดงข้อมูลโปเกม่อนอัจฉริยะ (PokeAPI)</p>
      
      <hr className="border-slate-100 my-4" />
      
      <div className="space-y-4 text-left max-w-md mx-auto my-6 text-slate-700 font-medium">
        <div className="flex justify-between"><span className="text-slate-400">ผู้พัฒนา:</span> <span>[นาย ณัฐพัชร ศิริวราพัฒน์]</span></div>
        <div className="flex justify-between"><span className="text-slate-400">รหัสนักศึกษา:</span> <span className="font-mono">[ 673450035-6]</span></div>
        <div className="flex justify-between"><span className="text-slate-400">รายวิชา:</span> <span>[69/IN403101 การพัฒนาโปรแกรมเว็บระบบหน้าบ้าน]</span></div>
        <div className="flex justify-between"><span className="text-slate-400">หลักสูตร:</span> <span>[(วิทยาการคอมพิวเตอร์)]</span></div>
        <div className="flex justify-between"><span className="text-slate-400">มหาวิทยาลัย:</span> <span>[มหาวิทยาลัยขอนแก่น]</span></div>
      </div>

      <hr className="border-slate-100 my-4" />

      <a 
        href="https://github.com/tasspower/pokemon-app.git" // เดี๋ยวเราค่อยมาเปลี่ยนเป็นลิงก์จริงตอนอัปขึ้นกิตฮับครับ
        target="_blank" 
        rel="noreferrer"
        className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
      >
        🐙 ลิงก์ไปยัง GitHub Source Code
      </a>
    </div>
  );
}