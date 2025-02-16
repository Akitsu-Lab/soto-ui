"use client";
import { Button, Column, Grid, Header, HeaderName } from "@carbon/react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header aria-label="Platform Name">
        <HeaderName href="#" prefix="秋津ラボ">
          くじ
        </HeaderName>
      </Header>
      <Grid className={"under-header"}>
        <Column span={4}>このページは未実装</Column>
      </Grid>
      <Grid className={"normal-content"}>
        <Column span={4}>
          <Button>イベント取得</Button>
        </Column>
      </Grid>
      <Grid className={"normal-content"}>
        <Column span={4}>
          <Button>購入</Button>
        </Column>
      </Grid>
      <Grid className={"normal-content"}>
        <Column span={4}>
          <Link href={"/"}>神のページへ戻る</Link>
        </Column>
      </Grid>
    </>
  );
}
