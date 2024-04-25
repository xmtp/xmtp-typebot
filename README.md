# XMTP Typebot Runner

This project enables conversational bots to interact with users via the XMTP decentralized messaging protocol. It uses Typebot as an example service but is designed to be extensible for other services like Intercom or Dialogflow.

## Requirements

- `yarn` package manager version 2.x or 3.x or 4.x
- An Ethereum wallet private key for XMTP authentication. **Note:** The Ethereum wallet must already be activated on XMTP.
- A Postgres container running in Docker

### Setting Up a Postgres Container with Docker for Local Development

Before starting the development setup, ensure you have a Postgres container running in Docker. Follow these steps to get it set up:

1. **Install Docker Desktop**: Make sure you have Docker Desktop installed on your machine.

2. **Pull the Postgres Docker Official Image**:
   - Download the latest Postgres version by running `docker pull postgres` in your terminal.

3. **Start a Postgres Instance**:
   - Execute the following command to start a new Postgres container:
     ```bash
     docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
     ```

## Development Setup

1. **Clone the Repository**

   Start by cloning the repository to your local machine.

2. **Install Dependencies**

   Navigate to the project directory and run:
   ```bash
   yarn
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory with the following variables:
   - `WALLET_KEY`: Your Ethereum wallet private key for XMTP authentication.
   - `XMTP_ENV`: The environment for the XMTP network (e.g., `development`).
   - `TYPEBOT_PUBLIC_ID`: The public ID for your Typebot.
   - `POSTGRES_CONNECTION_STRING`: The URL for your production Postgres instance.

   Ensure `.env` is listed in your `.gitignore` to prevent exposing sensitive information.

4. **Development Commands**

   - To start the Docker container, run:
     ```bash
     docker-compose up -d
     ```

   - To compile TypeScript to JavaScript, run:
     ```bash
     yarn build
     ```
   - To start the application, use:
     ```bash
     yarn start
     ```
   - For development, you can watch for changes and automatically recompile:
     ```bash
     yarn build:watch
     ```
   - To run the application with automatic restarts on code changes, use:
     ```bash
     yarn start:watch
     ```

5. **Testing**

   Ensure your setup is correct by sending a message through an XMTP client to the wallet address associated with your private key. The bot should respond based on the Typebot configuration.

## Deployment on Railway

[Railway](https://railway.app/) offers a straightforward deployment process for hosting this integration. Here's how to deploy:

1. **Railway Setup**: Sign up or log in to [Railway](https://railway.app/) and connect your GitHub repository containing the project.

2. **Deploy Railway Postgres Image**: Add Railways's [Postgres template](https://github.com/railwayapp-templates/postgres-ssl/pkgs/container/postgres-ssl) to your project and deploy it.

3. **Configure Environment Variables**: In the Railway project settings for your GitHub repository, add the necessary [environment variables](#environment-variables).

4. **Deploy**: Railway automatically deploys your application when you push changes to the connected GitHub repository. You can also trigger deployments manually via the Railway dashboard.

5. **Use**: After deployment, your XMTP Typebot integration is live. To test it, send a message to the XMTP address associated with your application, similar to how you tested during development. Ensure the bot responds appropriately based on your Typebot configuration.