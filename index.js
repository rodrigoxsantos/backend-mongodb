const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();

(async () => {
  const url = "mongodb://localhost:27017";
  const dbName = "back-end-mongodb_ocean";

  const client = await MongoClient.connect(url);

  const db = client.db(dbName);

  const collection = db.collection("series");

  // Tranformando em Json como retorno da resposta
  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Hello Rodrigo");
  });

  // CRUD -> Create, Read (All & Single/byId), Update, delete

  // "CRUD em memória"

  // Lista de textos(STRING)
  const lista = [
    {
      id: 1,
      nome: "La casa de papel",
    },
    {
      id: 2,
      nome: "Prison break",
    },
  ];

  //passando o caminho da requisição
  //[GET] /series
  // Read All
  app.get("/series", async function (req, res) {
    const listaSeries = await collection.find().toArray();
    res.send(listaSeries);
  });

  function findById(id) {
    return collection.findOne({ _id: new ObjectId(id) });
  }

  //[GET] /series/:id
  //Read By Id
  app.get("/series/:id", async function (req, res) {
    const id = +req.params.id;

    const item = await findById(id);

    if (item) {
      res.status(404).send("Serie não encontrada");

      return;
    }

    res.send(item);
  });

  //[POST] /series
  // Create
  app.post("/series", async function (req, res) {
    // Obtém o corpo da requisição e coloca na variável item
    const item = req.body;

    if (!item || item.nome) {
      res
        .status(400)
        .send("Chave 'nome' não foi encontrada no corpo da requisição");

      return;
    }
    await collection.insertOne(item);

    res.status(201).send(item);
  });

  //[PUT] /series/:id
  // Update
  app.put("/series/:id", async function (req, res) {
    /** Objetivo: Atualizar uma série
   - Atualizar uma serie 
   - pegar i ID desta serie
   - pegar a nova informação que eu quero atualizar
   - atualizar essa nova informação na lista de serie
   - exibir que de certo

   */

    const id = req.params.id;

    const itemEncontrado = await findById(id);

    if (!itemEncontrado) {
      res.status(404).send("Serie não encontrada.");

      return;
    }

    const novoItem = req.body;

    if (!novoItem || !novoItem.nome) {
      res
        .status(400)
        .send("Chave 'nome' não foi encontrada no corpo da requisição.");
      return;
    }
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: novoItem });

    res.send(novoItem);
  });

  //[DELETE] /series/:id
  // Delete
  app.delete("/series/:id", async function (req, res) {
    const id = req.params.id;

    const itemEncontrado = findById(id);

    if (!itemEncontrado) {
      res.status(404).send("Personagem não encontrado");

      return;
    }

    await collection.deleteOne({ _id: new ObjectId(id) });

    res.send("Serie removida com sucesso!");
  });
  app.listen(process.env.PORT || 3000);
})();
