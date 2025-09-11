import { useEffect, useState } from "react";
import { Search, Filter, UserPlus, Shield, ShieldOff, Trash2, Settings, MoreVertical, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers } from "@/lib/api/users";

interface UserFilters {
  firstName: string;
  email: string;
  roles: string[];
  status: string;
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState<UserFilters>({
    firstName: "",
    email: "",
    roles: [],
    status: ""
  });
  const { toast } = useToast();

  // Available options for filters
  const roleOptions = ["ADMIN", "TEACHER", "STUDENT", "MODERATOR"];
  const statusOptions = ["CREATED", "ACTIVE", "DEACTIVATED", "SUSPENDED"];

  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()));
  //   const matchesFilter = filter === "all" || user.status === filter;
  //   return matchesSearch && matchesFilter;
  // });

  const handleUserAction = async (
      id: number,
      action: "activate" | "deactivate" | "delete" | "addRole" | "removeRole"
  ) => {
    try {
      switch (action) {
        case "activate":
          await activateUser(id);
          setUsers(prev => prev.map(user =>
              user.id === id ? { ...user, status: "ACTIVE" } : user
          ));
          toast({
            title: "User Activated",
            description: `User has been activated.`,
          });
          break;

        case "deactivate":
          await deactivateUser(id);
          setUsers(prev => prev.map(user =>
              user.id === id ? { ...user, status: "DEACTIVATED" } : user
          ));
          toast({
            title: "User Deactivated",
            description: `User has been deactivated.`,
            variant: "destructive",
          });
          break;

        case "addRole":
          await addUserRole(id, "TEACHER");
          setUsers(prev => prev.map(user =>
              user.id === id && !user.roles.includes("TEACHER")
                  ? { ...user, roles: [...user.roles, "TEACHER"] }
                  : user
          ));
          toast({
            title: "Role Added",
            description: `Teacher role added to user.`,
          });
          break;

        case "removeRole":
          await removeUserRole(id, "TEACHER");
          setUsers(prev => prev.map(user =>
              user.id === id
                  ? { ...user, roles: user.roles.filter(r => r !== "TEACHER") }
                  : user
          ));
          toast({
            title: "Role Removed",
            description: `Teacher role removed from user.`,
            variant: "destructive",
          });
          break;

        case "delete":
          // delete API yoxdur, sadəcə frontenddən silirik
          setUsers(prev => prev.filter(user => user.id !== id));
          toast({
            title: "User Deleted",
            description: "The user has been permanently deleted.",
            variant: "destructive",
          });
          break;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Action failed",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Admin: "bg-destructive/10 text-destructive",
      Teacher: "bg-success/10 text-success",
      Student: "bg-primary/10 text-primary",
    };
    return colors[role as keyof typeof colors] || "bg-muted/10 text-muted-foreground";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };


  const fetchUsers = async (searchFilters: Partial<UserFilters> = {}) => {
    setLoading(true);
    try {
      const data = await getAllUsers(searchFilters);
      console.log(data);
      setUsers(data?.content || []);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchCriteria: Partial<UserFilters> = {};
    
    if (filters.firstName.trim()) searchCriteria.firstName = filters.firstName.trim();
    if (filters.email.trim()) searchCriteria.email = filters.email.trim();
    if (filters.roles.length > 0) searchCriteria.roles = filters.roles;
    if (filters.status.trim()) searchCriteria.status = filters.status.trim();
    
    fetchUsers(searchCriteria);
  };

  const handleClear = () => {
    setFilters({
      firstName: "",
      email: "",
      roles: [],
      status: ""
    });
    fetchUsers({});
  };

  const handleRoleToggle = (role: string) => {
    setFilters(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect(() =>{
  //   login()
  // })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Advanced Filters */}
      <Card className="bg-gradient-card border-0 shadow-custom-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* First Name Filter */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name..."
                value={filters.firstName}
                onChange={(e) => setFilters(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>

            {/* Email Filter */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter email..."
                value={filters.email}
                onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {/* Roles Multi-select */}
            <div className="space-y-2">
              <Label>Roles</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {filters.roles.length > 0 
                      ? `${filters.roles.length} role(s) selected`
                      : "Select roles..."
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-2">
                  <div className="space-y-2">
                    {roleOptions.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={filters.roles.includes(role)}
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                        <Label htmlFor={role} className="text-sm font-normal">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({
                    ...prev,
                    status: value === "all" ? "" : value
                  }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Filters Display */}
          {(filters.firstName || filters.email || filters.roles.length > 0 || filters.status) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.firstName && (
                <Badge variant="secondary" className="gap-1">
                  Name: {filters.firstName}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, firstName: "" }))}
                  />
                </Badge>
              )}
              {filters.email && (
                <Badge variant="secondary" className="gap-1">
                  Email: {filters.email}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, email: "" }))}
                  />
                </Badge>
              )}
              {filters.roles.map((role) => (
                <Badge key={role} variant="secondary" className="gap-1">
                  Role: {role}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRoleToggle(role)}
                  />
                </Badge>
              ))}
              {filters.status && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, status: "" }))}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSearch} disabled={loading} className="flex-1 sm:flex-none">
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={loading}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user,index) => (
          <Card
            key={index}
            className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                   <Avatar className="h-12 w-12">
                     <AvatarImage src={user.avatar} alt={user.firstName || user.name} />
                     <AvatarFallback className="bg-gradient-primary text-white font-medium">
                       {getInitials(user.firstName || user.name || "U")}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <CardTitle className="text-lg">{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name}</CardTitle>
                     <p className="text-sm text-muted-foreground">{user.email}</p>
                   </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleUserAction(user.id, "deactivate")}>
                        <ShieldOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleUserAction(user.id, "activate")}>
                        <Shield className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    {user.roles.includes("Teacher") ? (
                      <DropdownMenuItem onClick={() => handleUserAction(user.id, "removeRole")}>
                        Remove Teacher Role
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleUserAction(user.id, "addRole")}>
                        Add Teacher Role
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleUserAction(user.id, "delete")}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Roles */}
              <div>
                <span className="text-sm font-medium text-foreground">Roles:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className={getRoleBadgeColor(role)}
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Status:</span>
                <Badge
                  variant="secondary"
                  className={
                    user.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {user.status}
                </Badge>
              </div>

              {/* Last Login */}
              <div className="text-xs text-muted-foreground">
                <div>Last login: {new Date(user.lastLogin).toLocaleDateString()}</div>
                <div>Joined: {new Date(user.dateCreated).toLocaleDateString()}</div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                {user.status === "active" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleUserAction(user.id, "deactivate")}
                  >
                    <ShieldOff className="h-3 w-3 mr-1" />
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    onClick={() => handleUserAction(user.id, "activate")}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) 
                ? "Try adjusting your search or filter criteria."
                : "No users have been created yet."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-foreground mb-2">Loading users...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the user data.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}