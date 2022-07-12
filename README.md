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

## Generating New Indices
* new indices may be required to run complex queries, such as the one below:
```node
const queryGetReplies = datastore.createQuery("Reply")
        .filter("questionId", "=", questionId)
        .order("time", {
            descending: true
        });
```
* If you get a `FAILED_PRECONDITION` error, copy and paste the suggested index code into `index.yaml`
* For the above example, the required configuration is:
```yaml
- kind: Reply
  properties:
    - name: questionId
    - name: time
      direction: desc
```
* To reflect these changes in Datastore, run the following command, making sure you're in the same directory as `index.yaml`
```bash
gcloud datastore indexes create index.yaml
```
* Navigate to [the Datastore console](https://console.cloud.google.com/datastore/indexes?authuser=0&project=summer22-sps-52) and wait a few minutes for the index changes to be reflected
* To learn more about how indices work check out the [Index Configuration](https://cloud.google.com/datastore/docs/tools/indexconfig) documentation