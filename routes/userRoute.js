const router = require("express").Router();

router.get("/", async (req, res) => {
  res.json({
    posts: {
      title: "My firt Post,",
      discription: "Random data you should not access",
    },
  });
});

module.exports = router;
