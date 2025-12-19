import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  icon: ReactNode;
  className?: string;
  delay?: number;
}

export function StatsCard({ title, value, change, icon, className, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border/50",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              {change.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-success" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  change.trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {change.value}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
