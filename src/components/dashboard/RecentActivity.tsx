import { motion } from "framer-motion";
import { Phone, Mail, FileText, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "call",
    icon: Phone,
    title: "Call with Sarah Johnson",
    company: "TechCorp Inc.",
    time: "10 min ago",
    status: "completed",
  },
  {
    id: 2,
    type: "email",
    icon: Mail,
    title: "Proposal sent to Acme Corp",
    company: "Acme Corporation",
    time: "25 min ago",
    status: "sent",
  },
  {
    id: 3,
    type: "meeting",
    icon: Calendar,
    title: "Demo scheduled with InnovateTech",
    company: "InnovateTech Solutions",
    time: "1 hour ago",
    status: "upcoming",
  },
  {
    id: 4,
    type: "note",
    icon: MessageSquare,
    title: "Notes added for GlobalTrade deal",
    company: "GlobalTrade Ltd.",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 5,
    type: "document",
    icon: FileText,
    title: "Contract uploaded for review",
    company: "Summit Partners",
    time: "3 hours ago",
    status: "pending",
  },
];

const iconColors: Record<string, string> = {
  call: "bg-success/10 text-success",
  email: "bg-primary/10 text-primary",
  meeting: "bg-warning/10 text-warning",
  note: "bg-accent/20 text-accent",
  document: "bg-muted text-muted-foreground",
};

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl shadow-card border border-border/50"
    >
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Latest interactions across your team</p>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className={cn("p-2.5 rounded-lg", iconColors[activity.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.company}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </motion.div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all activity →
        </button>
      </div>
    </motion.div>
  );
}
