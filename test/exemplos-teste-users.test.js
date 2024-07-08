const request = require("supertest");
require("dotenv").config();

const rotaUsers = process.env.URL_USUARIO;
const { faker } = require("@faker-js/faker");

describe("Testes de Alteração de Usuário", () => {
  let idUsuario;

  // Primeiro, cria um novo usuário
  beforeAll(async () => {
    const crudPayload = {
      nome: faker.name.fullName(),
      telefone: faker.phone.number("+55 (##) ####-####"),
      email: faker.internet.email(),
      senha: faker.internet.password(),
    };

    const response = await request(rotaUsers).post("/users").send(crudPayload);

    // Salva o ID do usuário criado
    idUsuario = response.body.id;

    expect(response.status).toBe(201);
    expect(idUsuario).toBeDefined();
    console.log(response.body);
  });

  it("Deve alterar o nome do usuário e validar a alteração", async () => {
    const novoNome = {
      nome: "Updated UserS",
      telefone: "1234567890",
      email: "updateuserteste2@example.com",
      senha: "TESTE",
    };

    // Altera o nome do usuário criado
    const responseUpdate = await request(rotaUsers)
      .put(`/users/${idUsuario}`)
      .send(novoNome);

    expect(responseUpdate.status).toBe(201);
    expect(responseUpdate.body.nome).toBe(novoNome.nome);

    // Consulta o usuário para validar a alteração
    const responseGet = await request(rotaUsers).get(`/users/${idUsuario}`);

    expect(responseGet.status).toBe(200);
    expect(responseGet.body.id).toBe(idUsuario);
    expect(responseGet.body.nome).toBe(novoNome.nome);
    expect(responseGet.body.telefone).toBeDefined();
    expect(responseGet.body.email).toBeDefined();
    console.log(responseGet.body);
  });

  it("DEVE REMOVER O USUARIO, 204", async () => {
    const responseUpdate = await request(rotaUsers).delete(
      `/users/${idUsuario}`
    );

    expect(responseUpdate.status).toBe(204);
    console.log(responseUpdate.body);
  });

  it("CONSULTAR O USUARIO REMOVIDO.", async () => {
    const responseUpdate = await request(rotaUsers).get(`/users/${idUsuario}`);

    expect(responseUpdate.status).toBe(404);
    expect(responseUpdate.body.error).toEqual("Usuário não encontrado");
    console.log(responseUpdate.body);
  });
});
