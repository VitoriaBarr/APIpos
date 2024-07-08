const request = require("supertest");

const rota = "http://localhost:3000";

describe("Suite de testes da api  users...", () => {
  const json_arquivo_cadastro_usuario = {
    nome: "Geovana",
    telefone: "1111111",
    email: "geo@gmail.com", // chave unica
    senha: "12345",
  };

  let idUsuario;

  it("Consulta todos os usuarios..deve retornar status 200.", async () => {
    const response = await request(rota).get("/users");
    expect(response.status).toBe(200);
    console.log(response.body);
  });
  //.only testa apenas esse bloco de codigo
  it("Deve cadastrar um novo usuario, e retornar status 200.", async () => {
    //construimos a nossa requisicao, passando a rota completa
    const response = await request(rota)
      .post("/users")
      //Precisamos construir os dados que serao enviados no body
      .send(json_arquivo_cadastro_usuario);
    //Teste do retorno de status 200
    console.log(response.body);
    expect(response.status).toBe(201);
  });
  it("Quando cadastrar um usuario que ja esteja na base, deve retornar 422.", async () => {
    const response = await request(rota)
      .post("/users")
      .send(json_arquivo_cadastro_usuario);
    console.log(response.body);
    expect(response.status).toBe(422);
  });

  it("Deve cadastrar um novo usuario, e retornar status 200.", async () => {
    const response = await request(rota)
      .post("/users")
      .send(json_arquivo_cadastro_usuario);
    expect(response.status).toBe(201);
    //expect(response.body).toEqual(json_arquivo_cadastro_usuario);
    console.log(response.body);
  });

  it.only("Criacao de um usuario com dados validos, deve retornar a resposta", async () => {
    const response = await request(rota)
      .post("/users")
      .send(json_arquivo_cadastro_usuario);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(201);
    idUsuario = response.body.id;
    console.log("Usuario cadastrado:", idUsuario);
  });
  /* Dicas:
    Apos o cadastro, armazene o resultado em uma variavel
    essa variavel ja deverá estar definida
    lembre-se que para voce acessar o objeto de um payload voce pode usar response.body.objetoDesejado.
*/
  it("Deve consultar o usuario cadastrado anteriormente, e logar o registro do usuario cadastrado com o retorno", async () => {
    const response = await request(rota).get(`/users/${idUsuario}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id", idUsuario);
    console.log("Usuario retornado:", response.body);
  });

  it("Alterando o registro cadastrado anteiormente.", async () => {
    //Com a variavel armazenada, chame o metodo put, passando o payload com a alteracao do nome do usuario,
    //nao esqueca de passas todos os campos que sejam obrigatorios
    const novoPayload = {
      nome: "gardenia",
      telefone: "1111111",
      email: "geo@gmail.com", // chave unica
      senha: "12345",
    };
    const responseUpdate = await request(rota)
      .put(`/users/${idUsuario}`)
      .send(novoPayload);
    expect(responseUpdate.status).toBe(201);
    expect(responseUpdate.body.nome).toBe(novoPayload.nome);
    console.log(responseUpdate.body);
  });

  it("Criacao de um usuario com dados invalidos, deve retornar 422 e a mensagem de erro como resposta", async () => {
    const response = await request(rota)
      .post("/users")
      .send(json_arquivo_cadastro_usuario);
    expect(response.body);
    expect(response.status).toBe(422);
    console.log(response.body);
  });
});
