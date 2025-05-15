import { Routes, Route } from 'react-router-dom';
import App from '../App';
import TeamsView from './TeamsView';
import ScheduleView from './ScheduleView';
import PointsTableView from './PointsTableView';
import KnockoutView from './KnockoutView';
import AboutView from './AboutView';
import MatchSummaryView from './MatchSummaryView';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<TeamsView />} />
                <Route path="schedule" element={<ScheduleView />} />
                <Route path="points-table" element={<PointsTableView />} />
                <Route path="knockout" element={<KnockoutView />} />
                <Route path="about" element={<AboutView />} />
                <Route path="match/:matchId" element={<MatchSummaryView />} />
            </Route>
        </Routes>
    );
} 