const express = require("express");
const expressLayout = require("express-ejs-layouts");
const qs = require("qs");
const { body, validationResult, check } = require("express-validator");

const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
} = require("./utils/contacts");

const app = express();

const port = 8888;

// use EJS
app.set("view engine", "ejs");
app.use(expressLayout);

// Build in Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index", {
    tittle: "Homing Base",
    layout: "layouts/main-layout",
  });
});
app.get("/hell", function (req, res) {
  res.render("hell", {
    nama: "Fiqriananda",
    tittle: "Hell No",
    layout: "layouts/main-layout",
  });
});
app.get("/contact", function (req, res) {
  const contact = loadContact();
  res.render("contact", {
    tittle: "Contact",
    layout: "layouts/main-layout",
    contact: contact,
  });
});

// Process data
app.post(
  "/contact",
  [
    check("email", "Email Tidak VALIDDD").isEmail(),
    check("hp", "Nomor HP Tidak Valid").isMobilePhone("id-ID"),
    body("nama").custom((value) => {
      const duplicate = cekDuplikat(value);
      if (duplicate) {
        throw new Error("Nama Sudah Digunakan");
      }
      return true;
    }),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // return res.status(400).json({ errors: error.array() });
      res.render('add-contact', {
        tittle: "Form Tambah Contact",
        layout: "layouts/main-layout",
        error: error.array()
      })
    }else{
      addContact(req.body);
      res.redirect('/contact')
    }
  }
);

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    tittle: "Add Contact",
    layout: "layouts/main-layout",
  });
});

app.get("/contact/:nama", function (req, res) {
  const contacts = findContact(req.params.nama);
  res.render("detail", {
    tittle: "Halaman Detail",
    layout: "layouts/main-layout",
    contact: contacts,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
});

app.listen(port, () => {
  console.log(`Listening Port ${port}`);
});
