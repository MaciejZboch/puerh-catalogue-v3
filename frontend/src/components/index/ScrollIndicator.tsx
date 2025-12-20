"use client";

export default function ScrollIndicator() {
  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer absolute bottom-6 left-1/2 -translate-x-1/2 opacity-80"
    >
      <div className="w-6 h-10 border-2 border-white rounded-full flex items-center justify-center">
        <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
      </div>
    </div>
  );
}
