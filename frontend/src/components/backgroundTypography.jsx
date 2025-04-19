import AnimatedWrapper from "./animatedWrapper.jsx";
export default function BackgroundTypography() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedWrapper />
      </div>
    </div>
  );
}
