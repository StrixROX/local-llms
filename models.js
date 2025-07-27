const MODELS = {
  JOHN: {
    name: "John",
    model: "john:latest",
    modelFile: "john.modelfile",
  },
  BATMAN: {
    name: "Batman",
    model: "batman:latest",
    modelFile: "batman.modelfile",
  },
};

async function fetchModels() {
  const response = await fetch(ENDPOINTS.LIST_MODELS, { method: "GET" });
  const { models } = await response.json();
  const modelsListParsed = models.map(({ model }) => {
    const modelInfo = Object.keys(MODELS).find(
      (key) => MODELS[key].model === model
    );
    return {
      name: MODELS[modelInfo]?.name || model,
      model,
    };
  });

  return modelsListParsed;
}
