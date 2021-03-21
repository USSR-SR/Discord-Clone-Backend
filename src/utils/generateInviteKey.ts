export function generateInviteKey(): string {
  var key = [];
  for (var i = 0; i < 10; i++) {
    key.push(String.fromCharCode(Math.floor(Math.random() * 26) + 65));
  }
  return key.join("");
}
