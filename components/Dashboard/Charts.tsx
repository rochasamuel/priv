"use client";

import apiClient from "@/backend-sdk";
import useBackendClient from "@/hooks/useBackendClient";
import { toCurrency } from "@/utils/currency";
import { Loader2 } from "lucide-react";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
// import React, { PureComponent } from "react";
import { useQuery } from "react-query";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Charts: FunctionComponent = () => {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();

  const { data: producerMetrics } = useQuery({
    queryKey: ["producerMetrics", session?.user?.userId],
    queryFn: async () => {
      const socialMetrics = await api.metrics.getSocialMetrics("2024-01-25");
      const profitMetrics = await api.metrics.getProfitMetrics("2024-01-25");

      return {
        socialMetrics,
        profitMetrics,
      };
    },
  });

  const CustomProfitTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-24 bg-slate-900 border p-2 rounded-sm">
          <p className="text-sm font-bold">{`${DateTime.fromISO(label).toFormat(
            "LLL yyyy",
            { locale: "pt-br" }
          )}`}</p>
          <p className="text-sm">{toCurrency(payload[0].value)}</p>
        </div>
      );
    }

    return null;
  };

  const CustomSocialTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      console.log(payload);
      return (
        <div className="w-auto bg-slate-900 border p-2 rounded-sm">
          <p className="text-sm font-bold">{`${DateTime.fromISO(label).toFormat(
            "LLL yyyy",
            { locale: "pt-br" }
          )}`}</p>
          <p className="text-sm font-bold">
            {payload[0].name}:{" "}
            <span className="font-normal">
              {payload[0].payload.totalSubscriptions}
            </span>
          </p>
          <p className="text-sm font-bold">
            {payload[1].name}:{" "}
            <span className="font-normal">
              {payload[0].payload.totalFollowers}
            </span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row mt-10 gap-6">
      <div className="w-full h-72 flex flex-col justify-center items-center gap-4 border rounded-sm p-2">
        {producerMetrics?.profitMetrics ? (
          <>
            <div className="font-semibold">Faturamento Mensal</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={producerMetrics?.profitMetrics}
                margin={{
                  top: 5,
                  left: -20,
                  right: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  angle={-60}
                  dataKey="metricDate"
                  tickMargin={25}
                  style={{ fontSize: 12 }}
                  interval={0}
                  height={60}
                  tickFormatter={(value) =>
                    DateTime.fromISO(value).toFormat("LLL yyyy", {
                      locale: "pt-br",
                    })
                  }
                />
                <YAxis style={{ fontSize: 14 }} />
                <Tooltip
                  content={<CustomProfitTooltip />}
                  cursor={{ fillOpacity: 0.4, fill: "#959dab" }}
                />
                <Bar
                  dataKey="totalProfit"
                  fill="#b259b2"
                  radius={[3, 3, 0, 0]}
                  activeBar={<Rectangle enableBackground={0} fill="#ff80ff" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="flex items-center gap-2 text-lg opacity-50">
            Processando Dados <Loader2 className="animate-spin" />
          </div>
        )}
      </div>

      <div className="w-full h-72 flex flex-col justify-center items-center gap-4 border rounded-sm p-2">
        {producerMetrics?.socialMetrics ? (
          <>
            <div className="font-semibold">Seguidores e Assinantes</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={producerMetrics?.socialMetrics}
                margin={{
                  top: 5,
                  left: -20,
                  right: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  angle={-60}
                  dataKey="metricDate"
                  tickMargin={25}
                  style={{ fontSize: 12 }}
                  interval={0}
                  height={60}
                  tickFormatter={(value) =>
                    DateTime.fromISO(value).toFormat("LLL yyyy", {
                      locale: "pt-br",
                    })
                  }
                />
                <YAxis style={{ fontSize: 14 }} />
                <Tooltip
                  content={<CustomSocialTooltip />}
                  cursor={{ fillOpacity: 0.4, fill: "#959dab" }}
                />
                <Bar
                  name="Assinantes"
                  dataKey="totalSubscriptions"
                  fill="#e250e6"
                  radius={[3, 3, 0, 0]}
                  activeBar={<Rectangle enableBackground={0} fill="#963599" />}
                />
                <Bar
                  name="Seguidores"
                  dataKey="totalFollowers"
                  fill="#812dbf"
                  radius={[3, 3, 0, 0]}
                  activeBar={<Rectangle enableBackground={0} fill="#4d1a72" />}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 14 }} />
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="flex items-center gap-2 text-lg opacity-50">
            Processando Dados <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export const TooltipContent: FunctionComponent<{ values: any }> = ({
  values,
}) => {
  console.log(values);
  return <div>ddsd</div>;
};

export default Charts;
