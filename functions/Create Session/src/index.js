const sdk = require("node-appwrite");
const { nanoid } = require("nanoid");

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
    const DATABASE_ID = req.variables["TIMERS_DATABASE_ID"];
    const sessionId = nanoid();
    console.log(`Trying to create session ${sessionId}`);
    await databases.createCollection(DATABASE_ID, sessionId, sessionId, [
      sdk.Permission.create(sdk.Role.any()),
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.update(sdk.Role.any()),
      sdk.Permission.delete(sdk.Role.any()),
    ]);
    await databases.createStringAttribute(
      DATABASE_ID,
      sessionId,
      "title",
      "128",
      true,
      "My Timer"
    );
    await databases.createBooleanAttribute(
      DATABASE_ID,
      sessionId,
      "stopwatch",
      true,
      false
    );
    console.log("OK!");
    res.json({
      ok: true,
      sessionId,
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
