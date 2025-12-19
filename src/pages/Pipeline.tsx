import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Building2, DollarSign, User } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  probability: number;
  owner: { name: string; initials: string };
  daysInStage: number;
}

interface Stage {
  id: string;
  name: string;
  deals: Deal[];
  color: string;
}

const initialStages: Stage[] = [
  {
    id: "lead",
    name: "Lead",
    color: "bg-muted-foreground",
    deals: [
      {
        id: 1,
        name: "Website Redesign",
        company: "StartupXYZ",
        value: 45000,
        probability: 20,
        owner: { name: "John D.", initials: "JD" },
        daysInStage: 3,
      },
      {
        id: 2,
        name: "Mobile App",
        company: "TechStart",
        value: 75000,
        probability: 15,
        owner: { name: "Sarah M.", initials: "SM" },
        daysInStage: 1,
      },
    ],
  },
  {
    id: "qualified",
    name: "Qualified",
    color: "bg-primary",
    deals: [
      {
        id: 3,
        name: "Enterprise License",
        company: "TechCorp Inc.",
        value: 250000,
        probability: 45,
        owner: { name: "Emily R.", initials: "ER" },
        daysInStage: 7,
      },
      {
        id: 4,
        name: "API Integration",
        company: "DataFlow",
        value: 120000,
        probability: 50,
        owner: { name: "Mike T.", initials: "MT" },
        daysInStage: 5,
      },
      {
        id: 5,
        name: "Cloud Migration",
        company: "LegacyCorp",
        value: 180000,
        probability: 40,
        owner: { name: "John D.", initials: "JD" },
        daysInStage: 12,
      },
    ],
  },
  {
    id: "proposal",
    name: "Proposal",
    color: "bg-warning",
    deals: [
      {
        id: 6,
        name: "Platform Integration",
        company: "GlobalTrade Ltd.",
        value: 180000,
        probability: 60,
        owner: { name: "Sarah M.", initials: "SM" },
        daysInStage: 4,
      },
      {
        id: 7,
        name: "Annual Contract",
        company: "InnovateTech",
        value: 150000,
        probability: 55,
        owner: { name: "Emily R.", initials: "ER" },
        daysInStage: 2,
      },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    color: "bg-accent",
    deals: [
      {
        id: 8,
        name: "Custom Solution",
        company: "Summit Partners",
        value: 320000,
        probability: 75,
        owner: { name: "Mike T.", initials: "MT" },
        daysInStage: 8,
      },
      {
        id: 9,
        name: "Security Suite",
        company: "SecureBank",
        value: 420000,
        probability: 80,
        owner: { name: "John D.", initials: "JD" },
        daysInStage: 3,
      },
    ],
  },
  {
    id: "closed",
    name: "Closed Won",
    color: "bg-success",
    deals: [
      {
        id: 10,
        name: "Data Analytics",
        company: "InsightCo",
        value: 195000,
        probability: 100,
        owner: { name: "Sarah M.", initials: "SM" },
        daysInStage: 0,
      },
    ],
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Pipeline = () => {
  const [stages] = useState<Stage[]>(initialStages);

  const getStageTotal = (deals: Deal[]) => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 h-[calc(100vh-4rem)] flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              Visualize and manage your deals through every stage.
            </p>
          </div>
          <Button className="gradient-primary shadow-glow">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Deal
          </Button>
        </div>

        {/* Pipeline Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {stages.map((stage, stageIndex) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stageIndex * 0.1 }}
                className="w-80 flex flex-col bg-muted/30 rounded-xl border border-border/50"
              >
                {/* Stage Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                      <h3 className="font-semibold text-foreground">{stage.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {stage.deals.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {formatCurrency(getStageTotal(stage.deals))}
                  </p>
                </div>

                {/* Deals */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {stage.deals.map((deal, dealIndex) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: stageIndex * 0.1 + dealIndex * 0.05 }}
                      className="bg-card rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group border border-border/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-foreground text-sm leading-tight">
                          {deal.name}
                        </h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                            <DropdownMenuItem>Move to Stage</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">{deal.company}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-success" />
                          <span className="text-sm font-semibold text-foreground">
                            {formatCurrency(deal.value)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0 bg-muted/50"
                          >
                            {deal.probability}%
                          </Badge>
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {deal.owner.initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {deal.daysInStage > 7 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-warning flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                            {deal.daysInStage} days in stage
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Pipeline;
