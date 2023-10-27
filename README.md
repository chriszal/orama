# Orama Initiative

## Overview
Orama is a unique initiative aimed at understanding and researching the changes in various locations. Utilizing specifically placed phone stands, we encourage passersby to scan a code, get redirected to a specific page on our website, and upload photos of the location. These crowd-sourced images help us analyze the evolution of a particular site, whether it's traffic on a beach, changes in a forest, urban development, or more. Over time, this data can be used to create timelapses highlighting the transformations.

**Website**: [orama-initiative.web.app](https://orama-initiative.web.app/)

## Phone Stand Image
[Insert Image Here]

## Technical Stack
- **Framework**: Next.js (React.js)
- **Backend**: Firebase (Hosting, Storage, Firestore)
- **Notifications**: Emailjs for uploaded image notifications

## How It Works
1. Phone stands are placed at various locations.
2. Each stand has a code that people can scan.
3. Upon scanning, users are redirected to a specific page on the Orama website.
4. Here, they can read the instructions, take a photo of the location, and optionally add metadata.
5. Images are uploaded to Firebase Storage and Firestore collection.
6. Upon upload, a notification is sent via EmailJs.
7. Images are reviewed for appropriateness based on the location and context. If they align with the project's intent, the `is_approved` field is set to true.
8. Approved images are displayed in the gallery for that specific location.

## Development Setup
1. Clone the project from GitHub.
2. Create a `.env` file in the root directory, and add necessary configurations such as the Emails API token, MapboxGL token, and Firebase configurations.
3. Install dependencies and start the development server:
    ```bash
    npm install
    npm run dev
    ```
   
## Deployment
The deployment process is facilitated through GitHub Actions. Every push to the repository triggers an automatic deployment to Firebase Hosting. However, if you wish to deploy manually:

1. Build the project:
    ```bash
    npm run build
    npm run export
    ```

2. Deploy to Firebase:
    ```bash
    firebase deploy
    ```

## Ongoing Work
- We are currently working on providing translations for both Greek and English to make the platform more accessible to a broader audience.
