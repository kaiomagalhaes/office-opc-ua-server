const opcua = require("node-opcua");
const { MongoClient } = require("mongodb");

// MongoDB configuration with your provided URI
const mongoUrl = "mongodb+srv://codelitt:s9aL2sJnZLFIRi2t@cluster0.acj1ec4.mongodb.net/storyforge?retryWrites=true&w=majority";
const dbName = "officedata"; // Database name, adjusted to match your URI
const collectionName = "lux"; // Collection name for storing lux values

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
	maxConnection: 20,
    });

    await server.initialize();

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    // Add a new object to the server
    const device = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "MyDevice",
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
                   // Insert or update the lux value in MongoDB
                    await collection.updateOne(
                        { nodeId: "ns=1;s=the.node.identifier" }, // Unique identifier for the document
                        { $set: { luxValue: luxValue, timestamp: new Date() } },
                        { upsert: true }
                    );
                    console.log("Lux value updated in MongoDB.");


                } catch (error) {
                    console.error("Error updating MongoDB:", error);
                }
                return opcua.StatusCodes.Good;
            }
        }
    });

    await server.start();
    console.log(`Server is now listening on port ${server.endpoints[0].port}...`);

    // Ensure MongoDB connection is closed when the OPC UA server shuts down
    process.on('SIGINT', async () => {
        await client.close();
        console.log("Disconnected from MongoDB.");
        process.exit(0);
    });
})();

