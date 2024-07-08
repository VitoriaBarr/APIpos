const request = require("supertest");
const { faker } = require("@faker-js/faker");

const { URLS, HEADERS } = require("../suporte/configEnv");

describe("Suite de testes crud (post, get, put, delete USER)", () => {
  let recebeId;

  const payloadUsuario = {
    nome: faker.name.fullName(),
    telefone: faker.phone.number("+55 (##) ####-####"),
    email: faker.internet.email(),
    senha: faker.internet.password(),
  };

  const payloadUsuarioEmailFieldNull = {
    nome: faker.name.fullName(),
    telefone: faker.phone.number("+55 (##) ####-####"),
    email: null,
    senha: faker.internet.password(),
  };

  it("Ausencia de campo email, deverá gerar o status code 422 e emitir uma mensagem de erro validando a mesma.", async () => {
    const response = await request(URLS.ENDPOINT_USERS)
      .post("/users")
      .send(payloadUsuarioEmailFieldNull);

    //validação do status code
    expect(response.status).toBe(422);

    // validar a mensagem: Os seguintes campos são obrigatórios: email"
    expect(response.body).toEqual({
      error: "Os seguintes campos são obrigatórios: email",
    });
    console.log(response.body);
  });

  /* it("Cadastrando um usuario, e consultando o retorno dos campos, se foram os enviados", async () => {
    const response = await request(rotaUsers)
      .post("/users")
      .send(payloadUsuario);

    //validacao do status code
    expect(response.status).toBe(201);
    console.log(response.body);

    //validar dados retornados
    const { id, nome, telefone, email } = response.body;

    //Verifica presenca de id
    expect(id).toBeDefined();

    //Verifica valor enviado x persistido (recebido)
    expect(nome).toBe(payloadUsuario.nome);
    expect(telefone).toBe(payloadUsuario.telefone);
    expect(email).toBe(payloadUsuario.email);

    //Verificar que a senha nao esta presente no retorno
    expect(response.body.senha).toBeUndefined();
    console.log("Cadastro do usuario randomico", response.body);
  });
*/
  it("Cadastrando um usuário, e consultando o retorno dos campos, se foram os enviados.", async () => {
    const response = await request(URLS.ENDPOINT_USERS)
      .post("/users")
      .set(HEADERS.CONTENT_TYPE)
      .send(payloadUsuario);

    //armazenar o retorno do ID, na variável
    recebeId = response.body.id;

    //validação do status code
    expect(response.status).toBe(201);

    //verificar se o id realmente está definido (retornado)
    expect(recebeId).toBeDefined();

    console.log("Usuário cadastrado: ", response.body);
  });

  it("Alterando o registro cadastrado anteriormente, e verificando se os dados realmente foram alterados.", async () => {
    const novoUsuario = {
      nome: faker.name.fullName(),
      telefone: faker.phone.number("+55 (##) ####-####"),
      email: faker.internet.email(),
      senha: faker.internet.password(),
    };

    //passamos o usuário como parâmetro no id da rota
    const responsePut = await request(URLS.ENDPOINT_USERS)
      .put(`/users/${recebeId}`)
      .send(novoUsuario);

    //validação do statusCode
    expect(responsePut.status).toBe(201);

    //validação da alteração dos campos: nome, telefone, senha
    expect(responsePut.body.nome).toBe(novoUsuario.nome);
    expect(responsePut.body.telefone).toBe(novoUsuario.telefone);

    //logar reposta
    console.log("Usuário alterado: ", responsePut.body);

    //validar a consulta dos dados se estão retornando os dados que foram alterados.
    const responseGet = await request(URLS.ENDPOINT_USERS).get(
      `/users/${recebeId}`
    );

    expect(responseGet.status).toBe(200);
    expect(responseGet.body.id).toBe(recebeId);
    expect(responseGet.body.nome).toBe(novoUsuario.nome);
    expect(responseGet.body.telefone).toBe(novoUsuario.telefone);

    //logar reposta da consultas
    console.log("Usuário alterado resultado da consulta: ", responseGet.body);
  });

  it("Deverá remover o registro cadastrado anteriormente. E retornar 204.", async () => {
    //Informe uma variavel para receber o id
    //Receber o id nessa variavel
    //popular a url do delete com o id recebido

    const response = await request(URLS.ENDPOINT_USERS).delete(
      `/users/${recebeId}`
    );

    //validar o statusCode
    expect(response.status).toBe(204);
    console.log("Resposta do delete:", response.body);

    //validar se realmente foi removido o registro
    const responseGet = await request(URLS.ENDPOINT_USERS).get(
      `/users/${recebeId}`
    );

    expect(responseGet.status).toBe(404);
    expect(responseGet.body).toEqual({ error: "Usuário não encontrado" });
    console.log(responseGet.body);
  });
});
