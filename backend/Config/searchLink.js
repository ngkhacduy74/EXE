const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SerpAPI);

function searchLinks(query) {
  return new Promise((resolve, reject) => {
    search.json(
      {
        q: query,
        location: "Vietnam",
        hl: "vi",
        gl: "vn",
        num: 5,
      },
      (data) => {
        try {
          const links = data.organic_results.map((item) => item.link);

          resolve(links);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

module.exports = searchLinks;
