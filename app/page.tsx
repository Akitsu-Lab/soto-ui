'use client';
import {
    Button,
    Column,
    DataTable,
    Grid,
    Header,
    HeaderName,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TextInput
} from "@carbon/react";
import axios from "axios";
import {useEffect, useState} from "react";

// APIで受け取るアカウント情報の型
interface UserAccount {
    id: string;
    accountName: string;
    balance: number;
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
        key: 'accountName',
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
                accountId: number;
                accountName: string;
                balance: number;
                created_at: string;
                updated_at: string;
            }) => ({
                id: String(item.accountId), // `id` を `string` に変換
                accountName: item.accountName,
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
            <Header aria-label="Platform Name">
                <HeaderName href="#" prefix="秋津ラボ">
                    くじ
                </HeaderName>
            </Header>

            <Grid className={"cds--content"}>
                <Column span={4}>
                </Column>
                <Column span={4}>
                    <TextInput id="text-input-1" type="text" labelText={"アカウント名"}
                               placeholder={"例：Kankuro"} helperText={"追加したいアカウントの名前"}></TextInput>
                </Column>
                <Column span={4}>
                    <Button>登録</Button>
                </Column>
            </Grid>

            <Grid>
                <Column span={16}>
                    <DataTable rows={rows} headers={headers}>

                        {({rows, headers, getTableProps, getHeaderProps, getRowProps}) => (
                            <TableContainer title={"アカウントテーブル"} description={"くじを買えるアカウントの一覧"}>
                                <Table {...getTableProps()}>
                                    <TableHead>
                                        <TableRow>
                                            {headers.map((header) => (
                                                <TableHeader {...getHeaderProps({header, isSortable: true})}
                                                             key={header.key}>
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
                            </TableContainer>
                        )}
                    </DataTable>
                </Column>
            </Grid>

        </div>
    );
}
