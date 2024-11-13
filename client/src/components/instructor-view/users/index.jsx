import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

function InstructorManageUsers({ listOfUsers }) {

  const navigate = useNavigate();
    
  const usersWithRole = (role) => {
    return listOfUsers.filter(user => user.role === role);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">Manage Users</CardTitle>
          <Button
            onClick={() => {
              navigate('/instructor/create-new-instructor');
            }}
            className="p-6"
          >
            Create New Instructor
          </Button>
        </CardHeader>
      <CardContent>
        <Tabs defaultValue="users">
          <TabsList className="space-x-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersWithRole("user").length > 0 ? (
                    usersWithRole("user").map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.userEmail}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center">No users found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="instructors">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersWithRole("instructor").length > 0 ? (
                    usersWithRole("instructor").map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.userEmail}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center">No instructors found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default InstructorManageUsers;
