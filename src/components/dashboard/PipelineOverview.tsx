import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const stages = [
  { name: "Lead", count: 24, value: "$120,000", color: "bg-muted-foreground" },
  { name: "Qualified", count: 18, value: "$340,000", color: "bg-primary" },
  { name: "Proposal", count: 12, value: "$580,000", color: "bg-warning" },
  { name: "Negotiation", count: 8, value: "$420,000", color: "bg-accent" },
  { name: "Closed Won", count: 15, value: "$890,000", color: "bg-success" },
];

const totalValue = stages.reduce((sum, stage) => {
  const value = parseInt(stage.value.replace(/[$,]/g, ""));
  return sum + value;
}, 0);

export function PipelineOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card rounded-xl shadow-card border border-border/50"
    >
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pipeline Overview</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Deal value by stage</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${(totalValue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground">Total pipeline</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Progress bar */}
        <div className="flex h-3 rounded-full overflow-hidden bg-muted mb-6">
          {stages.map((stage, index) => {
            const value = parseInt(stage.value.replace(/[$,]/g, ""));
            const percentage = (value / totalValue) * 100;
            return (
              <motion.div
                key={stage.name}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className={cn(stage.color, "first:rounded-l-full last:rounded-r-full")}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-5 gap-3">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <div className={cn("w-2.5 h-2.5 rounded-full", stage.color)} />
                <span className="text-xs font-medium text-muted-foreground">{stage.name}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{stage.count}</p>
              <p className="text-xs text-muted-foreground">{stage.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
