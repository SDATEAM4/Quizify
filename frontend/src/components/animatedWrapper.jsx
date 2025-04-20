export default function AnimatedWrapper() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute whitespace-nowrap animate-marquee text-[20vw] font-black text-black/10 leading-none tracking-wider">
        QUIZIFY QUIZIFY QUIZIFY QUIZIFY QUIZIFY
      </div>
      <div className="absolute whitespace-nowrap animate-marquee-reverse text-[15vw] font-black text-black/10 leading-none tracking-wider mt-[10vw]">
        FAST NUCES FAST NUCES FAST NUCES FAST NUCES
      </div>
    </div>
  );
}
