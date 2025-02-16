"use client";
import {
  Button,
  Column,
  DataTable,
  DataTableRow,
  DataTableSkeleton,
  Grid,
  Header,
  HeaderName,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TextInput,
  ToastNotification,
} from "@carbon/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Renew, TrashCan } from "@carbon/icons-react";
import { ToastNotificationProps } from "@carbon/react/lib/components/Notification/Notification";
import Link from "next/link";

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
    "Content-Type": "application/json",
  },
});

// Tableのヘッダー
const headers = [
  {
    key: "id",
    header: "ID",
  },
  {
    key: "accountName",
    header: "アカウント名",
  },
  {
    key: "balance",
    header: "残高",
  },
];

export default function Home() {
  const [rows, setRows] = useState<UserAccount[] | null>(null);
  const [userNameInput, setUserNameInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [toastNotificationProps, setToastNotificationProps] =
    useState<ToastNotificationProps | null>(null);

  // アカウントリスト取得
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/accounts");
      console.log("取得データ:", response.data);
      const transformedData: UserAccount[] = response.data.map(
        (item: {
          accountId: number;
          accountName: string;
          balance: number;
        }) => ({
          id: String(item.accountId),
          accountName: item.accountName,
          balance: item.balance,
        }),
      );
      setRows(transformedData);
    } catch (e) {
      errorHandler(e, "データ取得失敗");
      console.error("データ取得エラー:", e);
    } finally {
      setLoading(false);
    }
  };

  // 新規アカウント作成
  const createAccount = async (accountName: string) => {
    try {
      const response = await instance.post("/accounts", {
        accountName: accountName,
      });
      console.log("新しいアカウントが登録されました:", response.data);
    } catch (e) {
      errorHandler(e, `アカウント: ${accountName} 登録失敗`);
      console.error("アカウント: ${accountName} 登録録エラー:", e);
      return;
    }
    setToastNotificationProps({
      kind: "success",
      title: `アカウント: ${accountName} 登録成功`,
    });
    await fetchAccounts();
  };

  // アカウントバッチ削除
  const batchDeleteClick = async (
    selectedRows: DataTableRow<UserAccount[]>[],
  ) => {
    for (const row of selectedRows) {
      try {
        const response = await instance.delete(`/accounts/${row.id}`);
        console.log("新しいアカウントが削除されました:", response.data);
      } catch (e) {
        errorHandler(e, `アカウント ${row.cells.at(1)?.value} 削除失敗`);
        console.error("アカウント削除エラー:", e);
        return;
      }
    }
    console.log("バッチ削除成功:", selectedRows);
    setToastNotificationProps({ kind: "success", title: "アカウント削除成功" });
    await fetchAccounts();
  };

  // エラー出た場合の対処
  const errorHandler = (e: unknown, errTitle: string) => {
    if (axios.isAxiosError(e)) {
      const errorMessage = e.response
        ? `${e.response.data}. ${e.message}.`
        : `${e.message}. ${e.code}`;
      setToastNotificationProps({
        kind: "error",
        title: errTitle,
        subtitle: errorMessage,
      });
    } else {
      console.error("native errorが発生した", e);
    }
  };

  // 通知用
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <>
      <Header aria-label="Platform Name">
        <HeaderName href="#" prefix="秋津ラボ">
          くじ
        </HeaderName>
      </Header>
      {/*通知エリア*/}
      {toastNotificationProps && (
        <ToastNotification
          className="toast-notification"
          kind={toastNotificationProps.kind}
          lowContrast={true}
          onClose={() => setToastNotificationProps(null)}
          subtitle={toastNotificationProps.subtitle}
          title={toastNotificationProps.title}
          timeout={4000}
        ></ToastNotification>
      )}

      <Grid className={"cds--content"}>
        <Column span={4}>
          <TextInput
            id="accountName"
            type="text"
            labelText={"アカウント名"}
            placeholder={"例：カンクロウ"}
            helperText={"登録したいアカウントの名前"}
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
          ></TextInput>
        </Column>
        <Column span={4}>
          <Button onClick={() => createAccount(userNameInput)}>登録</Button>
        </Column>
      </Grid>

      {/*アカウントテーブル*/}
      <Grid>
        <Column span={16}>
          {/*loadingの時はskeltonでそれ以外の時に通常のテーブルを表示*/}
          {loading || rows == null ? (
            <DataTableSkeleton headers={headers} aria-label="sample table" />
          ) : (
            <DataTable rows={rows} headers={headers}>
              {({
                rows,
                headers,
                getHeaderProps,
                getSelectionProps,
                getToolbarProps,
                getBatchActionProps,
                selectedRows,
                getTableProps,
                getTableContainerProps,
              }) => {
                const batchActionProps = getBatchActionProps();
                return (
                  <TableContainer
                    title={"アカウントリスト"}
                    description={"くじを買えるアカウントの一覧"}
                    {...getTableContainerProps()}
                  >
                    {/*テーブルコンテナ内上部*/}
                    <TableToolbar {...getToolbarProps()}>
                      {/*バッチ削除*/}
                      <TableBatchActions {...batchActionProps}>
                        <TableBatchAction
                          renderIcon={TrashCan}
                          onClick={() => batchDeleteClick(selectedRows)}
                        >
                          Delete
                        </TableBatchAction>
                      </TableBatchActions>
                      <TableToolbarContent>
                        <TableToolbarSearch
                          tabIndex={
                            batchActionProps.shouldShowBatchActions ? -1 : 0
                          }
                          onChange={() => {}}
                        />
                        <Button
                          kind="ghost"
                          renderIcon={Renew}
                          style={{ color: "black" }}
                          onClick={fetchAccounts}
                          disabled={loading}
                        ></Button>
                      </TableToolbarContent>
                    </TableToolbar>

                    {/* テーブルのコンテンツ */}
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          <TableSelectAll
                            {...getSelectionProps()}
                          ></TableSelectAll>
                          {headers.map((header) => (
                            <TableHeader
                              {...getHeaderProps({ header, isSortable: true })}
                              key={header.key}
                            >
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.id}>
                            <TableSelectRow
                              {...getSelectionProps({ row })}
                              onChange={() => {}}
                            />
                            {row.cells.map((cell) => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              }}
            </DataTable>
          )}
        </Column>
      </Grid>

      <Grid className={"cds--content"}>
        <Column span={8}>
          <Link href={"purchase"}>くじの購入画面へ</Link>
        </Column>
      </Grid>
    </>
  );
}
