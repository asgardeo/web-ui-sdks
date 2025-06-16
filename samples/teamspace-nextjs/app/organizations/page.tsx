'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Building2, Users, Settings, Crown, Shield, User, Plus, ExternalLink} from 'lucide-react';
import Link from 'next/link';
import {Header} from '@/components/header';
import {redirect} from 'next/navigation';
import {useEffect} from 'react';

export default function OrganizationsPage() {
  const organizations = [
    {
      id: '1',
      name: 'Organization 1',
      slug: 'organization-1',
      avatar: '/placeholder.svg',
      role: 'owner',
      memberCount: 5,
    },
    {
      id: '2',
      name: 'Organization 2',
      slug: 'organization-2',
      avatar: '/placeholder.svg',
      role: 'admin',
      memberCount: 3,
    },
  ];
  const setCurrentOrg = org => {
    // This function should handle setting the current organization in your state management or API
    console.log('Current organization set to:', org);
  };
  const isAuthenticated = true; // Replace with actual authentication check
  const isLoading = false; // Replace with actual loading state
  const redirect = path => {
    // This function should handle redirection in your application
    console.log('Redirecting to:', path);
  };
  const currentOrg = organizations[0] || null; // Default to first organization or null if none

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
            <p className="text-muted-foreground mt-2">Manage your organizations and switch between them</p>
          </div>
          <Button asChild>
            <Link href="/organizations/new">
              <Plus className="h-4 w-4 mr-2" />
              New Organization
            </Link>
          </Button>
        </div>

        {/* Current Organization */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Current Organization</h2>
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={currentOrg?.avatar || '/placeholder.svg'} alt={currentOrg?.name} />
                    <AvatarFallback>{currentOrg?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">{currentOrg?.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getRoleBadge(currentOrg?.role || 'member')}>
                        {getRoleIcon(currentOrg?.role || 'member')}
                        <span className="ml-1 capitalize">{currentOrg?.role}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">{currentOrg?.memberCount} members</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Organizations */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">All Organizations</h2>
          <div className="space-y-4">
            {organizations?.map(org => (
              <Card key={org.id} className={currentOrg?.id === org.id ? 'border-primary/50 bg-primary/5' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={org.avatar || '/placeholder.svg'} alt={org.name} />
                        <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{org.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getRoleBadge(org.role)}>
                            {getRoleIcon(org.role)}
                            <span className="ml-1 capitalize">{org.role}</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            <Users className="h-3 w-3 inline mr-1" />
                            {org.memberCount} members
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {currentOrg?.id !== org.id && (
                        <Button onClick={() => setCurrentOrg(org)} variant="outline" size="sm">
                          Switch to
                        </Button>
                      )}
                      {currentOrg?.id === org.id && <Badge variant="default">Current</Badge>}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Organization Invitations */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Pending Invitations</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending invitations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
