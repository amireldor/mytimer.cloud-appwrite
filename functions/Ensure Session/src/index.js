const sdk = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);
  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_API_KEY"]
  ) {
    console.warn(
      "Environment variables are not set. Function cannot use Appwrite SDK."
    );
  } else {
    client
      .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
      .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
      .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"])
      .setSelfSigned(true);
  }

  try {
    // TODO: how to read from project's `.env`
    const DATABASE_ID = "6467da4fb14c66daa55a";
    const { sessionId } = JSON.parse(req.payload);
    console.log(`sessionId in payload: ${sessionId}`);
    if (!sessionId) {
      throw new Error("sessionId is required");
    }
    console.log("Checking for existing collection");
    const response = await databases.listCollections(
      DATABASE_ID,
      undefined,
      sessionId
    );
    if (response.total > 0) {
      console.log("Collection already exists");
      res.json({
        ok: true,
      });
      return;
    }
    console.log("Trying to create collection");
    await databases.createCollection(DATABASE_ID, sessionId, sessionId);
    console.log("OK!");
    res.json({
      ok: true,
    });
  } catch (error) {
    console.error("error:", error);
    res.json(
      {
        ok: false,
      },
      400
    );
    throw error;
  }
};
