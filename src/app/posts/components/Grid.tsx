"use client";
import Link from "next/link";
import React from "react";

const Grid = () => {
  return (
    <div className="grid gap-20 pb-20">
      <div className="w-full grid gap-1">
        <p className="text-lg font-bold mb-6">Latest public memos</p>
        <div className="grid md:grid-cols-3 gap-1">
          <div className="h-82 md:col-span-2 bg-white dark:bg-neutral-900 shadow">
            Latest public memo
          </div>
          <div className="md:col-span-1 grid grid-cols-1 gap-1">
            <div className="h-40 bg-white dark:bg-neutral-900 shadow">
              Memo 2
            </div>
            <div className="h-40 bg-white dark:bg-neutral-900 shadow">
              Memo 2
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-1 mb-12">
          <div className="h-40 bg-white dark:bg-neutral-900 shadow">Memo 2</div>
          <div className="h-40 bg-white dark:bg-neutral-900 shadow">Memo 2</div>
          <div className="h-40 bg-white dark:bg-neutral-900 shadow">Memo 2</div>
        </div>
        <div className="flex justify-center">
          <Link
            href={"/bulletin"}
            className="bg-white dark:bg-neutral-900 hover:shadow w-32 h-10 rounded font-bold text-sm grid place-content-center"
          >
            View more
          </Link>
        </div>
      </div>

      <div className="w-full">
        <p className="text-lg font-bold mb-6">Memos for your department</p>
        <div className="grid md:grid-cols-3 gap-1 mb-12">
          <div className="h-40 bg-white dark:bg-neutral-900 shadow">Memo 2</div>
          <div className="h-40 bg-white dark:bg-neutral-900 shadow">Memo 2</div>
          <div className="h-40 bg-white dark:bg-neutral-900 shadow">Memo 2</div>
        </div>
        <div className="flex justify-center">
          <Link
            href={"/departments-memo"}
            className="bg-white dark:bg-neutral-900 hover:shadow w-32 h-10 rounded font-bold text-sm grid place-content-center"
          >
            View more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Grid;
