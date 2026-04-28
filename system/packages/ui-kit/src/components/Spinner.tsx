export function Spinner({ size = 16 }: { size?: number }) {
  return <span className="zy-spinner" style={{ width: size, height: size }} aria-hidden />;
}
