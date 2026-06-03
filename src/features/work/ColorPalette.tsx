type Props = {
  palettes: Array<{ name: string; hex: string }>;
};

export function ColorPalette({ palettes }: Props) {
  if (!palettes.length) return null;

  return (
    <div className="overflow-hidden rounded-2xs">
      {palettes.map((palette) => (
        <div
          key={palette.name}
          className="flex items-center px-6 h-16"
          style={{ backgroundColor: palette.hex }}
        >
          <span className="text-xl text-white">{palette.name}</span>
        </div>
      ))}
    </div>
  );
}
