# Updin Mobile

Mobile frontend for Updin, a gamified financial education application for guardians and teenagers. The project was built with Expo + React Native and uses `expo-router` to organize route-based navigation.

## App Purpose

The application connects two user profiles:

- `Guardian`: monitors the teenager’s balance, configures allowances, creates missions, and validates completed activities.
- `Teenager`: monitors their balance, completes missions, answers quizzes, checks rankings, and progresses through XP and achievements.

## How the Frontend Works

### Public Flow

- The initial screen (`/home`) provides access to both user profiles.
- The guardian login is available at `/login-responsavel`.
- The teenager login is available at `/login-adolescente`.
- The session is stored in `AsyncStorage`, allowing access to be restored when the app is reopened.

### Authenticated Flow

- Protected routes are located inside `app/(protected)`.
- The `ProtectedLayout` checks whether a session exists and redirects the user to the correct area based on their profile type.
- When the API returns a `401` response, the token and session data are automatically cleared.

### Guardian Area

- Selects which teenager they want to manage.
- Views a financial dashboard with the total balance, the division between fixed and variable allowance amounts, recent transaction history, and missions.
- Configures the allowance frequency as `Weekly`, `Biweekly`, or `Monthly`.
- The allowance amount is automatically divided into `80%` fixed allowance and `20%` variable allowance.
- Creates new missions with a title, description, reward, deadline, and additional notes.
- Validates missions completed by the teenager and can provide feedback during approval.

### Teenager Area

- Accesses a home screen with the available balance, pending missions, notifications, and quick-access shortcuts.
- Views the transaction history with filters based on transaction type.
- Browses a catalog of public quizzes.
- Answers quizzes, automatically saves progress locally, and views the final result with the score and percentage of correct answers.
- Views the global ranking by period (`overall`, `weekly`, and `monthly`).
- Accesses a profile with statistics, achievements, weekly XP progress, and logout.
- Opens mission details, submits completed missions for validation, and views notifications for approved missions.

## Main Structure

| Path                           | Responsibility                                         |
| ------------------------------ | ------------------------------------------------------ |
| `app/`                         | Application routes using `expo-router`                 |
| `app/(auth)/`                  | Public entry and login screens                         |
| `app/(protected)/responsavel/` | Guardian flow                                          |
| `app/(protected)/adolescente/` | Teenager flow, including tab navigation                |
| `features/auth/`               | Authentication context and session restoration         |
| `services/`                    | HTTP client, API integration, and data adapters        |
| `types/`                       | Entity types, API responses, and view models           |
| `components/`                  | Reusable UI components and modals                      |
| `styles/`                      | Styles separated by screen                             |

## API Integration

The app depends on the Updin API and uses the following variable to define the base URL for requests:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

The HTTP client:

- adds the Bearer token to authenticated requests;
- handles connectivity errors;
- normalizes messages returned by the API;
- ends the session when it receives a `401` response.

Main API resource groups:

- `auth`: login and retrieval of the authenticated user.
- `responsaveis`: guardian data and linked teenagers.
- `adolescentes`: account, allowances, missions, statistics, achievements, notifications, and weekly XP.
- `missoes`: mission assignment, completion, and validation.
- `quizzes`: public catalog, attempt submission, and result retrieval.
- `ranking`: global and period-based rankings.

## How to Run the Project

1. Install the dependencies:

```bash
npm install
```

2. Configure the `.env` file with the API URL:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

3. Start the Expo project:

```bash
npx expo start
```

4. Open the project in the desired environment:

- Press `a` in the Expo terminal to open it on Android.
- Press `w` to open it on the web.
- Scan the QR code displayed in the terminal and open the app using Expo Go on your mobile device.
