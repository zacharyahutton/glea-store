import { site } from "@/lib/site";

/** One static line, like Loftie's announcement bar (no rotation, not sticky). Real store offers only. */
export function AnnBar() {
  return (
    <div className="abar" role="region" aria-label="Store offers">
      <p>Free US shipping on orders over ${site.freeShippingThreshold} <span aria-hidden="true">·</span> <em>{site.returnDays}-day</em> returns</p>
    </div>
  );
}
