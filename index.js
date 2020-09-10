const github = require("@actions/github");
const core = require("@actions/core");
const ManagementClient = require("auth0").ManagementClient;

(async () => {
  try {
    const { pull_request, repository } = github.context.payload;
    //
    // ─── INPUTS ─────────────────────────────────────────────────────────────────────
    //
    const appBaseUrl = core.getInput("app-base-url");
    const authZeroApplicationId = core.getInput("auth0-application-id");
    const authZeroManagementClientSecret = core.getInput(
      "auth0-management-client-secret"
    );
    const authZeroManagementClientId = core.getInput(
      "auth0-management-client-id"
    );
    const authZeroManagementDomain = core.getInput("auth0-management-domain");
    const command = core.getInput("command");
    //
    // ─── AUTH0 SETUP ────────────────────────────────────────────────────────────────
    //
    const managementClient = new ManagementClient({
      domain: authZeroManagementDomain,
      clientId: authZeroManagementClientId,
      clientSecret: authZeroManagementClientSecret,
      scope: "read:clients update:clients",
    });
    const apiParams = {
      client_id: authZeroApplicationId,
    };
    const authZeroApplication = await managementClient.clients.get(apiParams);
    //
    // ─── URLS ───────────────────────────────────────────────────────────────────────
    //
    const prUrl = `${appBaseUrl}/pr-${pull_request.number}-${repository.name}`;
    const callbackUrl = `${prUrl}/callback`;
    const logoutUrl = `${prUrl}/logout`;

    const callbackIndex = authZeroApplication.callbacks.indexOf(callbackUrl);
    const logoutIndex = authZeroApplication.allowed_logout_urls.indexOf(
      logoutUrl
    );

    if (command === "whitelist") {
      if (callbackIndex < 0) {
        console.log(
          `Adding ${callbackUrl} to ${authZeroApplication.name} callbacks`
        );
        authZeroApplication.callbacks.push(callbackUrl);
        await managementClient.clients.update(apiParams, {
          callbacks: authZeroApplication.callbacks,
        });
      }

      if (logoutIndex < 0) {
        console.log(
          `Adding ${logoutUrl} to ${authZeroApplication.name} logouts`
        );
        authZeroApplication.allowed_logout_urls.push(logoutUrl);
        await managementClient.clients.update(apiParams, {
          allowed_logout_urls: authZeroApplication.allowed_logout_urls,
        });
      }
    } else if (command === "remove") {
      if (callbackIndex >= 0) {
        console.log(`Removing ${callbackUrl} from ${authZeroApplication.name}`);
        authZeroApplication.callbacks.splice(callbackIndex, 1);
        await managementClient.clients.update(apiParams, {
          callbacks: authZeroApplication.callbacks,
        });
      }

      if (logoutIndex >= 0) {
        console.log(`Removing ${logoutUrl} from ${authZeroApplication.name}`);
        authZeroApplication.allowed_logout_urls.splice(logoutIndex, 1);
        await managementClient.clients.update(apiParams, {
          allowed_logout_urls: authZeroApplication.allowed_logout_urls,
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
