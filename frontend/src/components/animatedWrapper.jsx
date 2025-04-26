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
      
      {/* Diagonal marquee - top right to bottom left */}
      <div className="absolute whitespace-nowrap animate-diagonal-tl text-[12vw] font-black text-black/10 leading-none tracking-wider right-0 -top-[5vw]">
        QUIZIFY FAST QUIZIFY FAST
      </div>
      
      {/* Diagonal marquee - bottom left to top right */}
      <div className="absolute whitespace-nowrap animate-diagonal-br text-[12vw] font-black text-black/10 leading-none tracking-wider left-0 bottom-0">
        NUCES QUIZ NUCES QUIZ
      </div>
      
      {/* Vertical scrolling text - right side */}
      <div className="absolute right-[5vw] top-0 h-full flex items-center">
        <div className="animate-vertical-scroll whitespace-nowrap transform rotate-90 text-[10vw] font-black text-black/10 tracking-wider">
          QUIZIFY FAST NUCES QUIZIFY FAST NUCES
        </div>
      </div>
      
      {/* Pulsing text - center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-text">
        <p className="text-[8vw] font-black text-black/10 text-center">QUIZ</p>
      </div>
    </div>
  );
}