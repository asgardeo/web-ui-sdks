'use client';

import {useAuth} from '@/hooks/use-auth';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Users, MessageSquare, Calendar, FileText, TrendingUp, Clock, CheckCircle2, AlertCircle} from 'lucide-react';
import {redirect} from 'next/navigation';
import {useEffect} from 'react';
import {Header} from '@/components/Header/Header';

export default function DashboardPage() {
  const {user, currentOrg, isAuthenticated, isLoading} = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      name: 'Active Projects',
      value: '12',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: FileText,
    },
    {
      name: 'Team Members',
      value: currentOrg?.memberCount.toString() || '0',
      change: '+5.4%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      name: 'Messages Today',
      value: '89',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: MessageSquare,
    },
    {
      name: 'Meetings This Week',
      value: '7',
      change: '-2.3%',
      changeType: 'negative' as const,
      icon: Calendar,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'Sarah Chen',
      action: 'completed task "Design Review"',
      time: '2 hours ago',
      type: 'completed',
    },
    {
      id: 2,
      user: 'Mike Johnson',
      action: 'created new project "Mobile App"',
      time: '4 hours ago',
      type: 'created',
    },
    {
      id: 3,
      user: 'Emily Davis',
      action: 'scheduled team meeting',
      time: '6 hours ago',
      type: 'scheduled',
    },
    {
      id: 4,
      user: 'Alex Rodriguez',
      action: 'uploaded 3 files to "Q4 Planning"',
      time: '1 day ago',
      type: 'uploaded',
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Review quarterly reports',
      dueDate: 'Today, 3:00 PM',
      priority: 'high' as const,
      project: 'Q4 Planning',
    },
    {
      id: 2,
      title: 'Team standup meeting',
      dueDate: 'Tomorrow, 9:00 AM',
      priority: 'medium' as const,
      project: 'Daily Operations',
    },
    {
      id: 3,
      title: 'Client presentation prep',
      dueDate: 'Friday, 2:00 PM',
      priority: 'high' as const,
      project: 'Client Work',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with {currentOrg?.name} today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp
                      className={`h-3 w-3 mr-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}
                    />
                    <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'completed' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {activity.type === 'created' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'scheduled' && (
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                      {activity.type === 'uploaded' && (
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-orange-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your tasks and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.dueDate}
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {task.priority === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
