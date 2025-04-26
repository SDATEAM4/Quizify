export default function AnimatedWrapper() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Horizontal marquee - top */}
      <div className="absolute whitespace-nowrap animate-marquee text-[20vw] font-black text-black/10 leading-none tracking-wider">
        QUIZIFY QUIZIFY QUIZIFY QUIZIFY QUIZIFY
      </div>
      
      {/* Reverse horizontal marquee - middle */}
      <div className="absolute whitespace-nowrap animate-marquee-reverse text-[15vw] font-black text-black/10 leading-none tracking-wider mt-[10vw]">
        FAST NUCES FAST NUCES FAST NUCES FAST NUCES
      </div>

      {/* Vertical scrolling text - right side */}
      <div className="absolute right-[5vw] top-0 h-full flex items-center">
        <div className="animate-vertical-scroll whitespace-nowrap transform rotate-90 text-[10vw] font-black text-black/10 tracking-wider">
          QUIZIFY FAST NUCES QUIZIFY FAST NUCES
        </div>
      </div>
      
    </div>
  );
}