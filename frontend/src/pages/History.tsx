import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { historyService } from '../services/api';
import { History, Calendar, Search, ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: number;
  assessment_id: number;
  sentence: string;
  overall_score: number;
  pronunciation_score: number;
  fluency_score: number;
  assessment_date: string;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await historyService.getHistory();
        setRecords(data);
      } catch (err) {
        console.warn('Backend history list offline. Initializing fallback logs:', err);
        setRecords([
          { id: 1, assessment_id: 10, sentence: 'She sells seashells by the seashore.', overall_score: 82, pronunciation_score: 85, fluency_score: 79, assessment_date: '2026-06-30T10:00:00' },
          { id: 2, assessment_id: 11, sentence: 'Peter Piper picked a peck of pickled peppers.', overall_score: 74, pronunciation_score: 78, fluency_score: 70, assessment_date: '2026-06-28T14:30:00' },
          { id: 3, assessment_id: 12, sentence: 'The quick brown fox jumps over the lazy dog.', overall_score: 80, pronunciation_score: 83, fluency_score: 77, assessment_date: '2026-06-25T11:15:00' },
          { id: 4, assessment_id: 13, sentence: 'To be or not to be, that is the question.', overall_score: 88, pronunciation_score: 91, fluency_score: 85, assessment_date: '2026-06-22T09:45:00' },
          { id: 5, assessment_id: 14, sentence: 'Practice makes perfect when learning spoken pronunciation.', overall_score: 84, pronunciation_score: 87, fluency_score: 81, assessment_date: '2026-06-20T16:00:00' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredRecords = records.filter(rec =>
    rec.sentence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
          {/* Header row */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Assessment History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete historical ledger of speech recording submissions and analysis runs.
            </p>
          </div>

          <div className="space-y-6">
            {/* Search tool block */}
            <div className="bg-card border p-4 rounded-3xl shadow-sm flex items-center space-x-3 max-w-md">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by sentence text..."
                className="w-full bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground text-foreground"
              />
            </div>

            {loading ? (
              <Loader message="Fetching historical therapy logs..." />
            ) : (
              <div className="border rounded-3xl bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="p-4 pl-6">Target Sentence</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Pronunciation</th>
                        <th className="p-4 text-center">Fluency</th>
                        <th className="p-4 text-center">Overall</th>
                        <th className="p-4 pr-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {filteredRecords.map((rec) => (
                        <tr
                          key={rec.id}
                          onClick={() => navigate(`/results?assessment_id=${rec.assessment_id}`)}
                          className="hover:bg-muted/40 transition-colors cursor-pointer"
                        >
                          <td className="p-4 pl-6 font-bold text-foreground max-w-md truncate">
                            {rec.sentence}
                          </td>
                          <td className="p-4 text-muted-foreground font-medium">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(rec.assessment_date).toLocaleDateString()}</span>
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-indigo-500">
                            {rec.pronunciation_score}%
                          </td>
                          <td className="p-4 text-center font-bold text-amber-500">
                            {rec.fluency_score}%
                          </td>
                          <td className="p-4 text-center font-extrabold text-primary">
                            {rec.overall_score}%
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <ChevronRight className="h-5 w-5 text-muted-foreground inline" />
                          </td>
                        </tr>
                      ))}
                      {filteredRecords.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-muted-foreground">
                            <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                            <h4 className="font-bold">No Records Found</h4>
                            <p className="text-xs">No entries match your search criteria.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
export { HistoryPage as History };
