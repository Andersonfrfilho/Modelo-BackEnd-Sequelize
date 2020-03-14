function soma(a, b) {
  return a + b;
}
// qual funcionalidade que estamos estando em qual questão
test('if I call the route / authenticate with a valid user, it should return a JWT token', () => {
  const result = soma(4, 5);
  // expect pega o resultado de uma função compara com um valor
  expect(result).toBe(9);
});
