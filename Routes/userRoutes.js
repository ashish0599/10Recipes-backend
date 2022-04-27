const router = require("express").Router();
const User = require("../modal/userModal");
const authUser = require("../authUser");

router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    await user.generateToken();
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    await user.generateToken();
    res.status(200).send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/auto-login", authUser, async (req, res) => {
  res.send(req.user);
});

router.post("/logout", authUser, async (req, res) => {
  const user = req.user;
  user.token = "";
  await user.save();
  res.status(200).send();
});

router.post("/add-fav", authUser, async (req, res) => {
  const { recipeId } = req.body;
  const user = req.user;
  user.favorite.push(recipeId);
  await user.save();
  res.status(200).send(user);
});

router.post("/remove-fav", authUser, async (req, res) => {
  const { recipeId } = req.body;
  const user = req.user;
  user.favorite = user.favorite.filter((id) => id !== recipeId);
  await user.save();
  res.status(200).send(user);
});

module.exports = router;
