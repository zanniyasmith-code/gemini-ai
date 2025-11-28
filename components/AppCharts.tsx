import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

// --- Types ---
interface BarData {
  name: string;
  value: number;
}

interface PieData {
  name: string;
  value: number;
}

interface YearlyData {
  year: number;
  [key: string]: number;
}

// --- Components ---

/**
 * Simple Bar Chart for comparing Cost vs Price vs Profit
 */
export const ProfitBarChart: React.FC<{ cost: number; price: number; profit: number }> = ({ cost, price, profit }) => {
  const { theme } = useTheme();
  
  const data = [
    { name: 'Cost', value: cost, fill: theme.colors.muted },
    { name: 'Price', value: price, fill: theme.colors.primary },
    { name: 'Profit', value: profit, fill: profit >= 0 ? theme.colors.accent : theme.colors.danger },
  ];

  return (
    <div className="h-64 w-full animate-in fade-in duration-500">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
          <XAxis dataKey="name" stroke={theme.colors.muted} tick={{fill: theme.colors.muted}} />
          <YAxis stroke={theme.colors.muted} tick={{fill: theme.colors.muted}} />
          <Tooltip 
            cursor={{fill: theme.colors.secondary}}
            contentStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: '12px' }}
            itemStyle={{ color: theme.colors.text }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Pie Chart for EMI Breakdown (Principal vs Interest)
 */
export const EmiPieChart: React.FC<{ principal: number; interest: number }> = ({ principal, interest }) => {
  const { theme } = useTheme();
  
  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: interest },
  ];
  
  const COLORS = [theme.colors.primary, theme.colors.accent];

  if (principal === 0 && interest === 0) return null;

  return (
    <div className="h-64 w-full animate-in fade-in duration-500">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={theme.colors.surface} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: '12px' }}
             itemStyle={{ color: theme.colors.text }}
          />
          <Legend wrapperStyle={{ color: theme.colors.muted }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Stacked Bar Chart for Investment Growth (Invested vs Gain)
 */
export const GrowthChart: React.FC<{ data: YearlyData[]; dataKeys: { key: string; color: string; name: string }[] }> = ({ data, dataKeys }) => {
    const { theme } = useTheme();

    return (
        <div className="h-64 w-full animate-in fade-in duration-500">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        {dataKeys.map((k, i) => (
                            <linearGradient key={k.key} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={k.color} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={k.color} stopOpacity={0}/>
                            </linearGradient>
                        ))}
                    </defs>
                    <XAxis dataKey="year" stroke={theme.colors.muted} tick={{fill: theme.colors.muted}} />
                    <YAxis stroke={theme.colors.muted} tick={{fill: theme.colors.muted}} />
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: '12px' }}
                        labelStyle={{ color: theme.colors.text }}
                        itemStyle={{ color: theme.colors.text }}
                    />
                    <Legend />
                    {dataKeys.map((k, i) => (
                        <Area 
                            key={k.key}
                            type="monotone" 
                            dataKey={k.key} 
                            stackId="1" 
                            stroke={k.color} 
                            fill={`url(#color${i})`} 
                            name={k.name}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};