"use client";

import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Transaction } from "@/types/transaction";
import { toCurrency } from "@/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'details',
    header: "Ver",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <Dialog>
            <DialogTrigger><Eye size={20} /></DialogTrigger>
            <DialogContent className="w-[96%]">
              <div className="text-lg font-bold">Detalhes da transação</div>

              <div className="mt-2">ID da transação: {row.original.idTransaction}</div>
              <div>Data: {DateTime.fromISO(row.original.registrationDate).toFormat(
              "dd/MM/yyyy HH:mm:ss"
            )}</div>
              <div>Inscrição: @{row.original.producerUsername}</div>
              <div>Valor: {toCurrency(row.original.value)}</div>
              <div>Status: {row.original.status}</div>
              <div>Produto: {row.original.description}</div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: "registrationDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Data e hora" />;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div>
            {DateTime.fromISO(row.getValue("registrationDate")).toFormat(
              "dd/MM/yyyy HH:mm:ss"
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "producerUsername",
    header: ({ column }) => {
      const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
      const isMobile = mobileMediaQuery.matches;
      if (isMobile) {
        column.toggleVisibility(false);
      }
      return <DataTableColumnHeader column={column} title="Inscrição" />;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <Link
            className="hover:underline"
            href={`/profile/${row.getValue("producerUsername")}`}
          >
            @{row.getValue("producerUsername")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Valor" />;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="text-sm">{toCurrency(row.getValue("value"))}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
      const isMobile = mobileMediaQuery.matches;
      if (isMobile) {
        column.toggleVisibility(false);
      }
      return <DataTableColumnHeader column={column} title="Produto" />;
    },
  },
];
