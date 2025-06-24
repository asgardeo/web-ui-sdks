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
import {ChevronDown, Check, Building2, Plus} from 'lucide-react';
import {useAuth} from '@/hooks/use-auth';

interface OrganizationSwitcherProps {
  className?: string;
}

export default function OrganizationSwitcher({className = ''}: OrganizationSwitcherProps) {
  const {currentOrg, organizations, setCurrentOrg} = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center space-x-2 ${className}`}>
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
  );
}
