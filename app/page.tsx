'use client';
import {Button, DataTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@carbon/react";
import axios from "axios";


export default function Home() {
    const instance = axios.create({
        baseURL: "https://soto-account.deno.dev",
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        },
    })

    instance.get('/accounts').then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    })

    async function fetchDataTable() {
        try {
            const rows = await axios.get('/accounts');
            console.log(rows);
        } catch (error) {
            console.log(error);
        }
    }

    const rows = [
        {
            id: '9',
            name: 'kankurou',
            balance: '0',
        }
    ];

    const headers = [
        {
            key: 'id',
            header: 'ID',
        },
        {
            key: 'name',
            header: 'アカウント名',
        },
        {
            key: 'balance',
            header: '残高',
        }
    ];

    return (
        <div>
            <main>
                <Button>a</Button>
                <DataTable rows={rows} headers={headers}>
                    {({rows, headers, getTableProps, getHeaderProps, getRowProps}) => (
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader {...getHeaderProps({header})} key={header.key}>
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow {...getRowProps({row})} key={row.id}>
                                        {row.cells.map((cell) => (
                                            <TableCell key={cell.id}>{cell.value}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </DataTable>
            </main>
            <footer>

            </footer>
        </div>
    );
}
