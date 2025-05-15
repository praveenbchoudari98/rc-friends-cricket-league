# Cricket Tournament Manager

A React-based web application for managing local cricket tournaments. This application helps organize cricket tournaments by managing teams, generating match schedules, tracking scores, and maintaining points tables.

## Features

- Team Management
  - Add teams with captain information
  - View registered teams
- Tournament Management
  - Automatic league schedule generation
  - Match score tracking
  - Live points table updates
  - Knockout stage progression
- Real-time Points Table
  - Automatic calculation of points
  - Net Run Rate calculation
  - Team rankings

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cricket-tournament-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Usage

1. **Adding Teams**
   - Navigate to the Teams tab
   - Fill in the team name and captain
   - Optionally add a team logo URL
   - Submit the team

2. **Starting Tournament**
   - Add at least 3 teams
   - Go to the Schedule tab
   - Click "Start Tournament"

3. **Managing Matches**
   - View match schedule in the Schedule tab
   - Add match results as games are played
   - View updated points table in the Points Table tab

4. **Knockout Stage**
   - Automatically begins after all league matches are completed
   - Top teams qualify for semi-finals
   - Winners proceed to finals

## Technologies Used

- React
- TypeScript
- Material-UI
- Vite
- date-fns

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License.
