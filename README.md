# URL Shortener Service

This project is a URL shortener service built with Node.js. It provides functionality to shorten URLs and manage them.

## Project Structure



### Folders

- **common/config**: Contains configuration files, such as database configuration.
- **common/constants**: Contains constant values used throughout the project, such as error codes and response messages.
- **common/helpers**: Contains helper functions.
- **common/middleware**: Contains middleware functions, including authentication and error handling.
- **common/utils**: Contains utility functions, including logging and URL utilities.
- **server**: Contains the main server code, including controllers, models, services, and utilities specific to the URL shortener functionality.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd <project-directory>
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

### Configuration

1. Create a `.env` file in the root directory and add the necessary environment variables.
  Refer to `.env.example` if available.

### Running the Project

To start the server, run:

```sh
npm start

API Requests
You can find example API requests in the requests/URLshortner.http file.
Use an HTTP client like VSCode REST Client or Postman to test the endpoints.
