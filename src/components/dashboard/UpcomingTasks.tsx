import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
  {
    id: 1,
    title: "Follow up with Sarah Johnson",
    dueDate: "Today, 2:00 PM",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Send proposal to Acme Corp",
    dueDate: "Today, 5:00 PM",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Review contract terms",
    dueDate: "Tomorrow, 10:00 AM",
    priority: "low",
    completed: false,
  },
  {
    id: 4,
    title: "Prepare demo presentation",
    dueDate: "Tomorrow, 3:00 PM",
    priority: "medium",
    completed: true,
  },
];

const priorityColors: Record<string, string> = {
  high: "text-destructive",
  medium: "text-warning",
  low: "text-muted-foreground",
};

export function UpcomingTasks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-card rounded-xl shadow-card border border-border/50"
    >
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Tasks</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Your priorities for today and tomorrow</p>
      </div>

      <div className="divide-y divide-border">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className={cn(
              "flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer",
              task.completed && "opacity-60"
            )}
          >
            <button className="flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate",
                task.completed ? "line-through text-muted-foreground" : "text-foreground"
              )}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{task.dueDate}</span>
              </div>
            </div>

            {!task.completed && task.priority === "high" && (
              <AlertCircle className={cn("w-4 h-4 flex-shrink-0", priorityColors[task.priority])} />
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all tasks →
        </button>
      </div>
    </motion.div>
  );
}
