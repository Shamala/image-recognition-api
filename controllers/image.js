const PAT = process.env.PAT;
const USER_ID = process.env.USER_ID;
const APP_ID = process.env.APP_ID;
const MODEL_ID = process.env.MODEL_ID;

const getClarifaiRequestOptions = (imageUrl) => {
  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
          },
        },
      },
    ],
  });

  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
};

const handleClarifaiApiCall = (req, res) => {
  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    getClarifaiRequestOptions(req.body.imageUrl)
  )
    .then((response) => response.json())
    .then((data) => res.json(data))

    .catch((err) => res.status(400).json("unable to work with clarifai"));
};
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({
      id,
    })

    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.json(400).json("unable to update entries"));
};

module.exports = {
  handleImage,
  handleClarifaiApiCall,
};
