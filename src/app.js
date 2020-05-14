const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const LogLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(LogLabel);

  next();

  console.timeEnd(LogLabel);
}

function validateRepoId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid repo ID." });
  }
  return next();
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const { title, techs, url } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => (repository.id = id)
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
  const repository = { id, title, techs, url };
  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    ...repository,
  };
  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepoId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (respository) => respository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const { likes } = repositories[repositoryIndex];

  const repository = { ...repositories[repositoryIndex], likes: likes + 1 };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
console.log("🚀 Back-end started!");
