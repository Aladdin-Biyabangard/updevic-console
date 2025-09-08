import { useEffect, useState } from "react";
import { Search, Filter, UserPlus, Shield, ShieldOff, Trash2, Settings, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockUsers, User } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, login } from "@/lib/api/users";

export default function Users() {
  const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();

  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()));
  //   const matchesFilter = filter === "all" || user.status === filter;
  //   return matchesSearch && matchesFilter;
  // });

  const handleUserAction = (id: string, action: "activate" | "deactivate" | "delete" | "addRole" | "removeRole") => {
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        switch (action) {
          case "activate":
            toast({
              title: "User Activated",
              description: `${user.name} has been activated.`,
            });
            return { ...user, status: "active" as const };
          case "deactivate":
            toast({
              title: "User Deactivated",
              description: `${user.name} has been deactivated.`,
              variant: "destructive",
            });
            return { ...user, status: "inactive" as const };
          case "addRole":
            if (!user.roles.includes("Teacher")) {
              toast({
                title: "Role Added",
                description: `Teacher role added to ${user.name}.`,
              });
              return { ...user, roles: [...user.roles, "Teacher"] };
            }
            return user;
          case "removeRole":
            if (user.roles.includes("Teacher")) {
              toast({
                title: "Role Removed",
                description: `Teacher role removed from ${user.name}.`,
                variant: "destructive",
              });
              return { ...user, roles: user.roles.filter(role => role !== "Teacher") };
            }
            return user;
          default:
            return user;
        }
      }
      return user;
    }));

    if (action === "delete") {
      setUsers(prev => prev.filter(user => user.id !== id));
      toast({
        title: "User Deleted",
        description: "The user has been permanently deleted.",
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


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers('');
        console.log(data);
        setUsers(data?.content || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

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

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-custom-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "inactive"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status as any)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
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
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-primary text-white font-medium">
                      {getInitials(user.firstName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
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

      {users.length === 0 && (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No users have been created yet."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}