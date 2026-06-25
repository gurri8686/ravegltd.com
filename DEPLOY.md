# Auto-Deploy Setup (GitHub Actions → SSH → GoDaddy)

Same mechanism as the `vendor-manager` repo. When you push to `main`, a GitHub
Actions workflow SSHes into the GoDaddy cPanel server and runs `git pull` there,
so the live site updates automatically.

**How it works:** push to `main` → GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
→ SSH into the server → `git fetch` + `git reset --hard origin/main`. The site is
served straight from the repo working tree, so no FTP and no build step.

---

## One-time setup

### 1. Repo on the server — DONE ✅

The repo is already cloned via cPanel Git Version Control at:

```text
/home/fx8fdk9i85rt/public_html/ravegltd
```

This path is already set as `REPO_DIR` in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

> Since it's a subfolder, make sure the **`ravegltd.com` document root points at
> `public_html/ravegltd`** (cPanel → Domains) so the site serves at the root rather
> than at `ravegltd.com/ravegltd/`.

### 2. Confirm SSH access on GoDaddy

cPanel → **Security** → **SSH Access** → enable it / note the **host**, **username**
(`fx8fdk9i85rt`), and **port** (often 22). Add or upload an SSH **key pair** — keep
the **private** key for step 3, authorize the **public** key on the server.

### 3. Add the repo secrets on GitHub

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
Add the same four secrets the vendor-manager repo uses:

| Secret | Value |
| --- | --- |
| `SSH_HOST` | server hostname or IP (from cPanel SSH Access) |
| `SSH_USERNAME` | cPanel username (`fx8fdk9i85rt`) |
| `SSH_KEY` | the **private** SSH key (full contents, incl. BEGIN/END lines) |
| `SSH_PORT` | SSH port (e.g. `22`) |

> Prefer password auth? Add `SSH_PASSWORD` instead, then in `deploy.yml` comment out
> the `key:` line and uncomment the `password:` line.

### 4. Push and watch it deploy

```bash
git add .github/workflows/deploy.yml .htaccess DEPLOY.md
git commit -m "Add auto-deploy via GitHub Actions"
git push
```

Go to the repo's **Actions** tab — the **Deploy to GoDaddy** run should go green and
print `Deployed: <old> -> <new>`. You can also trigger it manually from there
(**workflow_dispatch**).

---

## Notes

- **Don't edit files directly on the server.** `git reset --hard` makes the server an
  exact mirror of `main`, so any server-side edits are overwritten on the next deploy.
  Always edit locally → push.
- [`.htaccess`](.htaccess) blocks the `.git` folder from being served, since the repo
  working tree is the docroot.
- The first deploy (the clone) is done by hand in cPanel; every deploy after that is
  automatic on push.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `cannot cd to $REPO_DIR` | `REPO_DIR` in `deploy.yml` doesn't match the clone path. The job prints `ls -la $HOME` to help you find it. |
| Action fails at the SSH step | Check the four secrets. For key auth, `SSH_KEY` must be the full **private** key and its public half must be authorized on the server. |
| `git fetch failed` | The server clone has no `origin`, or the host can't reach GitHub. Re-clone via cPanel Git Version Control. |
| Changes don't appear | The server had local edits that diverged. They're overwritten on the next push — never edit on the server. |
