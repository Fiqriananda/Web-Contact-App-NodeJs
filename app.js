const express = require("express");
const expressLayout = require("express-ejs-layouts");
const qs = require("qs");
const { body, validationResult, check, cookie } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();

// config flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContact,
} = require("./utils/contacts");

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
    msg: req.flash('msg')
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
      res.render("add-contact", {
        tittle: "Form Tambah Contact",
        layout: "layouts/main-layout",
        error: error.array(),
      });
    } else {
      req.flash("msg", "Data Contact Berhasil di tambahkan");

      addContact(req.body);
      res.redirect("/contact");
    }
  }
);

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    tittle: "Add Contact",
    layout: "layouts/main-layout",
  });
});

// Process delete
app.get("/contact/delete/:nama", (req, res) =>{
  const contacts = findContact(req.params.nama)
  
  if(!contacts){
    res.status(404)
    res.send("<h1>404</h1>")
  }else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data Contact Berhasil di Delete");
    res.redirect("/contact");
  }
})

// form ubah data
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama)
  res.render("edit-contact", {
    tittle: "Form Edit Contact",
    layout: "layouts/main-layout",
    contact,
  });
});


// Ubah data
app.post(
  "/contact/update",
  [
    check("email", "Email Tidak VALIDDD").isEmail(),
    check("hp", "Nomor HP Tidak Valid").isMobilePhone("id-ID"),
    body("nama").custom((value, {req}) => {
      const duplicate = cekDuplikat(value);
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Nama Sudah Digunakan");
      }
      return true;
    }),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // return res.status(400).json({ errors: error.array() });
      res.render("edit-contact", {
        tittle: "Form Edit Contact",
        layout: "layouts/main-layout",
        error: error.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body)
      req.flash('msg', 'Data berhasil di update')
      res.redirect('/contact')
    }
  }
);

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
