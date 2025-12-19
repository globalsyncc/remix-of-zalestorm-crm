import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Globe,
  Users,
  DollarSign,
  ChevronDown,
  Building2,
  MapPin,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const companies = [
  {
    id: 1,
    name: "TechCorp Inc.",
    industry: "Technology",
    employees: "1,000-5,000",
    revenue: "$50M - $100M",
    location: "San Francisco, CA",
    website: "techcorp.com",
    contacts: 12,
    deals: 3,
    status: "Customer",
  },
  {
    id: 2,
    name: "GlobalTrade Ltd.",
    industry: "Logistics",
    employees: "5,000-10,000",
    revenue: "$100M - $500M",
    location: "London, UK",
    website: "globaltrade.co.uk",
    contacts: 8,
    deals: 2,
    status: "Customer",
  },
  {
    id: 3,
    name: "InnovateTech Solutions",
    industry: "Software",
    employees: "100-500",
    revenue: "$10M - $50M",
    location: "Austin, TX",
    website: "innovatetech.io",
    contacts: 5,
    deals: 1,
    status: "Prospect",
  },
  {
    id: 4,
    name: "Summit Partners",
    industry: "Finance",
    employees: "500-1,000",
    revenue: "$50M - $100M",
    location: "New York, NY",
    website: "summit.co",
    contacts: 6,
    deals: 2,
    status: "Lead",
  },
  {
    id: 5,
    name: "Acme Corporation",
    industry: "Manufacturing",
    employees: "10,000+",
    revenue: "$500M+",
    location: "Chicago, IL",
    website: "acme.com",
    contacts: 15,
    deals: 4,
    status: "Customer",
  },
  {
    id: 6,
    name: "Nexus Technologies",
    industry: "Technology",
    employees: "100-500",
    revenue: "$10M - $50M",
    location: "Seattle, WA",
    website: "nexustech.com",
    contacts: 4,
    deals: 1,
    status: "Prospect",
  },
];

const statusColors: Record<string, string> = {
  Customer: "bg-success/10 text-success border-success/20",
  Lead: "bg-primary/10 text-primary border-primary/20",
  Prospect: "bg-warning/10 text-warning border-warning/20",
};

const industryColors: Record<string, string> = {
  Technology: "bg-primary/10 text-primary",
  Software: "bg-accent/20 text-accent",
  Logistics: "bg-warning/10 text-warning",
  Finance: "bg-success/10 text-success",
  Manufacturing: "bg-muted text-muted-foreground",
};

const Companies = () => {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Companies</h1>
            <p className="text-muted-foreground mt-1">
              Manage your B2B accounts and organizations.
            </p>
          </div>
          <Button className="gradient-primary shadow-glow">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Company
          </Button>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className="w-3 h-3" />
          </Button>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {company.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs mt-1", industryColors[company.industry])}
                    >
                      {company.industry}
                    </Badge>
                  </div>
                </div>
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
                    <DropdownMenuItem>Edit Company</DropdownMenuItem>
                    <DropdownMenuItem>Add Contact</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{company.website}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {company.contacts}
                  </span>
                  <span className="text-xs text-muted-foreground">contacts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {company.deals}
                  </span>
                  <span className="text-xs text-muted-foreground">deals</span>
                </div>
                <Badge
                  variant="outline"
                  className={cn("ml-auto text-xs", statusColors[company.status])}
                >
                  {company.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1-6 of 482 companies</p>
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
    </AppLayout>
  );
};

export default Companies;
