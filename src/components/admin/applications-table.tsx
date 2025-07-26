'use client';

import type { FC } from 'react';
import type { Application } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ApplicationsTableProps {
  applications: Application[];
}

const ApplicationsTable: FC<ApplicationsTableProps> = ({ applications }) => {
  return (
    <section id="adminApplicationsSection" className="max-w-7xl mx-auto my-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Submitted Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-muted-foreground">No applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Project Interest</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Grad Year</TableHead>
                    <TableHead>Work Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{app.projectInterest}</Badge>
                      </TableCell>
                      <TableCell>{app.email}<br />{app.contact}</TableCell>
                      <TableCell>{app.college}</TableCell>
                      <TableCell>{app.gradYear}</TableCell>
                      <TableCell>{app.workType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ApplicationsTable;