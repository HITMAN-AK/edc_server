const exp = require("express");
const mongoose = require("mongoose");
const app = exp.Router();
const user = require("./user");
const Up = require("./up");
const cors = require("cors");
app.use(cors());
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://legendaryairforce:ASHWIN01012004@offpub.9t7fv.mongodb.net/"
  );
}
app.post("/leave", async (req, res) => {
  const uid = await Up.where({ username: req.body.username }).select("uuid");
  const uuid = uid[0].uuid;
  await user
    .updateOne(
      { "departments.staff.user_id": uuid },
      { $set: { "departments.$[outer].staff.$[inner].status": "l" } },
      {
        arrayFilters: [
          { "outer.staff.user_id": uuid },
          { "inner.user_id": uuid },
        ],
      }
    )
    .then(res.json({ status: "sc" }));
});
app.post("/out", async (req, res) => {
  const uid = await Up.where({ username: req.body.username }).select("uuid");
  const time = await Up.where({ username: req.body.username }).select("time");
  const uuid = uid[0].uuid;
  console.log(req.body.time);
  await Up.updateOne({ _id: time }, { time: req.body.time });
  await user
    .updateOne(
      { "departments.staff.user_id": uuid },
      { $set: { "departments.$[outer].staff.$[inner].status": "o" } },
      {
        arrayFilters: [
          { "outer.staff.user_id": uuid },
          { "inner.user_id": uuid },
        ],
      }
    )
    .then(res.json({ status: "sc" }));
});
app.post("/in", async (req, res) => {
  const uid = await Up.where({ username: req.body.username }).select("uuid");
  const uuid = uid[0].uuid;
  await user
    .updateOne(
      { "departments.staff.user_id": uuid },
      { $set: { "departments.$[outer].staff.$[inner].status": "i" } },
      {
        arrayFilters: [
          { "outer.staff.user_id": uuid },
          { "inner.user_id": uuid },
        ],
      }
    )
    .then(res.json({ status: "sc" }));
});
app.post("/od", async (req, res) => {
  const uid = await Up.where({ username: req.body.username }).select("uuid");
  const uuid = uid[0].uuid;
  const det = await user.findOne({ "departments.staff.user_id": uuid });

  if (!det) {
    return res.status(404).json({ message: "User not found" });
  }
  let departmentName, staffName, collegeName, status;
  det.departments.forEach((department) => {
    const staff = department.staff.find((staff) => staff.user_id === uuid);
    if (staff) {
      departmentName = department.name;
      staffName = staff.name;
      collegeName = det.name;
      status = staff.status;
    }
  });

  res.json({
    col: collegeName,
    dep: departmentName,
    name: staffName,
    status: status,
  });
});
app.post("/pr", async (req, res) => {
  const ud = await Up.where({ username: req.body.un }).exists({
    uuid: req.body.ud,
  });
  if (ud !== null) {
    res.json({ per: "ac" });
  } else {
    res.json({ per: "dn" });
  }
});
app.post("/login", async (req, res) => {
  const luname = await Up.exists({ username: req.body.luname });
  const lpass = await Up.where({ username: req.body.luname }).findOne({
    password: req.body.lpass,
  });
  if (luname !== null) {
    if (lpass !== null) {
      const x = Math.floor(Math.random() * 10000000000);
      const uuid = await Up.where({ username: req.body.luname }).select("id");
      await Up.updateOne({ _id: uuid }, { id: x });
      res.json({ name: "bc", uuid: x });
      res.end();
    } else {
      res.json({ name: "ip" });
      res.end();
    }
  } else {
    if (lpass !== null) {
      res.json({ name: "iu" });
      res.end();
    } else {
      res.json({ name: "bic" });
      res.end();
    }
  }
});
app.post("/ca", async (req, res) => {
  const uname = req.body.uname;
  const av = await Up.findOne({ username: uname });
  if (av === null) {
    res.json({ status: "sc" });
  } else {
    res.json({ status: "f" });
  }
});
app.post("/newup", async (req, res) => {
  const uid = req.body.uuid;
  const uname = req.body.uname;
  const pass = req.body.pass;
  const x = Math.floor(Math.random() * 10000000000);
  const ua = await Up.findOne({ username: uname });
  if (ua !== null) {
    res.json({ status: "uae" });
  } else {
    const nuser = new Up({
      uuid: uid,
      username: uname,
      password: pass,
      id: x,
    });
    nuser.save().then(() => {
      res.json({ status: "sc" });
      console.log("USER DATA SAVED");
    });
  }
});
app.get("/cuid", async (req, res) => {
  const uuid = req.headers.uuid;
  const up = await Up.findOne({ uuid: uuid });
  if (up === null) {
    const staffMember = await user.findOne({
      "departments.staff.user_id": uuid,
    });
    if (staffMember) {
      res.json({ status: "sc" });
    } else {
      res.json({ status: "f" });
    }
  } else {
    res.json({ status: "ae" });
  }
});
module.exports = app;
