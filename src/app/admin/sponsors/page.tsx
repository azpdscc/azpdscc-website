
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSponsors } from '@/services/sponsors';
import type { Sponsor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Loader2 } from 'lucide-react';
import { DeleteSponsorButton } from '@/components/admin/delete-buttons';

export default function ManageSponsorsPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getSponsors()
            .then(setSponsors)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Manage Sponsors</CardTitle>
                        <CardDescription>A list of all sponsors.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/admin/sponsors/add">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Sponsor
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Logo</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sponsors.map((sponsor) => (
                                    <TableRow key={sponsor.id}>
                                        <TableCell>
                                            <Image src={sponsor.logo} alt={sponsor.name} width={100} height={50} className="object-contain" />
                                        </TableCell>
                                        <TableCell className="font-medium">{sponsor.name}</TableCell>
                                        <TableCell>{sponsor.level}</TableCell>
                                        <TableCell className="text-right">
                                           <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/sponsors/edit/${sponsor.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Link>
                                           </Button>
                                           <DeleteSponsorButton id={sponsor.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
