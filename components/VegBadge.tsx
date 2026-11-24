export function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      role="img"
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={`inline-grid h-4 w-4 place-items-center rounded-sm border-2 ${
        isVeg ? "border-olive" : "border-terracotta-deep"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isVeg ? "bg-olive" : "bg-terracotta-deep"}`} />
    </span>
  );
}
