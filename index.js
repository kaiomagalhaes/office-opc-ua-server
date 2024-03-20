require('dotenv').config();

const opcua = require("node-opcua");
const { MongoClient } = require("mongodb");

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

(async () => {
    // Initialize MongoDB client and connect
    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log("Connected to MongoDB.");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Initialize OPC UA server
    const server = new opcua.OPCUAServer({
        port: 4840,
        resourcePath: "/UA/MyLittleServer",
        maxConnections: 20,
    });

    await server.initialize();

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    // Add a new object to the server
    const device = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "Arduino",
    });

    // Add a variable that represents the LuxValue
    namespace.addVariable({
        componentOf: device,
        nodeId: "ns=1;s=the.node.identifier",
        browseName: "LuxValue",
        dataType: "Double",
        value: {
            get: () => new opcua.Variant({ dataType: opcua.DataType.Double, value: 0 }),
            set: async (variant) => {
                const luxValue = variant.value;
                try {
                    await collection.insertOne({
                        nodeId: "ns=1;s=the.node.identifier",
                        luxValue: luxValue,
                        timestamp: new Date()
                    });
                    console.log("New Lux value inserted into MongoDB.");
                } catch (error) {
                    console.error("Error updating MongoDB:", error);
                }
                return opcua.StatusCodes.Good;
            }
        }
    });

    await server.start();
    console.log(`Server is now listening on port ${server.endpoints[0].port}...`);

    process.on('SIGINT', async () => {
        await client.close();
        console.log("Disconnected from MongoDB.");
        process.exit(0);
    });
})();

