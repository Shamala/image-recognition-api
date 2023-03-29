const PAT = "9c190be0d5734c2ab57c4963fee46c38";
const USER_ID = "shamala_mallya";
const APP_ID = "face-recognition";
const MODEL_ID = "general-image-detection";

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
