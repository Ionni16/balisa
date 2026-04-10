import { Order } from "@/lib/types";

export function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<string, string> = {
    pending: "bg-white/10 text-white/50",
    paid: "bg-blue-900/50 text-blue-300",
    shipped: "bg-yellow-900/50 text-yellow-300",
    delivered: "bg-green-900/50 text-green-300",
    cancelled: "bg-red-900/50 text-red-300",
  };
  const labels: Record<string, string> = {
    pending: "In attesa",
    paid: "Pagato",
    shipped: "Spedito",
    delivered: "Consegnato",
    cancelled: "Annullato",
  };
  return (
    <span className={`font-sans text-xs px-2.5 py-1 uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}