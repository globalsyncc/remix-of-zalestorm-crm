import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const deals = [
  {
    id: 1,
    name: "Enterprise License",
    company: "TechCorp Inc.",
    value: "$250,000",
    stage: "Negotiation",
    probability: 80,
    owner: { name: "Sarah M.", initials: "SM" },
  },
  {
    id: 2,
    name: "Platform Integration",
    company: "GlobalTrade Ltd.",
    value: "$180,000",
    stage: "Proposal",
    probability: 60,
    owner: { name: "John D.", initials: "JD" },
  },
  {
    id: 3,
    name: "Annual Contract",
    company: "InnovateTech",
    value: "$150,000",
    stage: "Qualified",
    probability: 45,
    owner: { name: "Emily R.", initials: "ER" },
  },
  {
    id: 4,
    name: "Custom Solution",
    company: "Summit Partners",
    value: "$320,000",
    stage: "Negotiation",
    probability: 75,
    owner: { name: "Mike T.", initials: "MT" },
  },
];

const stageColors: Record<string, string> = {
  Lead: "bg-muted text-muted-foreground",
  Qualified: "bg-primary/10 text-primary",
  Proposal: "bg-warning/10 text-warning",
  Negotiation: "bg-accent/20 text-accent",
  "Closed Won": "bg-success/10 text-success",
};

export function TopDeals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-xl shadow-card border border-border/50"
    >
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Top Deals</h3>
        <p className="text-sm text-muted-foreground mt-0.5">High-value opportunities to focus on</p>
      </div>

      <div className="divide-y divide-border">
        {deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-secondary">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">{deal.name}</p>
                  <Badge variant="secondary" className={cn("text-xs", stageColors[deal.stage])}>
                    {deal.stage}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{deal.company}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">{deal.value}</p>
                <p className="text-xs text-muted-foreground">{deal.probability}% probability</p>
              </div>

              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {deal.owner.initials}
                </AvatarFallback>
              </Avatar>

              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all deals →
        </button>
      </div>
    </motion.div>
  );
}
