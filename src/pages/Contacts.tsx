import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  ChevronDown,
  X,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    role: "VP of Engineering",
    status: "Customer",
    lastActivity: "2 hours ago",
    avatar: null,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@globaltrade.com",
    phone: "+1 (555) 234-5678",
    company: "GlobalTrade Ltd.",
    role: "Chief Technology Officer",
    status: "Lead",
    lastActivity: "1 day ago",
    avatar: null,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@innovatetech.io",
    phone: "+1 (555) 345-6789",
    company: "InnovateTech Solutions",
    role: "Director of Operations",
    status: "Prospect",
    lastActivity: "3 days ago",
    avatar: null,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@summit.co",
    phone: "+1 (555) 456-7890",
    company: "Summit Partners",
    role: "Managing Partner",
    status: "Customer",
    lastActivity: "5 hours ago",
    avatar: null,
  },
  {
    id: 5,
    name: "Jessica Williams",
    email: "j.williams@acme.com",
    phone: "+1 (555) 567-8901",
    company: "Acme Corporation",
    role: "Head of Procurement",
    status: "Lead",
    lastActivity: "1 week ago",
    avatar: null,
  },
  {
    id: 6,
    name: "Robert Martinez",
    email: "r.martinez@nexustech.com",
    phone: "+1 (555) 678-9012",
    company: "Nexus Technologies",
    role: "CEO",
    status: "Customer",
    lastActivity: "2 days ago",
    avatar: null,
  },
];

const statusColors: Record<string, string> = {
  Customer: "bg-success/10 text-success border-success/20",
  Lead: "bg-primary/10 text-primary border-primary/20",
  Prospect: "bg-warning/10 text-warning border-warning/20",
};

const Contacts = () => {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);

  const toggleContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((c) => c.id));
    }
  };

  const handleRowClick = (contact: typeof contacts[0]) => {
    setSelectedContact(contact);
  };

  return (
    <AppLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
              <p className="text-muted-foreground mt-1">
                Manage your contacts and leads in one place.
              </p>
            </div>
            <Button className="gradient-primary shadow-glow">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Contact
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
                placeholder="Search contacts..."
                className="pl-10 bg-card border-border"
              />
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
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedContacts.length === contacts.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact, index) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleRowClick(contact)}
                    className={`group hover:bg-muted/30 transition-colors cursor-pointer border-b border-border last:border-0 ${
                      selectedContact?.id === contact.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContact(contact.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={contact.avatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{contact.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[contact.status]}
                      >
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contact.lastActivity}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                            <DropdownMenuItem>Create Deal</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-6 of 2,847 contacts
            </p>
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
          {selectedContact && (
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
                      {selectedContact.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedContact(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{selectedContact.role}</p>
                    <p className="text-muted-foreground">{selectedContact.company}</p>
                    <p className="text-muted-foreground">{selectedContact.email}</p>
                  </div>

                  <AIInsightsPanel
                    context={{
                      type: 'contact',
                      data: selectedContact,
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

export default Contacts;
