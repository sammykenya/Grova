
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  Award, 
  Users, 
  MessageSquare,
  Video,
  Phone,
  DollarSign,
  CheckCircle,
  User,
  BookOpen,
  TrendingUp,
  Target,
  Briefcase,
  Globe
} from "lucide-react";

interface Mentor {
  id: number;
  userId: string;
  expertise: string[];
  experienceYears: number;
  hourlyRate: number;
  availability: string;
  bio: string;
  rating: number;
  totalSessions: number;
  status: string;
  createdAt: string;
  name?: string;
  email?: string;
}

interface MentorshipSession {
  id: number;
  mentorId: number;
  menteeId: string;
  sessionDate: string;
  durationMinutes: number;
  topic: string;
  status: string;
  notes: string;
  createdAt: string;
}

export default function Mentorship() {
  const [activeTab, setActiveTab] = useState("find");
  const [showBookSession, setShowBookSession] = useState(false);
  const [showBecomeMentor, setShowBecomeMentor] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [sessionData, setSessionData] = useState({
    date: "",
    time: "",
    duration: "60",
    topic: ""
  });
  const [mentorData, setMentorData] = useState({
    expertise: "",
    experienceYears: "",
    hourlyRate: "",
    availability: "",
    bio: ""
  });
  const { toast } = useToast();

  // Fetch mentors
  const { data: mentors = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/mentors'],
    retry: false,
  });

  // Fetch user's mentorship sessions
  const { data: sessions = [], refetch: refetchSessions } = useQuery({
    queryKey: ['/api/mentorship/sessions'],
    retry: false,
  });

  // Book session mutation
  const bookSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch('/api/mentorship/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) throw new Error('Failed to book session');
      return response.json();
    },
    onSuccess: () => {
      refetchSessions();
      setShowBookSession(false);
      setSessionData({ date: "", time: "", duration: "60", topic: "" });
      toast({ title: "Success", description: "Session booked successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to book session", variant: "destructive" });
    }
  });

  // Become mentor mutation
  const becomeMentorMutation = useMutation({
    mutationFn: async (mentorData: any) => {
      const response = await fetch('/api/mentors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mentorData),
      });
      if (!response.ok) throw new Error('Failed to register as mentor');
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setShowBecomeMentor(false);
      setMentorData({ expertise: "", experienceYears: "", hourlyRate: "", availability: "", bio: "" });
      toast({ title: "Success", description: "You've been registered as a mentor!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to register as mentor", variant: "destructive" });
    }
  });

  const handleBookSession = () => {
    if (!sessionData.date || !sessionData.time || !sessionData.topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const sessionDateTime = new Date(`${sessionData.date}T${sessionData.time}`);
    
    bookSessionMutation.mutate({
      mentorId: selectedMentor?.id,
      sessionDate: sessionDateTime.toISOString(),
      durationMinutes: parseInt(sessionData.duration),
      topic: sessionData.topic
    });
  };

  const handleBecomeMentor = () => {
    if (!mentorData.expertise || !mentorData.experienceYears || !mentorData.hourlyRate || !mentorData.bio) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    becomeMentorMutation.mutate({
      expertise: mentorData.expertise.split(',').map(e => e.trim()),
      experienceYears: parseInt(mentorData.experienceYears),
      hourlyRate: parseFloat(mentorData.hourlyRate),
      availability: mentorData.availability,
      bio: mentorData.bio
    });
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading mentorship data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/founders-room">
              <Button variant="ghost" className="text-blue-600 p-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold">Mentorship</h2>
              <p className="text-sm text-slate-500">Connect with industry experts</p>
            </div>
          </div>
          <Dialog open={showBecomeMentor} onOpenChange={setShowBecomeMentor}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Award className="w-4 h-4 mr-2" />
                Become Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Become a Mentor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <Input
                    id="expertise"
                    value={mentorData.expertise}
                    onChange={(e) => setMentorData({...mentorData, expertise: e.target.value})}
                    placeholder="e.g., Tech, Business, Marketing (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={mentorData.experienceYears}
                    onChange={(e) => setMentorData({...mentorData, experienceYears: e.target.value})}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Hourly Rate (KES)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={mentorData.hourlyRate}
                    onChange={(e) => setMentorData({...mentorData, hourlyRate: e.target.value})}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select onValueChange={(value) => setMentorData({...mentorData, availability: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={mentorData.bio}
                    onChange={(e) => setMentorData({...mentorData, bio: e.target.value})}
                    placeholder="Tell us about your background and what you can offer..."
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleBecomeMentor} 
                  className="w-full"
                  disabled={becomeMentorMutation.isPending}
                >
                  {becomeMentorMutation.isPending ? "Registering..." : "Register as Mentor"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="find">Find Mentors</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* Find Mentors Tab */}
          <TabsContent value="find" className="space-y-4">
            <div className="grid gap-4">
              {mentors.length > 0 ? (
                mentors.map((mentor: Mentor) => (
                  <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {mentor.name ? mentor.name.split(' ').map(n => n[0]).join('') : 'M'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{mentor.name || 'Mentor'}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-slate-600">{mentor.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {mentor.expertise.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3">{mentor.bio}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {mentor.experienceYears} years
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {formatCurrency(mentor.hourlyRate)}/hr
                              </span>
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {mentor.totalSessions} sessions
                              </span>
                            </div>
                            
                            <Dialog open={showBookSession} onOpenChange={setShowBookSession}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => setSelectedMentor(mentor)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Book Session
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Book Mentorship Session</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="sessionDate">Date</Label>
                                      <Input
                                        id="sessionDate"
                                        type="date"
                                        value={sessionData.date}
                                        onChange={(e) => setSessionData({...sessionData, date: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="sessionTime">Time</Label>
                                      <Input
                                        id="sessionTime"
                                        type="time"
                                        value={sessionData.time}
                                        onChange={(e) => setSessionData({...sessionData, time: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Select onValueChange={(value) => setSessionData({...sessionData, duration: value})}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="60">60 minutes</SelectItem>
                                        <SelectItem value="90">90 minutes</SelectItem>
                                        <SelectItem value="120">120 minutes</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="topic">Session Topic</Label>
                                    <Textarea
                                      id="topic"
                                      value={sessionData.topic}
                                      onChange={(e) => setSessionData({...sessionData, topic: e.target.value})}
                                      placeholder="What would you like to discuss?"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600">
                                      <strong>Total Cost:</strong> {formatCurrency(mentor.hourlyRate * (parseInt(sessionData.duration) / 60))}
                                    </p>
                                  </div>
                                  <Button 
                                    onClick={handleBookSession} 
                                    className="w-full"
                                    disabled={bookSessionMutation.isPending}
                                  >
                                    {bookSessionMutation.isPending ? "Booking..." : "Book Session"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Mentors Available</h3>
                  <p className="text-slate-600">Be the first to register as a mentor!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* My Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="space-y-3">
              {sessions.length > 0 ? (
                sessions.map((session: MentorshipSession) => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{session.topic}</h4>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(session.sessionDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {session.durationMinutes} minutes
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-2 p-2 bg-slate-50 rounded">
                          <p className="text-sm">{session.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Sessions Yet</h3>
                  <p className="text-slate-600">Book your first mentorship session to get started!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    My Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Sessions Completed</span>
                      <span className="font-semibold">{sessions.filter(s => s.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Hours</span>
                      <span className="font-semibold">
                        {sessions.reduce((total, s) => total + (s.durationMinutes / 60), 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Target</span>
                      <span className="font-semibold">4 sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Progress</span>
                      <span className="font-semibold text-green-600">75%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
