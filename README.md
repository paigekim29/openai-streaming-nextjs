# Chat Application

A real-time chat application built with Next.js, React, TypeScript, and OpenAI's GPT-4 API. This app supports message streaming, editing, and dynamic scrolling, allowing users to interact with an AI assistant in an intuitive chat interface.

## Features

- **Real-time Messaging**: Send and receive messages instantly.
- **Stream Processing**: Display streaming responses from the OpenAI API.
- **Message Editing**: Edit previously sent messages.
- **Abort Action**: Abort message submissions mid-way if needed.
- **Auto Scroll**: Automatically scroll to the latest message.
- **Clean UI**: User-friendly interface using Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js and pnpm
- OpenAI API Key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/paigekim29/openai-streaming-nextjs
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables:

   Create a .env.local file in the root directory with the following:

   ```bash
   OPENAI_API_KEY=
   OPENAI_PROJECT_ID=
   ```

4. Running the Application

   ```bash
   pnpm run dev
   ```

   The application will be available at http://localhost:3000.
