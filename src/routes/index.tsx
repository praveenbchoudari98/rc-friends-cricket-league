import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import TeamsView from './TeamsView';
import ScheduleView from './ScheduleView';
import PointsTableView from './PointsTableView';
import KnockoutView from './KnockoutView';
import AboutView from './AboutView';

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                { index: true, element: <TeamsView /> },
                { path: "schedule", element: <ScheduleView /> },
                { path: "points-table", element: <PointsTableView /> },
                { path: "knockout", element: <KnockoutView /> },
                { path: "about", element: <AboutView /> },
            ]
        }
    ],
    {
        basename: '/rc-friends-cricket-league'  // Must match your GitHub repository name
    }
);

export default function AppRouter() {
    return <RouterProvider router={router} />;
} 