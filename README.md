## Setup Node.js in your Local Environment
1. Clone this repository `git clone <repo-link>`
2. Navigate Inside the Repo with `cd rellit`
3. Run `npm install` to install all dependencies specified in `package.json`
4. To run the server locally, do `nodemon index.js`
    - `nodemon` allows saves any updates you make automatically without needing to re-run the server
    - if you are fine with manually re-running the server each time, you can run `node index.js`
    - Click on "Web Preview" near the top-right corner and "Preview on Port 8080"
5. Ready to deploy? Run `gcloud app deploy`
    - you might get an error and have to set the project with `gcloud config set project summer22-sps-52`