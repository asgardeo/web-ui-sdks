'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Users, ChevronDown, Settings, User, LogOut, Plus, Check, Building2, Menu, X} from 'lucide-react';

export function Header() {
  const isAuthenticated = true; // Replace with actual authentication check
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
  }; // Replace with actual user data
  const organizations = [
    {id: '1', name: 'Organization One', avatar: '/org1.svg ', memberCount: 10},
    {id: '2', name: 'Organization Two', avatar: '/org2.svg', memberCount: 5},
  ]; // Replace with actual organizations data
  const [currentOrg, setCurrentOrg] = useState(organizations[0]); // Replace with actual current organization
  const signOut = () => {
    // Implement sign out logic here
    console.log('Signing out...');
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Teamspace</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="#features" className="block text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#testimonials" className="block text-muted-foreground hover:text-foreground">
                Testimonials
              </Link>
              <Link href="#pricing" className="block text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <div className="pt-4 border-t space-y-2">
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Teamspace</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/teams" className="text-muted-foreground hover:text-foreground transition-colors">
              Teams
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Organization Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={currentOrg?.avatar || '/placeholder.svg'} alt={currentOrg?.name} />
                  <AvatarFallback className="text-xs">{currentOrg?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="max-w-32 truncate">{currentOrg?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>Switch organization</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {organizations?.map(org => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => setCurrentOrg(org)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={org.avatar || '/placeholder.svg'} alt={org.name} />
                      <AvatarFallback className="text-xs">{org.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-xs text-muted-foreground">{org.memberCount} members</div>
                    </div>
                  </div>
                  {currentOrg?.id === org.id && <Check className="h-4 w-4 text-green-600" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/organizations" className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage organizations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/organizations/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New organization
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar || '/placeholder.svg'} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-muted-foreground">@{user?.username}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Your profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="flex items-center text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
