export default async function handler(req, res) {
  try {
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;
    const githubToken = process.env.GITHUB_PAT;

    if (!deployHook) {
      return res.status(500).json({
        error: "Missing VERCEL_DEPLOY_HOOK environment variable."
      });
    }

    // STEP 1 — Trigger Vercel Deploy
    const vercelRes = await fetch(deployHook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    // STEP 2 — Optional: Trigger GitHub Workflow
    let githubStatus = "skipped";

    if (githubToken) {
      await fetch("https://api.github.com/repos/samanthas-projects-0e1d986a/cinemorphsrl/actions/workflows/main.yml/dispatches", {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${githubToken}`
        },
        body: JSON.stringify({
          ref: "main"
        })
      });

      githubStatus = "triggered";
    }

    // Final result returned to dashboard
    return res.status(200).json({
      message: "Nova Engine deployed successfully.",
      vercel: vercelRes.status,
      github_workflow: githubStatus
    });

  } catch (err) {
    console.error("Nova Engine ERROR:", err);
    return res.status(500).json({
      error: "Nova Engine failed.",
      details: err.message
    });
  }
}
