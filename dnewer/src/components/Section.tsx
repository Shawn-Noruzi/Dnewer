import { clsx } from "clsx";


export function Section({ className, children }: { className?: string; children: React.ReactNode }) {
return <section className={clsx("section", className)}><div className="container">{children}</div></section>;
}
