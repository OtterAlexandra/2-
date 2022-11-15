import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite"; 

async function openDB() {
return open({
    filename: "sqlite.db",
    driver: sqlite3.Database,
});
}

const db = await openDB ();
const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  const result = await db.all("SELECT * FROM sq")
  res.send(result);
});

app.get("/getList", async (req, res) => {
  const sort = req.query?.sort || "asc";
  const offset = req.query?.offset || 0;
  const limit = req.query?.limit || 10000000001;

  const result = await db.all(`SELECT * FROM sq order by date ${sort} limit ${offset}, ${limit}`)
  res.send(result);
});

app.get("/addItem", async (req, res) => {
  const result = await db.run(
    "INSERT INTO sq (date, message) VALUES (:date, :message)",
        {
            ":date": new Date(),
            ":message": req.query.message,
        }
   );
  res.send(result);
});

app.get("/deleteItem", async (req, res) => {
  const result = await db.run(
    "DELETE FROM sq WHERE ID=:id",
    {
      ":id": req.query.id,
    }
  );
  res.send(result);
});

/*app.delete("/item", (req, res) => {
  if (
    list.find((e) => {
      return e.id === id;
    })
  ) {
    list = list.filter((e) => {
      return e.id !== id;
    });
    res.status(200).send("OK");
  } else {
    res.status(404).send("error");
  }
});*/

app.listen(5000);
