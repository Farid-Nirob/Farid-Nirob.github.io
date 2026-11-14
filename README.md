# Publish Farid's Portfolio on GitHub Pages

The GitHub Pages ZIP contains the ready-to-upload public website. The separate Razor Source ZIP contains the editable C#/ASP.NET Core project and an export script. Nothing has been uploaded to GitHub or made public by preparing these files.

## Choose the right ZIP

- **Farid-Portfolio-GitHub-Pages.zip:** Unzip this for publishing. It contains `index.html`, `.nojekyll`, `css/`, `js/`, and this guide as `README.md`.
- **Farid-Portfolio-Razor-Source.zip:** Keep this for future development. Do not upload it in place of the static website files when following the branch-based steps below.

GitHub Pages serves static HTML, CSS and JavaScript; it does not run this portfolio's ASP.NET server. Public repositories can use Pages with GitHub Free ([GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)).

## Publish the website

1. Sign in to your own GitHub account, `Farid-Nirob`. Create a public repository named `Farid-Nirob.github.io`, following GitHub's `<username>.github.io` convention ([GitHub quickstart](https://docs.github.com/en/pages/quickstart)). If that repository already contains another site, do not replace it without reviewing its existing files; use a separate repository such as `portfolio` instead.
2. Unzip `Farid-Portfolio-GitHub-Pages.zip` on your computer. Upload its contents into the repository root, not the ZIP itself and not an extra enclosing folder. `index.html` must sit alongside `css` and `js`.
3. Include the empty `.nojekyll` file. If your file picker hides dotfiles, create a file named `.nojekyll` in GitHub's repository editor; it may contain a blank line. This bypasses Jekyll processing ([GitHub publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
4. Commit the uploaded files to `main`. Open **Settings → Pages → Build and deployment → Deploy from a branch**, select **main** and **/(root)**, and save ([GitHub publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
5. Wait for the deployment to finish, then use the website address shown in Settings → Pages. GitHub says updates can take up to ten minutes to appear ([GitHub quickstart](https://docs.github.com/en/pages/quickstart)).

No custom domain is required: GitHub provides a `github.io` address. A user-site repository uses the account's `github.io` address; a separate project repository adds the repository name to the path ([GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)).

## What is ready

- Your current design, concise copy, two ML/DL projects, and all supplied hobbies.
- Light/dark modes, device preference, project filtering, project details, gaming tabs, and mobile navigation.
- Public GitHub profile and project links.
- No desktop header section links or redundant section-number prefixes.
- No working-preview banner or temporary profile-editing controls in the public export.
- Relative asset paths support either a user-site repository or a project-site subpath.

## What is not connected

- LinkedIn remains “coming soon” because its URL has not been supplied.
- GitHub links open your public repositories; the site does not automatically synchronize projects.
- Contact opens your available profile; there is no message-sending form or backend.
- The theme override lasts until reload, then follows device preference again.
- Fonts are requested from Fontshare, with local fallback fonts if the request fails.

## Update it later

For a quick static edit, update the exported HTML/CSS/JS and upload the changed files. For long-term work, edit the Razor source and regenerate the public export so your C# project remains the source of truth.

The source ZIP's README explains how to run and export the app. Add new projects only after they are finished, and keep credentials, your CV and private documents out of the public repository.

## Check after publishing

- Open the GitHub-provided address in a private browser window.
- Switch between light and dark modes.
- Try both project filters and open each project's details and repository link.
- Switch between competitive and campaign games.
- Check the mobile menu and section links on your phone.
- Confirm your name and GitHub links, and that no preview editor is visible.

If the page is missing, confirm that Pages uses `main` and `/(root)` and that `index.html` is at the repository root. If old content remains, wait for the deployment to finish and reload without cache.
