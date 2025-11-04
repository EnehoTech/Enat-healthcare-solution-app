# Enat Healthcare Solution project: Project README

## Description
This repository contains the codebase for the Enat Healthcare Solution, a modern clinic management system designed to streamline clinical workflows, enhance patient communication, and eliminate time-wasting administrative tasks for staff (Doctors, Nurses, and Receptionists).

**Goal:** To provide a comprehensive, secure, and user-friendly platform that handles patient check-in, EMR/charting, appointments, and communication, driving efficiency and cost savings for the clinic.
**Technology Stack:** Built using a standard MERN stack architecture (MySql, Express, React, Node.js) to ensure scalability and developer familiarity.
**Key Features:** Patient Profiles persistence, quick EMR charting templates, automated reminders, and staff role-based access control.

## Prerequisites

- Node.js
- React
- Git / Github

## Getting Started

### Installation Steps
Clone the Repository:

`Bash`
git clone https://github.com/enat-healthcare/solution.git
cd solution
Install Dependencies (frontend and backend):

`Bash`
### Install backend dependencies
cd backend
npm install

### Install frontend (Vite React app) dependencies
cd ../frontend
npm install
Configure Environment Variables (backend):
Create a file named .env in the backend/ directory.
Add the necessary configurations, including the database connection string.

### .env file content
PORT=2411
database connection string
JWT_SECRET=YOUR_SECURE_SECRET
### (Add any external API keys here, e.g., SMS_GATEWAY_KEY)
Running the Application
Start the Backend (Server):
nodemon index.js

`Bash`
cd backend
nodemon index.js
### The server will run on http://localhost:2411 (or the port specified in .env)
Start the Frontend (Client):

`Bash`
cd ../frontend
npm run dev
### The client will open automatically in your terminal, typically at http://localhost:2416. open it in your browser

### Contribution Guidelines
We welcome contributions! Please follow the standard development workflow:

1. **Level your Repo**: level your local repository with the remote repository.
2. **Create a new branch**: Create a new branch with the same name as your task branch. Command to create a branch and switch to your new branch:
   ```
     git checkout -b <your branch name>.
   ```
3. **Work on Task**: Implement the changes or fixes related to the your task.
4. **Commit Changes**: Once you've completed your work, commit your changes to the branch. Command to add and commit your changes:
   ```
   git add . or use vs code stage changes feature
   git commit -m "Your commit message (e.g., feat: added appointment status check)" ***make sure your commit message is perfectly describe what you have done***
   ```
5. **Push Changes**: Push the changes to your branch on the remote repository. Command to push your changes:
   ```
   git push origin <branch-name>
   ```
6. **Create a Pull Request**: Create a pull request from your branch to the development repository's branch. Ensure that you've completed all the necessary fields in the pull request template, and check the markdown boxes in the pull request template labeled under **_Quality Checklist_** with **x**, similar to this: - [x].
7. **Mention Reviewer**: When creating the pull request, mention the appropriate reviewer(s) to ensure timely review.
8. **Merging**: Approving pull requests and merging are done by senior developers. Please refrain from merging your pull request unless you are a senior developer or told to to do so.

## License
This project is licensed under the Eneho Tech License.



