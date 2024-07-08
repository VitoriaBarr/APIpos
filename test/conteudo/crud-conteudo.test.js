const request = require("supertest");
const { faker } = require("@faker-js/faker");
const URLS = { ROTA_ENDPOINT: "http://localhost:3000" };
describe("Descrição da suíte de testes", () => {
  let idConteudo;
  let payloadConteudos;

  beforeAll(async () => {
    payloadConteudos = {
      titulo: faker.lorem.words(),
      descricao: faker.lorem.sentence(),
      tipoConteudo: faker.lorem.word(),
      conteudo: faker.lorem.paragraph(),
    };

    const response = await request(URLS.ROTA_ENDPOINT)
      .post("/conteudos")
      .send(payloadConteudos);

    expect(response.body.titulo).toBe(payloadConteudos.titulo);
    expect(response.body.descricao).toBe(payloadConteudos.descricao);
    expect(response.body.tipoConteudo).toBe(payloadConteudos.tipoConteudo);
    expect(response.body.conteudo).toBe(payloadConteudos.conteudo);

    idConteudo = response.body.id;
    expect(response.status).toBe(201);
    expect(idConteudo).toBeDefined();

    console.log("Conteúdo cadastrado: ", response.body);
    console.log(`Status Code: ${response.status} - Created`);
  });

  it("Teste 01: Cadastrando novo conteudo, e validando dados enviados e statusCode 201.", async () => {
    //Você deverá cadastrar um novo conteúdo e verificar que o conteúdo está devidamente
    //retornando os dados esperados e o statusCode de sucesso esperado.
    // Professora, neste it eu nao validei nada pois ja estava fazendo isso no proprio beforeAll
    /*const conteudoResponse = await request(URLS.ROTA_ENDPOINT).get(
      `/conteudos/${idConteudo}`
    );
    expect(conteudoResponse.status).toBe(200);
    expect(conteudoResponse.body.id).toBe(idConteudo);
    expect(conteudoResponse.body.titulo).toBe(payloadConteudos.titulo);
    expect(conteudoResponse.body.descricao).toBe(payloadConteudos.descricao);
    expect(conteudoResponse.body.tipoConteudo).toBe(
      payloadConteudos.tipoConteudo
    );
    expect(conteudoResponse.body.conteudo).toBe(payloadConteudos.conteudo);
    console.log("Conteúdo recuperado: ", conteudoResponse.body); */
  });

  it("Teste 02: deve consultar o registro cadastrado anteriormente, e validar resultado e statusCode", async () => {
    //Você deverá realizar a consulta desse conteúdo em que acabou de cadastrar,
    //e verificar se realmente está sendo retornado o conteúdo desejado com os dados desejados.
    const conteudoResponse = await request(URLS.ROTA_ENDPOINT).get(
      `/conteudos/${idConteudo}`
    );

    expect(conteudoResponse.status).toBe(200);
    expect(conteudoResponse.body.id).toBe(idConteudo);
    expect(conteudoResponse.body.titulo).toBe(payloadConteudos.titulo);
    expect(conteudoResponse.body.descricao).toBe(payloadConteudos.descricao);
    expect(conteudoResponse.body.tipoConteudo).toBe(
      payloadConteudos.tipoConteudo
    );
    expect(conteudoResponse.body.conteudo).toBe(payloadConteudos.conteudo);

    console.log("Conteúdo recuperado: ", conteudoResponse.body);
  });

  it("Teste 03: deve alterar o conteudo cadastrado anteriormente, e validar que os dados realmente foram alterados e validar statusCode", async () => {
    //Você deverá alterar o conteúdo consultado anteriormente, e em seguida validar se
    //realmente os dados foram alterados.
    const novoPayloadConteudos = {
      titulo: faker.lorem.words(),
      descricao: faker.lorem.sentence(),
      tipoConteudo: faker.lorem.word(),
      conteudo: faker.lorem.paragraph(),
    };

    const updateResponse = await request(URLS.ROTA_ENDPOINT)
      .put(`/conteudos/${idConteudo}`)
      .send(novoPayloadConteudos);

    expect(updateResponse.status).toBe(201);
    console.log(`Status Code: ${updateResponse.status} - Updated`);

    const conteudoAtualizadoResponse = await request(URLS.ROTA_ENDPOINT).get(
      `/conteudos/${idConteudo}`
    );

    expect(conteudoAtualizadoResponse.status).toBe(200);
    expect(conteudoAtualizadoResponse.body.id).toBe(idConteudo);
    expect(conteudoAtualizadoResponse.body.titulo).toBe(
      novoPayloadConteudos.titulo
    );
    expect(conteudoAtualizadoResponse.body.descricao).toBe(
      novoPayloadConteudos.descricao
    );
    expect(conteudoAtualizadoResponse.body.tipoConteudo).toBe(
      novoPayloadConteudos.tipoConteudo
    );
    expect(conteudoAtualizadoResponse.body.conteudo).toBe(
      novoPayloadConteudos.conteudo
    );

    console.log("Conteúdo atualizado: ", conteudoAtualizadoResponse.body);
  });

  it("Teste 04: deve remover o registro cadastrado, e validar a consulta do registro para garantir sua remoção.", async () => {
    //Por fim, você deverá remover o conteúdo e garantir que o mesmo foi removido e
    //não existe mais para consulta.

    const deleteResponse = await request(URLS.ROTA_ENDPOINT).delete(
      `/conteudos/${idConteudo}`
    );

    expect(deleteResponse.status).toBe(200);
    console.log(`Status Code: ${deleteResponse.status} - Deleted`);

    // Verificar se o conteúdo foi realmente removido
    const conteudoRemovidoResponse = await request(URLS.ROTA_ENDPOINT).get(
      `/conteudos/${idConteudo}`
    );

    expect(conteudoRemovidoResponse.status).toBe(404);
    console.log(`Status Code: ${conteudoRemovidoResponse.status} - Not Found`);
  });
});
