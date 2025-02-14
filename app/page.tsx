'use client';
import {
    Button,
    Column,
    DataTable,
    DataTableSkeleton,
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
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    TextInput,
    ToastNotification
} from "@carbon/react";
import axios, {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {Renew} from "@carbon/icons-react";

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
    const [userNameInput, setUserNameInput] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [toastTitle, setToastTitle] = useState<string>("");
    const [toastSubTitle, setToastSubtitle] = useState<string>("");
    const [toastKind, setToastKind] = useState<'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt'>('info');

    // アカウントリスト取得
    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await instance.get('/accounts');
            console.log("取得データ:", response.data);
            const transformedData: UserAccount[] = response.data.map((item: {
                accountId: number;
                accountName: string;
                balance: number;
            }) => ({
                id: String(item.accountId),
                accountName: item.accountName,
                balance: item.balance
            }));
            setRows(transformedData);
        } catch (error) {
            console.error("データ取得エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    // 新規アカウント作成
    const createAccount = async (accountName: string) => {
        try {
            const response = await instance.post('/accounts', {accountName: accountName});
            console.log("新しいアカウントが作成されました:", response.data);
            fetchAccounts();
        } catch (e) {
            const error = e as Error | AxiosError;
            if (axios.isAxiosError(error) && error.response) {
                setToastTitle(error.response.data);
                setToastSubtitle(error.message);
                setToastKind('error');
            } else {
                // TODO native errorの場合
            }
            console.error("アカウント作成エラー:", error);
        }
    }

    useEffect(() => {
        fetchAccounts();
    }, [])


    return (
        <div>
            <Header aria-label="Platform Name">
                <HeaderName href="#" prefix="秋津ラボ">
                    くじ
                </HeaderName>
            </Header>

            {/*通知エリア*/}
            {toastTitle && (<ToastNotification className={"toast-notification"} kind={toastKind} lowContrast={true}
                                               onClose={() => setToastTitle("")}
                                               subtitle={toastSubTitle} title={toastTitle}
                                               timeout={4000}></ToastNotification>)}


            <Grid className={"cds--content"}>
                <Column span={4}>
                    <TextInput id="text-input-1" type="text" labelText={"アカウント名"}
                               placeholder={"例：Kankuro"} helperText={"追加したいアカウントの名前"}
                               value={userNameInput} onChange={(e) => setUserNameInput(e.target.value)}></TextInput>
                </Column>
                <Column span={4}>
                    <Button onClick={() => createAccount(userNameInput)}>登録</Button>
                </Column>
            </Grid>

            <Grid>
                <Column span={16}>

                    {/*loadingの時はskeltonでそれ以外の時に通常のテーブルを表示*/}
                    {loading ? <DataTableSkeleton headers={headers} aria-label="sample table"/> :
                        <DataTable rows={rows} headers={headers}>

                            {({rows, headers, getTableProps, getHeaderProps, getRowProps}) => (
                                <TableContainer title={"アカウントテーブル"}
                                                description={"くじを買えるアカウントの一覧"}>
                                    <TableToolbar>
                                        <TableToolbarContent>
                                            <TableToolbarSearch/>
                                            <Button kind="ghost" renderIcon={Renew} style={{color: "black"}}
                                                    onClick={fetchAccounts} disabled={loading}></Button>
                                        </TableToolbarContent>
                                    </TableToolbar>

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
                        </DataTable>}
                </Column>
            </Grid>

        </div>
    );
}
