const request = require("supertest");
const User = require("../schemas/user"); // ruta a tu archivo user.js
const app = require("../app"); // ruta a tu archivo app.js

// Crea un mock de tu modelo User
jest.mock("../schemas/user", () => ({
  findOne: jest.fn(),
}));

describe("Pruebas para el controlador de entrada", () => {
  let server;

  beforeAll(() => {
    server = app.listen(); // Inicia el servidor Express
  });

  afterAll((done) => {
    server.close(done); // Cierra el servidor Express
  });

  test("Inicio de sesión exitoso", async () => {
    // Configura el mock para que devuelva un usuario de prueba
    User.findOne.mockResolvedValue({
      email: "test@test.com",
      validPassword: jest.fn().mockReturnValue(true),
      save: async () => {},
      subscription: "starter",
    });

    const response = await request(server).post("/api/users/login").send({
      email: "test@test.com",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).toHaveProperty("email");
    expect(response.body.data.user).toHaveProperty("subscription");
  }); // No es necesario un tiempo de espera ya que no estamos haciendo operaciones reales de base de datos
});
