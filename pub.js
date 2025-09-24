const exp = require("express");
const mongoose = require("mongoose");
const app = exp.Router();
const user = require("./user");
const axios = require("axios");
const cron = require("node-cron");
const Up = require("./up");
const cors = require("cors");
app.use(cors());
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://legendaryairforce:ASHWIN01012004@offpub.9t7fv.mongodb.net/"
  );
}
app.post("/status", async (req, res) => {
  const clg = req.body.clg;
  const dep = req.body.dep;
  const sta = req.body.sta;
  let s = "LEAVE";
  let t = false;
  let dur = "";
  const college = await user.findOne({ name: clg });
  const department = college.departments.find((dept) => dept.name === dep);
  const staffMember = department.staff.find((staff) => staff.name === sta);
  const { name, workingtime, status, user_id } = staffMember;
  if (status === "i") {
    s = "AVAILABLE";
  } else if (status === "o") {
    s = "NOT AVAILABLE";
    const time = await Up.where({ uuid: user_id }).select("time");
    console.log(time);
    if (time && time.length > 0 && time[0].time !== undefined) {
      dur = time[0].time;
      t = true;
    }
  }
  res.json({ name, workingtime, s, t, dur });
});
app.post("/gd", async (req, res) => {
  const clg = await user.find();
  res.json({ det: clg });
});
const callAPI = async () => {
  try {
    const res = await axios.get("http://localhost:800/public/gd");
    console.log("API response:", res.data);
  } catch (err) {
    console.error("Error calling API:", err.message);
  }
};
cron.schedule("* * * * *", () => {
  callAPI();
});
const staffMembers = [
  {
    name: "AVUDAIAPPAN T",
    user_id: 3171001,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "MURUGAVALLI S",
    user_id: 3171002,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "REETHA JEYARANI M A",
    user_id: 3171003,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "KUMARAN V",
    user_id: 3171004,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "SRI SANTHOSHINI E",
    user_id: 3171005,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "DEENA ROSE DEVASAHAYAM",
    user_id: 3171006,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "ARAVIND PRASAD BASKARAN",
    user_id: 3171007,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "Jasmine Jose P",
    user_id: 3171008,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "MUTHUKUMARAN C",
    user_id: 3171009,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "HEMA R",
    user_id: 3171010,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "PRABASRI S",
    user_id: 3171011,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "PRAVEEN KUMAR T",
    user_id: 3171012,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "SUMATHI A",
    user_id: 3171013,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
  {
    name: "ROSHAN JOSHUA",
    user_id: 3171014,
    status: "o",
    workingtime: "8:45 am - 5:00 pm",
  },
];
async function createCollegeAndDepartment() {
  try {
    const college = new user({ name: "KRCT", departments: [] });
    const department = { name: "AIML", staff: staffMembers };
    college.departments.push(department);
    await college.save();
    console.log(
      "College and department created successfully with staff members!"
    );
  } catch (error) {
    console.error("Error creating college and department:", error);
  }
}
// createCollegeAndDepartment();
module.exports = app;
