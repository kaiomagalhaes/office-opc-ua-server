# OPC UA Server for Office Data Collection

The OPC UA Server for Office Data Collection is a Node.js application designed to receive and store sensor data, such as light intensity measured in lux, from various sources including Arduino devices. This server facilitates the aggregation and analysis of environmental data within office spaces, contributing to smarter building management, energy efficiency improvements, and enhanced working conditions.

This server is a counterpart to the OPC UA Arduino Client and is a key component in the tutorial [Building a minimal OPC UA integration to collect office data with Arduino and Raspberry PI 3](https://kaiomagalhaes.com).

## Features

- **OPC UA Server**: Implements an OPC UA server using the `node-opcua` library, allowing for standardized communication within industrial and IoT systems.
- **MongoDB Integration**: Stores received sensor data in a MongoDB database, providing a robust mechanism for data persistence and later analysis.
- **Flexible Data Handling**: Configured to receive data from multiple clients, supporting a variety of sensors and data types.
- **Real-Time Data Processing**: Processes and stores real-time sensor data, facilitating immediate insights and actions.

## Prerequisites

Before starting, ensure you have the following:

- **Node.js**: Installed on your system.
- **MongoDB Access**: Either a local MongoDB instance or access to a MongoDB Atlas cluster.
- **Environment Configuration**: Knowledge of configuring environment variables for Node.js applications, particularly for sensitive information like database connection strings.

## Installation

1. **Clone the Repository**:
   Obtain the project by cloning this repository to your local machine:

```bash
git clone https://github.com/kaiomagalhaes/office-opc-ua-server
```

2. **Install Dependencies**:
   Change to the project directory and install the necessary dependencies:

```
cd office-opc-ua-server
npm install
```

3. **Configure the Server and Database:**:
   Create a .env file in the root directory to store your MongoDB URI, database name, and collection name. Ensure your OPC UA server settings (port and resource path) are correctly configured in index.js.

## Usage

Run the server with the following command to start listening for incoming sensor data and to serve as a central hub for data collection:

```bash
npm start
```

Upon receiving data from clients, the server will process and store it in the specified MongoDB database for future analysis and visualization.

## Contributing

Your contributions make the open-source community a fantastic place to learn, inspire, and create. Any contributions you make are highly appreciated. To contribute:

1. Fork the repository.
2. Create a new branch for your feature (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -am 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a pull request.

## Contact

For questions or feedback regarding the OPC UA Server for Office Data Collection, please reach out to me@kaiomagalhaes.com.
