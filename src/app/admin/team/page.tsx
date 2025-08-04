
import { getTeamMembers } from '@/services/team';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { deleteTeamMemberAction } from './actions';
import Image from 'next/image';

export default async function AdminTeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
                <CardTitle className="font-headline text-2xl">Manage Team Members</CardTitle>
                <CardDescription>Add, edit, or delete your organization's team members.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href="/admin/team/add">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Member
                    </Link>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">No team members found.</TableCell>
                    </TableRow>
                ) : (
                    teamMembers.map((member) => (
                    <TableRow key={member.id}>
                        <TableCell>
                            <Image src={member.image} alt={member.name} width={40} height={40} className="rounded-full" />
                        </TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/admin/team/edit/${member.id}`}>
                                    <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <form action={deleteTeamMemberAction}>
                                    <input type="hidden" name="id" value={member.id} />
                                    <Button variant="ghost" size="icon" type="submit">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </form>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
