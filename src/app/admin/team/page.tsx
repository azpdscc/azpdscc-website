
import Link from 'next/link';
import { getTeamMembers } from '@/services/team';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit } from 'lucide-react';
import { DeleteTeamMemberButton } from '@/components/admin/delete-buttons';
import Image from 'next/image';

export default async function ManageTeamPage() {
    const teamMembers = await getTeamMembers();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Manage Team Members</CardTitle>
                        <CardDescription>A list of all team members. Use the 'Order' to change the display sequence.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/admin/team/add">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Member
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium text-center">{member.order}</TableCell>
                                    <TableCell>
                                        <Image src={member.image} alt={member.name} width={40} height={40} className="rounded-full" />
                                    </TableCell>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell className="text-right">
                                       <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/team/edit/${member.id}`}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Link>
                                       </Button>
                                       <DeleteTeamMemberButton id={member.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
