"use client";

import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserTransaction } from "@/types/metric";
import { toCurrency } from "@/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UserTransaction>[] = [
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
              <div>Data: {DateTime.fromHTTP("2024-01-27T00:57:16.762496Z").toFormat(
              "dd/MM/yyyy HH:mm:ss"
            )}</div>
              <div>Tipo: {row.original.description}</div>
              <div>Valor Bruto: {toCurrency(row.original.value)}</div>
              <div>Valor Líquido: {toCurrency(row.original.netValue)}</div>
              <div>Taxa Privatus: {toCurrency(row.original.plataformTax)}</div>
              <div>Status: {row.original.status}</div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Data e hora" />;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div>
            {DateTime.fromISO(row.getValue("transactionDate")).toFormat(
              "dd/MM/yyyy HH:mm:ss"
            )}
          </div>
        </div>
      );
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
      return <DataTableColumnHeader column={column} title="Tipo" />;
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
      const isMobile = mobileMediaQuery.matches;
      if (isMobile) {
        column.toggleVisibility(false);
      }
      return <DataTableColumnHeader column={column} title="Valor bruto" />;
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
    accessorKey: "netValue",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Valor líquido" />;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="text-sm">{toCurrency(row.getValue("netValue"))}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "plataformTax",
    header: ({ column }) => {
      const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
      const isMobile = mobileMediaQuery.matches;
      if (isMobile) {
        column.toggleVisibility(false);
      }
      return <DataTableColumnHeader column={column} title="Taxa Privatus" />;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="text-sm">{toCurrency(row.getValue("plataformTax"))}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  }
];
