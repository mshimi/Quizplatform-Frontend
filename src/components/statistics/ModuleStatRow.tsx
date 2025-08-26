import type {ModuleStat} from "../../types";

const ModuleStatRow = ({ moduleStat }: { moduleStat: ModuleStat }) => {
    const scoreColor = moduleStat.averageScore >= 50 ? 'text-teal-600' : 'text-amber-600';

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-4 font-bold text-slate-800">{moduleStat.moduleTitle}</td>
            <td className="p-4 text-center text-slate-600">{moduleStat.quizzesPlayed}</td>
            <td className={`p-4 text-center font-bold ${scoreColor}`}>{moduleStat.averageScore}%</td>
            <td className="p-4 text-center text-slate-600">
                {moduleStat.correctAnswers} / {moduleStat.totalAnswers}
            </td>
        </tr>
    );
};

export default ModuleStatRow;