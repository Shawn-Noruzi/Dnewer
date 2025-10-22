import { CreditCard, Scan, Sparkles, Icon as LucideIcon } from "lucide-react";


const iconMap = {
    "credit-card": CreditCard,
    scan: Scan,
    sparkles: Sparkles
} as const;


export type ValueProp = { title: string; desc: string; icon: keyof typeof iconMap };


export function ValueProps({ items }: { items: ValueProp[] }) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {items.map((it) => {
                const Icon = iconMap[it.icon];
                return (
                    <div key={it.title} className="card">
                        <Icon className="h-6 w-6" />
                        <div className="mt-3 font-medium">{it.title}</div>
                        <p className="mt-1 text-sm text-neutral-600">{it.desc}</p>
                    </div>
                );
            })}
        </div>
    );
}