export function WorkArrow({ direction = "up-right" }: { direction?: "down" | "up-right" | "curved" }) {
  const path = direction === "down" ? "M12 4v16m-6-6 6 6 6-6"
    : direction === "curved" ? "M3 5c12-2 5 13 18 11m-5-5 5 5-6 4"
    : "M5 19 19 5M5 5h14v14";
  return <svg className="work-label-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>;
}
