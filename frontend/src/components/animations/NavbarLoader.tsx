export function NavbarLoader() {
  return (
    <div className="relative w-4 h-4">
      <div className="absolute inset-0 rounded-full border border-green-accent/30"></div>
      <div className="absolute inset-0 animate-orbit">
        <div className="w-1.5 h-1.5 rounded-full bg-green-accent absolute -top-0.5 left-1/2 transform -translate-x-1/2"></div>
      </div>
    </div>
  );
}
