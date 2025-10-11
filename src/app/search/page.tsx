import { Suspense } from "react";
import { connection } from 'next/server';

import Search from "@/components/search/Search";

import client from "@/lib/sanity";

//@ts-expect-error
export default async function SearchPage({ searchParams }) {
    await connection();
    const {country, month} = searchParams;

  return (
    <>
      <Search />
    </>
  );
}
