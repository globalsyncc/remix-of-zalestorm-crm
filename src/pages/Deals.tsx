import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Building2,
  Calendar,
  TrendingUp,
  ChevronDown,
  ArrowUpRight,
  X,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel";
import { cn } from "@/lib/utils";

const deals = [
  {
    id: 1,
    name: "Enterprise License",
    company: "TechCorp Inc.",
    value: 250000,
    stage: "Negotiation",
    probability: 80,
    closeDate: "2024-02-15",
    owner: { name: "Sarah Miller", initials: "SM" },
    createdAt: "2024-01-05",
  },
  {
    id: 2,
    name: "Platform Integration",
    company: "GlobalTrade Ltd.",
    value: 180000,
    stage: "Proposal",
    probability: 60,
    closeDate: "2024-02-28",
    owner: { name: "John Doe", initials: "JD" },
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Annual Contract",
    company: "InnovateTech Solutions",
    value: 150000,
    stage: "Qualified",
    probability: 45,
    closeDate: "2024-03-15",
    owner: { name: "Emily Rodriguez", initials: "ER" },
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    name: "Custom Solution",
    company: "Summit Partners",
    value: 320000,
    stage: "Negotiation",
    probability: 75,
    closeDate: "2024-02-20",
    owner: { name: "Mike Thompson", initials: "MT" },
    createdAt: "2024-01-08",
  },
  {
    id: 5,
    name: "Security Suite",
    company: "SecureBank Corp",
    value: 420000,
    stage: "Proposal",
    probability: 65,
    closeDate: "2024-03-01",
    owner: { name: "Sarah Miller", initials: "SM" },
    createdAt: "2024-01-15",
  },
  {
    id: 6,
    name: "Cloud Migration",
    company: "LegacyCorp",
    value: 180000,
    stage: "Lead",
    probability: 25,
    closeDate: "2024-04-01",
    owner: { name: "John Doe", initials: "JD" },
    createdAt: "2024-01-18",
  },
];

const stageColors: Record<string, string> = {
  Lead: "bg-muted text-muted-foreground",
  Qualified: "bg-primary/10 text-primary",
  Proposal: "bg-warning/10 text-warning",
  Negotiation: "bg-accent/20 text-accent",
  "Closed Won": "bg-success/10 text-success",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Deals = () => {
  const [selectedDeal, setSelectedDeal] = useState<typeof deals[0] | null>(null);

  const handleRowClick = (deal: typeof deals[0]) => {
    setSelectedDeal(deal);
  };

  return (
    <AppLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Deals</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage all your sales opportunities.
              </p>
            </div>
            <Button className="gradient-primary shadow-glow">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Deal
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50"
            >
              <p className="text-sm text-muted-foreground">Total Pipeline</p>
              <p className="text-2xl font-bold text-foreground mt-1">$2.35M</p>
              <div className="flex items-center gap-1 mt-1 text-success text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>12.5% vs last month</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50"
            >
              <p className="text-sm text-muted-foreground">Active Deals</p>
              <p className="text-2xl font-bold text-foreground mt-1">127</p>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>23 closing this month</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50"
            >
              <p className="text-sm text-muted-foreground">Avg. Deal Size</p>
              <p className="text-2xl font-bold text-foreground mt-1">$185K</p>
              <div className="flex items-center gap-1 mt-1 text-success text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>8.2% increase</span>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search deals..." className="pl-10 bg-card border-border" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-3 h-3" />
            </Button>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Deal</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Close Date</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal, index) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => handleRowClick(deal)}
                    className={`group hover:bg-muted/30 transition-colors cursor-pointer border-b border-border last:border-0 ${
                      selectedDeal?.id === deal.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{deal.name}</p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{deal.company}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(deal.value)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", stageColors[deal.stage])}>
                        {deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={deal.probability} className="w-16 h-1.5" />
                        <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(deal.closeDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {deal.owner.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{deal.owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                          <DropdownMenuItem>Move Stage</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing 1-6 of 127 deals</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <AnimatePresence>
          {selectedDeal && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="border-l border-border bg-card overflow-hidden"
            >
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {selectedDeal.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDeal(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valeur</span>
                      <span className="font-semibold">{formatCurrency(selectedDeal.value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Probabilité</span>
                      <span className="font-semibold">{selectedDeal.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stage</span>
                      <Badge variant="secondary" className={cn("text-xs", stageColors[selectedDeal.stage])}>
                        {selectedDeal.stage}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{selectedDeal.company}</p>
                  </div>

                  <AIInsightsPanel
                    context={{
                      type: 'deal',
                      data: selectedDeal,
                    }}
                  />
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Deals;
