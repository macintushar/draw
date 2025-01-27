[![Draw Logo](https://raw.githubusercontent.com/macintushar/draw/main/public/draw-logo.png)]()

<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
  <a href="https://codeclimate.com/github/macintushar/draw/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/01b60d9dbd7f8af2d25f/maintainability" alt="Maintainability" />
  </a>
</div>

Draw is a wrapper around Excalidraw, integrated with Supabase to save and sync your drawings seamlessly across different devices. It allows you to use Excalidraw anywhere while keeping your data available everywhere.

## Features

- **Excalidraw Integration:** Leverages the functionality of Excalidraw, a popular web-based drawing tool.
- **Supabase Backend:** Uses Supabase for authentication and storage, ensuring secure access and synchronization of your drawings.
- **Cross-Platform Sync:** Access your drawings from any device by securely saving them to your Supabase database.

## Acknowledgments

- [Excalidraw](https://excalidraw.com/) for providing the best open-source drawing tool. This wouldn't be possible without them (literally).

## Getting Started

### Usage

- **Sign Up or Log In:** Use the authentication flow provided by Supabase to sign up or log in.
- **Create and Edit Drawings:** Use the Excalidraw interface to create or edit drawings.
- **Save Drawings:** Drawings are automatically saved to your Supabase database.
- **Access Anywhere:** Log in from any device to access and sync your drawings.

## Deployment

To deploy the app, you can use platforms like Vercel or Netlify.
We have set up a one-click deploy to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/macintushar/draw)

If you want to deploy using Docker, you can use the provided docker-compose file, using the instruction in the [Docker](https://github.com/macintushar/draw/blob/main/docs/docker.md) section.

If you'd like to build the app yourself, run:

    bun run build

Deploy to other hosting providers by following their specific deployment instructions.

## Tech Stack / Libraries

- Vite (React)
- Tailwind CSS with shadcn/ui
- Tanstack Query and Router
- Excalidraw
- Supabase
- Sentry
- Day.js
- Zod
- Bun

and many others.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. For major changes, please open an issue to discuss what you would like to change.

1.  Fork the repository
2.  Create your feature branch
3.  Commit your changes
4.  Push to the branch
5.  Open a pull request

## Development

### Prerequisites

- [Bun](https://bun.sh)
- [Supabase Account and Project](https://supabase.com/)

### DB Structure and Setup

This is a visual of the Database Schema on Supabase. Read [docs/supabase.md](https://github.com/macintushar/draw/blob/main/docs/supabase.md) for more detailed information on how to set up Supabase to work with Draw.
[![DB Schema](./docs/assets/Draw-Readme-DB-Schema.png)](./docs/assets/Draw-Readme-DB-Schema.png)

### Installation

Clone the repository:

    git clone https://github.com/macintushar/draw.git
    cd draw

Install dependencies:

    bun install

Set up your environment variables:

Create a `.env` file in the root directory and add your Supabase and Sentry credentials:

    cp .env.example .env

Run the development server:

    bun run dev

Your app will be available at <http://localhost:5173>.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/macintushar/draw/blob/main/LICENCE) file for more details.

## Contact

If you have any questions or suggestions, feel free to reach out!
