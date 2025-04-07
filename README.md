# FreqWorld

A modern web application that lets you listen to radio stations from around the world, powered by Radio Garden's global radio station database.

## About

FreqWorld is a feature-rich radio streaming platform that gives you access to thousands of radio stations worldwide. Leveraging the Radio Garden API, this application allows you to:

- Discover radio stations from different countries and cities
- Listen to live streams with a beautiful audio visualizer
- Search for stations by name, location or genre
- Browse featured stations from around the world
- Keep track of your recently played stations

Whether you want to listen to local stations from your area or explore radio broadcasts from the other side of the world, FreqWorld brings global radio to your fingertips.

## Features

- **Global Radio Access**: Stream thousands of radio stations from around the world
- **Interactive Audio Player**: Includes volume control, visualizer, and station information
- **Featured Stations**: Discover curated radio stations from various locations
- **Recently Played**: Keep track of your listening history
- **Search Functionality**: Find stations by name, location, or genre
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Station Information**: View details about each station including location and country
- **Built with Next.js**: Fast, modern web application architecture

## Project Structure

```
src/
├── app/          # Next.js app router, pages, and API endpoints
├── components/   # Reusable React components (AudioPlayer, FeaturedStations, etc.)
└── utils/        # Helper functions and API integration utilities
```

## Technical Details

FreqWorld is built as a modern Next.js application that serves as a client for Radio Garden's extensive global radio database. Key technical aspects include:

- **API Integration**: Custom API routes that proxy requests to Radio Garden
- **Audio Visualization**: Real-time audio spectrum analysis
- **Geolocation Support**: Detect and suggest local stations
- **Client-Side State Management**: React hooks for state management
- **Data Caching**: Optimized data fetching with local storage caching
- **Responsive UI**: Mobile-first design approach

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/idMJA/FreqWorld.git
cd FreqWorld
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development

- The application uses the Next.js App Router for routing
- Components are organized in the `src/components` directory
- Utility functions can be found in `src/utils`
- Pages and routes are defined in `src/app`
- API endpoints are in `src/app/api/radio/*` and proxy requests to Radio Garden

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Radio Garden](https://radio.garden/) API
- Built with [Next.js](https://nextjs.org/)
- Styled with modern CSS practices
- Developed by [iaMJ / アーリャ](https://mjba.my)
