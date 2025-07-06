import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  DollarSign, 
  Vote,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  MessageSquare,
  Send,
  Megaphone,
  Pin,
  Star,
  AlertCircle,
  Eye,
  MoreVertical,
  Settings,
  UserPlus,
  CreditCard,
  PiggyBank,
  Target,
  Activity,
  Bell,
  FileText
} from "lucide-react";

interface CommunityGroup {
  id: number;
  name: string;
  description: string;
  totalPool: string;
  currency: string;
  nextDisbursement: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CommunityProposal {
  id: number;
  groupId: number;
  proposedBy: string;
  title: string;
  description: string;
  amount: string;
  votesFor: number;
  votesAgainst: number;
  status: string;
  createdAt: string;
}

interface CommunityMessage {
  id: number;
  groupId: number;
  userId: string;
  message: string;
  messageType: string;
  isAnnouncement: boolean;
  isPinned: boolean;
  createdAt: string;
}

interface CommunityAnnouncement {
  id: number;
  groupId: number;
  userId: string;
  title: string;
  content: string;
  priority: string;
  isActive: boolean;
  viewedBy: string[];
  createdAt: string;
}

export default function CommunityTreasury() {
  const [newProposal, setNewProposal] = useState({ title: "", description: "", amount: "" });
  const [newMessage, setNewMessage] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", priority: "normal" });
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [contributionAmount, setContributionAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const { toast } = useToast();

  // Fetch community groups
  const { data: communityGroups = [], isLoading: groupsLoading, refetch: refetchGroups } = useQuery({
    queryKey: ['/api/community/groups'],
    retry: false,
  });

  // Get current group
  const currentGroup = communityGroups[0] as CommunityGroup;

  // Fetch proposals for current group
  const { data: proposals = [], refetch: refetchProposals } = useQuery({
    queryKey: [`/api/community/groups/${currentGroup?.id}/proposals`],
    enabled: !!currentGroup?.id,
    retry: false,
  });

  // Fetch messages for current group
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: [`/api/community/groups/${currentGroup?.id}/messages`],
    enabled: !!currentGroup?.id,
    retry: false,
  });

  // Fetch announcements for current group
  const { data: announcements = [], refetch: refetchAnnouncements } = useQuery({
    queryKey: [`/api/community/groups/${currentGroup?.id}/announcements`],
    enabled: !!currentGroup?.id,
    retry: false,
  });

  // Fetch group members
  const { data: members = [] } = useQuery({
    queryKey: [`/api/community/groups/${currentGroup?.id}/members`],
    enabled: !!currentGroup?.id,
    retry: false,
  });

  // Create proposal mutation
  const createProposalMutation = useMutation({
    mutationFn: async (proposalData: any) => {
      const response = await fetch(`/api/community/groups/${currentGroup.id}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(proposalData),
      });
      if (!response.ok) throw new Error('Failed to create proposal');
      return response.json();
    },
    onSuccess: () => {
      refetchProposals();
      setNewProposal({ title: "", description: "", amount: "" });
      setShowCreateProposal(false);
      toast({ title: "Success", description: "Proposal created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create proposal", variant: "destructive" });
    }
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      const response = await fetch(`/api/community/groups/${currentGroup.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      refetchMessages();
      setNewMessage("");
      toast({ title: "Success", description: "Message sent successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: any) => {
      const response = await fetch(`/api/community/groups/${currentGroup.id}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(announcementData),
      });
      if (!response.ok) throw new Error('Failed to create announcement');
      return response.json();
    },
    onSuccess: () => {
      refetchAnnouncements();
      setNewAnnouncement({ title: "", content: "", priority: "normal" });
      setShowCreateAnnouncement(false);
      toast({ title: "Success", description: "Announcement created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create announcement", variant: "destructive" });
    }
  });

  // Contribution mutation
  const contributeMutation = useMutation({
    mutationFn: async (amount: string) => {
      const response = await fetch(`/api/community/groups/${currentGroup.id}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      if (!response.ok) throw new Error('Failed to process contribution');
      return response.json();
    },
    onSuccess: () => {
      refetchGroups();
      toast({ title: "Success", description: "Contribution processed successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to process contribution", variant: "destructive" });
    }
  });

  // Loan request mutation
  const loanRequestMutation = useMutation({
    mutationFn: async (loanData: any) => {
      const response = await fetch(`/api/community/groups/${currentGroup.id}/loan-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loanData),
      });
      if (!response.ok) throw new Error('Failed to submit loan request');
      return response.json();
    },
    onSuccess: () => {
      refetchProposals();
      toast({ title: "Success", description: "Loan request submitted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit loan request", variant: "destructive" });
    }
  });

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createProposalMutation.mutate({
      title: newProposal.title,
      description: newProposal.description,
      amount: newProposal.amount ? parseFloat(newProposal.amount) : null,
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    createMessageMutation.mutate({
      message: newMessage,
      messageType: 'message',
      isAnnouncement: false,
      isPinned: false
    });
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createAnnouncementMutation.mutate(newAnnouncement);
  };

  const handleContribution = () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount",
        variant: "destructive",
      });
      return;
    }

    contributeMutation.mutate(contributionAmount);
    setContributionAmount("");
  };

  const handleWithdrawal = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    // Create withdrawal proposal for group approval
    createProposalMutation.mutate({
      title: `Withdrawal Request - ${formatCurrency(withdrawalAmount)}`,
      description: `Requesting withdrawal of ${formatCurrency(withdrawalAmount)} from community treasury`,
      amount: withdrawalAmount,
    });
    setWithdrawalAmount("");
  };

  const handleLoanRequest = (loanAmount: string, purpose: string, repaymentPeriod: string) => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid loan amount",
        variant: "destructive",
      });
      return;
    }

    loanRequestMutation.mutate({
      amount: parseFloat(loanAmount),
      purpose,
      repaymentPeriod,
      interestRate: 5.0 // Default interest rate
    });
  };

  const formatCurrency = (amount: string | number, currency: string = 'KES') => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${currency} ${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(207,90%,54%)] mx-auto mb-4"></div>
          <p>Loading community data...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <Link href="/more">
              <Button variant="ghost" className="text-[hsl(207,90%,54%)] p-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h2 className="text-xl font-semibold">Community Treasury</h2>
          </div>
        </div>

        <div className="p-4 text-center">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Community Groups</h3>
          <p className="text-slate-600 mb-6">
            Join or create a community group to start saving together
          </p>
          <Button className="bg-[hsl(207,90%,54%)] text-white">
            Create Group
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6 pt-2">
            <Link href="/more">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-unifi-blue bg-clip-text text-transparent">
              Community Treasury
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">3</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Group Notifications</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">New member joined</p>
                      <p className="text-xs text-slate-600">Mike Kiprotich joined the group • 2 hours ago</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium">Proposal approved</p>
                      <p className="text-xs text-slate-600">Emergency Fund Setup passed with 8 votes • 1 day ago</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium">Contribution reminder</p>
                      <p className="text-xs text-slate-600">Monthly contribution due in 3 days • 2 days ago</p>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Announcements Banner */}
        {announcements.length > 0 && (
          <div className="space-y-2">
            {announcements.slice(0, 2).map((announcement: CommunityAnnouncement) => (
              <Card key={announcement.id} className={`border-l-4 ${getPriorityColor(announcement.priority)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Megaphone className="w-4 h-4" />
                        <span className="font-semibold text-sm">{announcement.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{announcement.content}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(announcement.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Discover Groups Tab */}
          <TabsContent value="discover" className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Discover Communities</h3>
              </div>
              <p className="text-sm text-purple-700">Find and join saving groups that match your goals</p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search groups by name or purpose..."
                className="flex-1"
              />
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available Groups */}
            <div className="space-y-4">
              {/* Public Groups */}
              <Card className="border-green-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Nairobi Emergency Fund</CardTitle>
                      <CardDescription>Community emergency savings group for Nairobi residents</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Open</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Total Pool</p>
                      <p className="font-semibold">KES 2,500,000</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Members</p>
                      <p className="font-semibold">45 active</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Min. Contribution</p>
                      <p className="font-semibold">KES 1,000/month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.8 rating • 6 months active • Location: Nairobi</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Join Group
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">SME Investment Circle</CardTitle>
                      <CardDescription>Small business investment and support group</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Invite Only</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Total Pool</p>
                      <p className="font-semibold">KES 5,800,000</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Members</p>
                      <p className="font-semibold">20 verified</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Min. Investment</p>
                      <p className="font-semibold">KES 10,000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.9 rating • Business verified • Sector: Technology</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Request Invitation
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">University Students Chama</CardTitle>
                      <CardDescription>Student-focused saving and loan group</CardDescription>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Application Required</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Total Pool</p>
                      <p className="font-semibold">KES 890,000</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Members</p>
                      <p className="font-semibold">35 students</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Monthly Contribution</p>
                      <p className="font-semibold">KES 500</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.7 rating • Student ID required • Age: 18-25</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Apply to Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply to Join University Students Chama</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="studentId">Student ID</Label>
                          <Input id="studentId" placeholder="Enter your student ID" />
                        </div>
                        <div>
                          <Label htmlFor="university">University/College</Label>
                          <Input id="university" placeholder="Your institution" />
                        </div>
                        <div>
                          <Label htmlFor="course">Course/Program</Label>
                          <Input id="course" placeholder="Your field of study" />
                        </div>
                        <div>
                          <Label htmlFor="motivation">Why do you want to join?</Label>
                          <Textarea id="motivation" placeholder="Tell us about your saving goals" rows={3} />
                        </div>
                        <Button className="w-full">Submit Application</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Create New Group */}
            <Card className="border-dashed border-2 border-slate-300">
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Can't find the right group?</h3>
                <p className="text-sm text-slate-600 mb-4">Create your own community savings group</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Create New Group</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Community Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="groupName">Group Name</Label>
                        <Input id="groupName" placeholder="Enter group name" />
                      </div>
                      <div>
                        <Label htmlFor="groupDescription">Description</Label>
                        <Textarea id="groupDescription" placeholder="Describe the group's purpose" rows={3} />
                      </div>
                      <div>
                        <Label htmlFor="groupType">Group Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public (Anyone can join)</SelectItem>
                            <SelectItem value="invite">Invite Only</SelectItem>
                            <SelectItem value="application">Application Required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minContribution">Min. Monthly Contribution</Label>
                          <Input id="minContribution" type="number" placeholder="1000" />
                        </div>
                        <div>
                          <Label htmlFor="maxMembers">Max Members</Label>
                          <Input id="maxMembers" type="number" placeholder="50" />
                        </div>
                      </div>
                      <Button className="w-full">Create Group</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Treasury Stats */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-purple-200 text-sm">Total Pool</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(currentGroup.totalPool, currentGroup.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Your Share</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency('15000', currentGroup.currency)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-purple-200 text-sm">Members</p>
                    <p className="text-xl font-semibold">{members.length}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Interest Rate</p>
                    <p className="text-xl font-semibold">8.5% APY</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-purple-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Next Disbursement: {currentGroup.nextDisbursement 
                    ? new Date(currentGroup.nextDisbursement).toLocaleDateString()
                    : 'TBD'}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <PiggyBank className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold">Contribute</p>
                      <p className="text-sm text-slate-500">Add money to pool</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Make Contribution</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contributionAmount">Amount (KES)</Label>
                      <Input
                        id="contributionAmount"
                        type="number"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    <Button 
                      onClick={handleContribution} 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={contributeMutation.isPending}
                    >
                      {contributeMutation.isPending ? "Processing..." : "Contribute"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold">Request Loan</p>
                      <p className="text-sm text-slate-500">Borrow from pool</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Loan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="loanAmount">Loan Amount (KES)</Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        placeholder="Enter loan amount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="loanPurpose">Purpose</Label>
                      <Textarea
                        id="loanPurpose"
                        placeholder="Describe the purpose of the loan"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="repaymentPeriod">Repayment Period</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-month">1 Month</SelectItem>
                          <SelectItem value="3-months">3 Months</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="12-months">12 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-slate-600">
                      Interest rate: 5% per annum. Loan requests require group approval.
                    </p>
                    <Button 
                      onClick={() => {
                        const loanAmount = (document.getElementById('loanAmount') as HTMLInputElement)?.value;
                        const purpose = (document.getElementById('loanPurpose') as HTMLTextAreaElement)?.value;
                        const repaymentPeriod = document.querySelector('[id="repaymentPeriod"]')?.textContent || "3-months";
                        handleLoanRequest(loanAmount, purpose, repaymentPeriod);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={loanRequestMutation.isPending}
                    >
                      {loanRequestMutation.isPending ? "Submitting..." : "Request Loan"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Additional Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 text-center">
                      <Target className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                      <p className="text-sm font-medium">Set Goal</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Savings Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goalAmount">Target Amount (KES)</Label>
                      <Input id="goalAmount" type="number" placeholder="100000" />
                    </div>
                    <div>
                      <Label htmlFor="goalTitle">Goal Title</Label>
                      <Input id="goalTitle" placeholder="Emergency Fund" />
                    </div>
                    <div>
                      <Label htmlFor="goalDeadline">Target Date</Label>
                      <Input id="goalDeadline" type="date" />
                    </div>
                    <Button className="w-full">Set Goal</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-3 text-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">Analytics</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-3 text-center">
                  <Bell className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">Alerts</p>
                </CardContent>
              </Card>
            </div>

            {/* Member List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Members ({members.length})
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Members</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="inviteMethod">Invitation Method</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phone">Phone Number</SelectItem>
                              <SelectItem value="email">Email Address</SelectItem>
                              <SelectItem value="link">Share Invite Link</SelectItem>
                              <SelectItem value="qr">QR Code</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="inviteContact">Contact Information</Label>
                          <Input id="inviteContact" placeholder="Enter phone or email" />
                        </div>
                        <div>
                          <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
                          <Textarea id="inviteMessage" placeholder="Join our savings group..." rows={2} />
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1">Send Invite</Button>
                          <Button variant="outline">Generate Link</Button>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            💡 Tip: Invited members will need to contribute the minimum amount to join
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {members.length > 0 ? (
                  members.map((member: any, index: number) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {member.userId === 'member-1' ? 'JD' : 
                             member.userId === 'member-2' ? 'SM' : 
                             member.userId === 'member-3' ? 'MK' : 'ME'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {member.userId === 'member-1' ? 'John Doe' : 
                             member.userId === 'member-2' ? 'Sarah Mwangi' : 
                             member.userId === 'member-3' ? 'Mike Kiprotich' : 'You'}
                          </p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(member.contribution)}
                        </p>
                        <p className="text-xs text-slate-500">contributed</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-4">No members found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            {/* Messages */}
            <Card className="h-96">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Group Chat
                  </CardTitle>
                  <Dialog open={showCreateAnnouncement} onOpenChange={setShowCreateAnnouncement}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Megaphone className="w-4 h-4 mr-2" />
                        Announce
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Announcement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="announcementTitle">Title</Label>
                          <Input
                            id="announcementTitle"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                            placeholder="Announcement title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="announcementContent">Content</Label>
                          <Textarea
                            id="announcementContent"
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                            placeholder="Announcement content"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleCreateAnnouncement} className="w-full">
                          Create Announcement
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64 px-4">
                  <div className="space-y-3">
                    {messages.length > 0 ? (
                      messages.map((message: CommunityMessage) => (
                        <div key={message.id} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {message.userId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">
                                {message.userId === 'member-1' ? 'John Doe' : 
                                 message.userId === 'member-2' ? 'Sarah Mwangi' : 
                                 message.userId === 'member-3' ? 'Mike Kiprotich' : 'You'}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatDate(message.createdAt)}
                              </span>
                              {message.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-slate-700">{message.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Community Proposals</h3>
              <Dialog open={showCreateProposal} onOpenChange={setShowCreateProposal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Proposal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Proposal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="proposalTitle">Title</Label>
                      <Input
                        id="proposalTitle"
                        value={newProposal.title}
                        onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                        placeholder="Proposal title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="proposalDescription">Description</Label>
                      <Textarea
                        id="proposalDescription"
                        value={newProposal.description}
                        onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                        placeholder="Describe your proposal"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="proposalAmount">Amount (optional)</Label>
                      <Input
                        id="proposalAmount"
                        type="number"
                        value={newProposal.amount}
                        onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
                        placeholder="Enter amount if applicable"
                      />
                    </div>
                    <Button onClick={handleCreateProposal} className="w-full">
                      Create Proposal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {proposals.length > 0 ? (
                proposals.map((proposal: CommunityProposal) => (
                  <Card key={proposal.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold">{proposal.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{proposal.description}</p>
                          {proposal.amount && (
                            <p className="text-sm font-medium text-green-600 mt-1">
                              Amount: {formatCurrency(proposal.amount)}
                            </p>
                          )}
                        </div>
                        <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                          {proposal.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            {proposal.votesFor} for
                          </span>
                          <span className="text-red-600">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            {proposal.votesAgainst} against
                          </span>
                        </div>

                        {proposal.status === 'active' && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Vote For
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Vote Against
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        Proposed on {formatDate(proposal.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Vote className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">No proposals yet. Create the first one!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <PiggyBank className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Mwangi made a contribution</p>
                    <p className="text-xs text-slate-500">2 hours ago • KES 5,000</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Vote className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New proposal: Emergency Fund Setup</p>
                    <p className="text-xs text-slate-500">1 day ago • By John Doe</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Announcement: Monthly meeting scheduled</p>
                    <p className="text-xs text-slate-500">2 days ago • By Admin</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mike Kiprotich joined the group</p>
                    <p className="text-xs text-slate-500">3 days ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Monthly savings goal achieved!</p>
                    <p className="text-xs text-slate-500">1 week ago • KES 100,000 target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
        </div>
      </div>
    </div>
  );
}