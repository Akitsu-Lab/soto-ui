'use client';
import {DataTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@carbon/react";
import axios from "axios";
import {useEffect, useState} from "react";

// APIで受け取るアカウント情報の型
interface UserAccount {
    id: string;
    account_name: string;
    balance: number;
    created_at: string; // ISO 8601 日付文字列
    updated_at: string; // ISO 8601 日付文字列
}

// APIのエンドポイントなどの設定
const instance = axios.create({
    // NEXT_PUBLIC_XXXにする必要があるようだ
    baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL || "http://0.0.0.0:8000",
    headers: {
        'Content-Type': 'application/json',
    },
})

// Tableのヘッダー
const headers = [
    {
        key: 'id',
        header: 'ID',
    },
    {
        key: 'account_name',
        header: 'アカウント名',
    },
    {
        key: 'balance',
        header: '残高',
    }
];


export default function Home() {

    const [rows, setRows] = useState<UserAccount[]>([])


    useEffect(() => {
        console.log(process.env.API_SERVER_URL, instance.getUri())
        instance.get('/accounts').then(function (response) {
            // setRows(response.data)
            console.log(response.data);
            // 後で消す
            const transformedData: UserAccount[] = response.data.map((item: {
                account_id: number;
                account_name: string;
                balance: number;
                created_at: string;
                updated_at: string;
            }) => ({
                id: String(item.account_id), // `id` を `string` に変換
                account_name: item.account_name,
                balance: item.balance,
                created_at: item.created_at,
                updated_at: item.updated_at,
            }));
            setRows(transformedData);
        }).catch(function (error) {
            console.log(error);
        })
    }, [])


    return (
        <div>
            <main>
                <DataTable rows={rows} headers={headers}>
                    {({rows, headers, getTableProps, getHeaderProps, getRowProps}) => (
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader {...getHeaderProps({header, isSortable: true})} key={header.key}>
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
