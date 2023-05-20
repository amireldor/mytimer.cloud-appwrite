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
    console.log("Hey what's up?");
    const DATABASE_ID = req.variables["TIMERS_DATABASE_ID"];
    const { sessionId } = JSON.parse(req.payload ?? "{}");
    if (!sessionId) {
      throw new Error("No session id provided");
    }

    console.log(`Trying to clear all documents of session ${sessionId}`);

    let sum = 0;
    let done = false;

    while (!done) {
      console.log(`Getting documents, deleted so far: ${sum}`);
      const response = await databases.listDocuments(DATABASE_ID, sessionId);
      const documents = response.documents;

      for (const document of documents) {
        await databases.deleteDocument(DATABASE_ID, sessionId, document.$id);
        sum++;
      }

      if (documents.length === 0) {
        done = true;
      }
    }

    res.json({
      ok: true,
      sum,
    });
  } catch (error) {
    console.log("error:", error);
    res.json(
      {
        ok: false,
      },
      400
    );
  }
};
