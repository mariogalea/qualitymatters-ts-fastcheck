import jsrp from 'jsrp';

export async function srpRegisterAndAuthenticate(username: string, password: string): Promise<boolean> {
  // Registration phase
  const server = new jsrp.server();
  const client = new jsrp.client();

  await new Promise<void>((resolve) => server.init(() => resolve()));
  await new Promise<void>((resolve) => client.init({ username, password }, () => resolve()));

  // Client generates salt/verifier for registration
  const salt = client.getSalt();
  const verifier = client.getVerifier();

  // Server stores salt/verifier
  await new Promise<void>((resolve) => server.setSalt(salt, () => resolve()));
  await new Promise<void>((resolve) => server.setVerifier(verifier, () => resolve()));

  // Authentication phase
  // 1. Client sends A to server
  await new Promise<void>((resolve) => client.createVerifier(() => resolve()));
  const A = client.getPublicKey();
  await new Promise<void>((resolve) => server.setClientPublicKey(A, () => resolve()));

  // 2. Server sends B, salt to client
  const B = server.getPublicKey();
  await new Promise<void>((resolve) => client.setServerPublicKey(B, () => resolve()));
  await new Promise<void>((resolve) => client.setSalt(salt, () => resolve()));

  // 3. Client computes M1, sends to server
  const M1 = client.getProof();
  await new Promise<void>((resolve) => server.checkClientProof(M1, () => resolve()));

  // 4. Server computes M2, sends to client
  const M2 = server.getProof();
  await new Promise<void>((resolve) => client.checkServerProof(M2, () => resolve()));

  // If both sides are happy, authentication succeeded
  return client.checkServerProof(M2, () => {}) === undefined;
}
