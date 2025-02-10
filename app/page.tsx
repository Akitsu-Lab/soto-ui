'use client';
import {Button, DataTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@carbon/react";
import axios from "axios";


export default function Home() {
    const instance = axios.create({
        // baseURL: "https://soto-account.deno.dev",
        // 慶太のブランチ
        baseURL: "https://soto-account--keita-address-cors.deno.dev/",
        // baseURL: "http://0.0.0.0:8000",
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // TODO ここから再開
    async function fetchDataTable() {
        try {
            const rows = await instance.get('/accounts');
            console.log(rows);
            return rows;
        } catch (error) {
            console.log(error);
        }
    }

    const rows = fetchDataTable();

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
