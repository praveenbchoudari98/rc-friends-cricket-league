import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MatchCard } from '../components/Matches/MatchCard';
import { generateUUID } from '../utils/uuid';
import type { Match, Team } from '../types';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import React from 'react';

// Mock generateUUID to return predictable values
jest.mock('../utils/uuid', () => ({
    generateUUID: () => 'test-uuid'
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Select: ({ 
        children, 
        onChange, 
        'data-testid': testId 
    }: { 
        children: React.ReactNode; 
        onChange: (event: SelectChangeEvent<string>) => void;
        'data-testid'?: string;
    }) => (
        <select
            data-testid={testId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                onChange({ target: { value: e.target.value } } as SelectChangeEvent<string>)
            }
        >
            {children}
        </select>
    ),
    MenuItem: ({ 
        children, 
        value 
    }: { 
        children: React.ReactNode; 
        value: string;
    }) => (
        <option value={value}>{children}</option>
    )
}));

describe('Super Duper Over Match Creation', () => {
    const mockTeam1: Team = {
        id: 'team1',
        name: 'Team A',
        logo: 'https://example.com/logo-a.png'
    };

    const mockTeam2: Team = {
        id: 'team2',
        name: 'Team B',
        logo: 'https://example.com/logo-b.png'
    };

    const createTiedMatch = (matchType: 'qualifier' | 'final'): Match => ({
        id: generateUUID(),
        team1: mockTeam1,
        team2: mockTeam2,
        matchType,
        status: 'tied',
        venue: 'Test Stadium',
        date: new Date('2024-03-20'),
        time: '14:00',
        result: {
            team1Score: { runs: 150, wickets: 8, overs: 20 },
            team2Score: { runs: 150, wickets: 7, overs: 20 },
            result: 'tie'
        },
        inningsInfo: {
            tossWinner: mockTeam1,
            tossDecision: 'bat',
            battingFirst: mockTeam1,
            date: new Date('2024-03-20'),
            time: '14:00'
        }
    });

    it('should show Start Super Duper Over button for tied playoff matches', () => {
        const tiedMatch = createTiedMatch('qualifier');
        render(
            <MatchCard 
                match={tiedMatch} 
                onUpdate={jest.fn()} 
            />
        );

        expect(screen.getByRole('button', { name: /start super duper over/i })).toBeInTheDocument();
    });

    it('should not show Start Super Duper Over button for completed matches', () => {
        const completedMatch: Match = {
            ...createTiedMatch('qualifier'),
            status: 'completed',
            result: {
                team1Score: { runs: 150, wickets: 8, overs: 20 },
                team2Score: { runs: 140, wickets: 7, overs: 20 },
                result: 'win',
                winner: mockTeam1
            }
        };

        render(
            <MatchCard 
                match={completedMatch} 
                onUpdate={jest.fn()} 
            />
        );

        expect(screen.queryByRole('button', { name: /start super duper over/i })).not.toBeInTheDocument();
    });

    it('should create a new super duper over match when clicking the button', () => {
        const tiedMatch = createTiedMatch('qualifier');
        const onUpdate = jest.fn();

        render(
            <MatchCard 
                match={tiedMatch} 
                onUpdate={onUpdate} 
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /start super duper over/i }));

        expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({
            team1: mockTeam1,
            team2: mockTeam2,
            matchType: 'super_duper_over',
            status: 'scheduled',
            venue: 'Test Stadium',
            parentMatchId: tiedMatch.id,
            isSuperDuperOver: true
        }));
    });

    it('should limit overs to 2 in super duper over match', async () => {
        const superDuperOverMatch: Match = {
            id: generateUUID(),
            team1: mockTeam1,
            team2: mockTeam2,
            matchType: 'super_duper_over',
            status: 'scheduled',
            venue: 'Test Stadium',
            isSuperDuperOver: true,
            parentMatchId: 'parent-match-id'
        };

        render(
            <MatchCard 
                match={superDuperOverMatch} 
                onUpdate={jest.fn()} 
            />
        );

        // Click Add Score button
        fireEvent.click(screen.getByRole('button', { name: /add score/i }));

        // Fill in match details
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-03-20' } });
        fireEvent.change(screen.getByLabelText(/time/i), { target: { value: '14:30' } });
        fireEvent.change(screen.getByLabelText(/venue/i), { target: { value: 'Test Stadium' } });

        // Set toss details using mocked select elements
        const tossWinnerSelect = screen.getByTestId('toss-winner-select');
        fireEvent.change(tossWinnerSelect, { target: { value: mockTeam1.id } });

        const tossDecisionSelect = screen.getByTestId('toss-decision-select');
        fireEvent.change(tossDecisionSelect, { target: { value: 'bat' } });

        // Click Next
        fireEvent.click(screen.getByRole('button', { name: /next/i }));

        // Try to enter more than 2 overs
        const oversInput = screen.getByTestId('overs-input');
        fireEvent.change(oversInput, { target: { value: '3' } });
        expect(oversInput).toHaveValue(2);
    });

    it('should show super duper over title in match card', () => {
        const superDuperOverMatch: Match = {
            id: generateUUID(),
            team1: mockTeam1,
            team2: mockTeam2,
            matchType: 'super_duper_over',
            status: 'scheduled',
            venue: 'Test Stadium',
            isSuperDuperOver: true,
            parentMatchId: 'parent-match-id'
        };

        render(
            <MatchCard 
                match={superDuperOverMatch} 
                onUpdate={jest.fn()} 
            />
        );

        // Use getAllByText since there might be multiple elements with the same text
        expect(screen.getAllByText(/super duper over/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/max 2 overs/i)).toBeInTheDocument();
    });
}); 