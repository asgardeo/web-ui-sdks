import {UserDropdown, OrganizationSwitcher} from '@asgardeo/nextjs';

interface AuthenticatedActionsProps {
  className?: string;
}

export default function AuthenticatedActions({className = ''}: AuthenticatedActionsProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <OrganizationSwitcher />
      <UserDropdown />
    </div>
  );
}
