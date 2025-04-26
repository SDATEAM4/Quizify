// BackgroundTypography.jsx
import AnimatedWrapper from "./animatedWrapper.jsx";

export default function BackgroundTypography() {
  return (
    <div className="fixed inset-0 min-h-screen mt-[100px] overflow-hidden pointer-events-none">
      <AnimatedWrapper />
    </div>
  );
}