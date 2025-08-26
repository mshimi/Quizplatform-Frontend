import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useState} from "react";
import type {ActivityDataPoint} from "../../types";

interface ActivityChartProps {
    data: ActivityDataPoint[];
}

const ActivityChart = ({ data }: ActivityChartProps) => {

    const [visibility, setVisibility] = useState({
        quizzes: true,
        avgScore: true,
    });


    const handleToggle = (key: 'quizzes' | 'avgScore') => {
        setVisibility(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            // If the user tries to hide the last visible line, prevent it.
            if (!newState.quizzes && !newState.avgScore) {
                return prev; // Return the previous state, effectively doing nothing
            }
            return newState;
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-96">

            <div className="flex justify-end items-center gap-4 mb-4">
                <button
                    onClick={() => handleToggle('quizzes')}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                        visibility.quizzes
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                    Gespielte Quiz
                </button>
                <button
                    onClick={() => handleToggle('avgScore')}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                        visibility.avgScore
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                    Ø Note
                </button>
            </div>


            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #e0e0e0',
                            borderRadius: '1rem',
                        }}
                    />
                    <Legend />
                    {visibility.quizzes && (
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="quizzes"
                            name="Gespielte Quiz"
                            stroke="#8884d8"
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                        />
                    )}
                    {visibility.avgScore && (
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="avgScore"
                            name="Ø Note (%)"
                            stroke="#82ca9d"
                            strokeWidth={3}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;