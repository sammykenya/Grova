import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Plus, 
  DollarSign, 
  Vote,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function CommunityTreasury() {
  const [newProposal, setNewProposal] = useState({ title: "", description: "", amount: "" });
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const { toast } = useToast();

  // Fetch community groups
  const { data: communityGroups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/community/groups'],
    retry: false,
  });

  // Fetch group members (using first group for demo)
  const groupId = communityGroups[0]?.id;
  const { data: members = [] } = useQuery({
    queryKey: ['/api/community/groups', groupId, 'members'],
    enabled: !!groupId,
    retry: false,
  });

  // Fetch proposals
  const { data: proposals = [] } = useQuery({
    queryKey: ['/api/community/groups', groupId, 'proposals'],
    enabled: !!groupId,
    retry: false,
  });

  // Create proposal mutation
  const createProposalMutation = useMutation({
    mutationFn: async (proposalData: any) => {
      await apiRequest('POST', `/api/community/groups/${groupId}/proposals`, proposalData);
    },
    onSuccess: () => {
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted for voting",
      });
      setNewProposal({ title: "", description: "", amount: "" });
      setShowCreateProposal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/community/groups', groupId, 'proposals'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive",
      });
    },
  });

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.title || !newProposal.description) {
      toast({
        title: "Invalid Input",
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

  const formatCurrency = (amount: string | number, currency: string = 'KES') => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${currency} ${num.toLocaleString()}`;
  };

  const currentGroup = communityGroups[0];

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
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <Link href="/">
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" className="text-[hsl(207,90%,54%)] p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-semibold">{currentGroup.name}</h2>
            <p className="text-sm text-slate-500">Community Treasury</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Treasury Stats */}
        <Card className="community-gradient text-white">
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
            <div className="flex items-center text-sm text-purple-200">
              <Calendar className="w-4 h-4 mr-2" />
              Next Disbursement: {currentGroup.nextDisbursement 
                ? new Date(currentGroup.nextDisbursement).toLocaleDateString()
                : 'TBD'}
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Members ({members.length})</h3>
              <Button variant="outline" className="text-[hsl(207,90%,54%)] text-sm">
                Invite
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {members.slice(0, 7).map((member: any, index: number) => (
                <div key={member.id} className="text-center">
                  <Avatar className="w-12 h-12 mx-auto mb-1">
                    <AvatarFallback>
                      {`M${index + 1}`}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-slate-600">Member {index + 1}</p>
                </div>
              ))}
              {members.length > 7 && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <span className="text-xs text-slate-600">+{members.length - 7}</span>
                  </div>
                  <p className="text-xs text-slate-600">More</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button className="bg-green-600 text-white py-3 rounded-xl font-medium h-auto flex flex-col space-y-1">
            <Plus className="w-5 h-5" />
            <span className="text-sm">Contribute</span>
          </Button>
          <Button className="bg-blue-600 text-white py-3 rounded-xl font-medium h-auto flex flex-col space-y-1">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Request Loan</span>
          </Button>
          <Dialog open={showCreateProposal} onOpenChange={setShowCreateProposal}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 text-white py-3 rounded-xl font-medium h-auto flex flex-col space-y-1">
                <Vote className="w-5 h-5" />
                <span className="text-sm">Propose</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Proposal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProposal} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Solar lamp project"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your proposal..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (optional)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newProposal.amount}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={createProposalMutation.isPending}
                  className="w-full bg-[hsl(207,90%,54%)] text-white"
                >
                  {createProposalMutation.isPending ? 'Creating...' : 'Create Proposal'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recent Proposals */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Recent Proposals</h3>
            <div className="space-y-3">
              {proposals.length > 0 ? (
                proposals.map((proposal: any) => (
                  <div key={proposal.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{proposal.title}</p>
                      <p className="text-xs text-slate-500">
                        Proposed {new Date(proposal.createdAt).toLocaleDateString()}
                        {proposal.amount && ` • ${formatCurrency(proposal.amount, currentGroup.currency)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {proposal.status === 'approved' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-600" />
                        )}
                        <p className="text-sm font-medium">
                          {proposal.votesFor} votes
                        </p>
                      </div>
                      <Badge 
                        variant={proposal.status === 'approved' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-4">
                  <Vote className="w-8 h-8 mx-auto mb-2" />
                  <p>No proposals yet</p>
                  <p className="text-xs">Create the first proposal for your group</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
